const path = require('path');
// const { createCanvas, loadImage } = require('canvas');
const { getURL, baseurl, selectLevel } = require('./scraper.js')

// 获取文件路径
const FILE_PATH = path.resolve(__dirname, '..');

// class ImgText {
//     constructor(text) {
//         this.width = 600;
//         this.text = text;
//         this.fontPath = path.join(FILE_PATH, 'fonts', 'msyh1.otf');
//         this.fontSize = 14;
//         this.lineHeight = 0;
//         this.drowHeight = 0;
//         this.duanluo = [];
//         this.noteHeight = 0;
//         this.splitText();
//     }

//     getDuanluo(text) {
//         const canvas = createCanvas(400, 800);
//         const ctx = canvas.getContext('2d');
//         ctx.font = `${this.fontSize}px "Microsoft YaHei"`;

//         let duanluo = "";
//         let sumWidth = 0;
//         let lineCount = 1;
//         let lineHeight = 0;

//         for (const char of text) {
//             const { width } = ctx.measureText(char);
//             sumWidth += width;
//             if (sumWidth > this.width) {
//                 lineCount += 1;
//                 sumWidth = 0;
//                 duanluo += '\n';
//             }
//             duanluo += char;
//             lineHeight = Math.max(ctx.measureText('M').width, lineHeight);
//         }

//         if (!duanluo.endsWith('\n')) {
//             duanluo += '\n';
//         }

//         return [duanluo, lineHeight, lineCount];
//     }

//     splitText() {
//         let maxLineHeight = 0;
//         let totalLines = 0;
//         const allText = [];

//         for (const text of this.text.split('\n')) {
//             const [duanluo, lineHeight, lineCount] = this.getDuanluo(text);
//             maxLineHeight = Math.max(lineHeight, maxLineHeight);
//             totalLines += lineCount;
//             allText.push([duanluo, lineCount]);
//         }

//         this.lineHeight = maxLineHeight;
//         this.noteHeight = totalLines * this.lineHeight;
//         this.drowHeight = this.noteHeight;
//         this.duanluo = allText;
//     }

//     drawText() {
//         const canvas = createCanvas(600, this.drowHeight);
//         const ctx = canvas.getContext('2d');
//         ctx.fillStyle = 'white';
//         ctx.fillRect(0, 0, canvas.width, canvas.height);

//         ctx.font = `${this.fontSize}px "Microsoft YaHei"`;
//         ctx.fillStyle = 'black';

//         let x = 0, y = 0;
//         for (const [duanluo, lineCount] of this.duanluo) {
//             ctx.fillText(duanluo, x, y);
//             y += this.lineHeight * lineCount;
//         }

//         const base64Str = canvas.toDataURL().replace(/^data:image\/png;base64,/, '');
//         return `[CQ:image,file=base64://${base64Str}]`;
//     }
// }

function chooseID(IDdata) {
    let message = "";
    for (let i = 0; i < IDdata.length; i++) {
        message += `【${i + 1}】${IDdata[i].nickname}(${judgeLevel(IDdata[i].level.id.toString())})\n`;
    }
    message += "若列表内没有您要找的昵称，请将昵称补全以便于查找";
    return message;
}

async function printExtendInfo(IDdata, room_level, num) {
    let message = "PS: 本数据不包含金之间以下对局以及2019.11.29之前的对局\n";
    message += "昵称：" + IDdata.nickname + "  ";
    const score = parseInt(IDdata.level.score) + parseInt(IDdata.level.delta);
    message += processLevelInfo(score, IDdata.level.id.toString());
    // console.log(message)
    let dataList, room;
    if (num === "4") {
        dataList = await selectInfo(IDdata.id, room_level);
        room = "四";
    } else {
        dataList = await select_triInfo(IDdata.id, room_level);
        room = "三";
    }

    if (dataList[0] instanceof Error) {
        message += `\n没有查询到在${judgeRoom(room_level)}${room}人南的对局数据呢~\n`;
    } else {
        message += await processBasicInfo(dataList[0], room_level, `${room}人南`, num);
        message += await processExtendInfo(dataList[1], room_level, `${room}人南`);
    }

    if (dataList[2] instanceof Error) {
        message += `\n没有查询到在${judgeRoom(room_level)}${room}人东的对局数据呢~\n`;
    } else {
        message += await processBasicInfo(dataList[2], room_level, `${room}人东`, num);
        message += await processExtendInfo(dataList[3], room_level, `${room}人东`);
    }

    // const pic = new ImgText(message);
    // return pic.drawText();
    return message;
}


