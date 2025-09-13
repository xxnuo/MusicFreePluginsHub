"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const axios_1 = require("axios");
const CryptoJs = require("crypto-js");
const dayjs = require("dayjs");
const pageSize = 30;
// 音质参数
const qualityMap = {
    "low": "standard",
    "standard": "exhigh",
    "high": "lossless",
    "super": "hires",
    /*
        "standard": "128k标准音质",
        "higher": "192k高品音质",
        "exhigh": "320k极高音质",
        "lossless": "flac无损音质",
        "hires": "Hi-Res音质",
        "jyeffect": "高清环绕",
        "sky": "沉浸环绕", // SVIP
        "jymaster": "超清母带", // SVIP
    */
};



// 实现 eapi 请求
function MD5(data) {
    return CryptoJs.MD5(data)
        .toString(CryptoJs.enc.Hex);
}

function AES(data) {
    let key = CryptoJs.enc.Utf8.parse("e82ckenh8dichen8");
    let text = CryptoJs.enc.Utf8.parse(data);
    return CryptoJs.AES.encrypt(text, key, {
        mode: CryptoJs.mode.ECB,
        padding: CryptoJs.pad.Pkcs7
    }).ciphertext.toString(CryptoJs.enc.Hex);
}
async function EAPI(path, json = {}) {

    let params = [path, JSON.stringify(json)];
    params.push(MD5(
        "nobody" +
        params.join("use") +
        "md5forencrypt"
    ));
    params = AES(params.join("-36cd479b6b5-"));

    let { // 获取用户数据
        music_u
    } = env && env.getUserVariables();
    let music_a = String(music_u || "").match(/(MUSIC_[UA]=|^)([^;]+)/i)
    music_u = "os=pc; appver=9.0.25; " + (music_a ? "MUSIC_U=" + music_a[1] : "MUSIC_U=0034B44F9926BE9F1DD236BFB146E0FEB27696AD0802E2DD8D8062B036AD87CEEEB49D3141C00C103A8B110C944E6DFA2909843C098EB2515B513BC1AA0A7974866D653BEA27F81BF15700FB398CB95ABE260EDA0E71900A46296E8E9C069B6C6A3509D1FDE9F41DCEF55B07BEE0990EE13F8A461098536FF86896E76892551CC5B8C6C2063E605639146CEF24D2904725876F53C57B442653EA13ACFE9F2653B512A23BABE01680F2E953AF4BE1602B38B39B38B1D6D5C50E1F84AAF323D841A717DECDF9E0834EF1703C1D4A37DE7DB3AC49FA2A2C397B3418C34FAF191ED064E4F266D94A281B0C08947F339929EE1896350C37FE1E007D32BE2E0C1970DD2161A0D87F4A95CEA5B111289EC1064555149DBEEFBF73A1397D5B24EB5B429D81C8CBDB2A7DF61BECFAB3DBA3BD165167");
    // console.log(music_u);
    return (await (0, axios_1.default)({
        url: path.replace("/", "https://interface.music.163.com/e"),
        method: "POST",
        data: "params=" + params.toUpperCase(),
        headers: {
            Cookie: music_u
        },
    })).data;
}



