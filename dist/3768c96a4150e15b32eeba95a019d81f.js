var $1PmeY$cheerio = require("cheerio");
var $1PmeY$axios = require("axios");
require("he");

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

$parcel$export(module.exports, "default", () => $fb42a3116a5ee582$export$2e2bcd8739ae039);
/** 搜索方法 */
async function $e498536cecf4b2de$export$c55fd7b1d7fa3710(raw_data, separator) {
    const $ = $1PmeY$cheerio.load(raw_data);
    const rawPlayList = $("div.play_list").find("li");
    var list = [];
    for(let i = 0; i < rawPlayList.length; i++){
        const item = $(rawPlayList[i]).find("a");
        let id = $(item[0]).attr("href").match(/\/song\/(.*?).html/)[1];
        let separatedText = $(item[0]).text().split(separator);
        let artist = separatedText[0] // 通过分隔符区分歌手和歌名
        ;
        let title = separatedText[1] != "" ? separatedText[1] : separatedText[2];
        list.push({
            id: id,
            title: title,
            artist: artist
        });
    }
    return list;
}
async function $e498536cecf4b2de$export$d88d07b680eb6fd1(html) {}
async function $e498536cecf4b2de$export$5f54ed25dd7fe25e(html) {
    const $ = $1PmeY$cheerio.load(html);
    const rawPlayList = $("div.ilingku_fl").find("li");
    const pageData = $("div.pagedata").text();
    let topListArr = [];
    topListArr.push({
        id: "new",
        title: "新歌榜",
        description: "每日同步官方数据。" + pageData
    }, {
        id: "top",
        title: "飙升榜",
        description: "每日同步官方数据。" + pageData
    });
    for(let i = 0; i < rawPlayList.length; i++){
        const item = $(rawPlayList[i]).find("a");
        let href = $(item[0]).attr("href").match(/\/list\/(.*?).html/)[1];
        let title = $(item[0]).text();
        topListArr.push({
            id: href,
            title: title,
            description: "每日同步官方数据：" + pageData
        });
    }
    return topListArr;
}
function $e498536cecf4b2de$export$d7bdacb66077735f(_) {
    return {
        id: _.id,
        artist: _.artist,
        title: _.title,
        album: _.album,
        duration: _.duration,
        artwork: _.artwork
    };
}




const $12b2041efbdef206$var$host = "http://www.2t58.com";
async function $12b2041efbdef206$var$searchMusic(query, page) {
    let keyword = encodeURIComponent(query);
    let serchUrl = $12b2041efbdef206$var$host + "/so/" + keyword + "/" + page + ".html";
    let searchRes = (await (0, ($parcel$interopDefault($1PmeY$axios))).get(serchUrl)).data;
    const $ = $1PmeY$cheerio.load(searchRes);
    const total = $("div.play_list").find("span").text();
    var isEnd = true;
    let songList = await (0, $e498536cecf4b2de$export$c55fd7b1d7fa3710)(searchRes, " - ");
    if (total !== "" && !isNaN(Number(total))) isEnd = Number(total) <= page * 68;
    const songs = songList.map((0, $e498536cecf4b2de$export$d7bdacb66077735f));
    return {
        isEnd: isEnd,
        data: songs
    };
}
async function $12b2041efbdef206$var$searchAlbum(query, page) {
    /*const res = (await searchBase(query, page, "album")).data.album;
    return {
      isEnd: true,
      data: res.map(formatMusicItem),
    };*/ return {
        isEnd: true,
        data: []
    };
}
async function $12b2041efbdef206$var$searchArtist(query, page) {
    /*var res = (await searchBase(query, page)).data;
    return {
      isEnd: true,
      data: res.filter((raw) => raw.sname.include(query)).map(formatMusicItem),
    };*/ return {
        isEnd: true,
        data: []
    };
}
async function $12b2041efbdef206$export$2e2bcd8739ae039(query, page, type) {
    if (type === "music") return $12b2041efbdef206$var$searchMusic(query, page);
    else if (type === "album") return $12b2041efbdef206$var$searchAlbum(query, page);
    else if (type === "artist") return $12b2041efbdef206$var$searchArtist(query, page);
}






