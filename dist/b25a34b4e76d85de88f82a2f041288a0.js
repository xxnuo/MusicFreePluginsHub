var $7qzYT$axios = require("axios");
var $7qzYT$cryptojs = require("crypto-js");
var $7qzYT$cheerio = require("cheerio");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "pageSize", () => $34cadbb4fc0ee347$export$3a40bd8b0ff0173c);
$parcel$export(module.exports, "headers", () => $34cadbb4fc0ee347$export$838e2a576d4d6ff6);
$parcel$export(module.exports, "default", () => $34cadbb4fc0ee347$export$2e2bcd8739ae039);
/** 搜索方法 */ 


function $06dad0ab4e3fbe2e$export$d7bdacb66077735f(_) {
    return {
        id: _.songId,
        title: $7qzYT$cheerio.load(_.songName).text(),
        artist: _.singer,
        singerId: _.singerId,
        album: _.typeName,
        type: _.type,
        typeName: _.typeName,
        typeEname: _.typeEname
    };
}
function $06dad0ab4e3fbe2e$export$ed1fb53032701881(_) {
    return {
        id: _.songListId,
        artist: _.userName,
        title: $7qzYT$cheerio.load(_.title).text(),
        artwork: _.pictureUrl,
        description: _.content,
        date: _.createTime
    };
}
function $06dad0ab4e3fbe2e$export$d08aae127141ee12(_) {
    return {
        id: _.id,
        name: $7qzYT$cheerio.load(_.nickName).text(),
        fans: _.fans,
        avatar: _.pictureUrl,
        description: _.description,
        worksNum: _.totalSong
    };
}


async function $99f39107e6812c91$var$searchMusic(query, page) {
    const res = (await (0, ($parcel$interopDefault($7qzYT$axios))).get("http://search.5sing.kugou.com/home/json", {
        headers: (0, $34cadbb4fc0ee347$export$838e2a576d4d6ff6),
        params: {
            keyword: query,
            sort: 1,
            page: page,
            filter: 0,
            type: 0
        }
    })).data;
    const songs = res.list.map((0, $06dad0ab4e3fbe2e$export$d7bdacb66077735f));
    return {
        isEnd: res.pageInfo.cur >= res.pageInfo.totalPages,
        data: songs
    };
}
async function $99f39107e6812c91$var$searchAlbum(query, page) {
    const res = (await (0, ($parcel$interopDefault($7qzYT$axios))).get("http://search.5sing.kugou.com/home/json", {
        headers: (0, $34cadbb4fc0ee347$export$838e2a576d4d6ff6),
        params: {
            keyword: query,
            sort: 1,
            page: page,
            filter: 0,
            type: 1
        }
    })).data;
    const songs = res.list.map((0, $06dad0ab4e3fbe2e$export$ed1fb53032701881));
    return {
        isEnd: res.pageInfo.cur >= res.pageInfo.totalPages,
        data: songs
    };
}
async function $99f39107e6812c91$var$searchArtist(query, page) {
    const res = (await (0, ($parcel$interopDefault($7qzYT$axios))).get("http://search.5sing.kugou.com/home/json", {
        headers: (0, $34cadbb4fc0ee347$export$838e2a576d4d6ff6),
        params: {
            keyword: query,
            sort: 1,
            page: page,
            filter: 1,
            type: 2
        }
    })).data;
    const songs = res.list.map((0, $06dad0ab4e3fbe2e$export$d08aae127141ee12));
    return {
        isEnd: res.pageInfo.cur >= res.pageInfo.totalPages,
        data: songs
    };
}
async function $99f39107e6812c91$var$searchSheet(query, page) {}
async function $99f39107e6812c91$export$2e2bcd8739ae039(query, page, type) {
    if (type === "music") return $99f39107e6812c91$var$searchMusic(query, page);
    else if (type === "album") return $99f39107e6812c91$var$searchAlbum(query, page);
}





