/******************** IMPORT ********************/
const express = require("express");
const line = require("@line/bot-sdk");

/******************** CONFIG ********************/
const LINE_CONFIG = {
  channelAccessToken: process.env.LINE_TOKEN || "PUT_LINE_ACCESS_TOKEN",
  channelSecret: process.env.LINE_SECRET || "PUT_LINE_CHANNEL_SECRET",
};

const PORT = process.env.PORT || 3000;

/******************** INIT ********************/
const app = express();
const client = new line.Client(LINE_CONFIG);

/******************** HEALTH CHECK ********************/
app.get("/", (req, res) => {
  res.status(200).send("บอทเปิดบ้านกำลังทำงาน");
});

/******************** WEBHOOK ********************/
app.post(
  "/webhook",
  line.middleware(LINE_CONFIG),
  async (req, res) => {

    // ⭐ สำคัญที่สุด ป้องกัน LINE timeout / 502
    res.sendStatus(200);

    try {
      const events = req.body.events;
      if (!events || events.length === 0) return;

      const event = events[0];
      if (event.type !== "message") return;
      if (!event.replyToken) return;

      const text = event.message.text.trim();
      const replyToken = event.replyToken;

      /************ COMMAND ************/
      if (text === "PING") {
        await replyText(replyToken, "🟢 Bot Online");
        return;
      }

      if (/^\d+\/\d+$/.test(text)) {
        await replyText(replyToken, `✅ รับโพย ${text}`);
        return;
      }

      if (text === "O") {
        await replyText(replyToken, "🟢 เปิดรอบแล้ว");
        return;
      }

      if (text === "X" || text === "DL") {
        await replyText(replyToken, "🔴 ปิดรอบแล้ว");
        return;
      }

      await replyText(replyToken, "❌ รูปแบบไม่ถูกต้อง\nตัวอย่าง 3/100");

    } catch (err) {
      console.error("WEBHOOK ERROR:", err);
    }
  }
);

/******************** REPLY ********************/
function replyText(token, text) {
  return client.replyMessage(token, {
    type: "text",
    text: text,
  });
}

/******************** START SERVER ********************/
app.listen(PORT, () => {
  console.log("🚀 LINE BOT RUNNING ON PORT", PORT);
});
