const TelegramApi = require('node-telegram-bot-api');
const token = '5869805416:AAEeqaiPPunq-rt4of8-T57SY7rHDsh_8WM';
const bot = new TelegramApi(token, {polling: true}); 
const axios = require('axios');
CHAT_ID = "-785368621";
const uri_api = `https://api.telegram.org/bot${ token }/sendMessage`;

let chatId;

let ping = require('ping');

const host = ['46.211.84.179'];

const result = async () => {
  
    let res;
    let inputStatus;
    
    res = await ping.promise.probe(host);
    inputStatus = res.alive;
    console.log(inputStatus);
    if (inputStatus) {
        console.log('Світло є');
    } else {
        console.log('Світла нема');
    }

    //порівняння з поточним станом
    setInterval(() => {
        res = ping.promise.probe(host);
        res.then(value => {
                console.log('value.alive', value.alive);
                console.log('inputStatus', inputStatus);
                if (value.alive !== inputStatus && inputStatus === true) {
                    bot.sendMessage(CHAT_ID, `Свет выключили ${new Date()}`);
                    console.log(`Свет выключили ${new Date()}`);
                    inputStatus = value.alive;
                }
                if (value.alive !== inputStatus && inputStatus === false) {
                    bot.sendMessage(CHAT_ID, `Свет включили ${new Date()}`);
                    console.log(`Свет включили ${new Date()}`);
                    inputStatus = value.alive;
                    console.log(value.alive);
                }
                inputStatus = value.alive;
            }, reason => {  
            console.log(reason); //вбудована функція маячка для помилок
          });
    }, 10000);
}
result();

const chat = [];
let marker = false;

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начать'},
        // {command: '/contacts', description: 'Контакты нашего консультанта'},
        // {command: '/record', description: 'Запись на консультацию'},
        // {command: '/again', description: 'Начать заново'}
    ]);

//save Name answer
//let FIO;     
    
//bot react when writing
    bot.on('message', async msg => {
        const text = msg.text;
        chatId = msg.chat.id;
        console.log(chatId);
    
//Itaration ONE
        if(text === '/start') {
            marker = false;
            await bot.sendMessage(chatId, 'Вітаю');
            return bot.sendMessage(chatId, 'Статус світла на зараз');
        }
})
};

start();