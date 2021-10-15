'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;

const getChannelSeacret = require("./seacretDirectory/channelSeacret");
const getChannelAccessToken = require("./seacretDirectory/channelAccessToken");

const config = {
    channelSecret: getChannelSeacret(),
    channelAccessToken: getChannelAccessToken()
};

const app = express();

app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); //ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);

    //ここのif分はdeveloper consoleの"接続確認"用なので削除して問題ないです。
    if(req.body.events[0].replyToken === '00000000000000000000000000000000' && req.body.events[1].replyToken === 'ffffffffffffffffffffffffffffffff'){
        res.send('Hello LINE BOT!(POST)');
        console.log('疎通確認用');
        return;
    }

    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

async function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    let replyText = '';
    if(event.message.text === 'よろしく' ||　event.message.text === 'はじめまして'　|| event.message.text === 'おはよう' || event.message.text === 'こんにちは'　|| event.message.text === 'こんばんは') {
        replyText = event.message.text;
    } else {
        const rand = Math.floor(Math.random() * (5 + 1 - 1)) + 1;
        switch(rand) {
            case 1:
                replyText = '顎が制御できないんですよねΣ( °o°)';
                break;
            case 2:
                replyText = 'プラモデルも作ります( ; ›ω‹ )';
                break;
            case 3:
                replyText = 'あんた握手会出禁にしてやる💢';
                break;
            default:
                replyText = 'うざっ';
                break;
        }
    }
    
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: replyText
    });
}
app.listen(PORT);
console.log(`Server running at ${PORT}`)