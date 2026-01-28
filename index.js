const express = require("express");
const line = require("@line/bot-sdk");

const app = express();

/* ================= CONFIG ================= */
const LINE_CONFIG = {
  channelAccessToken: process.env.LINE_TOKEN,
  channelSecret: process.env.LINE_SECRET,
};

const client = new line.Client(LINE_CONFIG);

/* ================= MIDDLEWARE ================= */
app.use("/webhook", line.middleware(LINE_CONFIG));

/* ================= WEBHOOK ================= */
app.post("/webhook", async (req, res) => {
  try {
    const event = req.body.events[0];
    if (!event || event.type !== "message") {
      return res.sendStatus(200);
    }

    const text = event.message.text;
    const replyToken = event.replyToken;

    // ทดสอบระบบ
    if (text === "PING") {
      await client.replyMessage(replyToken, {
        type: "text",
        text: "🟢 Bot Online",
      });
    }

    // รับโพย 3/100
    if (/^\d+\/\d+$/.test(text)) {
      await client.replyMessage(replyToken, {
        type: "text",
        text: `✅ รับโพย ${text}`,
      });
    }

    return res.sendStatus(200);
  } catch (err) {
    console.error("ERROR:", err);
    return res.sendStatus(200);
  }
});

/* ================= ROOT (กัน 502) ================= */
app.get("/", (req, res) => {
  res.send("LINE Dice Bot is running");
});

/* ================= PORT ================= */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Bot running on port", PORT);
});
