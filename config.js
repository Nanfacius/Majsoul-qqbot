config = {
    appid: '102281402', // qq机器人的appID (必填)
    secret: 'dGtWAoS6kO2gL0fKzeJyeK0gM2iP6nUB', // qq机器人的secret (必填)
    sandbox: true, // 是否是沙箱环境 默认 false
    removeAt: true, // 移除第一个at 默认 false
    logLevel: 'info', // 日志等级 默认 info
    maxRetry: 10, // 最大重连次数 默认 10
    intents: [
        'GROUP_AT_MESSAGE_CREATE', // 群聊@消息事件 没有群权限请注释
        'C2C_MESSAGE_CREATE', // 私聊事件 没有私聊权限请注释
        'GUILD_MESSAGES', // 私域机器人频道消息事件 公域机器人请注释
        // 'PUBLIC_GUILD_MESSAGES', // 公域机器人频道消息事件 私域机器人请注释
        'DIRECT_MESSAGE', // 频道私信事件
        'GUILD_MESSAGE_REACTIONS', // 频道消息表态事件
        'GUILDS', // 频道变更事件
        'GUILD_MEMBERS', // 频道成员变更事件
        'DIRECT_MESSAGE', // 频道私信事件
    ], // (必填)
}

module.exports = config
