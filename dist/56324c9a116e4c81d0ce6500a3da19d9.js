var $6tF58$axios = require("axios");
var $6tF58$cheerio = require("cheerio");

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

$parcel$export(module.exports, "host", () => $e419ee3fc9a9aada$export$5e032988b71f6158);
$parcel$export(module.exports, "headers", () => $e419ee3fc9a9aada$export$838e2a576d4d6ff6);
$parcel$export(module.exports, "getArtistWorks", () => $e419ee3fc9a9aada$export$4adb7587a1eda30e);
$parcel$export(module.exports, "default", () => $e419ee3fc9a9aada$export$2e2bcd8739ae039);
/** 搜索方法 */ 
async function $5d6ef737067ff070$export$d48dc9c5c585da4(rawData) {
    const $ = $6tF58$cheerio.load(rawData);
    var rawPlayList = $("ul.musicList").find("li");
    var list = [];
    for(let i = 0; i < rawPlayList.length; i++){
        var item = $(rawPlayList[i]).find("a.mTitle");
        const artists = $(rawPlayList[i]).find("span.artist");
        let musicId = $(item[0]).attr("href").match(/\/play\/(\d+)/) ? $(item[0]).attr("href").match(/\/play\/(\d+)/)[1] : "";
        let title = $(item[0]).text().toString();
        let artist = $(artists[0]).text();
        list.push({
            id: musicId,
            title: title,
            artist: artist
        });
    }
    return list;
}
function $5d6ef737067ff070$export$ca2a7395555a320f(html) {
    // 使用正则表达式提取变量
    const fileHostMatch = html.match(/var fileHost\s*=\s*"([^"]+)"/);
    const mp3Match = html.match(/var mp3\s*=\s*"([^"]+)"/);
    if (!fileHostMatch || !mp3Match) throw new Error("无法提取播放链接");
    const fileHost = fileHostMatch[1];
    const mp3Path = mp3Match[1];
    // 拼接播放链接
    const playUrl = `${fileHost}${mp3Path}`;
    return playUrl;
}
async function $5d6ef737067ff070$export$e73e0faebaff9d71(rawData) {
    const $ = $6tF58$cheerio.load(rawData);
    var rawPlayList = $("ul.musicList").find("li");
    var list = [];
    for(let i = 0; i < rawPlayList.length; i++){
        var item = $(rawPlayList[i]).find("span.title a");
        const artists = $(rawPlayList[i]).find("span.artistName a");
        let musicId = $(item[0]).attr("href").match(/\/play\/(\d+)/) ? $(item[0]).attr("href").match(/\/play\/(\d+)/)[1] : "";
        let title = $(item[0]).text().toString();
        let artist = $(artists[0]).text();
        let album = $("h1.head").text();
        list.push({
            id: musicId,
            title: title,
            artist: artist,
            album: album
        });
    }
    return list;
}
async function $5d6ef737067ff070$export$c55fd7b1d7fa3710(rawData, type) {
    const $ = $6tF58$cheerio.load(rawData);
    var rawPlayList = $("ul#musicList").find("li");
    var list = [];
    for(let i = 0; i < rawPlayList.length; i++){
        var item = $(rawPlayList[i]).find("span.title a");
        const artists = $(rawPlayList[i]).find("span.artistName a");
        const albums = $(rawPlayList[i]).find("span.albumName a");
        let musicId = $(item[0]).attr("href").match(/\/play\/(\d+)/) ? $(item[0]).attr("href").match(/\/play\/(\d+)/)[1] : "";
        let artistId = artists.length == 0 ? "" : $(artists[0]).attr("href").match(/\/artist\/(\d+)/) ? $(artists[0]).attr("href").match(/\/artist\/(\d+)/)[1] : "";
        let albumId = albums.length == 0 ? "" : $(albums[0]).attr("href").match(/\/album\/(\d+)/) ? $(albums[0]).attr("href").match(/\/album\/(\d+)/)[1] : "";
        let title = $(item[0]).text().toString();
        let artist = artists.length == 0 ? $("h2.ib").text() : $(artists[0]).text();
        let album = albums.length == 0 ? $("h1.head").text() : $(albums[0]).text();
        list.push({
            id: type == "artist" ? artistId : type == "album" ? albumId : musicId,
            title: type == "artist" ? artist : type == "album" ? album : title,
            artist: artist,
            platform: "好听轻音乐",
            album: album
        });
    }
    return list;
}
async function $5d6ef737067ff070$export$5f54ed25dd7fe25e(html) {
    const $ = $6tF58$cheerio.load(html);
    const rawPlayList = $("div.topL").find("li");
    let topListArr = [];
    for(let i = 0; i < rawPlayList.length; i++){
        const item = $(rawPlayList[i]).find("a");
        var href = $(item[0]).attr("href");
        if (href == "/top") continue;
        let id = $(item[0]).attr("href").match(/\/top\/(.*)/)[1];
        let title = $(item[0]).text();
        topListArr.push({
            id: id,
            title: title
        });
    }
    return topListArr;
}
function $5d6ef737067ff070$export$d7bdacb66077735f(_) {
    return {
        id: _.id,
        artist: _.artist,
        title: _.title,
        album: _.album,
        duration: _.duration,
        artwork: _.artwork
    };
}
function $5d6ef737067ff070$export$d08aae127141ee12(_) {
    return {
        id: _.id,
        name: _.title,
        avatar: "",
        worksNum: 0
    };
}
function $5d6ef737067ff070$export$ed1fb53032701881(_) {
    return {
        id: _.id,
        title: _.title,
        artist: _.artist
    };
}