const $fb42a3116a5ee582$var$host = "http://www.2t58.com";
async function $fb42a3116a5ee582$var$getLyric(musicItem) {
    let res = (await ($parcel$interopDefault($1PmeY$axios))({
        method: "get",
        url: $fb42a3116a5ee582$var$host + "/plug/down.php?ac=music&lk=lrc&id=" + musicItem.id,
        timeout: 10000
    })).data;
    res = res.replace("www.44h4.com", "");
    res = res.replace("www.2t58.com", "");
    res = res.replace("44h4", "****"); //屏蔽歌词中的网站信息
    res = res.replace("2t58", "****");
    res = res.replace("欢迎来访", ""); //屏蔽歌词中的网站信息
    res = res.replace("爱听音乐网", ""); //屏蔽歌词中的网站信息
    return {
        rawLrc: res
    };
}
async function $fb42a3116a5ee582$var$getTopLists() {
    const html = (await ($parcel$interopDefault($1PmeY$axios)).get($fb42a3116a5ee582$var$host + "/list/top.html")).data;
    let toplist = await (0, $e498536cecf4b2de$export$5f54ed25dd7fe25e)(html);
    return [
        {
            title: "官方榜单",
            data: toplist.map((_)=>{
                return {
                    id: _.id,
                    title: _.title,
                    description: _.description
                };
            })
        }
    ];
}
async function $fb42a3116a5ee582$var$getTopListDetail(topListItem) {
    var res = {
        ...topListItem
    };
    var page = 1;
    var musicList = [];
    while(true){
        let urlSerch = $fb42a3116a5ee582$var$host + "/list/" + topListItem.id + "/" + page + ".html";
        let searchRes = (await ($parcel$interopDefault($1PmeY$axios)).get(urlSerch)).data;
        let songList = await (0, $e498536cecf4b2de$export$c55fd7b1d7fa3710)(searchRes, "_");
        songList = songList.map((_)=>{
            return {
                id: _.id,
                title: _.title,
                artist: _.artist
            };
        });
        musicList = musicList.concat(songList);
        page++;
        res.musicList = musicList;
        // 翻页，最多翻3页，约200条数据
        if (songList.length < 68 || page > 3) break;
    }
    return res;
}
async function $fb42a3116a5ee582$var$getRecommendSheetTags() {
    try {
        var result = {};
        var datas = [];
        var pinned = [];
        const html = (await ($parcel$interopDefault($1PmeY$axios)).get($fb42a3116a5ee582$var$host + "/playtype/index.html")).data;
        const $ = $1PmeY$cheerio.load(html);
        const tagList = $("div.ilingku_fl");
        for(let i = 0; i < tagList.length; i++){
            var tag = $(tagList[i]).find("li:first-child").text().replace(":", "");
            var group = {};
            group.title = tag;
            var secondTag = [];
            const secondTagList = $(tagList[i]).find("a");
            for(let j = 0; j < secondTagList.length; j++){
                var item = {
                    id: $(secondTagList[j]).attr("href").match(/\/playtype\/(.*?).html/)[1],
                    title: $(secondTagList[j]).text()
                };
                secondTag.push(item);
                if (j == 0) pinned.push(item);
            }
            group.data = secondTag;
            datas.push(group);
        }
        result.data = datas;
        result.pinned = pinned;
        return result;
    } catch (e) {
        console.log(e);
    }
    return {};
}
async function $fb42a3116a5ee582$var$getRecommendSheetsByTag(tag, page) {
    try {
        var result = {};
        var sheets = [];
        var id = tag.id !== "" ? tag.id : "index";
        var searchUrl = $fb42a3116a5ee582$var$host + "/playtype/" + id + "/" + page + ".html";
        const html = (await ($parcel$interopDefault($1PmeY$axios)).get(searchUrl)).data;
        const $ = $1PmeY$cheerio.load(html);
        const sheetList = $("div.video_list").find("li");
        for(let i = 0; i < sheetList.length; i++)sheets.push({
            id: $(sheetList[i]).find(".pic a").attr("href").match(/\/playlist\/(.*?).html/)[1],
            title: $(sheetList[i]).find(".name a").text(),
            artwork: $(sheetList[i]).find(".pic a img").attr("src")
        });
        result.data = sheets;
        result.isEnd = sheets.length < 30;
        return result;
    } catch (e) {
        console.log(e);
    }
    return {};
}
async function $fb42a3116a5ee582$var$getMediaSource(musicItem, quality) {
    let header = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": $fb42a3116a5ee582$var$host + `/song/${musicItem.id}.html`
    };
    let mp3_Result = (await ($parcel$interopDefault($1PmeY$axios))({
        method: "post",
        url: $fb42a3116a5ee582$var$host + `/js/play.php`,
        headers: header,
        data: `id=${musicItem.id}&type=music`
    })).data;
    if (mp3_Result.url) return {
        url: mp3_Result.url,
        quality: quality
    };
    return {
        url: ""
    };
}
async function $fb42a3116a5ee582$var$getMusicSheetInfo(sheet, page) {
    var result = {};
    let urlSerch = $fb42a3116a5ee582$var$host + "/playlist/" + sheet.id + "/" + page + ".html";
    let searchRes = (await ($parcel$interopDefault($1PmeY$axios)).get(urlSerch)).data;
    const $ = $1PmeY$cheerio.load(searchRes);
    result.sheetItem = {
        description: $(".info").text()
    };
    let songList = await (0, $e498536cecf4b2de$export$c55fd7b1d7fa3710)(searchRes, " - ");
    result.musicList = songList;
    result.isEnd = songList.length < 68;
    return result;
}
const $fb42a3116a5ee582$var$pluginInstance = {
    platform: "爱听",
    version: "0.1.0",
    author: "SoEasy同学",
    srcUrl: "https://gitee.com/kevinr/tvbox/raw/master/musicfree/plugins/at.js",
    cacheControl: "no-cache",
    supportedSearchType: [
        "music",
        "album",
        "artist"
    ],
    search: $12b2041efbdef206$export$2e2bcd8739ae039,
    getMediaSource: $fb42a3116a5ee582$var$getMediaSource,
    getLyric: $fb42a3116a5ee582$var$getLyric,
    getTopLists: $fb42a3116a5ee582$var$getTopLists,
    getTopListDetail: $fb42a3116a5ee582$var$getTopListDetail,
    getRecommendSheetTags: $fb42a3116a5ee582$var$getRecommendSheetTags,
    getRecommendSheetsByTag: $fb42a3116a5ee582$var$getRecommendSheetsByTag,
    getMusicSheetInfo: $fb42a3116a5ee582$var$getMusicSheetInfo
};
var /*search("童话镇", 1, "music").then((res) => {
    console.log(res)
    getMediaSource(res.data[0], "standard").then((res) => {
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
})*/ $fb42a3116a5ee582$export$2e2bcd8739ae039 = $fb42a3116a5ee582$var$pluginInstance;


//# sourceMappingURL=2t58.js.map