// 格式化歌曲信息
function formatMusicItem(_) {
    _ = _.baseInfo || _.song || _;
    let name = _.name || _.songname;
    let singer = _.ar && _.ar.map(_ => _.name).join('&') || "";
    let albumName = _.al && _.al.name;
    let albumId = (_.al && _.al.id) || "";
    let picUrl = (_.al && _.al.picUrl) || "";
    let qualities = {};
    for (let k of ['l', 'h', 'sq', 'hr']) {
        if (_[k] || (k == 'l' && _[k = 'm'])) {
            let t = {
                'm': "low",
                'l': "low", //192k
                'h': "standard",
                'sq': "high",
                'hr': "super"
            } [k];
            qualities[t] = {};
            qualities[t].size = _[k].size;
            // qualities[t].url = "";
        }
    }
    let content = ((_.fee == 0 || _.fee == 8) && (_.privilege ? (_.privilege.st > -1) : 1)) ? 0 : 1;
    return {
        /* 隶属插件 */
        // platform: "网易音乐",
        /* 歌曲类别☆  0免费 1付费 */
        type: ((_.fee == 0 || _.fee == 8) && (_.privilege ? (_.privilege.st > -1) : 1)) ? "0" : "1",
        /* 歌曲在平台的唯一编号 */
        id: String(_.id || "") || undefined,

        /* 作者 */
        artist: singer,
        /* 标题 */
        title: name,
        /* 别名 */
        // alias: "",
        /* 时长(s) */
        duration: _.dt,
        /* 专辑名 */
        album: albumName,
        /* 专辑封面图 */
        artwork: picUrl,
        /* 音质信息 */
        qualities,
        /* 其他信息☆ */
        albumId,
        artistId: _.ar && _.ar.map(_ => _.id).join('&'), //歌手id
        vid: _.mv || undefined, //视频id video
        rid: _.dj && _.dj.id, //播客id radio

        /* 默认音源 */
        // url: `http://music.163.com/song/media/outer/url?id=${songId}.mp3`
        /* 音源 */
        // source?: Partial<Record<IQualityKey, IMediaSource>>
        /* 歌词文本 */
        rawLrc: _.lyrics,
    }
}

// 格式化歌单信息
function formatSheetItem(_) {
    _ = _.baseInfo || _;
    return {
        /* 隶属插件 */
        // platform: "网易音乐",
        /* 分组类别☆  2歌单 3榜单 4专辑 */
        type: "2",
        /* 歌单id */
        id: _.id || _.resourceId,
        /* 标题 */
        title: _.name || _.title,
        /* 作者 */
        artist: (_.artist && _.artist.name) || (_.creator && _.creator.nickname),
        /* 封面图 */
        // coverImg: "",
        artwork: _.coverImgUrl || _.picUrl || _.coverImg || _.coverUrl,
        /* 描述 */
        description: _.description || _.updateFrequency,
        /* 作品总数 */
        worksNum: _.trackCount || (_.artist && _.artist.musicSize),
        /* 其他参数 */
        playCount: _.playCount,
        date: dayjs.unix((_.updateTime || _.publishTime) / 1000).format("YYYY-MM-DD"),
        createUserId: _.userId,
        createTime: _.createTime,
        content: 2
    };
}
// 格式化榜单信息
function formatToplistItem(_) {
    _ = formatSheetItem(_);
    _.coverImg = _.artwork;
    _.type = "3" // 3榜单
    return _;
}
// 格式化专辑信息
function formatAlbumItem(_) {
    _ = formatSheetItem(_);
    _.type = "4" // 4专辑
    return _;
}

// 格式化歌手信息
function formatArtistItem(_) {
    return {
        /* 隶属插件 */
        // platform: "网易音乐",
        /* 分组类别☆ 5歌手 */
        type: "5",
        /* 歌手id */
        id: _.id,
        /* 标识2 - 优先获取✩ */
        // mid,
        /* 歌手名称 */
        name: _.name,
        /* 作者名称 */
        // artist: _.name,
        /* 头像 */
        avatar: _.img1v1Url || _.picUrl,
        /* 简介 */
        description: _.briefDesc || _.description,
        /* 作品总数 */
        worksNum: _.albumSize || _.musicSize,
        /* 粉丝数 */
        // fans: 0,
        /* 其他参数 */
    };
}



// 获取歌曲详情
async function getMusicInfo(musicItem) {
    let _ = await EAPI("/api/v3/song/detail", {
        c: `[{"id":"${musicItem.id}"}]`
    });
    let a = _.songs[0] || _.privileges[0];
    a.privilege = _.privileges[0];
    return formatMusicItem(a);
}

// 获取歌单详情
async function getMusicSheetInfo(sheet, page = 1) {
    let _ = (await EAPI("/api/v6/playlist/detail", {
        n: 99999,
        id: sheet.id
    })).playlist;
    let list = _.tracks || [];
    return {
        isEnd: 99999 >= _.trackCount,
        sheetItem: formatSheetItem(_),
        musicList: list.map(formatMusicItem)
    };
}