async function printBasicInfo(IDdata, room_level, num) {
    // console.log("printing basic info")
    let message = "PS：本数据不包含金之间以下对局以及2019.11.29之前的对局\n";
    message += `昵称：${IDdata.nickname}  `;
    const score = parseInt(IDdata.level.score) + parseInt(IDdata.level.delta);
    // console.log("still printing")
    message += processLevelInfo(score, IDdata.level.id.toString());
    let data_list, room;
    if (num === "4") {
        data_list = await selectInfo(IDdata.id, room_level);
        room = "四";
    } else {
        data_list = await select_triInfo(IDdata.id, room_level);
        room = "三";
    }
    // console.log("message:" + message)
    // console.log(data_list)
    if (data_list[0] instanceof Error) {
        message += `\n没有查询到在${room}人南的对局数据呢~\n`;
    } else {
        message += processBasicInfo(data_list[0], room_level, `${room}人南`, num) + "\n";
    }

    if (data_list[2] instanceof Error) {
        message += `\n没有查询到在${room}人东的对局数据呢~\n`;
    } else {
        message += processBasicInfo(data_list[2], room_level, `${room}人东`, num) + "\n";
    }
    // 暂时不发图片
    // const pic = new ImgText(message);
    // return pic.drawText();
    return message
}

function processExtendInfo(data, room_level, sessions) {
    let message = `\n【${judgeRoom(room_level)}${sessions}进阶数据】\n`;
    message += `和牌率：${(parseFloat(removeNull(data["和牌率"])) * 100).toFixed(2)}%  `;
    message += `自摸率：${(parseFloat(removeNull(data["自摸率"])) * 100).toFixed(2)}%  `;
    message += `默听率：${(parseFloat(removeNull(data["默听率"])) * 100).toFixed(2)}%  `;
    message += `放铳率：${(parseFloat(removeNull(data["放铳率"])) * 100).toFixed(2)}%  \n`;
    message += `副露率：${(parseFloat(removeNull(data["副露率"])) * 100).toFixed(2)}%  `;
    message += `立直率：${(parseFloat(removeNull(data["立直率"])) * 100).toFixed(2)}%  `;
    message += `流局率：${(parseFloat(removeNull(data["流局率"])) * 100).toFixed(2)}%  `;
    message += `流听率：${(parseFloat(removeNull(data["流听率"])) * 100).toFixed(2)}%  \n`;
    message += `一发率：${(parseFloat(removeNull(data["一发率"])) * 100).toFixed(2)}%  `;
    message += `里宝率：${(parseFloat(removeNull(data["里宝率"])) * 100).toFixed(2)}%  `;
    message += `先制率：${(parseFloat(removeNull(data["先制率"])) * 100).toFixed(2)}%  `;
    message += `追立率：${(parseFloat(removeNull(data["追立率"])) * 100).toFixed(2)}%  \n`;
    message += `平均打点：${removeNull(data["平均打点"])}  `;
    message += `平均铳点：${removeNull(data["平均铳点"])}  `;
    try {
        message += `最大连庄：${removeNull(data["最大连庄"])}  `;
    } catch (err) {
        message += "最大连庄：0  ";
    }
    message += `和了巡数：${parseFloat(removeNull(data["和了巡数"])).toFixed(2)}  \n`;
    return message;
}

function processBasicInfo(data, room_level, sessions, num) {
    let message = `\n【${judgeRoom(room_level)}${sessions}基础数据】\n`;
    // console.log(message)
    message += `总场次：${data.count}\n`;
    message += `一位率：${(parseFloat(data.rank_rates[0]) * 100).toFixed(2)}%  `;
    message += `二位率：${(parseFloat(data.rank_rates[1]) * 100).toFixed(2)}%  \n`;
    message += `三位率：${(parseFloat(data.rank_rates[2]) * 100).toFixed(2)}%  `;
    if (num === "4") {
        message += `四位率：${(parseFloat(data.rank_rates[3]) * 100).toFixed(2)}%`;
    }
    // console.log(message)
    return message;
}

