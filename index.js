const express = require("express");
const line = require("@line/bot-sdk");

const app = express();

/* ================= CONFIG ================= */
const LINE_CONFIG = {
  channelAccessToken: process.env.LINE_TOKEN,
  channelSecret: process.env.LINE_SECRET
};

/* ================= MIDDLEWARE ================= */
app.use(express.json());

/* ================= HOME ================= */
app.get("/", (req, res) => {
  res.status(200).send("บอทเปิดบ้านกำลังทำงาน");
});

/* ================= WEBHOOK ================= */
app.post("/webhook", line.middleware(LINE_CONFIG), async (req, res) => {
  try {
    const event = req.body.events[0];
    if (!event || event.type !== "message") {
      return res.sendStatus(200);
    }

    const text = event.message.text.trim();
    const replyToken = event.replyToken;

    const client = new line.Client(LINE_CONFIG);

    if (text === "PING") {
      await client.replyMessage(replyToken, {
        type: "text",
        text: "🟢 Bot Online"
      });
    }

    if (/^\d+\/\d+$/.test(text)) {
      await client.replyMessage(replyToken, {
        type: "text",
        text: `✅ รับโพย ${text}`
      });
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    return res.sendStatus(200);
  }
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Bot running on port", PORT);
});
