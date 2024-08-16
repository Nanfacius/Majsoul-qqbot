const axios = require('axios');
const urlencode = require('urlencode');

const baseurl = "https://ak-data-1.sapk.ch/api/v2/pl4";
const tribaseurl = "https://ak-data-1.sapk.ch/api/v2/pl3";

async function getURL(url) {
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36"
    };
    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        return error;
    }
}

async function getID(nickname) {
    const encodedNickname = urlencode.encode(nickname);
    const url = `${baseurl}/search_player/${encodedNickname}?limit=9`;
    // console.log(url)
    const data = await getURL(url);
    if (data instanceof Error) {
        return -404;
    }
    // console.log(data)
    return data.length === 0 ? -1 : data;
}

async function gettriID(nickname) {
    const encodedNickname = urlencode.encode(nickname);
    const url = `${tribaseurl}/search_player/${encodedNickname}?limit=9`;
    const data = await getURL(url);
    if (data instanceof Error) {
        return -404;
    }
    const datalist = JSON.parse(data);
    return datalist.length === 0 ? -1 : datalist;
}

function selectLevel(room_level) {
    const level_list = [];
    switch (room_level) {
        case "0":
            level_list.push("16.12.9", "15.11.8");
            break;
        case "1":
            level_list.push("9", "8");
            break;
        case "2":
            level_list.push("12", "11");
            break;
        case "3":
            level_list.push("16", "15");
            break;
    }
    return level_list;
}

function select_triLevel(room_level) {
    const level_list = [];
    switch (room_level) {
        case "0":
            level_list.push("22.24.26", "21.23.25");
            break;
        case "1":
            level_list.push("22", "21");
            break;
        case "2":
            level_list.push("24", "23");
            break;
        case "3":
            level_list.push("26", "25");
            break;
    }
    return level_list;
}

async function select_triInfo(id, room_level) {
    const localtime = Date.now();
    const basicurl = `${tribaseurl}/player_stats/${id}/1262304000000/${localtime}?mode=`;
    const extendurl = `${tribaseurl}/player_extended_stats/${id}/1262304000000/${localtime}?mode=`;
    const data_list = [];
    const level_list = select_triLevel(room_level);
    for (let i = 0; i < 2; i++) {
        data_list.push(await getURL(basicurl + level_list[i]));
        data_list.push(await getURL(extendurl + level_list[i]));
    }
    return data_list;
}

async function selectInfo(id, room_level) {
    const localtime = Date.now();
    const basicurl = `${baseurl}/player_stats/${id}/1262304000000/${localtime}?mode=`;
    const extendurl = `${baseurl}/player_extended_stats/${id}/1262304000000/${localtime}?mode=`;
    const data_list = [];
    const level_list = selectLevel(room_level);
    for (let i = 0; i < 2; i++) {
        data_list.push(await getURL(basicurl + level_list[i]));
        data_list.push(await getURL(extendurl + level_list[i]));
    }
    return data_list;
}

async function selectRecord(id) {
    const localtime = Date.now();
    const basicurl = `${baseurl}/player_stats/${id}/1262304000000/${localtime}?mode=16.12.9.15.11.8`;
    const count = JSON.parse(await getURL(basicurl)).count;
    const recordurl = `${baseurl}/player_records/${id}/${localtime}/1262304000000?limit=5&mode=16.12.9.15.11.8&descending=true&tag=${count}`;
    return await getURL(recordurl);
}

async function select_triRecord(id) {
    const localtime = Date.now();
    const basicurl = `${tribaseurl}/player_stats/${id}/1262304000000/${localtime}?mode=22.24.26.21.23.25`;
    const count = JSON.parse(await getURL(basicurl)).count;
    const recordurl = `${tribaseurl}/player_records/${id}/${localtime}/1262304000000?limit=5&mode=22.24.26.21.23.25&descending=true&tag=${count}`;
    return await getURL(recordurl);
}

// Exporting functions
module.exports = {
    baseurl,
    getURL,
    getID,
    gettriID,
    selectLevel,
    select_triLevel,
    select_triInfo,
    selectInfo,
    selectRecord,
    select_triRecord
};
