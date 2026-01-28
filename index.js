const express = require("express");
const line = require("@line/bot-sdk");

const app = express();

/************ LINE CONFIG ************/
const config = {
  channelAccessToken: process.env.LINE_TOKEN,
  channelSecret: process.env.LINE_SECRET
};

const client = new line.Client(config);

app.use(express.json());

/************ WEBHOOK ************/
app.post("/", async (req, res) => {
  try {
    const events = req.body.events;
    if (!events || events.length === 0) return res.sendStatus(200);

    const event = events[0];
    if (event.type !== "message" || event.message.type !== "text") {
      return res.sendStatus(200);
    }

    const text = event.message.text.trim();
    const replyToken = event.replyToken;

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
    console.error(err);
    return res.sendStatus(200);
  }
});

/************ HEALTH CHECK ************/
app.get("/", (req, res) => {
  res.send("OK");
});

/************ START SERVER ************/
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
