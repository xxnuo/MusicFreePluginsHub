var $1Qt5Z$axios = require("axios");
var $1Qt5Z$cheerio = require("cheerio");

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

$parcel$export(module.exports, "host", () => $71db8672df30ab6c$export$5e032988b71f6158);
$parcel$export(module.exports, "headers", () => $71db8672df30ab6c$export$838e2a576d4d6ff6);
$parcel$export(module.exports, "formatAlbumFromHtml", () => $71db8672df30ab6c$export$ca076635ed710b0d);
$parcel$export(module.exports, "search", () => $71db8672df30ab6c$export$d76128d007d19019);
$parcel$export(module.exports, "default", () => $71db8672df30ab6c$export$2e2bcd8739ae039);


const $71db8672df30ab6c$export$5e032988b71f6158 = "https://www.shuyinfm.com";
const $71db8672df30ab6c$export$838e2a576d4d6ff6 = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.69"
};
async function $71db8672df30ab6c$var$getRecommendSheetTags() {
    try {
        var result = {};
        var datas = [];
        var pinned = [];
        datas.push({
            data: [
                {
                    id: "1",
                    title: "言情"
                },
                {
                    id: "2",
                    title: "玄幻"
                },
                {
                    id: "5",
                    title: "恐怖"
                },
                {
                    id: "7",
                    title: "穿越"
                },
                {
                    id: "8",
                    title: "都市"
                },
                {
                    id: "16",
                    title: "历史"
                },
                {
                    id: "33",
                    title: "悬疑"
                },
                {
                    id: "36",
                    title: "穿越"
                },
                {
                    id: "38",
                    title: "文学"
                },
                {
                    id: "39",
                    title: "推理"
                },
                {
                    id: "40",
                    title: "军事"
                },
                {
                    id: "41",
                    title: "职场言情"
                },
                {
                    id: "56",
                    title: "反腐"
                },
                {
                    id: "58",
                    title: "人物"
                },
                {
                    id: "60",
                    title: "修真"
                },
                {
                    id: "63",
                    title: "网游"
                },
                {
                    id: "92",
                    title: "武侠"
                }
            ],
            title: "有声小说"
        });
        pinned = [].concat(datas[0].data);
        datas.push({
            data: [
                {
                    id: "10",
                    title: "耽美剧"
                },
                {
                    id: "12",
                    title: "爱情剧"
                },
                {
                    id: "51",
                    title: "古风剧"
                },
                {
                    id: "54",
                    title: "现代剧"
                }
            ],
            title: "广播剧"
        });
        datas.push({
            data: [
                {
                    id: "42",
                    title: "单田芳"
                },
                {
                    id: "43",
                    title: "刘兰芳"
                },
                {
                    id: "44",
                    title: "田连元"
                },
                {
                    id: "45",
                    title: "袁阔成"
                },
                {
                    id: "46",
                    title: "连丽如"
                },
                {
                    id: "47",
                    title: "张少佐"
                },
                {
                    id: "48",
                    title: "田战义"
                },
                {
                    id: "49",
                    title: "孙一"
                },
                {
                    id: "50",
                    title: "其他"
                },
                {
                    id: "53",
                    title: "袁田"
                },
                {
                    id: "55",
                    title: "王玥波"
                },
                {
                    id: "57",
                    title: "郭德纲"
                },
                {
                    id: "62",
                    title: "关勇超"
                },
                {
                    id: "65",
                    title: "王传林"
                }
            ],
            title: "评书"
        });
        datas.push({
            data: [
                {
                    id: "67",
                    title: "资讯"
                },
                {
                    id: "68",
                    title: "短剧"
                },
                {
                    id: "69",
                    title: "娱乐"
                },
                {
                    id: "70",
                    title: "音乐"
                },
                {
                    id: "71",
                    title: "情感"
                },
                {
                    id: "72",
                    title: "搞笑"
                },
                {
                    id: "73",
                    title: "相声小品"
                },
                {
                    id: "74",
                    title: "汽车"
                },
                {
                    id: "75",
                    title: "公开课"
                },
                {
                    id: "76",
                    title: "生活"
                },
                {
                    id: "77",
                    title: "旅游"
                }
            ],
            title: "车载"
        });
        datas.push({
            data: [
                {
                    id: "31",
                    title: "百家讲坛"
                },
                {
                    id: "35",
                    title: "娱乐"
                },
                {
                    id: "59",
                    title: "粤语"
                },
                {
                    id: "98",
                    title: "音乐"
                },
                {
                    id: "99",
                    title: "古风"
                }
            ],
            title: "其它"
        });
        /*const html = (await axios.get(host, {headers: headers})).data
        const $ = cheerio.load(html);
        var tagList = $("ul.layui-nav").find("li");
        for (let i = 0; i < tagList.length; i++) {
            const name = $(tagList[i]).find("a").text();
            const href = $(tagList[i]).find("a").attr("href");
            if (href == "/") continue
            var temp = {} as IMusic.IMusicSheetGroupItem;
            temp.title = name;
            temp.data = [];
            if (href.match(/\/\w+\//)) {
                const group = (await axios.get(host + href, {headers: headers})).data
                const group$ = cheerio.load(group);
                var secondTagList = group$("dd.clearfix").find("a")
                for (let j = 0; j < secondTagList.length; i++) {
                    var itemSecond = {
                        id: $(secondTagList[j]).attr("href"),
                        title: $(secondTagList[j]).text(),
                    } as IMusic.IMusicSheetItem
                    temp.data.push(itemSecond)
                    if (name === "有声小说") {
                        pinned.push(itemSecond)
                    }
                }
            } else {
                temp.data = [{
                    id: href,
                    title: name
                } as IMusic.IMusicSheetItem]
            }
            datas.push(temp);
        }*/ result.data = datas;
        result.pinned = pinned;
        return result;
    } catch (e) {}
    return {};
}
async function $71db8672df30ab6c$var$getRecommendSheetsByTag(tag, page) {
    try {
        var result = {};
        var sheets = [];
        var id = tag.id;
        if (id == "") id = "1";
        var searchUrl = $71db8672df30ab6c$export$5e032988b71f6158 + "/listinfo-" + id + "-" + (page - 1) + ".html";
        const html = (await (0, ($parcel$interopDefault($1Qt5Z$axios))).get(searchUrl, {
            headers: $71db8672df30ab6c$export$838e2a576d4d6ff6,
            timeout: 5000
        })).data;
        sheets = $71db8672df30ab6c$export$ca076635ed710b0d(html);
        result.data = sheets;
        result.isEnd = sheets.length > 0 && sheets.length < 24;
        return result;
    } catch (e) {}
    return {};
}
async function $71db8672df30ab6c$var$getMusicSheetInfo(albumItem, page) {
    var result = {
        sheetItem: {},
        musicList: []
    };
    let ret = await $71db8672df30ab6c$var$getAlbumInfo(albumItem, page);
    result.sheetItem = ret.albumItem;
    result.musicList = ret.musicList;
    return result;
}
async function $71db8672df30ab6c$var$getAlbumInfo(albumItem, page) {
    var result = {
        albumItem: {
            ...albumItem
        },
        musicList: []
    };
    var searchUrl = $71db8672df30ab6c$export$5e032988b71f6158 + albumItem.id;
    let searchRes = (await (0, ($parcel$interopDefault($1Qt5Z$axios))).get(searchUrl, {
        headers: $71db8672df30ab6c$export$838e2a576d4d6ff6
    })).data;
    const $ = $1Qt5Z$cheerio.load(searchRes);
    result.albumItem.description = $("#book_intro").find("dd").text();
    const artist = $("p.sub-tags").find("a").text();
    const fansList = $("#fansinfo").find("li");
    for(let i = 0; i < fansList.length; i++){
        const title = $(fansList[i]).find("a").text();
        const href = $(fansList[i]).find("a").attr("href");
        result.musicList.push({
            id: href,
            title: title,
            artist: artist
        });
    }
    return result;
}
async function $71db8672df30ab6c$var$getMediaSource(musicItem, quality) {
    const searchUrl = $71db8672df30ab6c$export$5e032988b71f6158 + musicItem.id;
    const html = (await (0, ($parcel$interopDefault($1Qt5Z$axios))).get(searchUrl, {
        headers: $71db8672df30ab6c$export$838e2a576d4d6ff6
    })).data;
    const $ = $1Qt5Z$cheerio.load(html);
    const code = $("#jp-lines").find("li").eq(0).attr("data-code");
    const path = html.match(/url : '(.*?)'/)[1];
    const tempUrl = $71db8672df30ab6c$export$5e032988b71f6158 + path + code;
    const res = (await (0, ($parcel$interopDefault($1Qt5Z$axios))).get(tempUrl, {
        headers: $71db8672df30ab6c$export$838e2a576d4d6ff6
    })).data;
    try {
        const res2 = await (0, ($parcel$interopDefault($1Qt5Z$axios))).get(res.url, {
            headers: $71db8672df30ab6c$export$838e2a576d4d6ff6
        });
        return {
            url: res2.request.responseURL
        };
    } catch (e) {
        return {
            url: e.request.responseURL
        };
    }
    return {
        url: ""
    };
}
async function $71db8672df30ab6c$export$d76128d007d19019(query, page, type) {
    if (type === "album") return $71db8672df30ab6c$var$searchAlbum(query, page);
    else if (type === "sheet") return $71db8672df30ab6c$var$searchAlbum(query, page);
}
async function $71db8672df30ab6c$var$searchAlbum(query, page) {
    try {
        let keyword = encodeURIComponent(query);
        var searchUrl = $71db8672df30ab6c$export$5e032988b71f6158 + "/e/search/index.php";
        const html = (await (0, ($parcel$interopDefault($1Qt5Z$axios))).post(searchUrl, "keyboard=" + keyword + "&show=" + encodeURIComponent("title,newstext,player,playadmin,movietime,filetype"), {
            headers: $71db8672df30ab6c$export$838e2a576d4d6ff6
        })).data;
        const sheets = $71db8672df30ab6c$export$ca076635ed710b0d(html);
        return {
            isEnd: true,
            data: sheets
        };
    } catch (e) {}
    return {
        isEnd: true,
        data: []
    };
}
function $71db8672df30ab6c$export$ca076635ed710b0d(html) {
    var sheets = [];
    const $ = $1Qt5Z$cheerio.load(html);
    const albumList = $("ul.qm-pic-txt").find("li");
    for(let i = 0; i < albumList.length; i++){
        const id = $(albumList[i]).find(".txt a").attr("href");
        const title = $(albumList[i]).find(".txt a").text();
        const artwork = $(albumList[i]).find(".pic a img").attr("src");
        sheets.push({
            id: id,
            title: title,
            artwork: artwork
        });
    }
    return sheets;
}
const $71db8672df30ab6c$var$pluginInstance = {
    platform: "书音FM",
    version: "0.3.6",
    author: "SoEasy同学",
    srcUrl: "https://musicfreepluginshub.2020818.xyz/a2c44d99dd3ff1de07f76259d6ef1858.js",
    cacheControl: "no-cache",
    supportedSearchType: [
        "album",
        "sheet"
    ],
    search: $71db8672df30ab6c$export$d76128d007d19019,
    getAlbumInfo: $71db8672df30ab6c$var$getAlbumInfo,
    getMusicSheetInfo: $71db8672df30ab6c$var$getMusicSheetInfo,
    getMediaSource: $71db8672df30ab6c$var$getMediaSource,
    getRecommendSheetTags: $71db8672df30ab6c$var$getRecommendSheetTags,
    getRecommendSheetsByTag: $71db8672df30ab6c$var$getRecommendSheetsByTag
};
var /*getRecommendSheetTags().then((res) => {
    console.log(res)
    getRecommendSheetsByTag(res.pinned[0], 1).then((res) => {
        console.log(res)
        getAlbumInfo(res.data[1], 1).then((res) => {
            console.log(res);
            getMediaSource(res.musicList[0], "standard").then((res) => {
                console.log(res)
            })
        })
    })
})*/ /*search("与虎谋婚", 1, "album").then((res) => {
    console.log(res)
    getMusicSheetInfo(res.data[0], 1).then((res) => {
        console.log(res);
        getMediaSource(res.musicList[0], "standard").then((res) => {
            console.log(res)
        })
    })
})*/ $71db8672df30ab6c$export$2e2bcd8739ae039 = $71db8672df30ab6c$var$pluginInstance;


//# sourceMappingURL=shuyinfm.js.map