async function $560c2fdd6d97039c$var$searchMusic(query, page) {
    let keyword = encodeURIComponent(query);
    let serchUrl = (0, $e419ee3fc9a9aada$export$5e032988b71f6158) + "/home/search?wd=" + keyword;
    let searchRes = (await (0, ($parcel$interopDefault($6tF58$axios))).get(serchUrl, {
        headers: (0, $e419ee3fc9a9aada$export$838e2a576d4d6ff6)
    })).data;
    var isEnd = true;
    let songList = await (0, $5d6ef737067ff070$export$c55fd7b1d7fa3710)(searchRes, "music");
    const songs = songList.map((0, $5d6ef737067ff070$export$d7bdacb66077735f));
    return {
        isEnd: isEnd,
        data: songs
    };
}
async function $560c2fdd6d97039c$var$searchAlbum(query, page) {
    let keyword = encodeURIComponent(query);
    let serchUrl = (0, $e419ee3fc9a9aada$export$5e032988b71f6158) + "/home/search?wd=" + keyword;
    let searchRes = (await (0, ($parcel$interopDefault($6tF58$axios))).get(serchUrl, {
        headers: (0, $e419ee3fc9a9aada$export$838e2a576d4d6ff6)
    })).data;
    var isEnd = true;
    let songList = await (0, $5d6ef737067ff070$export$c55fd7b1d7fa3710)(searchRes, "album");
    return {
        isEnd: isEnd,
        data: $560c2fdd6d97039c$var$filterUniqueById(songList.map((0, $5d6ef737067ff070$export$ed1fb53032701881)))
    };
}
function $560c2fdd6d97039c$var$filterUniqueById(list) {
    // 创建一个 Map 来存储每个唯一的 id 对应的对象
    const uniqueItems = new Map();
    // 遍历列表，将每个对象按其 id 存入 Map 中
    list.forEach((item)=>{
        if (!uniqueItems.has(item.id)) uniqueItems.set(item.id, item);
    });
    // 将 Map 中的对象值转换回数组
    return Array.from(uniqueItems.values());
}
async function $560c2fdd6d97039c$var$searchArtist(query, page) {
    let keyword = encodeURIComponent(query);
    let serchUrl = (0, $e419ee3fc9a9aada$export$5e032988b71f6158) + "/home/search?wd=" + keyword;
    let searchRes = (await (0, ($parcel$interopDefault($6tF58$axios))).get(serchUrl, {
        headers: (0, $e419ee3fc9a9aada$export$838e2a576d4d6ff6)
    })).data;
    var isEnd = true;
    let songList = await (0, $5d6ef737067ff070$export$c55fd7b1d7fa3710)(searchRes, "artist");
    const songs = $560c2fdd6d97039c$var$filterUniqueById(songList.map((0, $5d6ef737067ff070$export$d08aae127141ee12)));
    return {
        isEnd: isEnd,
        data: songs
    };
}
async function $560c2fdd6d97039c$export$2e2bcd8739ae039(query, page, type) {
    if (type === "music") return $560c2fdd6d97039c$var$searchMusic(query, page);
    else if (type === "album") return $560c2fdd6d97039c$var$searchAlbum(query, page);
    else if (type === "artist") return $560c2fdd6d97039c$var$searchArtist(query, page);
}





