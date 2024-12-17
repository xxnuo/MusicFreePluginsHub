"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const cheerio_1 = require("cheerio");
const pageSize = 10;
function formatMusicItem(_) {
    return {
        id: _.songId,
        title: (0, cheerio_1.load)(_.songName).text(),
        artist: _.singer,
        singerId: _.singerId,
        album: _.typeName,
        type: _.type,
        typeName: _.typeName,
        typeEname: _.typeEname,
    };
}
function formatAlbumItem(_) {
    return {
        id: _.songListId,
        artist: _.userName,
        title: (0, cheerio_1.load)(_.title).text(),
        artwork: _.pictureUrl,
        description: _.content,
        date: _.createTime,
    };
}
function formatArtistItem(_) {
    return {
        id: _.id,
        name: (0, cheerio_1.load)(_.nickName).text(),
        fans: _.fans,
        avatar: _.pictureUrl,
        description: _.description,
        worksNum: _.totalSong,
    };
}
const searchHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
    Host: "search.5sing.kugou.com",
    Accept: "application/json, text/javascript, */*; q=0.01",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "zh-CN,zh;q=0.9",
    Referer: "http://search.5sing.kugou.com/home/index",
};
async function searchMusic(query, page) {
    const res = (await axios_1.default.get("http://search.5sing.kugou.com/home/json", {
        headers: searchHeaders,
        params: {
            keyword: query,
            sort: 1,
            page,
            filter: 0,
            type: 0,
        },
    })).data;
    const songs = res.list.map(formatMusicItem);
    return {
        isEnd: res.pageInfo.cur >= res.pageInfo.totalPages,
        data: songs,
    };
}
async function searchAlbum(query, page) {
    const res = (await axios_1.default.get("http://search.5sing.kugou.com/home/json", {
        headers: searchHeaders,
        params: {
            keyword: query,
            sort: 1,
            page,
            filter: 0,
            type: 1,
        },
    })).data;
    const songs = res.list.map(formatAlbumItem);
    return {
        isEnd: res.pageInfo.cur >= res.pageInfo.totalPages,
        data: songs,
    };
}
async function searchArtist(query, page) {
    const res = (await axios_1.default.get("http://search.5sing.kugou.com/home/json", {
        headers: searchHeaders,
        params: {
            keyword: query,
            sort: 1,
            page,
            filter: 1,
            type: 2,
        },
    })).data;
    const songs = res.list.map(formatArtistItem);
    return {
        isEnd: res.pageInfo.cur >= res.pageInfo.totalPages,
        data: songs,
    };
}
let fcEnd = false;
let ycEnd = false;
let bzEnd = false;
async function getArtistMusicWorks(artistItem, page) {
    if (page === 1) {
        fcEnd = false;
        ycEnd = false;
        bzEnd = false;
    }
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        Host: "service.5sing.kugou.com",
        Origin: "http://5sing.kugou.com",
        Pragma: "no-cache",
        Referer: "http://5sing.kugou.com/",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
    };
    let data = [];
    if (!fcEnd) {
        const res = (await axios_1.default.get("http://service.5sing.kugou.com/user/songlist", {
            headers,
            params: {
                userId: artistItem.id,
                type: "fc",
                pageSize,
                page,
            },
        })).data;
        if (res.count <= page * pageSize) {
            fcEnd = true;
        }
        data = data.concat(res.data.map((_) => ({
            id: _.songId,
            artist: artistItem.name,
            title: _.songName,
            typeEname: "fc",
            typeName: "翻唱",
            type: _.songType,
            album: "翻唱",
        })));
    }
    if (!ycEnd) {
        const res = (await axios_1.default.get("http://service.5sing.kugou.com/user/songlist", {
            headers,
            params: {
                userId: artistItem.id,
                type: "yc",
                pageSize,
                page,
            },
        })).data;
        if (res.count <= page * pageSize) {
            ycEnd = true;
        }
        data = data.concat(res.data.map((_) => ({
            id: _.songId,
            artist: artistItem.name,
            title: _.songName,
            typeEname: "yc",
            typeName: "原唱",
            type: _.songType,
            album: "原唱",
        })));
    }
    if (!bzEnd) {
        const res = (await axios_1.default.get("http://service.5sing.kugou.com/user/songlist", {
            headers,
            params: {
                userId: artistItem.id,
                type: "bz",
                pageSize,
                page,
            },
        })).data;
        if (res.count <= page * pageSize) {
            bzEnd = true;
        }
        data = data.concat(res.data.map((_) => ({
            id: _.songId,
            artist: artistItem.name,
            title: _.songName,
            typeEname: "bz",
            typeName: "伴奏",
            type: _.songType,
            album: "伴奏",
        })));
    }
    return {
        isEnd: fcEnd && ycEnd && bzEnd,
        data,
    };
}
async function getArtistWorks(artistItem, page, type) {
    if (type === "music") {
        return getArtistMusicWorks(artistItem, page);
    }
}
const headers = {
    Accept: "*/*",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "zh-CN,zh;q=0.9",
    Host: "service.5sing.kugou.com",
    Referer: "http://5sing.kugou.com/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
};
async function getLyric(musicItem) {
    const res = (await axios_1.default.get("http://5sing.kugou.com/fm/m/json/lrc", {
        headers,
        params: {
            songId: musicItem.id,
            songType: musicItem.typeEname,
        },
    })).data;
    return {
        rawLrc: res.txt,
    };
}
async function getAlbumInfo(albumItem) {
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        Host: "service.5sing.kugou.com",
        Origin: "http://5sing.kugou.com",
        Referer: "http://5sing.kugou.com/",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
    };
    const res = (await axios_1.default.get("http://service.5sing.kugou.com/song/getPlayListSong", {
        headers: headers,
        params: {
            id: albumItem.id,
        },
    })).data;
    return {
        musicList: res.data.map((_) => ({
            id: _.ID,
            typeEname: _.SK,
            title: _.SN,
            artist: _.user.NN,
            singerId: _.user.ID,
            album: albumItem.title,
            artwork: albumItem.artwork,
        })),
    };
}
async function getTopLists() {
    return [
        {
            title: "排行榜",
            data: [
                {
                    id: "/",
                    title: "原创音乐榜",
                    description: "最热门的原创音乐歌曲榜",
                    typeEname: 'yc',
                    typeName: '原唱'
                },
                {
                    id: "/fc",
                    title: "翻唱音乐榜",
                    description: "最热门的流行歌曲翻唱排行",
                    typeEname: 'fc',
                    typeName: '翻唱'
                },
                {
                    id: "/bz",
                    title: "伴奏音乐榜",
                    description: "搜索最多的伴奏排行",
                    typeEname: 'bz',
                    typeName: '伴奏'
                },
            ],
        },
    ];
}
async function getTopListDetail(topListItem) {
    const rawHtml = (await axios_1.default.get(`http://5sing.kugou.com/top${topListItem.id}`)).data;
    const $ = (0, cheerio_1.load)(rawHtml);
    const tableRows = $('div.rank_view tbody').children('tr');
    const result = tableRows.slice(1).map((index, element) => {
        const el = $(element);
        const title = el.find('td.r_td_3').text().trim();
        const artistItem = el.find('td.r_td_4');
        const artist = artistItem.text();
        const singerId = $(artistItem).find('a').attr('href').match(/http:\/\/5sing\.kugou\.com\/(\d+)/)[1];
        const id = el.find('td.r_td_6').children().first().attr('href').match(/http:\/\/5sing\.kugou\.com\/.+?(\d+)\.html/)[1];
        return {
            title,
            artist,
            singerId,
            id,
            typeEname: topListItem.typeEname,
            typeName: topListItem.typeName,
            type: topListItem.typeEname,
            album: topListItem.typeName
        };
    }).toArray();
    return {
        ...topListItem,
        musicList: result.filter(_ => _.id),
    };
}
module.exports = {
    platform: "5sing",
    version: "0.1.0",
     order: 11,
    srcUrl: "http://adad23u.appinstall.life/dist/5sing/index.js",
    cacheControl: "no-cache",
    async search(query, page, type) {
        if (type === "music") {
            return await searchMusic(query, page);
        }
        if (type === "album") {
            return await searchAlbum(query, page);
        }
        if (type === "artist") {
            return await searchArtist(query, page);
        }
    },
    async getMediaSource(musicItem, quality) {
        if (quality === "super") {
            return;
        }
        const headers = {
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "zh-CN,zh;q=0.9",
            Host: "service.5sing.kugou.com",
            Referer: "http://5sing.kugou.com/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
        };
        const res = (await axios_1.default.get("http://service.5sing.kugou.com/song/getsongurl", {
            headers,
            params: {
                songid: musicItem.id,
                songtype: musicItem.typeEname,
                from: "web",
                version: "6.6.72",
                _: Date.now(),
            },
        })).data;
        const data = JSON.parse(res.substring(1, res.length - 1)).data;
        if (quality === "standard") {
            return {
                url: data.squrl ?? data.squrl_backup,
            };
        }
        else if (quality === "high") {
            return {
                url: data.hqurl ?? data.hqurl_backup,
            };
        }
        else {
            return {
                url: data.lqurl ?? data.lqurl_backup,
            };
        }
    },
    getAlbumInfo,
    getLyric,
    getArtistWorks,
    getTopLists,
    getTopListDetail
};
