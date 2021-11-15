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
            [{text: 'Начать заново', callback_data: '/again'}]
        ]
    })
}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Давай сыграем: я загадываю число от 0 до 9, и ты должен его угадать!');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Угадывай! :)', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Приветствие'},
        {command: '/info', description: 'Ваша информация'},
        {command: '/game', description: 'Игра'}
    ])
    
    bot.on('message', async msg  => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/6ab/72c/6ab72caf-009b-4997-beeb-7f4901bade09/8.webp');
            return bot.sendMessage(chatId, `Hello`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text ==='/game') {
           return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Не понимаю, что ты от меня хочешь :/')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if(data == chats[chatId]) { 
            return bot.sendMessage(chatId, `Поздравляю, ты угадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению, ты не угадал, бот выбрал цифру ${chats[chatId]}, а ты цифру ${data}`, againOptions)
        }
    })
}

start()