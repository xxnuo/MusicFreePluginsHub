var $M8GQN$axios = require("axios");
var $M8GQN$he = require("he");

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

$parcel$export(module.exports, "default", () => $4e63e094b4590b2b$export$2e2bcd8739ae039);


const $4e63e094b4590b2b$var$pageSize = 30;
function $4e63e094b4590b2b$var$artworkShort2Long(albumpicShort) {
    var _a;
    const firstSlashOfAlbum = (_a = albumpicShort === null || albumpicShort === void 0 ? void 0 : albumpicShort.indexOf("/")) !== null && _a !== void 0 ? _a : -1;
    return firstSlashOfAlbum !== -1 ? `https://img4.kuwo.cn/star/albumcover/1080${albumpicShort.slice(firstSlashOfAlbum)}` : undefined;
}
function $4e63e094b4590b2b$var$formatMusicItem(_) {
    return {
        id: _.MUSICRID.replace("MUSIC_", ""),
        artwork: $4e63e094b4590b2b$var$artworkShort2Long(_.web_albumpic_short),
        title: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.NAME || ""),
        artist: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.ARTIST || ""),
        album: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.ALBUM || ""),
        albumId: _.ALBUMID,
        artistId: _.ARTISTID,
        formats: _.FORMATS
    };
}
function $4e63e094b4590b2b$var$formatAlbumItem(_) {
    var _a;
    return {
        id: _.albumid,
        artist: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.artist || ""),
        title: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.name || ""),
        artwork: (_a = _.img) !== null && _a !== void 0 ? _a : $4e63e094b4590b2b$var$artworkShort2Long(_.pic),
        description: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.info || ""),
        date: _.pub,
        artistId: _.artistid
    };
}
function $4e63e094b4590b2b$var$formatArtistItem(_) {
    return {
        id: _.ARTISTID,
        avatar: _.hts_PICPATH,
        name: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.ARTIST || ""),
        artistId: _.ARTISTID,
        description: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.desc || ""),
        worksNum: _.SONGNUM
    };
}
function $4e63e094b4590b2b$var$formatMusicSheet(_) {
    return {
        id: _.playlistid,
        title: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.name || ""),
        artist: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.nickname || ""),
        artwork: _.pic,
        playCount: _.playcnt,
        description: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.intro || ""),
        worksNum: _.songnum
    };
}
async function $4e63e094b4590b2b$var$searchMusic(query, page) {
    const res = (await (0, ($parcel$interopDefault($M8GQN$axios)))({
        method: "get",
        url: `http://search.kuwo.cn/r.s`,
        params: {
            client: "kt",
            all: query,
            pn: page - 1,
            rn: $4e63e094b4590b2b$var$pageSize,
            uid: 2574109560,
            ver: "kwplayer_ar_8.5.4.2",
            vipver: 1,
            ft: "music",
            cluster: 0,
            strategy: 2012,
            encoding: "utf8",
            rformat: "json",
            vermerge: 1,
            mobi: 1
        }
    })).data;
    const songs = res.abslist.map($4e63e094b4590b2b$var$formatMusicItem);
    return {
        isEnd: (+res.PN + 1) * +res.RN >= +res.TOTAL,
        data: songs
    };
}
async function $4e63e094b4590b2b$var$searchAlbum(query, page) {
    const res = (await (0, ($parcel$interopDefault($M8GQN$axios)))({
        method: "get",
        url: `http://search.kuwo.cn/r.s`,
        params: {
            all: query,
            ft: "album",
            itemset: "web_2013",
            client: "kt",
            pn: page - 1,
            rn: $4e63e094b4590b2b$var$pageSize,
            rformat: "json",
            encoding: "utf8",
            pcjson: 1
        }
    })).data;
    const albums = res.albumlist.map($4e63e094b4590b2b$var$formatAlbumItem);
    return {
        isEnd: (+res.PN + 1) * +res.RN >= +res.TOTAL,
        data: albums
    };
}
async function $4e63e094b4590b2b$var$searchArtist(query, page) {
    const res = (await (0, ($parcel$interopDefault($M8GQN$axios)))({
        method: "get",
        url: `http://search.kuwo.cn/r.s`,
        params: {
            all: query,
            ft: "artist",
            itemset: "web_2013",
            client: "kt",
            pn: page - 1,
            rn: $4e63e094b4590b2b$var$pageSize,
            rformat: "json",
            encoding: "utf8",
            pcjson: 1
        }
    })).data;
    const artists = res.abslist.map($4e63e094b4590b2b$var$formatArtistItem);
    return {
        isEnd: (+res.PN + 1) * +res.RN >= +res.TOTAL,
        data: artists
    };
}
async function $4e63e094b4590b2b$var$searchMusicSheet(query, page) {
    const res = (await (0, ($parcel$interopDefault($M8GQN$axios)))({
        method: "get",
        url: `http://search.kuwo.cn/r.s`,
        params: {
            all: query,
            ft: "playlist",
            itemset: "web_2013",
            client: "kt",
            pn: page - 1,
            rn: $4e63e094b4590b2b$var$pageSize,
            rformat: "json",
            encoding: "utf8",
            pcjson: 1
        }
    })).data;
    const musicSheets = res.abslist.map($4e63e094b4590b2b$var$formatMusicSheet);
    return {
        isEnd: (+res.PN + 1) * +res.RN >= +res.TOTAL,
        data: musicSheets
    };
}
async function $4e63e094b4590b2b$var$getArtistMusicWorks(artistItem, page) {
    const res = (await (0, ($parcel$interopDefault($M8GQN$axios)))({
        method: "get",
        url: `http://search.kuwo.cn/r.s`,
        params: {
            pn: page - 1,
            rn: $4e63e094b4590b2b$var$pageSize,
            artistid: artistItem.id,
            stype: "artist2music",
            sortby: 0,
            alflac: 1,
            show_copyright_off: 1,
            pcmp4: 1,
            encoding: "utf8",
            plat: "pc",
            thost: "search.kuwo.cn",
            vipver: "MUSIC_9.1.1.2_BCS2",
            devid: "38668888",
            newver: 1,
            pcjson: 1
        }
    })).data;
    const songs = res.musiclist.map((_)=>{
        return {
            id: _.musicrid,
            artwork: $4e63e094b4590b2b$var$artworkShort2Long(_.web_albumpic_short),
            title: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.name || ""),
            artist: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.artist || ""),
            album: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.album || ""),
            albumId: _.albumid,
            artistId: _.artistid,
            formats: _.formats
        };
    });
    return {
        isEnd: (+res.pn + 1) * $4e63e094b4590b2b$var$pageSize >= +res.total,
        data: songs
    };
}
async function $4e63e094b4590b2b$var$getArtistAlbumWorks(artistItem, page) {
    const res = (await (0, ($parcel$interopDefault($M8GQN$axios)))({
        method: "get",
        url: `http://search.kuwo.cn/r.s`,
        params: {
            pn: page - 1,
            rn: $4e63e094b4590b2b$var$pageSize,
            artistid: artistItem.id,
            stype: "albumlist",
            sortby: 1,
            alflac: 1,
            show_copyright_off: 1,
            pcmp4: 1,
            encoding: "utf8",
            plat: "pc",
            thost: "search.kuwo.cn",
            vipver: "MUSIC_9.1.1.2_BCS2",
            devid: "38668888",
            newver: 1,
            pcjson: 1
        }
    })).data;
    const albums = res.albumlist.map($4e63e094b4590b2b$var$formatAlbumItem);
    return {
        isEnd: (+res.pn + 1) * $4e63e094b4590b2b$var$pageSize >= +res.total,
        data: albums
    };
}
async function $4e63e094b4590b2b$var$getArtistWorks(artistItem, page, type) {
    if (type === "music") return $4e63e094b4590b2b$var$getArtistMusicWorks(artistItem, page);
    else if (type === "album") return $4e63e094b4590b2b$var$getArtistAlbumWorks(artistItem, page);
}
async function $4e63e094b4590b2b$var$getLyric(musicItem) {
    const res = (await (0, ($parcel$interopDefault($M8GQN$axios))).get("http://m.kuwo.cn/newh5/singles/songinfoandlrc", {
        params: {
            musicId: musicItem.id,
            httpStatus: 1
        }
    })).data;
    const list = res.data.lrclist;
    return {
        rawLrc: list.map((_)=>`[${_.time}]${_.lineLyric}`).join("\n")
    };
}
async function $4e63e094b4590b2b$var$getAlbumInfo(albumItem) {
    const res = (await (0, ($parcel$interopDefault($M8GQN$axios)))({
        method: "get",
        url: `http://search.kuwo.cn/r.s`,
        params: {
            pn: 0,
            rn: 100,
            albumid: albumItem.id,
            stype: "albuminfo",
            sortby: 0,
            alflac: 1,
            show_copyright_off: 1,
            pcmp4: 1,
            encoding: "utf8",
            plat: "pc",
            thost: "search.kuwo.cn",
            vipver: "MUSIC_9.1.1.2_BCS2",
            devid: "38668888",
            newver: 1,
            pcjson: 1
        }
    })).data;
    const songs = res.musiclist.map((_)=>{
        var _a;
        return {
            id: _.id,
            artwork: (_a = albumItem.artwork) !== null && _a !== void 0 ? _a : res.img,
            title: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.name || ""),
            artist: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.artist || ""),
            album: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.album || ""),
            albumId: albumItem.id,
            artistId: _.artistid,
            formats: _.formats
        };
    });
    return {
        musicList: songs
    };
}
async function $4e63e094b4590b2b$var$getTopLists() {
    const result = (await (0, ($parcel$interopDefault($M8GQN$axios))).get("http://wapi.kuwo.cn/api/pc/bang/list")).data.child;
    return result.map((e)=>({
            title: e.disname,
            data: e.child.map((_)=>{
                var _a, _b;
                return {
                    id: _.sourceid,
                    coverImg: (_b = (_a = _.pic5) !== null && _a !== void 0 ? _a : _.pic2) !== null && _b !== void 0 ? _b : _.pic,
                    title: _.name,
                    description: _.intro
                };
            })
        }));
}
async function $4e63e094b4590b2b$var$getTopListDetail(topListItem) {
    const res = await (0, ($parcel$interopDefault($M8GQN$axios))).get(`http://kbangserver.kuwo.cn/ksong.s`, {
        params: {
            from: "pc",
            fmt: "json",
            pn: 0,
            rn: 80,
            type: "bang",
            data: "content",
            id: topListItem.id,
            show_copyright_off: 0,
            pcmp4: 1,
            isbang: 1,
            userid: 0,
            httpStatus: 1
        }
    });
    return Object.assign(Object.assign({}, topListItem), {
        musicList: res.data.musiclist.map((_)=>{
            return {
                id: _.id,
                title: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.name || ""),
                artist: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.artist || ""),
                album: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.album || ""),
                albumId: _.albumid,
                artistId: _.artistid,
                formats: _.formats
            };
        })
    });
}
async function $4e63e094b4590b2b$var$getMusicSheetResponseById(id, page, pagesize = 50) {
    return (await (0, ($parcel$interopDefault($M8GQN$axios))).get(`http://nplserver.kuwo.cn/pl.svc`, {
        params: {
            op: "getlistinfo",
            pid: id,
            pn: page - 1,
            rn: pagesize,
            encode: "utf8",
            keyset: "pl2012",
            vipver: "MUSIC_9.1.1.2_BCS2",
            newver: 1
        }
    })).data;
}
async function $4e63e094b4590b2b$var$importMusicSheet(urlLike) {
    var _a, _b;
    let id;
    if (!id) id = (_a = urlLike.match(/https?:\/\/www\/kuwo\.cn\/playlist_detail\/(\d+)/)) === null || _a === void 0 ? void 0 : _a[1];
    if (!id) id = (_b = urlLike.match(/https?:\/\/m\.kuwo\.cn\/h5app\/playlist\/(\d+)/)) === null || _b === void 0 ? void 0 : _b[1];
    if (!id) id = urlLike.match(/^\s*(\d+)\s*$/);
    if (!id) return;
    let page = 1;
    let totalPage = 30;
    let musicList = [];
    while(page < totalPage){
        try {
            const data = await $4e63e094b4590b2b$var$getMusicSheetResponseById(id, page, 80);
            totalPage = Math.ceil(data.total / 80);
            if (isNaN(totalPage)) totalPage = 1;
            musicList = musicList.concat(data.musicList.map((_)=>({
                    id: _.id,
                    title: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.name || ""),
                    artist: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.artist || ""),
                    album: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.album || ""),
                    albumId: _.albumid,
                    artistId: _.artistid,
                    formats: _.formats
                })));
        } catch (_c) {}
        await new Promise((resolve)=>{
            setTimeout((args)=>{
                resolve(args);
            }, 200 + Math.random() * 100);
        });
        ++page;
    }
    return musicList;
}
async function $4e63e094b4590b2b$var$getRecommendSheetTags() {
    const res = (await (0, ($parcel$interopDefault($M8GQN$axios))).get(`http://wapi.kuwo.cn/api/pc/classify/playlist/getTagList?cmd=rcm_keyword_playlist&user=0&prod=kwplayer_pc_9.0.5.0&vipver=9.0.5.0&source=kwplayer_pc_9.0.5.0&loginUid=0&loginSid=0&appUid=76039576`)).data.data;
    const data = res.map((group)=>({
            title: group.name,
            data: group.data.map((_)=>({
                    id: _.id,
                    digest: _.digest,
                    title: _.name
                }))
        })).filter((item)=>item.data.length);
    const pinned = [
        {
            id: "1848",
            title: "翻唱"
        },
        {
            id: "621",
            title: "网络"
        },
        {
            title: "伤感",
            id: "146"
        },
        {
            title: "欧美",
            id: "35"
        }
    ];
    return {
        data: data,
        pinned: pinned
    };
}
async function $4e63e094b4590b2b$var$getRecommendSheetsByTag(tag, page) {
    const pageSize = 20;
    let res;
    if (tag.id) {
        if (tag.digest === "10000") res = (await (0, ($parcel$interopDefault($M8GQN$axios))).get(`http://wapi.kuwo.cn/api/pc/classify/playlist/getTagPlayList?loginUid=0&loginSid=0&appUid=76039576&pn=${page - 1}&id=${tag.id}&rn=${pageSize}`)).data.data;
        else {
            let digest43Result = (await (0, ($parcel$interopDefault($M8GQN$axios))).get(`http://mobileinterfaces.kuwo.cn/er.s?type=get_pc_qz_data&f=web&id=${tag.id}&prod=pc`)).data;
            res = {
                total: 0,
                data: digest43Result.reduce((prev, curr)=>[
                        ...prev,
                        ...curr.list
                    ])
            };
        }
    } else res = (await (0, ($parcel$interopDefault($M8GQN$axios))).get(`https://wapi.kuwo.cn/api/pc/classify/playlist/getRcmPlayList?loginUid=0&loginSid=0&appUid=76039576&&pn=${page - 1}&rn=${pageSize}&order=hot`)).data.data;
    const isEnd = page * pageSize >= res.total;
    return {
        isEnd: isEnd,
        data: res.data.map((_)=>({
                title: _.name,
                artist: _.uname,
                id: _.id,
                artwork: _.img,
                playCount: _.listencnt,
                createUserId: _.uid
            }))
    };
}
async function $4e63e094b4590b2b$var$getMusicSheetInfo(sheet, page) {
    const res = await $4e63e094b4590b2b$var$getMusicSheetResponseById(sheet.id, page, $4e63e094b4590b2b$var$pageSize);
    return {
        isEnd: page * $4e63e094b4590b2b$var$pageSize >= res.total,
        musicList: res.musiclist.map((_)=>({
                id: _.id,
                title: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.name || ""),
                artist: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.artist || ""),
                album: (0, ($parcel$interopDefault($M8GQN$he))).decode(_.album || ""),
                albumId: _.albumid,
                artistId: _.artistid,
                formats: _.formats
            }))
    };
}
const $4e63e094b4590b2b$var$qualityLevels = {
    low: "128k",
    standard: "320k",
    high: "flac",
    super: "flac24bit"
};
async function $4e63e094b4590b2b$var$getMediaSource(musicItem, quality) {
    let url = "";
    const res1 = (await (0, ($parcel$interopDefault($M8GQN$axios))).get(`https://lxmusicapi.onrender.com/url/kw/${musicItem.id}/${$4e63e094b4590b2b$var$qualityLevels[quality]}`, {
        headers: {
            "X-Request-Key": "share-v2"
        }
    })).data;
    if (!res1.url || res1.msg != "success") {
        const res2 = (await (0, ($parcel$interopDefault($M8GQN$axios))).get(`https://lxmusicapi.onrender.com/url/kw/${musicItem.id}/${$4e63e094b4590b2b$var$qualityLevels[quality]}`, {
            headers: {
                "X-Request-Key": "share-v2"
            }
        })).data;
        if (!res2.url || res2.msg != "success") ;
        else url = res2.url;
    } else url = res1.url;
    return {
        url: url
    };
}
async function $4e63e094b4590b2b$var$getMusicInfo(musicItem) {
    const res = (await (0, ($parcel$interopDefault($M8GQN$axios))).get("http://m.kuwo.cn/newh5/singles/songinfoandlrc", {
        params: {
            musicId: musicItem.id,
            httpStatus: 1
        }
    })).data;
    const originalUrl = res.data.songinfo.pic;
    let picUrl;
    if (originalUrl.includes("starheads/")) picUrl = originalUrl.replace(/starheads\/\d+/, "starheads/800");
    else if (originalUrl.includes("albumcover/")) picUrl = originalUrl.replace(/albumcover\/\d+/, "albumcover/800");
    return {
        artwork: picUrl
    };
}
async function $4e63e094b4590b2b$var$search(query, page, type) {
    if (type === "music") return await $4e63e094b4590b2b$var$searchMusic(query, page);
    if (type === "album") return await $4e63e094b4590b2b$var$searchAlbum(query, page);
    if (type === "artist") return await $4e63e094b4590b2b$var$searchArtist(query, page);
    if (type === "sheet") return await $4e63e094b4590b2b$var$searchMusicSheet(query, page);
}
const $4e63e094b4590b2b$var$pluginInstance = {
    platform: "小蜗音乐",
    author: "SoEasy同学",
    version: "0.0.3",
    srcUrl: "https://gitee.com/kevinr/tvbox/raw/master/musicfree/plugins/xiaowo.js",
    cacheControl: "no-cache",
    hints: {
        importMusicSheet: [
            "酷我APP：自建歌单-分享-复制试听链接，直接粘贴即可",
            "H5：复制URL并粘贴，或者直接输入纯数字歌单ID即可",
            "导入时间和歌单大小有关，请耐心等待"
        ],
        importMusicItem: []
    },
    supportedSearchType: [
        "music",
        "album",
        "sheet",
        "artist"
    ],
    search: $4e63e094b4590b2b$var$search,
    getMediaSource: $4e63e094b4590b2b$var$getMediaSource,
    getMusicInfo: $4e63e094b4590b2b$var$getMusicInfo,
    getAlbumInfo: $4e63e094b4590b2b$var$getAlbumInfo,
    getLyric: $4e63e094b4590b2b$var$getLyric,
    getArtistWorks: $4e63e094b4590b2b$var$getArtistWorks,
    getTopLists: $4e63e094b4590b2b$var$getTopLists,
    getTopListDetail: $4e63e094b4590b2b$var$getTopListDetail,
    importMusicSheet: $4e63e094b4590b2b$var$importMusicSheet,
    getRecommendSheetTags: $4e63e094b4590b2b$var$getRecommendSheetTags,
    getRecommendSheetsByTag: $4e63e094b4590b2b$var$getRecommendSheetsByTag,
    getMusicSheetInfo: $4e63e094b4590b2b$var$getMusicSheetInfo
};
$4e63e094b4590b2b$var$search("童话镇", 1, "music").then((res)=>{
    console.log(res);
    $4e63e094b4590b2b$var$getMediaSource(res.data[0], "standard").then((res)=>{
        console.log(res);
    });
    $4e63e094b4590b2b$var$getLyric(res.data[0]).then((res)=>{
        console.log(res);
    });
});
var $4e63e094b4590b2b$export$2e2bcd8739ae039 = $4e63e094b4590b2b$var$pluginInstance;


//# sourceMappingURL=xiaowo.js.map
