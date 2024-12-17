var $aeeUC$axios = require("axios");
var $aeeUC$cheerio = require("cheerio");

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

$parcel$export(module.exports, "host", () => $f143b11fc67a70bd$export$5e032988b71f6158);
$parcel$export(module.exports, "default", () => $f143b11fc67a70bd$export$2e2bcd8739ae039);



async function $19a45cbfdc5a1d1d$var$searchMusic(query, page) {
    let keyword = encodeURIComponent(query);
    let serchUrl = (0, $f143b11fc67a70bd$export$5e032988b71f6158) + "/s/" + keyword;
    let songs = [];
    let searchRes = (await (0, ($parcel$interopDefault($aeeUC$axios))).get(serchUrl, {
        timeout: 5000
    })).data;
    const $ = $aeeUC$cheerio.load(searchRes);
    var rowList = $(".card-text").find(".row").slice(1);
    for(let i = 0; i < rowList.length; i++){
        var id = $(rowList[i]).find("a.music-link").attr("href").match(/\/music\/(\d+)/)[1];
        var title = $(rowList[i]).find("a.music-link span").eq(0).text().toString().trim();
        var artist = $(rowList[i]).find("small").text().toString().trim();
        songs.push({
            id: id,
            title: title,
            artist: artist
        });
    }
    return {
        isEnd: true,
        data: songs
    };
}
async function $19a45cbfdc5a1d1d$export$2e2bcd8739ae039(query, page, type) {
    if (type === "music") return $19a45cbfdc5a1d1d$var$searchMusic(query, page);
}




const $f143b11fc67a70bd$export$5e032988b71f6158 = "https://www.gequbao.com";
async function $f143b11fc67a70bd$var$getMediaSource(musicItem, quality) {
    // https://www.gequbao.com/music/5465
    let tempUrl = $f143b11fc67a70bd$export$5e032988b71f6158 + "/music/" + musicItem.id;
    let tempRes = (await (0, ($parcel$interopDefault($aeeUC$axios))).get(tempUrl, {
        timeout: 5000
    })).data;
    const id = tempRes.match(/window.play_id = '(.*?)';/)[1];
    let serchUrl = $f143b11fc67a70bd$export$5e032988b71f6158 + "/api/play-url";
    var body = "id=" + id;
    var headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Connection": "Keep-Alive"
    };
    var searchRes = await (0, ($parcel$interopDefault($aeeUC$axios))).post(serchUrl, body, {
        headers: headers,
        timeout: 100000
    }); //log(html)
    return {
        url: searchRes.data.data.url
    };
}
async function $f143b11fc67a70bd$var$getLyric(musicItem) {
    let serchUrl = $f143b11fc67a70bd$export$5e032988b71f6158 + "/music/" + musicItem.id;
    let searchRes = (await (0, ($parcel$interopDefault($aeeUC$axios))).get(serchUrl, {
        timeout: 5000
    })).data;
    const $ = $aeeUC$cheerio.load(searchRes);
    return {
        rawLrc: $("#content-lrc").text().toString()
    };
}
async function $f143b11fc67a70bd$var$getRecommendSheetTags() {
    try {
        var result = {};
        var datas = [];
        var pinned = [];
        pinned.push({
            id: "/history/",
            title: "最新搜索"
        });
        pinned.push({
            id: "/top/yesterday",
            title: "昨日搜索"
        });
        pinned.push({
            id: "/top/week",
            title: "本周搜索"
        });
        pinned.push({
            id: "/top/month",
            title: "本月搜索"
        });
        pinned.push({
            id: "/top/last_month",
            title: "上月搜索"
        });
        datas.push({
            title: "搜索记录",
            data: pinned
        });
        result.data = datas;
        result.pinned = pinned;
        return result;
    } catch (e) {
        console.log(e);
    }
}
async function $f143b11fc67a70bd$var$getRecommendSheetsByTag(tag, page) {
    try {
        var result = {};
        var sheets = [];
        var searchUrl = "";
        if (tag.id.toString().startsWith("/history")) searchUrl = $f143b11fc67a70bd$export$5e032988b71f6158 + tag.id + page;
        else if (tag.id.toString().startsWith("/top")) searchUrl = $f143b11fc67a70bd$export$5e032988b71f6158 + tag.id + "?page=" + page;
        else if (tag.id.toString() == "") searchUrl = $f143b11fc67a70bd$export$5e032988b71f6158 + "/history/" + page;
        let searchRes = (await (0, ($parcel$interopDefault($aeeUC$axios))).get(searchUrl, {
            timeout: 5000
        })).data;
        const $ = $aeeUC$cheerio.load(searchRes);
        var rowList = $("tbody").find("tr");
        for(let i = 0; i < rowList.length; i++){
            var id = $(rowList[i]).find("td a").attr("href");
            var title = $(rowList[i]).find("td a").attr("href").toString().trim().replace("/s/", "");
            sheets.push({
                id: id,
                title: title,
                description: '"' + title + '"的搜索记录'
            });
        }
        result.data = sheets;
        result.isEnd = sheets.length < 10;
        return result;
    } catch (e) {}
}
async function $f143b11fc67a70bd$var$getMusicSheetInfo(sheetItem, page) {
    try {
        var result = {
            sheetItem: {
                ...sheetItem
            }
        };
        let searchRes = await (0, $19a45cbfdc5a1d1d$export$2e2bcd8739ae039)(sheetItem.title, page, "music");
        result.musicList = searchRes.data;
        result.isEnd = searchRes.isEnd;
    } catch (e) {
        console.log(e);
    }
    return result;
}
const $f143b11fc67a70bd$var$pluginInstance = {
    platform: "歌曲宝",
    version: "0.0.5",
    author: "SoEasy同学",
    srcUrl: "https://gitee.com/kevinr/tvbox/raw/master/musicfree/plugins/gequbao.js",
    cacheControl: "no-cache",
    supportedSearchType: [
        "music"
    ],
    search: $19a45cbfdc5a1d1d$export$2e2bcd8739ae039,
    getMediaSource: $f143b11fc67a70bd$var$getMediaSource,
    getLyric: $f143b11fc67a70bd$var$getLyric,
    getRecommendSheetTags: $f143b11fc67a70bd$var$getRecommendSheetTags,
    getRecommendSheetsByTag: $f143b11fc67a70bd$var$getRecommendSheetsByTag,
    getMusicSheetInfo: $f143b11fc67a70bd$var$getMusicSheetInfo
};
(0, $19a45cbfdc5a1d1d$export$2e2bcd8739ae039)("江南", 1, "music").then((res)=>{
    console.log(res);
    $f143b11fc67a70bd$var$getMediaSource(res.data[0], "standard").then((res)=>{
        console.log(res);
    });
    $f143b11fc67a70bd$var$getLyric(res.data[0]).then((res)=>{
        console.log(res);
    });
});
var /*getRecommendSheetTags().then((res) => {
    console.log(res)
    getRecommendSheetsByTag(res.data[0].data[0], 1).then((res) => {
        console.log(res)
        getMusicSheetInfo(res.data[0], 1).then((res) => {
            console.log(res);
            getMediaSource(res.musicList[0], "standard").then((res) => {
                console.log(res)
            })
            getLyric(res.musicList[0]).then((res) => {
                console.log(res)
            })
        })
    })
})*/ $f143b11fc67a70bd$export$2e2bcd8739ae039 = $f143b11fc67a70bd$var$pluginInstance;


//# sourceMappingURL=gequbao.js.map