const $34cadbb4fc0ee347$export$3a40bd8b0ff0173c = 10;
const $34cadbb4fc0ee347$export$838e2a576d4d6ff6 = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
    Host: "search.5sing.kugou.com",
    Accept: "application/json, text/javascript, */*; q=0.01",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": "zh-CN,zh;q=0.9",
    Referer: "http://search.5sing.kugou.com/home/index"
};
async function $34cadbb4fc0ee347$var$getMediaSource(musicItem, quality) {
    if (quality === "super") return;
    const t = Date.now();
    const songId = musicItem.id;
    const songtype = musicItem.typeEname;
    const sign = "5uytoxQewcvIc1gn1PlNF0T2jbbOzRl5appid=2918clienttime=" + t + "clientver=1000dfid=08wYMS3ob9Yw3UWPbz08PRQVmid=63037fee343fbae9aa4054b2ed6607b5songid=" + songId + "songtype=" + songtype + "uuid=63037fee343fbae9aa4054b2ed6607b5version=6.6.725uytoxQewcvIc1gn1PlNF0T2jbbOzRl5";
    const signture = (0, ($parcel$interopDefault($7qzYT$cryptojs))).MD5(sign).toString();
    const url = "https://5sservice.kugou.com/song/getsongurl?appid=2918&clientver=1000&mid=63037fee343fbae9aa4054b2ed6607b5&uuid=63037fee343fbae9aa4054b2ed6607b5&dfid=08wYMS3ob9Yw3UWPbz08PRQV&songid=" + songId + "&songtype=" + songtype + "&version=6.6.72&clienttime=" + t + "&signature=" + signture;
    const res = (await (0, ($parcel$interopDefault($7qzYT$axios))).get(url)).data;
    const data = res.data;
    if (quality === "standard") return {
        url: data.squrl ?? data.lqurl
    };
    else if (quality === "high") return {
        url: data.hqurl ?? data.hqurl_backup
    };
    else return {
        url: data.lqurl ?? data.lqurl_backup
    };
}
async function $34cadbb4fc0ee347$var$getLyric(musicItem) {
    const res = (await (0, ($parcel$interopDefault($7qzYT$axios))).get("http://5sing.kugou.com/fm/m/json/lrc", {
        params: {
            songId: musicItem.id,
            songType: musicItem.typeEname
        }
    })).data;
    return {
        rawLrc: res.txt
    };
}
async function $34cadbb4fc0ee347$var$getAlbumInfo(albumItem) {
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        Host: "service.5sing.kugou.com",
        Origin: "http://5sing.kugou.com",
        Referer: "http://5sing.kugou.com/",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
    };
    const res = (await (0, ($parcel$interopDefault($7qzYT$axios))).get("http://service.5sing.kugou.com/song/getPlayListSong", {
        headers: headers,
        params: {
            id: albumItem.id
        }
    })).data;
    return {
        musicList: res.data.map((_)=>({
                id: _.ID,
                typeEname: _.SK,
                title: _.SN,
                artist: _.user.NN,
                singerId: _.user.ID,
                album: albumItem.title,
                artwork: albumItem.artwork
            }))
    };
}
async function $34cadbb4fc0ee347$var$getTopLists() {
    return [].concat([
        {
            title: "排行榜",
            data: [
                {
                    id: "/",
                    title: "原创音乐榜",
                    description: "最热门的原创音乐歌曲榜",
                    typeEname: "yc",
                    typeName: "原唱"
                },
                {
                    id: "/fc",
                    title: "翻唱音乐榜",
                    description: "最热门的流行歌曲翻唱排行",
                    typeEname: "fc",
                    typeName: "翻唱"
                },
                {
                    id: "/bz",
                    title: "伴奏音乐榜",
                    description: "搜索最多的伴奏排行",
                    typeEname: "bz",
                    typeName: "伴奏"
                }
            ]
        }
    ]);
}
async function $34cadbb4fc0ee347$var$getTopListDetail(topListItem) {
    const rawHtml = (await (0, ($parcel$interopDefault($7qzYT$axios))).get(`http://5sing.kugou.com/top${topListItem.id}`)).data;
    const $ = $7qzYT$cheerio.load(rawHtml);
    const tableRows = $("div.rank_view tbody").children("tr");
    const result = tableRows.slice(1).map((index, element)=>{
        const el = $(element);
        const title = el.find("td.r_td_3").text().trim();
        const artistItem = el.find("td.r_td_4");
        const artist = artistItem.text();
        const singerId = $(artistItem).find("a").attr("href").match(/http:\/\/5sing\.kugou\.com\/(\d+)/)[1];
        const id = el.find("td.r_td_6").children().first().attr("href").match(/http:\/\/5sing\.kugou\.com\/.+?(\d+)\.html/)[1];
        return {
            title: title,
            artist: artist,
            singerId: singerId,
            id: id,
            typeEname: topListItem.typeEname,
            typeName: topListItem.typeName,
            type: topListItem.typeEname,
            album: topListItem.typeName
        };
    }).toArray();
    return {
        ...topListItem,
        musicList: result.filter((_)=>_.id)
    };
}
let $34cadbb4fc0ee347$var$fcEnd = false;
let $34cadbb4fc0ee347$var$ycEnd = false;
let $34cadbb4fc0ee347$var$bzEnd = false;
async function $34cadbb4fc0ee347$var$getArtistMusicWorks(artistItem, page) {
    if (page === 1) {
        $34cadbb4fc0ee347$var$fcEnd = false;
        $34cadbb4fc0ee347$var$ycEnd = false;
        $34cadbb4fc0ee347$var$bzEnd = false;
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
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
    };
    let data = [];
    if (!$34cadbb4fc0ee347$var$fcEnd) {
        const res = (await (0, ($parcel$interopDefault($7qzYT$axios))).get("http://service.5sing.kugou.com/user/songlist", {
            headers: headers,
            params: {
                userId: artistItem.id,
                type: "fc",
                pageSize: $34cadbb4fc0ee347$export$3a40bd8b0ff0173c,
                page: page
            }
        })).data;
        if (res.count <= page * $34cadbb4fc0ee347$export$3a40bd8b0ff0173c) $34cadbb4fc0ee347$var$fcEnd = true;
        data = data.concat(res.data.map((_)=>({
                id: _.songId,
                artist: artistItem.name,
                title: _.songName,
                typeEname: "fc",
                typeName: "翻唱",
                type: _.songType,
                album: "翻唱"
            })));
    }
    if (!$34cadbb4fc0ee347$var$ycEnd) {
        const res = (await (0, ($parcel$interopDefault($7qzYT$axios))).get("http://service.5sing.kugou.com/user/songlist", {
            headers: headers,
            params: {
                userId: artistItem.id,
                type: "yc",
                pageSize: $34cadbb4fc0ee347$export$3a40bd8b0ff0173c,
                page: page
            }
        })).data;
        if (res.count <= page * $34cadbb4fc0ee347$export$3a40bd8b0ff0173c) $34cadbb4fc0ee347$var$ycEnd = true;
        data = data.concat(res.data.map((_)=>({
                id: _.songId,
                artist: artistItem.name,
                title: _.songName,
                typeEname: "yc",
                typeName: "原唱",
                type: _.songType,
                album: "原唱"
            })));
    }
    if (!$34cadbb4fc0ee347$var$bzEnd) {
        const res = (await (0, ($parcel$interopDefault($7qzYT$axios))).get("http://service.5sing.kugou.com/user/songlist", {
            headers: headers,
            params: {
                userId: artistItem.id,
                type: "bz",
                pageSize: $34cadbb4fc0ee347$export$3a40bd8b0ff0173c,
                page: page
            }
        })).data;
        if (res.count <= page * $34cadbb4fc0ee347$export$3a40bd8b0ff0173c) $34cadbb4fc0ee347$var$bzEnd = true;
        data = data.concat(res.data.map((_)=>({
                id: _.songId,
                artist: artistItem.name,
                title: _.songName,
                typeEname: "bz",
                typeName: "伴奏",
                type: _.songType,
                album: "伴奏"
            })));
    }
    return {
        isEnd: $34cadbb4fc0ee347$var$fcEnd && $34cadbb4fc0ee347$var$ycEnd && $34cadbb4fc0ee347$var$bzEnd,
        data: data
    };
}
async function $34cadbb4fc0ee347$var$getArtistWorks(artistItem, page, type) {
    if (type === "music") return $34cadbb4fc0ee347$var$getArtistMusicWorks(artistItem, page);
}
const $34cadbb4fc0ee347$var$pluginInstance = {
    platform: "5sing",
    version: "0.0.3",
    author: "SoEasy同学",
    srcUrl: "https://musicfreepluginshub.2020818.xyz/b25a34b4e76d85de88f82a2f041288a0.js",
    cacheControl: "no-cache",
    supportedSearchType: [
        "music",
        "album",
        "artist",
        "sheet"
    ],
    search: $99f39107e6812c91$export$2e2bcd8739ae039,
    getMediaSource: $34cadbb4fc0ee347$var$getMediaSource,
    getLyric: $34cadbb4fc0ee347$var$getLyric,
    getAlbumInfo: $34cadbb4fc0ee347$var$getAlbumInfo,
    getArtistWorks: $34cadbb4fc0ee347$var$getArtistWorks,
    getTopLists: $34cadbb4fc0ee347$var$getTopLists,
    getTopListDetail: $34cadbb4fc0ee347$var$getTopListDetail
};
var /*search("童话镇", 1, "music").then((res) => {
    console.log(res)
    getArtistWorks(res.data[0], 1, "music").then((res) => {
        console.log(res)
    })
    getLyric(res.data[0]).then((res) => {
        console.log(res)
    })
})*/ /*getTopLists().then((res) => {
    console.log(res)
    getTopListDetail(res[0].data[0]).then((res) => {
        console.log(res)
        getMediaSource(res.musicList[0], "standard").then((res) => {
            console.log(res)
        })
        getLyric(res.musicList[0]).then((res) => {
            console.log(res)
        })
    })
})*/ $34cadbb4fc0ee347$export$2e2bcd8739ae039 = $34cadbb4fc0ee347$var$pluginInstance;


//# sourceMappingURL=5sing.js.map
