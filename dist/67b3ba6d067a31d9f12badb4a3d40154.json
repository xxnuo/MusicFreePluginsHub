var $d9Bti$axios = require("axios");
var $d9Bti$cheerio = require("cheerio");
var $d9Bti$dayjs = require("dayjs");
var $d9Bti$cryptojs = require("crypto-js");

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

$parcel$export(module.exports, "default", () => $89bf7938ddf8e249$export$2e2bcd8739ae039);
/** 搜索方法 */ 


function $60fd231faf899fd5$export$47fac120ab74ef02(word, sing) {
    const key = (0, ($parcel$interopDefault($d9Bti$cryptojs))).enc.Utf8.parse(sing);
    const iv = (0, ($parcel$interopDefault($d9Bti$cryptojs))).enc.Utf8.parse("k1y2a3b4r5t6c7q7");
    var encrypted = (0, ($parcel$interopDefault($d9Bti$cryptojs))).AES.encrypt(word, key, {
        iv: iv,
        mode: (0, ($parcel$interopDefault($d9Bti$cryptojs))).mode.CBC,
        padding: (0, ($parcel$interopDefault($d9Bti$cryptojs))).pad.Pkcs7
    });
    var ciphertext = encrypted.ciphertext.toString((0, ($parcel$interopDefault($d9Bti$cryptojs))).enc.Hex);
    return ciphertext.toUpperCase();
}
async function $60fd231faf899fd5$export$bd6d310eff940ae4(url, params) {
    //请求函数
    var html = (0, ($parcel$interopDefault($d9Bti$axios))).get(url, {
        params: params,
        headers: {
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.61"
        }
    });
    return html;
}
function $60fd231faf899fd5$export$76cd2546cd31fda2(timeStr) {
    try {
        // 分离小时和分钟
        const times = timeStr.split(":");
        if (times.length == 2) {
            const [minutes, second] = timeStr.split(":").map(Number);
            const minutesInSeconds = minutes * 60;
            return minutesInSeconds + second;
        } else if (times.length == 3) {
            const [hours, minutes, second] = timeStr.split(":").map(Number);
            const hoursInSeconds = minutes * 3600;
            const minutesInSeconds = minutes * 60;
            return hoursInSeconds + minutesInSeconds + second;
        }
    } catch (e) {
        return 0;
    }
    return 0;
}


function $5c617407703ff57c$export$d7bdacb66077735f(_) {
    return {
        id: _.id,
        platform: "种子",
        artist: _.sname,
        title: _.mname,
        album: _.pic,
        duration: (0, $60fd231faf899fd5$export$76cd2546cd31fda2)(_.play_time),
        artwork: _.pic,
        url: _.mp3
    };
}
function $5c617407703ff57c$export$ed1fb53032701881(_) {
    return {
        id: _.albumId ?? _.id,
        artist: _.nickname,
        title: _.title,
        artwork: _.coverPath?.startsWith("//") ? `https:${_.coverPath}` : _.coverPath,
        description: _.intro ?? _.description,
        date: _.updatedAt ? (0, ($parcel$interopDefault($d9Bti$dayjs)))(_.updatedAt).format("YYYY-MM-DD") : null
    };
}
function $5c617407703ff57c$export$d08aae127141ee12(_) {
    return {
        name: _.nickname,
        id: _.uid,
        fans: _.followersCount,
        description: _.description,
        avatar: _.logoPic,
        worksNum: _.tracksCount
    };
}
function $5c617407703ff57c$export$4141752cc74ed82e(_) {
    return {
        id: _.id,
        platform: "岸听",
        artwork: _.coverImgUrl ?? _.pic,
        title: _.name,
        description: _.description,
        worksNum: _.trackCount
    };
}
function $5c617407703ff57c$export$fa5f2f9db37e5217(page, tag, first, list) {
    return {
        id: tag.id,
        artist: first.sname,
        title: first.mname,
        artwork: first.pic,
        musicList: list.map((_)=>{
            const r = $5c617407703ff57c$export$d7bdacb66077735f(_);
            return r;
        })
    };
}
function $5c617407703ff57c$export$4135fdd7029f141(raw) {
    return !raw.priceTypes?.length;
}
function $5c617407703ff57c$export$ed4cedad8375a67(raw) {
    return raw.tag === 0 || raw.isPaid === false || parseFloat(raw.price) === 0;
}



