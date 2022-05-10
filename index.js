const TelegramApi = require('node-telegram-bot-api')

const token = '2118894443:AAFSMZ_uw5_yK86638uMvYkRyqCE2dysTMw'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}, {text: '3', callback_data: '3'}],
            [{text: '4', callback_data: '4'}, {text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}],
            [{text: '7', callback_data: '7'}, {text: '8', callback_data: '8'}, {text: '9', callback_data: '9'}],
            [{text: '0', callback_data: '0'}]
        ]
    })
}

const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Start again', callback_data: '/again'}]
        ]
    })
}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "Let's play a game: I'll guess a number from 0 to 9 and you need to guess it! ");
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Guess! :)', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Welcome'},
        {command: '/info', description: 'Your info'},
        {command: '/game', description: 'Game'}
    ])
    
    bot.on('message', async msg  => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/6ab/72c/6ab72caf-009b-4997-beeb-7f4901bade09/8.webp');
            return bot.sendMessage(chatId, `Hello`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Your name is ${msg.from.first_name}`)
        }
        if (text ==='/game') {
           return startGame(chatId);
        }
        return bot.sendMessage(chatId, "I don't understand this command :/")
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if(data == chats[chatId]) { 
            return bot.sendMessage(chatId, `Congratulations! You have guessed a number ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `I'm sorry you didn't guess right. The correct number is ${chats[chatId]}, and you picked ${data}`, againOptions)
        }
    })
}

start()