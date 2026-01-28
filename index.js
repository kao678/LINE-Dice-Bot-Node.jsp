const express = require("express");
const line = require("@line/bot-sdk");
const { google } = require("googleapis");

/************ CONFIG ************/
const LINE_CONFIG = {
  channelAccessToken: "PUT_LINE_TOKEN",
  channelSecret: "PUT_LINE_SECRET"
};

const SPREADSHEET_ID = "18YxFEYT-NzYXuQP9aUMD3G1TPkvUCHwxU_S5gSmUO6M";

/************ GOOGLE SHEET ************/
const auth = new google.auth.GoogleAuth({
  keyFile: "service-account.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

const sheets = google.sheets({ version: "v4", auth });

/************ EXPRESS ************/
const app = express();
app.post("/webhook", line.middleware(LINE_CONFIG), async (req, res) => {
  try {
    const event = req.body.events[0];
    if (!event || event.type !== "message") return res.sendStatus(200);

    const text = event.message.text.trim();
    const replyToken = event.replyToken;
    const userId = event.source.userId;

    if (text === "PING") {
      await replyText(replyToken, "🟢 Bot Online");
    }

    if (/^\d+\/\d+$/.test(text)) {
      await replyText(replyToken, `✅ รับโพย ${text}`);
    }

    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(200);
  }
});

app.listen(3000, () => console.log("Bot running on port 3000"));

/************ LINE ************/
const client = new line.Client(LINE_CONFIG);

function replyText(token, text) {
  return client.replyMessage(token, {
    type: "text",
    text
  });
}