// 获取专辑详情
async function getAlbumInfo(albumItem) {
    let res = await EAPI("/api/v1/album/" + albumItem.id, {});
    return {
        isEnd: true,
        albumItem: formatAlbumItem(res.album),
        musicList: (res.songs || []).map(formatMusicItem),
    };
}

// 获取歌手详情
async function getArtistWorks(artistItem, page, type) {
    let T = {
        "music": {
            "path1": "/api/v1/artist/",
            "path2": "hotSongs",
            "mapJs": formatMusicItem
        },
        "album": {
            "path1": "/api/artist/albums/",
            "path2": "hotAlbums",
            "mapJs": formatAlbumItem
        },
    } [type];
    let res = await EAPI(T.path1 + artistItem.id, {});
    return {
        isEnd: true,
        artistItem: formatArtistItem(res.artist),
        data: res[T.path2].map(T.mapJs),
    };
}



// 获取排行榜分类
async function getTopLists() {
    let group1 = [];
    let group2 = await EAPI("/api/toplist/detail/v2", {});
    group2.data.map(_ => {
        if (_.list && _.list.length) {
            let group3 = [];
            _.list.map(_ => {
                if (_.id != 0) group3.push(formatToplistItem(_));
            });
            group1.push({
                title: _.name,
                data: group3
            });
        }
    });
    return group1;
}
// 获取榜单详情，网易云可以跳转到歌单详情函数
async function getTopListDetail(topListItem) {
    let res = await getMusicSheetInfo(topListItem);
    res.topListItem = res.sheetItem;
    res.topListItem.type = "3";
    return res;
}



// 获取歌单分类
async function getRecommendSheetTags() {
    let group1 = [{
            title: "推荐",
            id: "_SPECIAL_CLOUD_VILLAGE_PLAYLIST"
        },
        {
            title: "官方",
            id: "官方"
        },
        {
            title: "雷达",
            id: "_RADAR"
        },
        {
            title: "原创",
            id: "_SPECIAL_ORIGIN_SONG_LOCATION"
        },
        {
            title: "心情",
            id: "_FEELING_PLAYLIST_LOCATION"
        },
        {
            title: "场景",
            id: "_SCENE_PLAYLIST_LOCATION"
        },
        {
            title: "专属",
            id: "_COMBINATION"
        },
        {
            title: "全部",
            id: "全部歌单"
        },
        {
            title: "新热",
            id: "_NEW_SONG_AND_ALBUM"
        },
        {
            title: "影视",
            id: "_FIRM_PLAYLIST"
        },
        {
            title: "奖项",
            id: "_AWARDS_PLAYLIST"
        },
    ];
    let group2 = ["语种", "风格", "场景", "情感", "主题"]
        .map(name => {
            return ({
                title: name,
                data: []
            });
        });
    let group3 = await EAPI("/api/playlist/catalogue/v1", {});
    group3.sub.map(_ => {
        group2[_.category].data.push({
            title: _.name,
            id: _.name
        });
    });
    return {
        pinned: group1,
        data: group2,
    };
}
// 通过分类获取歌单列表
async function getRecommendSheetsByTag(tag, page) {
    let _, t1 = tag === null || tag === void 0 || (tag && tag.id);
    if (t1 === "" || t1 === true) { // 默认
        _ = await EAPI("/api/personalized/playlist", {
            limit: 30
        }, {
            Cookie: ""
        });
    } else if (/^_[A-Z]+/.test(t1)) { // 推荐
        _ = (await EAPI("/api/link/page/rcmd/resource/show", {
            "pageCode": "HOME_RECOMMEND_PAGE",
            "isFirstScreen": "false",
            "cursor": "6",
            "refresh": "true",
            "blockCodeOrderList": `["PAGE_RECOMMEND${t1}"]`
        })).data.blocks[0].dslData;
        _ = (_.home_page_common_playlist_module_d1r94fwj80 || _.home_page_scene_playlist_module_w5rp24j0x2 || _.home_page_scene_playlist_module_rsoa9pd6fn || _).blockResource;
    } else {
        _ = await EAPI("/api/playlist/list", {
            cat: t1 || "全部",
            order: "hot",
            limit: pageSize,
            offset: (page - 1) * pageSize,
            total: true,
            csrf_token: "",
        });
    }
    let list = _.result || _.playlists || _.resources || [];
    let total1 = page * pageSize;
    let total2 = _.total || (total1 - pageSize + list.length);
    return {
        isEnd: (_.more !== true) || (total2 <= total1),
        data: list.map(formatSheetItem)
    };
}



