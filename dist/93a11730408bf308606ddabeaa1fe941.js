var $h7QQr$axios = require("axios");
var $h7QQr$cryptojs = require("crypto-js");
var $h7QQr$cheerio = require("cheerio");

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

$parcel$export(module.exports, "host", () => $cfd4b261cce32605$export$5e032988b71f6158);
$parcel$export(module.exports, "default", () => $cfd4b261cce32605$export$2e2bcd8739ae039);
/** 搜索方法 */ 



function $0e27cb83c51dff83$export$ed1fb53032701881(_) {
    return {
        id: _.code,
        artist: _.author ?? "",
        title: $h7QQr$cheerio.load(_.name).text(),
        artwork: (0, $cfd4b261cce32605$export$5e032988b71f6158) + "/" + _.coverUrlLocal,
        description: _.descXx,
        date: _.udate
    };
}
function $0e27cb83c51dff83$export$d08aae127141ee12(_) {
    return {
        id: _.code,
        desc: _.name,
        name: $h7QQr$cheerio.load(_.author).text()
    };
}
function $0e27cb83c51dff83$export$f864c05433346335(_) {
    return {
        id: _.no,
        title: _.title
    };
}


async function $106b092730e7ea9e$var$searchMusic(query, page) {}
async function $106b092730e7ea9e$var$searchAlbum(query, page) {
    const res = (await (0, ($parcel$interopDefault($h7QQr$axios))).get((0, $cfd4b261cce32605$export$5e032988b71f6158) + "/search/index/search", {
        params: {
            content: query,
            pageNum: page,
            pageSize: 10,
            type: 1
        }
    })).data;
    var albums = res.data.content.map((0, $0e27cb83c51dff83$export$ed1fb53032701881));
    return {
        isEnd: res.data.totalPages <= page,
        data: albums
    };
}
async function $106b092730e7ea9e$var$searchArtist(query, page) {
    const res = (await (0, ($parcel$interopDefault($h7QQr$axios))).get((0, $cfd4b261cce32605$export$5e032988b71f6158) + "/search/index/search", {
        params: {
            content: query,
            pageNum: page,
            pageSize: 10,
            type: 2
        }
    })).data;
    var albums = res.data.content.map((0, $0e27cb83c51dff83$export$d08aae127141ee12));
    return {
        isEnd: res.data.totalPages <= page,
        data: $106b092730e7ea9e$var$filterUniqueByName(albums)
    };
}
function $106b092730e7ea9e$var$filterUniqueByName(list) {
    // 创建一个 Map 来存储每个唯一的 name 对应的对象
    const uniqueItems = new Map();
    // 遍历列表，将每个对象按其 name 存入 Map 中
    list.forEach((item)=>{
        if (!uniqueItems.has(item.name)) uniqueItems.set(item.name, item);
    });
    // 将 Map 中的对象值转换回数组
    return Array.from(uniqueItems.values());
}
async function $106b092730e7ea9e$var$searchSheet(query, page) {}
async function $106b092730e7ea9e$export$2e2bcd8739ae039(query, page, type) {
    if (type === "album") return $106b092730e7ea9e$var$searchAlbum(query, page);
    else if (type === "artist") return $106b092730e7ea9e$var$searchArtist(query, page);
}