async function $db56cb91f4576ed0$var$searchBase(query, page) {
    var html = await (0, $60fd231faf899fd5$export$bd6d310eff940ae4)("https://zz123.com/ajax/", {
        act: "search",
        key: query,
        lang: ""
    });
    var data = html.data;
    return data;
}
async function $db56cb91f4576ed0$var$searchMusic(query, page) {
    var res = (await $db56cb91f4576ed0$var$searchBase(query, page)).data;
    return {
        isEnd: true,
        data: res.map((0, $5c617407703ff57c$export$d7bdacb66077735f))
    };
}
async function $db56cb91f4576ed0$var$searchAlbum(query, page) {
    /*const res = (await searchBase(query, page, "album")).data.album;
  return {
    isEnd: true,
    data: res.map(formatMusicItem),
  };*/ return {
        isEnd: true,
        data: []
    };
}
async function $db56cb91f4576ed0$var$searchArtist(query, page) {
    var res = (await $db56cb91f4576ed0$var$searchBase(query, page)).data;
    return {
        isEnd: true,
        data: res.filter((raw)=>raw.sname.include(query)).map((0, $5c617407703ff57c$export$d7bdacb66077735f))
    };
}
async function $db56cb91f4576ed0$export$2e2bcd8739ae039(query, page, type) {
    if (type === "music") return $db56cb91f4576ed0$var$searchMusic(query, page);
    else if (type === "album") return $db56cb91f4576ed0$var$searchAlbum(query, page);
    else if (type === "artist") return $db56cb91f4576ed0$var$searchArtist(query, page);
}






