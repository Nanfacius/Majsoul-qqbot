const { Bot } = require('qq-group-bot')
const handle = require('./handle.js')
const config = require('./config.js')

// 创建机器人
const bot = new Bot(config)

// 回复函数
async function reply(e) {
	let text = e.message[0].text
	let cmd = text.split(' ')[0]
	if (["雀魂信息", "雀魂查询"].includes(cmd)) {
		const res = await handle.majInfo(text)
		console.log(res)
		e.reply(res)
}
};

// 启动机器人
bot.start().then(() => {
	// 频道被动回复
	bot.on('message.guild', async (e) => {
		e.reply('hello world')
	})
	// 频道私信被动回复
	bot.on('message.direct', async (e) => {
		e.reply('hello world')
	})
	// 群聊被动回复
	bot.on('message.group', async (e) => {
		await reply(e)
	})
	// 私聊被动回复
	bot.on('message.private', async (e) => {
		await reply(e)
	})
	// 主动发送频道消息
	bot.sendGuildMessage(channel_id, 'hello')
	// 主动发送群消息
	bot.sendGroupMessage(group_id, 'hello')
	// 主动发送私聊消息
	bot.sendPrivateMessage(user_id, 'hello')
	// 主动发送频道消息，注：需要先调用bot.createDirectSession(guild_id,user_id)创建私信会话，此处传入的guild_id为创建的session会话中返回的guild_id
	bot.sendDirectMessage(guild_id, 'hello')
})