function processLevelInfo(score, level) {
    let message = "";
    const intlevel = parseInt(level);

    if (score < 0) {
        if (intlevel % 10 === 1) {
            level = (intlevel - 98).toString();
        } else {
            level = (intlevel - 1).toString();
        }
        score = levelStart(level);
    } else if (score >= levelMax(level)) {
        if (intlevel % 10 === 3) {
            level = (intlevel + 98).toString();
            if (level === "199") {
                score = levelMax("100");
            } else {
                score = levelStart(level);
            }
        } else {
            level = (intlevel + 1).toString();
            score -= levelMax(level);
        }
    }

    message += `段位：${judgeLevel(level)}\n`;
    if (judgeLevel(level).slice(0, 2) == "魂天") {
        score = score / 100
    }
    message += `当前pt：${score}`;
    return message;
}

function removeNull(str) {
    return str === null ? "0" : str;
}

function levelMax(level) {
    if (level === "10203" || level === "20203") return 1000;
    else if (level === "10301" || level === "20301") return 1200;
    else if (level === "10302" || level === "20302") return 1400;
    else if (level === "10303" || level === "20303") return 2000;
    else if (level === "10401" || level === "20401") return 2800;
    else if (level === "10402" || level === "20402") return 3200;
    else if (level === "10403" || level === "20403") return 3600;
    else if (level === "10501" || level === "20501") return 4000;
    else if (level === "10502" || level === "20502") return 6000;
    else if (level === "10503" || level === "20503") return 9000;
    else if (level.startsWith("107") || level.startsWith("207")) return 2000;
    // else if (level === "10601" || level === "20601") return 9999999;
}

function levelStart(level) {
    if (level === "10203" || level === "20203") return 500;
    else if (level === "10301" || level === "20301") return 600;
    else if (level === "10302" || level === "20302") return 700;
    else if (level === "10303" || level === "20303") return 1000;
    else if (level === "10401" || level === "20401") return 1400;
    else if (level === "10402" || level === "20402") return 1600;
    else if (level === "10403" || level === "20403") return 1800;
    else if (level === "10501" || level === "20501") return 2000;
    else if (level === "10502" || level === "20502") return 3000;
    else if (level === "10503" || level === "20503") return 4500;
    else if (level.startsWith("107") || level.startsWith("207")) return 1000;
}


function judgeLevel(level) {
    if (level === "10203" || level === "20203") {
        return "雀士三";
    } else if (level === "10301" || level === "20301") {
        return "雀杰一";
    } else if (level === "10302" || level === "20302") {
        return "雀杰二";
    } else if (level === "10303" || level === "20303") {
        return "雀杰三";
    } else if (level === "10401" || level === "20401") {
        return "雀豪一";
    } else if (level === "10402" || level === "20402") {
        return "雀豪二";
    } else if (level === "10403" || level === "20403") {
        return "雀豪三";
    } else if (level === "10501" || level === "20501") {
        return "雀圣一";
    } else if (level === "10502" || level === "20502") {
        return "雀圣二";
    } else if (level === "10503" || level === "20503") {
        return "雀圣三";
    } else if (level.startsWith("107") || level.startsWith("207")) {
        return "魂天" + parseInt(level.slice(-2), 10);
    }
}
function judgeRoom(roomLevel) {
    if (roomLevel === "0") {
        return "总体";
    } else if (roomLevel === "1") {
        return "金之间";
    } else if (roomLevel === "2") {
        return "玉之间";
    } else if (roomLevel === "3") {
        return "王座之间";
    }
}

async function selectInfo(id, room_level) { // 信息查询
    const localtime = Date.now();
    const urltime = String(localtime); // 时间戳
    const basicurl = `${baseurl}/player_stats/${id}/1262304000000/${urltime}?mode=`;
    const extendurl = `${baseurl}/player_extended_stats/${id}/1262304000000/${urltime}?mode=`;
    const dataList = [];
    const levelList = selectLevel(room_level);

    for (let i = 0; i < 2; i++) {
        dataList.push(await getURL(basicurl + levelList[i]));
        dataList.push(await getURL(extendurl + levelList[i]));
    }
    return dataList;
}

const axios = require('axios');

async function select_triInfo(id, room_level) { // 信息查询
    const localtime = Date.now();
    const urltime = String(localtime); // 时间戳
    const basicurl = `${tribaseurl}/player_stats/${id}/1262304000000/${urltime}?mode=`;
    const extendurl = `${tribaseurl}/player_extended_stats/${id}/1262304000000/${urltime}?mode=`;
    const dataList = [];
    const levelList = select_triLevel(room_level);

    for (let i = 0; i < 2; i++) {
        dataList.push(await getURL(basicurl + levelList[i]));
        dataList.push(await getURL(extendurl + levelList[i]));
    }
    return dataList;
}


module.exports = {
    printBasicInfo,
    printExtendInfo
}