/** 获取专辑详情 */ async function $89bf7938ddf8e249$var$getAlbumInfo(albumItem, page = 1) {
    const res = await (0, ($parcel$interopDefault($d9Bti$axios))).get("https://www.ximalaya.com/revision/album/v1/getTracksList", {
        params: {
            albumId: albumItem.id,
            pageNum: page,
            pageSize: 50
        }
    });
    return {
        isEnd: page * 50 >= res.data.data.trackTotalCount,
        albumItem: {
            worksNum: res.data.data.trackTotalCount
        },
        musicList: res.data.data.tracks.filter((0, $5c617407703ff57c$export$ed4cedad8375a67)).map((_)=>{
            const r = (0, $5c617407703ff57c$export$d7bdacb66077735f)(_);
            r.artwork = albumItem.artwork;
            r.artist = albumItem.artist;
            return r;
        })
    };
}
/** 获取专辑详情 */ async function $89bf7938ddf8e249$var$getLyric(musicItem) {
    let html = await (0, $60fd231faf899fd5$export$bd6d310eff940ae4)("https://zz123.com/ajax/", {
        act: "songinfo",
        id: musicItem.id,
        lang: ""
    });
    const data = html.data.data;
    return {
        rawLrc: data.lrc
    };
}
/** 获取专辑详情 */ async function $89bf7938ddf8e249$var$getMediaSource(musicItem, quality) {
    let html = await (0, $60fd231faf899fd5$export$bd6d310eff940ae4)("https://zz123.com/ajax/", {
        act: "songinfo",
        id: musicItem.id,
        lang: ""
    });
    const data = html.data.data;
    return {
        url: data.mp3,
        quality: quality
    };
}
async function $89bf7938ddf8e249$var$getTopLists() {
    var result = [];
    const html = await (0, $60fd231faf899fd5$export$bd6d310eff940ae4)("https://zz123.com", {});
    const $ = $d9Bti$cheerio.load(html.data);
    const tops = $(".d-none .cate-list a").get();
    var lists = [];
    for(var i in tops)lists.push({
        id: $(tops[i]).attr("href").match(/\/list\/(\w+)\.htm/)[1],
        title: $(tops[i]).text()
    });
    result.push({
        title: "种子音乐",
        data: lists
    });
    // return
    return result;
}
async function $89bf7938ddf8e249$var$getTopListDetail(sheetItem, page = 1) {
    var result;
    result = {
        ...sheetItem
    };
    const id = sheetItem.id;
    const html = await (0, $60fd231faf899fd5$export$bd6d310eff940ae4)("https://zz123.com/ajax/", {
        act: "tag_music",
        tid: id,
        lang: "",
        page: 1
    });
    var list = html.data.data;
    result.musicList = list.map((_)=>{
        const r = (0, $5c617407703ff57c$export$d7bdacb66077735f)(_);
        return r;
    });
    const html2 = await (0, $60fd231faf899fd5$export$bd6d310eff940ae4)("https://zz123.com/ajax/", {
        act: "tag_music",
        tid: id,
        lang: "",
        page: 2
    });
    var list2 = html2.data.data;
    result.musicList = result.musicList.concat(list2.map((_)=>{
        const r = (0, $5c617407703ff57c$export$d7bdacb66077735f)(_);
        return r;
    }));
    return result;
}
async function $89bf7938ddf8e249$var$getRecommendSheetTags() {
    var result = {};
    const html = await (0, $60fd231faf899fd5$export$bd6d310eff940ae4)("https://zz123.com", {});
    const $ = $d9Bti$cheerio.load(html.data);
    const menus = $("ul.channel li").get();
    var lists = [];
    for(var i in menus)lists.push({
        id: $(menus[i]).find("a").attr("href").match(/\/list\/(\w+)\.htm/)[1],
        title: $(menus[i]).find("a span").text()
    });
    result.pinned = lists;
    var datas = [];
    datas.push({
        data: lists
    });
    result.data = datas;
    return result;
}
async function $89bf7938ddf8e249$var$getRecommendSheetsByTag(tag, page) {
    var result = {};
    let size = 50;
    var datas = [];
    var num = 1;
    while(size == 50 && num <= 10){
        const html = await (0, $60fd231faf899fd5$export$bd6d310eff940ae4)("https://zz123.com/ajax/", {
            act: "tag_music",
            tid: tag.id || "azz",
            lang: "",
            page: (page - 1) * 10 + num
        });
        const list = html.data.data;
        if (list.length > 0) {
            const first = list[0];
            datas.push((0, $5c617407703ff57c$export$fa5f2f9db37e5217)(page, tag, first, list));
        }
        size = list.length;
        num++;
        if (num == 10 && size == 50) result.isEnd = false;
    }
    result.data = datas;
    return result;
}
async function $89bf7938ddf8e249$var$getMusicSheetInfo(sheetItem, page) {
    var result = {};
    result.sheetItem = sheetItem;
    /*    const html = await getHtml("https://zz123.com/ajax/", {
        act: "tag_music",
        tid: sheetItem.id,
        lang: "",
        page: sheetItem.page
    });
    const list = html.data.data;*/ result.musicList = sheetItem.musicList;
    result.isEnd = true;
    return result;
}
const $89bf7938ddf8e249$var$pluginInstance = {
    platform: "种子",
    version: "0.1.0",
    author: "SoEasy同学",
    srcUrl: "https://gitee.com/kevinr/tvbox/raw/master/musicfree/plugins/zz.js",
    supportedSearchType: [
        "music",
        "album",
        "artist"
    ],
    search: $db56cb91f4576ed0$export$2e2bcd8739ae039,
    getMediaSource: $89bf7938ddf8e249$var$getMediaSource,
    getLyric: $89bf7938ddf8e249$var$getLyric,
    getTopLists: // getAlbumInfo, // 获取专辑详情
    // getArtistWorks, // 获取作者信息
    $89bf7938ddf8e249$var$getTopLists,
    getTopListDetail: $89bf7938ddf8e249$var$getTopListDetail,
    getRecommendSheetTags: $89bf7938ddf8e249$var$getRecommendSheetTags,
    getRecommendSheetsByTag: $89bf7938ddf8e249$var$getRecommendSheetsByTag,
    getMusicSheetInfo: $89bf7938ddf8e249$var$getMusicSheetInfo
};
/*search("童话镇", 1, "music").then((res) => {
    console.log(res)
    getMediaSource(res.data[0], "standard").then((res) => {
        console.log(res)
    })
    getLyric(res.data[0]).then((res) => {
        console.log(res)
    })
})*/ /*getRecommendSheetTags().then((res) => {
    console.log(res)
    getRecommendSheetsByTag(res.pinned[0], 1).then((res) => {
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
})*/ $89bf7938ddf8e249$var$getTopLists().then((res)=>{
    console.log(res);
    $89bf7938ddf8e249$var$getTopListDetail(res[0].data[0]).then((res)=>{
        console.log(res);
        $89bf7938ddf8e249$var$getMediaSource(res.musicList[0], "standard").then((res)=>{
            console.log(res);
        });
        $89bf7938ddf8e249$var$getLyric(res.musicList[0]).then((res)=>{
            console.log(res);
        });
    });
});
var $89bf7938ddf8e249$export$2e2bcd8739ae039 = $89bf7938ddf8e249$var$pluginInstance;


//# sourceMappingURL=zz.js.map
