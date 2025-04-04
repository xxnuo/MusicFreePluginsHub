var $k0FQJ$axios = require("axios");

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

$parcel$export(module.exports, "host", () => $05ed36bfbcd28011$export$5e032988b71f6158);
$parcel$export(module.exports, "default", () => $05ed36bfbcd28011$export$2e2bcd8739ae039);
/** 搜索方法 */ function $9e72644df5f6dae6$export$d7bdacb66077735f(_) {
    return {
        id: _.id,
        artist: _.author,
        title: _.name,
        album: _.album,
        duration: $9e72644df5f6dae6$export$76cd2546cd31fda2(_.time),
        artwork: _.pic
    };
}
function $9e72644df5f6dae6$export$76cd2546cd31fda2(timeStr) {
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




async function $6e3de376391b472d$var$searchMusic(query, page) {
    let keyword = query;
    let serchUrl = (0, $05ed36bfbcd28011$export$5e032988b71f6158) + "/index/index/search";
    let searchRes = (await (0, ($parcel$interopDefault($k0FQJ$axios))).post(serchUrl, {
        keywords: keyword
    })).data;
    const songs = searchRes.data.map((0, $9e72644df5f6dae6$export$d7bdacb66077735f));
    return {
        isEnd: true,
        data: songs
    };
}
async function $6e3de376391b472d$export$2e2bcd8739ae039(query, page, type) {
    if (type === "music") return $6e3de376391b472d$var$searchMusic(query, page);
}




const $05ed36bfbcd28011$export$5e032988b71f6158 = "https://ghyinyue.com";
async function $05ed36bfbcd28011$var$getMediaSource(musicItem, quality) {
    //https://ghyinyue.com/index/index/getUrlTest
    let mp3_Result = (await (0, ($parcel$interopDefault($k0FQJ$axios)))({
        method: "post",
        url: $05ed36bfbcd28011$export$5e032988b71f6158 + `/index/index/getUrlTest`,
        data: {
            secret: musicItem.id
        }
    })).data;
    if (mp3_Result.data) return {
        url: mp3_Result.data,
        quality: quality
    };
    return {
        url: ""
    };
}
async function $05ed36bfbcd28011$var$getTopLists() {
    return [
        {
            title: "官方榜单",
            data: [
                {
                    id: "/index/index/getRecommended",
                    title: "每日推荐",
                    description: "每日推荐30首音乐"
                }
            ]
        }
    ];
}
async function $05ed36bfbcd28011$var$getTopListDetail(topListItem) {
    var res = {
        ...topListItem
    };
    let serchUrl = $05ed36bfbcd28011$export$5e032988b71f6158 + topListItem.id;
    let searchRes = (await (0, ($parcel$interopDefault($k0FQJ$axios))).post(serchUrl)).data;
    res.musicList = searchRes.data.map((0, $9e72644df5f6dae6$export$d7bdacb66077735f));
    if (res.musicList.length > 0) res.artwork = res.musicList[0].artwork;
    return res;
}
const $05ed36bfbcd28011$var$pluginInstance = {
    platform: "果核音乐",
    version: "0.0.1",
    author: "SoEasy同学",
    srcUrl: "https://gitee.com/kevinr/tvbox/raw/master/musicfree/plugins/ghyinyue.js",
    cacheControl: "no-cache",
    supportedSearchType: [
        "music"
    ],
    search: $6e3de376391b472d$export$2e2bcd8739ae039,
    getMediaSource: $05ed36bfbcd28011$var$getMediaSource,
    getTopLists: $05ed36bfbcd28011$var$getTopLists,
    getTopListDetail: $05ed36bfbcd28011$var$getTopListDetail
};
var /*search("童话镇", 1, "music").then((res) => {
    console.log(res)
    getMediaSource(res.data[0], "standard").then((res) => {
        console.log(res)
    })
})*/ /*getTopLists().then((res) => {
    console.log(res)
    getTopListDetail(res[0].data[0]).then((res) => {
        console.log(res)
        getMediaSource(res.musicList[0], "standard").then((res) => {
            console.log(res)
        })
    })
})*/ $05ed36bfbcd28011$export$2e2bcd8739ae039 = $05ed36bfbcd28011$var$pluginInstance;


//# sourceMappingURL=ghyinyue.js.map