// 匹配歌单链接，跳转到歌单详情函数
// 需要返回列表，获取musicList
async function importMusicSheet(urlLike) {
    let id = (urlLike.match(/^(\d+)$/) || [])[1];
    if (!id && !urlLike.match(/music\.163\.com/i)) {
        return false;
    }
    if (!id) {
        id = (urlLike.match(/playlist(\/|.*?[\?\&]id=)(\d+)/i) || [])[2];
    }
    if (!id) {
        return false;
    }
    return (await getMusicSheetInfo({
        id
    })).musicList;
}



// 匹配单曲链接，跳转到单曲详情函数
async function importMusicItem(urlLike) {
    let id = (urlLike.match(/^(\d+)$/) || [])[1];
    if (!id && !urlLike.match(/music\.163\.com/i)) {
        return false;
    }
    if (!id) {
        id = (urlLike.match(/song(.*?[\?\&]id=|\/)(\d+)/i) || [])[2];
    }
    if (!id) {
        return false;
    }
    return await getMusicInfo({
        id
    });
}



// 获取在线歌词
async function getLyric(musicItem) {
    let res = await EAPI("/api/song/lyric", {
        id: musicItem.id,
        lv: -1,
        kv: -1,
        tv: -1
    });
    return {
        /* 歌词URL */
        // lrc: "",
        /* 纯文本歌词 */
        rawLrc: res.lrc.lyric,
        /* 没有时间戳的 纯文本歌词 */
        // rawLrcTxt: "",
        /* 纯文本格式的翻译 */
        // translation: "",
        /* 时间 s */
        // time: 0,
        /* 下标 */
        // index: 0,
    };
}



// 获取播放链接
async function getMediaSource(musicItem, quality) {
    if (!musicItem.qualities[quality]) {
        return false
    }
    let _ = (await EAPI("/api/song/enhance/player/url/v1", {
        ids: `["${musicItem.id}"]`,
        encodeType: "flac",
        immerseType: "c51",
        trialMode: "23", // 试听
        level: qualityMap[quality]
    })).data;
    if (_ && _[0] && _[0].url) {
        return {
            url: String(_[0].url).split("?")[0],
            size: _[0].size,
            quality,
            // userAgent: "",
            // headers: {},
        };
    }
    if (_ && _[0] && _[0].code == 404) { // 灰色歌曲
        return await KUWO(musicItem, quality);
    } else {
        return await getMediaProxys(musicItem, quality, 0);
    }
}



