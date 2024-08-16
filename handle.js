const sc = require("./scraper")
const pd = require("./processData")

async function majInfo(text) {
    let args = text.split(' ').slice(1)
    if (args.length == 1) {
        let nickname = args[0]
        // console.log(nickname)
        if (nickname.length > 15) {
            return "昵称长度超过雀魂最大限制"
        }
        let message = ""
        let IDdata = await sc.getID(nickname)
        if (IDdata == -404) {
            return "获取牌谱屋的数据超时了呢，请稍后再试哦~"
        }
        // console.log("正在查询" + nickname + "的对局数据")
        if (IDdata == -1) {
            return "没有查询到该角色在金之间以上的对局数据呢~"
        }
        else if (IDdata.length > 1) {
            message = message + "查询到多条角色昵称呢~，若输出不是您想查找的昵称，请补全查询昵称\n\n"
            message = message + await pd.printBasicInfo(IDdata[0], "0", "4")
            return message // how to @ sender
        }
        else {
            // console.log("OK")
            message = message + await pd.printBasicInfo(IDdata[0], "0", "4")
            return message // how to @ sender
        }
    }
    else if (args.length == 2) {
        let nickname = args[1]
        if (nickname.length > 15) {
            return "昵称长度超过雀魂最大限制"
        }
        // console.log("正在查询" + nickname + "的对局数据 ")
        let message = ""
        let room_level = ""
        if (args[0] == "金场" || args[0] == "金" || args[0] == "金之间") {
            room_level = "1"
        }
        else if (args[0] == "玉场" || args[0] == "玉" || args[0] == "玉之间") {
            room_level = "2"
        }
        else if (args[0] == "王座" || args[0] == "王座之间") {
            room_level = "3"
        }
        else {
            return "房间等级输入不正确，请重新输入"
        }
        // console.log("room level: " + room_level)
        let IDdata = await sc.getID(nickname)
        if (IDdata == -404) {
            return "获取牌谱屋的数据超时了呢，请稍后再试哦~"
        }
        if (IDdata == -1) {
            return "没有查询到该角色在金之间以上的对局数据呢~"
        }
        else {
            // console.log(message)
            if (IDdata.length > 1) {
                message = message + "查询到多条角色昵称呢~，若输出不是您想查找的昵称，请补全查询昵称\n"
                message = message + await pd.printExtendInfo(IDdata[0], room_level, "4")
                return message
            }
            else {
                message = message + await pd.printExtendInfo(IDdata[0], room_level, "4")
                return message
            }
        }
    }
    else {
        return "查询信息输入不正确，请重新输入"
    }
}

module.exports = {
    majInfo
}