const $cfd4b261cce32605$export$5e032988b71f6158 = "http://www.6yueting.com";
async function $cfd4b261cce32605$var$getAlbumInfo(albumItem, page) {
    var result = {
        albumItem: {
            ...albumItem
        }
    };
    // /web/index/xsListdetail?code=24673fb2ad&pageSize=30&pageNum=1
    const res = (await (0, ($parcel$interopDefault($h7QQr$axios))).get($cfd4b261cce32605$export$5e032988b71f6158 + "/web/index/xsListdetail", {
        params: {
            code: albumItem.id,
            pageSize: 30,
            pageNum: page
        }
    })).data;
    var songs = res.data.list.map((0, $0e27cb83c51dff83$export$f864c05433346335));
    songs.map((_)=>_.pid = albumItem.id);
    songs.map((_)=>_.artist = albumItem.artist);
    result.musicList = songs;
    result.isEnd = res.data.pages <= page;
    return result;
}
async function $cfd4b261cce32605$var$getMusicSheetInfo(sheetItem, page) {
    var result = {
        sheetItem: {
            ...sheetItem
        }
    };
    // /web/index/xsListdetail?code=24673fb2ad&pageSize=30&pageNum=1
    const res = (await (0, ($parcel$interopDefault($h7QQr$axios))).get($cfd4b261cce32605$export$5e032988b71f6158 + "/web/index/xsListdetail", {
        params: {
            code: sheetItem.id,
            pageSize: 30,
            pageNum: page
        }
    })).data;
    var songs = res.data.list.map((0, $0e27cb83c51dff83$export$f864c05433346335));
    songs.map((_)=>_.pid = sheetItem.id);
    songs.map((_)=>_.artist = sheetItem.artist);
    result.musicList = songs;
    result.isEnd = res.data.pages <= page;
    return result;
}
async function $cfd4b261cce32605$var$getMediaSource(musicItem, quality) {
    const t = Date.now();
    // 172680076118122934cc5e2879FRDSHFSKVKSKFKS
    const sign = t + musicItem.pid + musicItem.id + "FRDSHFSKVKSKFKS";
    const signture = (0, ($parcel$interopDefault($h7QQr$cryptojs))).MD5(sign).toString();
    const res = (await (0, ($parcel$interopDefault($h7QQr$axios))).get($cfd4b261cce32605$export$5e032988b71f6158 + "/web/index/video_new", {
        params: {
            code: musicItem.pid,
            no: musicItem.id,
            type: 0,
            timestamp: t,
            sign: signture
        },
        timeout: 10000
    })).data;
    var url = res.data.videoUrl;
    const hostHeader = url.match(/http[s]{0,1}:\/\/(.*?)\//) ? url.match(/http:\/\/(.*?)\//)[1] : "audio.6yueting.com:20001";
    return {
        url: url,
        headers: {
            Accept: "*/*",
            "Accept-Encoding": "identity",
            Connection: "keep-alive",
            Host: hostHeader,
            Pragma: "no-cache",
            Referer: "http://www.6yueting.com/",
            Range: "bytes=0-",
            "Cache-Control": "no-cache",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0"
        },
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0"
    };
}
async function $cfd4b261cce32605$var$getArtistWorks(artistItem, page, type) {
    if (type === "album") {
        var result = await (0, $106b092730e7ea9e$export$2e2bcd8739ae039)(artistItem.name, page, "album");
        return result;
    }
}
async function $cfd4b261cce32605$var$getRecommendSheetTags() {
    try {
        var result = {};
        var datas = [];
        var pinned = [];
        const html = (await (0, ($parcel$interopDefault($h7QQr$axios))).get($cfd4b261cce32605$export$5e032988b71f6158 + "/ys/t0")).data;
        const $ = $h7QQr$cheerio.load(html);
        const tagList = $("ul.category-list").find("li");
        for(let i = 0; i < tagList.length; i++){
            const name = $(tagList[i]).find("a").text();
            const id = $(tagList[i]).find("a").attr("href");
            var temp = {};
            pinned.push({
                id: id,
                title: name
            });
        }
        datas.push({
            title: "分类",
            data: pinned
        });
        result.data = datas;
        result.pinned = pinned;
        return result;
    } catch (e) {
        console.log(e);
    }
    return {};
}
async function $cfd4b261cce32605$var$getRecommendSheetsByTag(tag, page) {
    try {
        var result = {};
        var sheets = [];
        var id = tag.id;
        if (id == "") id = "/ys/t0";
        var sub = page == 1 ? "" : "/o1/p" + page;
        const html = (await (0, ($parcel$interopDefault($h7QQr$axios))).get($cfd4b261cce32605$export$5e032988b71f6158 + id + sub)).data;
        const $ = $h7QQr$cheerio.load(html);
        const tagList = $("ul.album-list").find("li");
        for(let i = 0; i < tagList.length; i++){
            var title = $(tagList[i]).find(".book-item-name a").text();
            var href = $(tagList[i]).find(".book-item-name a").attr("href");
            var artist = $(tagList[i]).find(".book-item-info a").eq(0).text();
            var artwork = $(tagList[i]).find(".book-item-img a img").attr("src").toString();
            var description = $(tagList[i]).find("p.book-item-desc").text();
            var createAt = $(tagList[i]).find("span.split").text().toString().replace("更新", "");
            sheets.push({
                id: href.match(/\/list\/(\w+)/)[1],
                title: title,
                artist: artist,
                artwork: "https://images.weserv.nl/?url=" + artwork,
                description: description
            });
        }
        result.data = sheets;
        result.isEnd = sheets.length < 10;
        console.log(result);
        return result;
    } catch (e) {
        console.log(e);
    }
    return {};
}
const $cfd4b261cce32605$var$pluginInstance = {
    platform: "6yueting",
    version: "0.1.5",
    author: "SoEasy同学",
    srcUrl: "https://gitee.com/kevinr/tvbox/raw/master/musicfree/plugins/6yueting.js",
    cacheControl: "no-cache",
    supportedSearchType: [
        "music",
        "album",
        "artist",
        "sheet"
    ],
    search: $106b092730e7ea9e$export$2e2bcd8739ae039,
    getAlbumInfo: $cfd4b261cce32605$var$getAlbumInfo,
    getMusicSheetInfo: $cfd4b261cce32605$var$getMusicSheetInfo,
    getMediaSource: $cfd4b261cce32605$var$getMediaSource,
    getArtistWorks: $cfd4b261cce32605$var$getArtistWorks,
    getRecommendSheetTags: $cfd4b261cce32605$var$getRecommendSheetTags,
    getRecommendSheetsByTag: $cfd4b261cce32605$var$getRecommendSheetsByTag
};
var /*search("明朝那些事儿", 1, "album").then((res) => {
    console.log(res)
    getAlbumInfo(res.data[0], 1).then((res) => {
        console.log(res)
        getMediaSource(res.musicList[0], "").then((res) => {
            console.log(res)
        })
    })
})*/ /*search("明朝那些事儿", 1, "artist").then((res) => {
    console.log(res)
    getArtistWorks(res.data[0], 1, "album").then((res) => {
        console.log(res)
        getAlbumInfo(res.data[0], 1).then((res) => {
            console.log(res)
            getMediaSource(res.musicList[0], "").then((res) => {
                console.log(res)
            })
        })
    })
})*/ /*getRecommendSheetTags().then((res) => {
    console.log(res)
    getRecommendSheetsByTag(res.data[0].data[0], 1).then((res) => {
        console.log(res)
        getMusicSheetInfo(res.data[0], 1).then((res) => {
            console.log(res);
            getMediaSource(res.musicList[0], "standard").then((res) => {
                console.log(res)
            })
        })
    })
})*/ $cfd4b261cce32605$export$2e2bcd8739ae039 = $cfd4b261cce32605$var$pluginInstance;


//# sourceMappingURL=6yueting.js.map