// 从解析获取链接 (lx-music-api-server)
// 基于 https://github.com/lxmusics/lx-music-api-server 实现的五个公益音源
async function getMediaProxys(musicItem, quality, err_i = 0) {
    let lxQuality = {
        low: "128k",
        high: "320k",
        lossless: "flac",
        super: "flac24bit"
    } [quality];
    let url, rawLrc, artwork, res;
    try {
        switch (String(err_i)) {
            case "0": // By: ikun0014
                // 反馈群组: https://t.me/ikunshare_qun
                // MusicFree: https://api.ikunshare.com/subscription_卡密.json
                // LX Music: https://api.ikunshare.com/script?key=卡密
                let { // 获取密匙
                    ikun_key
                } = env && env.getUserVariables();
                res = (
                    await axios_1.default.get(`https://api.ikunshare.com/url`, {
                        params: {
                            source: "wy",
                            songId: musicItem.id,
                            quality: lxQuality
                        },
                        headers: {
                            "X-Request-Key": ikun_key || "",
                            "User-Agent": "lx-music-mobile/2.0.0"
                        }
                    })
                ).data;
                url = res.url;
                if (url) return {
                    url
                };
                break;
            case "1": // By: 微信公众号@元力菌
                // 反馈群组：null
                // MusicFree: https://13413.kstore.vip/yuanli/元力音乐.json
                // LX Music: null
                res = (
                    await axios_1.default.get(`https://music.haitangw.cc/music/wy.php`, {
                        params: {
                            level: {
                                "low": "standard",
                                "standard": "exhigh",
                                "high": "lossless",
                                "super": "hires"
                            } [quality],
                            id: musicItem.id
                        }
                    })
                ).data;
                url = res.data.url;
                if (url) return {
                    rawLrc: res.data.lrc,
                    url
                }
                break;
            case "4": // By: Huibq
                // 反馈群组：https://t.me/+Xh7BWUUPqUZlMDU1
                // MusicFree: https://fastly.jsdelivr.net/gh/Huibq/keep-alive/Music_Free/myPlugins.json
                // LX Music: https://fastly.jsdelivr.net/gh/Huibq/keep-alive/render_api.js
                res = (
                    await axios_1.default.get(`https://lxmusicapi.onrender.com/url/wy/${musicItem.id}/${ quality=="low"?"128k":"320k" }`, {
                        headers: {
                            "X-Request-Key": "share-v2",
                            "User-Agent": "lx-music-mobile/2.0.0"
                        }
                    })
                ).data;
                url = res.url;
                if (url) return {
                    url,
                }
                break;
        }
    } catch (err) {}
    if (err_i < 5) {
        return await getMediaProxys(musicItem, quality, err_i + 1);
    } else {
        return await KUWO(musicItem, quality);
    }
}



// 获取灰色歌曲
async function KUWO(musicItem, quality) {
    let {
        source
    } = env && env.getUserVariables();
    let params = {
        // 必要参数
        rformat: "json", // 返回格式
        encoding: "utf8", // 编码方式
        ft: "music", // 搜索类型
        rn: 30, // 获取30个
        pn: 0, // 当前页数
        all: musicItem.title, // 搜索的关键词

        itemset: "web_2013",
        client: "kt",
        pcjson: 1
    };
    // 此参数存在时会返回vip歌曲
    if (source) params.vipver = "MUSIC_8.0.3.0_BCS75"

    // 搜索
    var songId;
    let sou = (await (0, axios_1.default)({
        method: "get",
        url: "http://search.kuwo.cn/r.s",
        params
    })).data.abslist;
    for (let _ of sou) {
        if (!_.SONGNAME.match('片段')) {
            songId = _.MUSICRID.split('_')[1].split('&')[0];
            break;
        };
    }
    // console.log(songId);

    // 获取
    let res = (await axios_1.default.get("http://nmobi.kuwo.cn/mobi.s", {
        params: {
            f: "web",
            source: source,
            user: 0,
            type: "convert_url_with_sign",
            rid: songId,
            br: {
                "low": "128kmp3",
                "standard": "320kmp3",
                "high": "2000kflac",
                "super": "20000kflac",
            } [quality],
        },
        headers: {
            "User-Agent": "okhttp/4.10.0"
        }
    })).data;
    // console.log(res);
    return {
        url: res.data.url.split("?")[0],
        quality
    }
}





// 格式化歌曲评论
function formatComment(_) {
    return {
        id: _.commentId,
        // 用户名
        nickName: _.user && _.user.nickname,
        // 头像
        avatar: _.user && _.user.avatarUrl,
        // 评论内容
        comment: _.content,
        // 点赞数
        like: _.likedCount,
        // 评论时间
        createAt: _.time,
        // 地址
        location: _.ipLocation && _.ipLocation.location,
        // 回复
        replies: (_.beReplied || []).map(formatComment),
        /* 其他参数 */
        type: "6"
    };
}
// 获取歌曲评论
async function getMusicComments(musicItem, page = 1) {
    let res = (await EAPI("/api/v2/resource/comments", {
        "threadId": "R_SO_4_" + musicItem.id,
        "cursor": "20",
        "sortType": "1",
        "pageNo": page,
        "pageSize": pageSize + "",
        "parentCommentld": "0",
        "showlnner": false
    })).data;
    return {
        isEnd: res.hasMore != true,
        data: res.comments.map(formatComment)
    }
}