const $e419ee3fc9a9aada$export$5e032988b71f6158 = "http://www.htqyy.com";
const $e419ee3fc9a9aada$export$838e2a576d4d6ff6 = {
    Cookie: "blk=0; Hm_lvt_74e11efe27096f6ef1745cd53f168168=1726491026; Hm_lpvt_74e11efe27096f6ef1745cd53f168168=1726491026; HMACCOUNT=72B42C3991430F07",
    Referer: "http://www.htqyy.com/"
};
async function $e419ee3fc9a9aada$var$getMediaSource(musicItem, quality) {
    const html = (await (0, ($parcel$interopDefault($6tF58$axios))).get($e419ee3fc9a9aada$export$5e032988b71f6158 + "/play/" + musicItem.id, {
        headers: $e419ee3fc9a9aada$export$838e2a576d4d6ff6
    })).data;
    const url = (0, $5d6ef737067ff070$export$ca2a7395555a320f)(html);
    return {
        // url: "http://s1.htqyy.com/play9/" + musicItem.id + "/mp3/0",
        url: url,
        headers: {
            ...$e419ee3fc9a9aada$export$838e2a576d4d6ff6,
            Accept: "*/*",
            Connection: "keep-alive",
            Host: "s1.htqyy.com",
            Pragma: "no-cache",
            Range: "bytes=0-",
            "Cache-Control": "no-cache",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "Accept-Encoding": "identity;q=1, *;q=0",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0"
        },
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0"
    };
}
async function $e419ee3fc9a9aada$var$getTopLists() {
    const html = (await (0, ($parcel$interopDefault($6tF58$axios))).get($e419ee3fc9a9aada$export$5e032988b71f6158 + "/top", {
        headers: $e419ee3fc9a9aada$export$838e2a576d4d6ff6
    })).data;
    let toplist = await (0, $5d6ef737067ff070$export$5f54ed25dd7fe25e)(html);
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
async function $e419ee3fc9a9aada$var$getTopListDetail(topListItem) {
    var res = {
        ...topListItem
    };
    var page = 0;
    var pageSize = 20;
    var musicList = [];
    while(true){
        let urlSearch = "";
        if (page == 0) urlSearch = $e419ee3fc9a9aada$export$5e032988b71f6158 + "/top/" + topListItem.id;
        else urlSearch = $e419ee3fc9a9aada$export$5e032988b71f6158 + "/top/musicList/" + topListItem.id + "?pageIndex=" + page + "&pageSize=" + pageSize;
        let searchRes = [];
        var songList = [];
        if (topListItem.id == "gedan") {
            searchRes = (await (0, ($parcel$interopDefault($6tF58$axios))).post(urlSearch, {
                pageIndex: page,
                pageSize: pageSize
            }, {
                headers: $e419ee3fc9a9aada$export$838e2a576d4d6ff6
            })).data;
            songList = await (0, $5d6ef737067ff070$export$d48dc9c5c585da4)(searchRes);
        } else {
            searchRes = (await (0, ($parcel$interopDefault($6tF58$axios))).get(urlSearch, {
                headers: $e419ee3fc9a9aada$export$838e2a576d4d6ff6
            })).data;
            songList = await (0, $5d6ef737067ff070$export$c55fd7b1d7fa3710)(searchRes, "music");
        }
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
        if (songList.length < pageSize) break;
    }
    return res;
}
async function $e419ee3fc9a9aada$var$getAlbumInfo(albumItem, page) {
    var result = {
        albumItem: {
            ...albumItem
        }
    };
    let urlSerch = $e419ee3fc9a9aada$export$5e032988b71f6158 + "/album/" + albumItem.id;
    let searchRes = (await (0, ($parcel$interopDefault($6tF58$axios))).get(urlSerch, {
        headers: $e419ee3fc9a9aada$export$838e2a576d4d6ff6
    })).data;
    var songList = await (0, $5d6ef737067ff070$export$e73e0faebaff9d71)(searchRes);
    const $ = $6tF58$cheerio.load(searchRes);
    var description = $("span.descWrap").text();
    var artwork = $("img#cover").attr("src");
    result.musicList = songList;
    result.albumItem.description = description;
    result.albumItem.artwork = artwork;
    return result;
}
async function $e419ee3fc9a9aada$var$getRecommendSheetTags() {
    try {
        var result = {};
        var datas = [];
        var pinned = [];
        const html = (await (0, ($parcel$interopDefault($6tF58$axios))).get($e419ee3fc9a9aada$export$5e032988b71f6158 + "/genre/", {
            headers: $e419ee3fc9a9aada$export$838e2a576d4d6ff6
        })).data;
        const $ = $6tF58$cheerio.load(html);
        const tagList = $("ul.tagList").find("li");
        var group = {};
        group.title = "分类";
        var secondTag = [];
        for(let j = 0; j < tagList.length; j++){
            const secondTagList = $(tagList[j]).find("a");
            var item = {
                id: $(secondTagList).attr("href"),
                title: $(secondTagList).text()
            };
            secondTag.push(item);
            pinned.push(item);
        }
        group.data = secondTag;
        datas.push(group);
        const html2 = (await (0, ($parcel$interopDefault($6tF58$axios))).get($e419ee3fc9a9aada$export$5e032988b71f6158 + "/album/", {
            headers: $e419ee3fc9a9aada$export$838e2a576d4d6ff6
        })).data;
        const $2 = $6tF58$cheerio.load(html2);
        const tagList2 = $2(".cateNav ul.cf").find("li");
        var group2 = {};
        group2.title = "专辑";
        var secondTag2 = [];
        for(let j = 0; j < tagList2.length; j++){
            const secondTagList2 = $(tagList2[j]).find("a");
            var item2 = {
                id: $(secondTagList2).attr("href"),
                title: $(secondTagList2).text()
            };
            secondTag2.push(item2);
            pinned.push(item2);
        }
        group2.data = secondTag2;
        datas.push(group2);
        result.data = datas;
        result.pinned = pinned;
        return result;
    } catch (e) {
        console.log(e);
    }
    return {};
}
async function $e419ee3fc9a9aada$var$getRecommendSheetsByTag(tag, page) {
    try {
        var result = {};
        var sheets = [];
        var id = tag.id !== "" ? tag.id : "/album";
        if (id.toString().startsWith("/album")) {
            var searchUrl = $e419ee3fc9a9aada$export$5e032988b71f6158 + id;
            const html = (await (0, ($parcel$interopDefault($6tF58$axios))).get(searchUrl, {
                headers: $e419ee3fc9a9aada$export$838e2a576d4d6ff6
            })).data;
            const $ = $6tF58$cheerio.load(html);
            const sheetList = $("ul#albumList").find("li");
            for(let i = 0; i < sheetList.length; i++)sheets.push({
                id: $(sheetList[i]).find("a").attr("href"),
                title: $(sheetList[i]).find("h4 a").text().trim(),
                artwork: $(sheetList[i]).find("a img").attr("src")
            });
        } else if (id.toString().startsWith("/genre")) {
            var myPage = 0;
            while(true){
                var searchUrl = "";
                if (myPage == 0) searchUrl = $e419ee3fc9a9aada$export$5e032988b71f6158 + id;
                else {
                    var idStr = id.toString().replace("/genre", "/genre/musicList");
                    searchUrl = $e419ee3fc9a9aada$export$5e032988b71f6158 + idStr + "?pageIndex=" + myPage + "&pageSize=20&order=hot";
                }
                const html = (await (0, ($parcel$interopDefault($6tF58$axios))).get(searchUrl, {
                    headers: $e419ee3fc9a9aada$export$838e2a576d4d6ff6
                })).data;
                const $ = $6tF58$cheerio.load(html);
                let songList = await (0, $5d6ef737067ff070$export$c55fd7b1d7fa3710)(html, "music");
                sheets.push({
                    id: id + "/" + myPage,
                    title: "第" + (myPage + 1) + "页",
                    musicList: songList
                });
                if (songList.length == 20) myPage++;
                else break;
            }
        }
        result.data = sheets;
        return result;
    } catch (e) {
        console.log(e);
    }
    return {};
}
async function $e419ee3fc9a9aada$var$getMusicSheetInfo(sheet, page) {
    var result = {};
    if (sheet.id.toString().startsWith("/genre")) {
        result.musicList = sheet.musicList;
        return result;
    } else if (sheet.id.toString().startsWith("/album")) {
        let urlSerch = $e419ee3fc9a9aada$export$5e032988b71f6158 + sheet.id;
        let searchRes = (await (0, ($parcel$interopDefault($6tF58$axios))).get(urlSerch, {
            headers: $e419ee3fc9a9aada$export$838e2a576d4d6ff6
        })).data;
        var songList = await (0, $5d6ef737067ff070$export$e73e0faebaff9d71)(searchRes);
        result.musicList = songList;
    }
    return result;
}
async function $e419ee3fc9a9aada$export$4adb7587a1eda30e(artistItem, page, type) {
    if (type === "music") {
        var searchUrl = "";
        if (page === 1) searchUrl = $e419ee3fc9a9aada$export$5e032988b71f6158 + "/artist/" + artistItem.id;
        else searchUrl = $e419ee3fc9a9aada$export$5e032988b71f6158 + "/api/musicList/" + artistItem.id;
        const searchRes = (await (0, ($parcel$interopDefault($6tF58$axios))).get(searchUrl, {
            headers: $e419ee3fc9a9aada$export$838e2a576d4d6ff6
        })).data;
        var songList = await (0, $5d6ef737067ff070$export$c55fd7b1d7fa3710)(searchRes, "music");
        const $ = $6tF58$cheerio.load(searchRes);
        var description = $("span.introWrap").text();
        return {
            isEnd: songList.length < 20,
            artistItem: {
                description: description
            },
            data: songList.map((0, $5d6ef737067ff070$export$d7bdacb66077735f))
        };
    } else return {
        isEnd: true,
        data: []
    };
}
const $e419ee3fc9a9aada$var$pluginInstance = {
    platform: "好听轻音乐",
    version: "0.1.2",
    author: "SoEasy同学",
    srcUrl: "https://gitee.com/kevinr/tvbox/raw/master/musicfree/plugins/htqyy.js",
    cacheControl: "no-cache",
    supportedSearchType: [
        "music",
        "album",
        "artist"
    ],
    search: $560c2fdd6d97039c$export$2e2bcd8739ae039,
    getMediaSource: $e419ee3fc9a9aada$var$getMediaSource,
    getTopListDetail: $e419ee3fc9a9aada$var$getTopListDetail,
    getAlbumInfo: $e419ee3fc9a9aada$var$getAlbumInfo,
    getArtistWorks: $e419ee3fc9a9aada$export$4adb7587a1eda30e,
    getTopLists: $e419ee3fc9a9aada$var$getTopLists,
    getRecommendSheetTags: $e419ee3fc9a9aada$var$getRecommendSheetTags,
    getRecommendSheetsByTag: $e419ee3fc9a9aada$var$getRecommendSheetsByTag,
    getMusicSheetInfo: $e419ee3fc9a9aada$var$getMusicSheetInfo
};
var /*search("班得瑞", 1, "music").then((res) => {
    console.log(res)
    getMediaSource(res.data[0], "standard").then((res) => {
        console.log(res)
    })
})*/ /*search("班得瑞", 1, "album").then((res) => {
    console.log(res)
    getAlbumInfo(res.data[0], 1).then((res) => {
        console.log(res)
        getMediaSource(res.musicList[0], "standard").then((res) => {
            console.log(res)
        })
    })
})*/ /*search("班得瑞", 1, "artist").then((res) => {
    console.log(res)
    getArtistWorks(res.data[0],1, "music").then((res) => {
        console.log(res)
        getMediaSource(res.data[0], "standard").then((res) => {
            console.log(res)
        })
    })
})*/ /*getTopLists().then((res) => {
    console.log(res)
    getTopListDetail(res[0].data[4]).then((res) => {
        console.log(res)
        getMediaSource(res.musicList[0], "standard").then((res) => {
            console.log(res)
        })
    })
})*/ /*getRecommendSheetTags().then((res) => {
    console.log(res)
    getRecommendSheetsByTag(res.pinned[16], 1).then((res) => {
        console.log(res)
        getMusicSheetInfo(res.data[0], 1).then((res) => {
            console.log(res);
            getMediaSource(res.musicList[0], "standard").then((res) => {
                console.log(res)
            })
        })
    })
})*/ $e419ee3fc9a9aada$export$2e2bcd8739ae039 = $e419ee3fc9a9aada$var$pluginInstance;


//# sourceMappingURL=htqyy.js.map