// 搜索函数
async function searchBase(query, page, type, v1 = "") {
    let path = "/api" + v1 + "/search/" + (/\//.test(type) ? type : (type + "/get"));
    let data = {
        "filterCode": "-1",
        "offset": ((page - 1) * pageSize) + "",
        "limit": pageSize + "",
        "channel": "typing",
        "keyword": query,
        "scene": "normal",
        "s": query,
    };
    let res = await EAPI(path, data);
    return res.data || res.result;
}
module.exports = {
    platform: "网易音乐",
    author: '反馈Q群@365976134',
    version: "2025.09.13",
    appVersion: ">0.4.0-alpha.0",
    srcUrl: "https://raw.githubusercontent.com/ThomasBy2025/musicfree/refs/heads/main/plugins/wy.js",
    cacheControl: "no-store",
    description: "## By: Thomas喲  \n#### 版本: 2025.09.13  \nJavaScript优化，细节调整  \n修复酷我渠道，增加解析  \n#### 音源重定向  \n支持的插件如下  \n网易云音乐, 小芸音乐, 简繁音乐, 元力WY  \n#### Bug反馈  \n[点我加入反馈群](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=x8r6m0bYYon_pCgT0BRc1ohwZmkkY61Q&authKey=DpmUioCvx45WjRRBnbRT2DsJ7LL6DNY3uau%2BFKPgR%2FSKz4EgYqUjEU5tJNi%2BkNPl&noverify=0&group_code=365976134)  \n#### 支持作者  \n![支持作者](https://raw.githubusercontent.com/ThomasBy2025/hikerview/refs/heads/main/mm_facetoface_collect_qrcode_1757315185814.png)",
    hints: {
        importMusicSheet: [
            "网易云：APP点击分享，然后复制链接",
            "默认歌单无法导入，先新建一个空白歌单复制过去再导入新歌单即可"
        ],
        importMusicItem: [
            "网易云：APP点击分享，然后复制链接"
        ]
    },
    userVariables: [{
        key: "music_u",
        name: "用户数据(cookie)",
        hint: "MUSIC_U 或 MUSIC_A"
    }, {
        key: "ikun_key",
        name: "ikun音源卡密",
        hint: "key"
    }, {
        key: "source",
        name: "酷我白名单渠道",
        hint: "source"
    }],
    supportedSearchType: ["music", "album", "sheet", "artist", "lyric"],
    async search(query, page, type) {
        let stype = {
            music: {
                t: "song",
                m: formatMusicItem,
            },
            album: {
                t: type,
                c: "4",
                v: "/v1",
                m: formatAlbumItem,
            },
            artist: {
                t: type,
                c: "5",
                v: "/v1",
                m: formatArtistItem,
            },
            sheet: {
                t: "playlist",
                c: "2",
                m: formatSheetItem,
            },
            lyric: {
                t: "resource/lyric",
                m: formatMusicItem
            }
        } [type];
        let _ = await searchBase(query, page, stype.t, stype.v);
        let list = _.resources || _.albums || _.artists || [];
        let total1 = page * pageSize
        let total2 = _.songCount || _.playlistCount || _.albumCount || _.totalCount || (total1 - pageSize + list.length);
        return {
            isEnd: total2 <= total1,
            data: list.map(stype.m)
        }
    },
    importMusicSheet,
    importMusicItem,
    getMusicInfo,
    getAlbumInfo,
    getArtistWorks,
    getMusicSheetInfo,
    getTopLists,
    getTopListDetail,
    getRecommendSheetTags,
    getRecommendSheetsByTag,
    getMediaSource,
    getLyric,
    getMusicComments,
};