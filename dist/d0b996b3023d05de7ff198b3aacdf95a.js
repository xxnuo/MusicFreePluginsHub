"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const axios_1 = require("axios");
const pcapi = "https://wapi.kuwo.cn/api/www/";
const pageSize = 30;
let page;



// 格式化歌曲信息
function formatMusicItem(_) {
    let reg, Reg = (k, _) => reg = (_.N_MINFO || "").match(new RegExp('bitrate:' + k + ',format:[^,]+,size:([^;]+)'));
    let name = _.songName || _.name || _.SONGNAME;
    let singer = _.artist || _.ARTIST;
    let songId = _.MUSICRID ? _.MUSICRID.split('_')[1].split('&')[0] : (_.rid || _.id);
    let albumName = _.album || _.ALBUM;
    let albumId = _.albumid || _.ALBUMID;

    let qualities = {};
    for (let k of [128, 320, 2000, 4000]) {
        if (Reg(k, _)) {
            let t = {
                128: "low",
                320: "standard",
                2000: "high",
                4000: "super"
            } [k];
            qualities[t] = {};
            qualities[t].size = reg[1].replace(/\s*mb/i, " MB");
        }
    }
    let picUrl = _.pic || _.img || _.hts_PICPATH;
    if (!picUrl) {
        if (_.web_albumpic_short) {
            picUrl = "https://img2.kuwo.cn/star/albumcover/" + _.web_albumpic_short.replace(/^\d+/, '500');
        }
        if (!picUrl && _.MVPIC) {
            picUrl = "https://img4.kuwo.cn/wmvpic/" + _.MVPIC.replace(/^\d+/, '500');
        }
        if (!picUrl && _.web_artistpic_short) {
            picUrl = "http://img1.kuwo.cn/star/starheads/" + _.web_artistpic_short.replace(/^\d+/, '500');
        }
    }
    return {
        /* 类型 */ // 0免费 1会员
        type: (_.isListenFee || _.tpay) == 1 ? "1" : "0",
        /* 标识 */
        id: songId + "",
        /* 曲名 */
        title: name,
        /* 作者 */
        artist: singer,
        /* 时长(s) */
        duration: _.songTimeMinutes || ((_.duration || _.DURATION) * 1000), // #interval
        /* 专辑 */
        album: albumName,
        /* 封面 */
        artwork: picUrl,
        /* 音质 */
        qualities,
        /* 其他 */ // 支持自定义
        albumId, //专辑id
        // artistId, //歌手id
        vid: (_.mvpayinfo && _.mvpayinfo.vid) || _.mkvrid, //视频id video
        // rid, //播客id radio
    }
}



// 格式化歌单信息
function formatSheetItem(_) {
    return {
        /* 类型 */ // 2歌单
        type: "2",
        /* 歌单id */
        id: _.sourceid || _.playlistid || _.id || _.ARTISTID || _.albumid,
        /* 标题 */
        title: _.name || _.album,
        /* 作者 */
        artist: _.artist || _.uname || _.userName,
        /* 封面图 */
        // coverImg: "",
        artwork: _.hts_img || _.img || _.pic,
        /* 描述 */
        description: _.pub || _.info || _.intro || _.albuminfo,
        /* 作品总数 */
        worksNum: _.total,
        /* 其他参数 */
        date: _.releaseDate, // 更新时间
        // tags: [], // 歌单标签
        // playCount, // 播放数
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
        /* 类型 */ // 5歌手
        type: "5",
        /* 歌手id */
        id: _.ARTISTID || _.id,
        /* 歌手名称 */
        name: _.ARTIST || _.name,
        /* 头像 */
        avatar: _.hts_PICPATH || _.pic,
        /* 简介 */
        description: _.desc,
        /* 作品总数 */
        worksNum: _.SONGNUM || _.musicNum,
        /* 粉丝数 */
        // fans: 0,
        /* 其他参数 */
    };
}



// 请求接口
function R(x, z) {
    let t, z = z || "1234567890abcdef";
    if (x == "randomUUID") {
        t = [R(8), R(4), R(4), R(4), R(12)].join("-");
    } else {
        t = "";
        for (let i = 0; i < x; i++) {
            t += z[Math.floor(Math.random() * z.length)];
        }
    }
    return t
}
async function ajax(url, run) {
    let res = await axios_1.default.get(url + `httpsStatus=1&reqId=${R("randomUUID")}&plat=web_www&from=`);
    let _ = res.data.data || {};
    if (run === true) return _;
    let _run = {};

    let list = _.data || _.list || _.albumList || [];
    if (!run) { // 获取歌曲信息
        list = Array.from(_.musicList || _.musiclist || _.list || []);
        let list2 = (await getMusicInfo(list)) || [];

        list = list.map((__, i) => Object.assign(__, list2[i]));
        if (/artistMusic/.test(url)) {
            _run.data = list.map(formatMusicItem);
        } else {
            _run.musicList = list.map(formatMusicItem);
        }
    } else {
        if (/artistAlbum/.test(url)) {
            _run.data = list.map(formatAlbumItem);
        } else {
            _run.data = list.map(run);
        }
    }
    _run.isEnd = list.length < pageSize;
    return _run;
}



// 歌单标签
async function getRecommendSheetTags() {
    let pinned = [{
        title: "最新",
        id: "classify/playlist/getRcmPlayList?order=new"
    }, {
        title: "热门",
        id: "classify/playlist/getRcmPlayList?order=hot"
    }];
    let list = await ajax(pcapi + "classify/playlist/getRcmTagList?", true);
    list = list[0].data.map((_, i) => ({
        title: _.name,
        id: "classify/playlist/getTagPlayList?id=" + _.id
    }));
    pinned.push(...list);

    let data = [];
    list = await ajax(pcapi + "classify/playlist/getTagList?", true);
    list.map(_ => {
        if (_.data.length && _.name != "专区") {
            _.name = _.name.replace('曲风流派', '风格').replace("语言", "语种");
            data.push({
                title: _.name,
                data: _.data.map(_ => ({
                    title: _.name,
                    id: "classify/playlist/getTagPlayList?id=" + _.id
                }))
            });
        }
    });
    return {
        pinned,
        data
    }
}

// 歌单列表
async function getRecommendSheetsByTag(tag, page) {
    let path = tag.id === "" ? "rcm/index/playlist?id=rcm" : tag.id;
    return await ajax(pcapi + path + "&pn=" + page + "&rn=" + pageSize + "&", formatSheetItem);
}

// 歌单详情
async function getMusicSheetInfo(sheet, page) {
    return await ajax(pcapi + "playlist/playListInfo?pid=" + sheet.id + "&pn=" + page + "&rn=" + pageSize + "&");
}



// 榜单列表
async function getTopLists() {
    let group = [];
    (await ajax(pcapi + "bang/bang/bangMenu?", true)).map(_ => {
        group.push({
            title: _.name,
            data: _.list.map(formatToplistItem)
        });
    });
    return group;
}

// 榜单详情
async function getTopListDetail(top, page) {
    return await ajax(pcapi + "bang/bang/musicList?bangId=" + top.id + "&pn=" + page + "&rn=" + pageSize + "&");
}



// 歌手详情
async function getArtistWorks(artist, page, type) {
    type = {
        music: "Music",
        album: "Album"
    } [type];
    return await ajax(pcapi + "artist/artist" + type + "?artistid=" + artist.id + "&pn=" + page + "&rn=" + pageSize + "&", type == "Album" && 4);
}

// 专辑详情
async function getAlbumInfo(album, page) {
    return await ajax(pcapi + "album/albumInfo?albumId=" + album.id + "&pn=" + page + "&rn=" + pageSize + "&");
}



// 歌曲详情
async function getMusicInfo(resource) {
    let isObj = !Array.isArray(resource);
    if (isObj) {
        resource = [resource];
    }
    resource = resource.map(_ => _.id || _.rid).join(",");
    let _res = (
        await axios_1.default.get(`http://musicpay.kuwo.cn/music.pay`, {
            params: {
                op: "query",
                action: "play",
                ids: resource
            }
        })
    ).data;
    if (isObj) {
        _res.songs = formatMusicItem(_res.songs[0]);
        let artwork = (await getMusicArtwork(_res.songs.id));
        _res.songs.artwork = artwork || _res.songs.artwork;
    }
    return _res.songs;
}

// 获取封面
async function getMusicArtwork(musicId) {
    let res = (
        await axios_1.default.get(`http://artistpicserver.kuwo.cn/pic.web`, {
            params: {
                type: "rid_pic",
                pictype: "url",
                size: "500",
                rid: musicId
            }
        })
    ).data || "";
    return res.replace("NO_PIC", "");
}

// 获取链接(url)
async function getMediaSource(musicItem, quality) {
    let url;
    try {
        let {
            source
        } = env && env.getUserVariables();
        if (source && source != "") {
            let mobi = (await axios_1.default.get("http://nmobi.kuwo.cn/mobi.s", {
                params: {
                    f: "web",
                    source: source,
                    user: 0,
                    type: "convert_url_with_sign",
                    rid: musicItem.id,
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
            url = mobi.data.url.split("?")[0];
        } else {
            url = (await ajax(
                pcapi.replace(/(api\/)/, '$1v1/') + "music/playUrl?mid=" + musicItem.id + "&type=music&", true
            )).url;
        }
    } catch (e) {}
    if (url && url != "" && url != "None") {
        return {
            url
        };
    } else {
        // console.log("调用解析");
        return await getMediaProxys(musicItem, quality);
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
                            source: "kw",
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
                    await axios_1.default.get(`https://music.haitangw.cc/music/kw.php`, {
                        params: {
                            level: {
                                "low": "exhigh",
                                "standard": "exhigh",
                                "high": "lossless",
                                "super": "lossless"
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
                    await axios_1.default.get(`https://lxmusicapi.onrender.com/url/kw/${musicItem.id}/${ quality=="low"?"128k":"320k" }`, {
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
        return null;
    }
}

// 获取歌词(lrc)
async function getLyric(musicItem) {
    let lrc, t1 = musicItem.id;
    try { // 备用
        lrc = await ajax("https://www.kuwo.cn/openapi/v1/www/lyric/getlyric?musicId=" + t1 + "&", true) || {};
        lrc = (lrc.lrclist || lrc.lrc || []).map(_ => {
            let s = ((_.time - 0) % 60).toFixed(3).padStart(6, '0');
            let m = ((_.time - s) / 60).toFixed(0).padStart(2, '0');
            return `[${m}:${s}]` + _.lineLyric
        }).join('\n');
    } catch (e) {}
    return {
        rawLrc: lrc || ""
    }
}



// 实现搜索
async function search(query, page, type) {
    let _type = {
        "免费": {
            ft: "music",
            noVipver: true,
            mat: formatMusicItem
        },
        "music": {
            ft: "music",
            mat: formatMusicItem
        },
        "sheet": {
            ft: "playlist",
            mat: formatSheetItem
        },
        "album": {
            ft: "album",
            mat: formatAlbumItem
        },
        "artist": {
            ft: "artist",
            mat: formatArtistItem
        },
        "lyric": {
            ft: "lyric",
            mat: formatMusicItem
        }
    } [type];
    let p = {
        // 必要参数
        rformat: "json", // 返回格式
        encoding: "utf8", // 编码方式
        ft: _type.ft, // 搜索类型
        rn: pageSize, // 获取30个
        pn: page - 1, // 当前页数
        all: query, // 搜索的关键词
        vipver: "MUSIC_8.0.3.0_BCS75", // 此参数存在时会返回vip歌曲

        // 下面是非必要参数
        mobi: 1, // APP端？ #限制返回的参数大小
        newsearch: 1, // 新搜索数据？
        searchapi: 7, // api序号？
        issubtitle: 1, // 是否包含关键词？
        vermerge: 1, // 未知参数
        strategy: 2012,
        show_copyright_off: 1,
        correct: 1,
        cluster: 0,
        client: "kt",
        spPrivilege: 0,
        newver: 3
        // 还有一些其他参数
    }
    if (_type.noVipver) {
        delete p.vipver;
    }
    if (_type.ft == "album") {
        p.albumver = 1; // 获取专辑信息
    } else if (_type.ft == "lyric") {
        delete p.all;
        p.ft = "music";
        p.lrccontent = query;
    }
    let _ = (
        await axios_1.default.get(`http://search.kuwo.cn/r.s`, {
            params: p
        })
    ).data;
    let list = _.abslist || _.albumlist || [];
    return {
        isEnd: list.length < pageSize,
        data: list.map(_type.mat)
    }
}



// 格式化评论信息
function formatComment(_) {
    return {
        // 评论ID
        id: _.id,
        // 用户名
        nickName: _.u_name,
        // 头像
        avatar: _.u_pic,
        // 评论内容
        comment: _.msg,
        // 点赞数
        like: _.like_num,
        // 评论时间
        createAt: _.time * 1000,
        // 地址
        location: 0,
        // 回复
        replies: (_.child_comments || []).map(formatComment),
        /* 其他参数 */
        type: "11" // 11评论
    };
}
// 获取评论
async function getMusicComments(musicItem, page) {
    let _ = (
        await axios_1.default.get(`http://ncomment.kuwo.cn/com.s`, {
            params: {
                f: "web",
                type: "get_comment",
                aapiver: 1,
                prod: "kwplayer_ar_10.5.2.0",
                digest: 15,
                sid: musicItem.id,
                start: (page - 1) * pageSize,
                msgflag: 1,
                count: pageSize,
                newver: 3,
                uid: 0
            }
        })
    ).data;
    let list = _.comments;
    return {
        isEnd: list.length < pageSize,
        data: list.map(formatComment)
    }
}



// 导入歌单
async function importMusicSheet(urlLike) {
    let id = (urlLike.match(/^(\d+)$/) || [])[1];
    if (!urlLike.match(/kuwo\.cn/i)) {
        return false;
    }
    if (!id) {
        id = (urlLike.match(/(\/playlist(_detail)?\/|[\?\&]pid=)(\d+)/i) || [])[3];
    }
    if (!id) {
        return false;
    }

    // 手动遍历歌单数据
    let e = 0;
    let page = 1;
    let list = [];
    do {
        try {
            let {
                isEnd,
                musicList
            } = await getMusicSheetInfo({
                id
            }, page);
            list.push(...musicList);
            if (isEnd) {
                break;
            }
        } catch (err) {
            if (e > 3) {
                break;
            } else {
                page--;
                e++;
            }
        }
    } while (page++);
    return list;
}



// 导入歌曲
async function importMusicItem(urlLike) {
    let id = (urlLike.match(/^(\d+)$/) || [])[1];
    if (!urlLike.match(/kuwo\.cn/i)) {
        return false;
    }
    if (!id) {
        id = (urlLike.match(/(\/yinyue\/|\/play_detail\/|[\?\&][mr]?id=(MUSIC_)?)(\d+)/i) || [])[3];
    }
    if (!id) {
        return false;
    }
    return await getMusicInfo({
        id
    });
}



// 返回函数
module.exports = {
    platform: "酷我音乐",
    author: '反馈Q群@365976134',
    version: "2025.09.16",
    appVersion: ">0.4.0-alpha.0",
    srcUrl: "https://raw.githubusercontent.com/ThomasBy2025/musicfree/refs/heads/main/plugins/kw.js",
    cacheControl: "no-store",
    description: "## By: Thomas喲  \n#### 版本: 2025.09.16  \n支持导入单曲，获取评论  \n修复更新解析，代码优化  \n支持用户变量，更改接口  \n#### 音源重定向  \n支持的插件如下  \n酷我音乐, 小蜗音乐, 元力KW  \n#### Bug反馈  \n[点我加入反馈群](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=x8r6m0bYYon_pCgT0BRc1ohwZmkkY61Q&authKey=DpmUioCvx45WjRRBnbRT2DsJ7LL6DNY3uau%2BFKPgR%2FSKz4EgYqUjEU5tJNi%2BkNPl&noverify=0&group_code=365976134)  \n#### 支持作者  \n![支持作者](https://raw.githubusercontent.com/ThomasBy2025/hikerview/refs/heads/main/mm_facetoface_collect_qrcode_1757315185814.png)",
    hints: {
        importMusicSheet: [
            "酷我APP：自建歌单-分享-复制试听链接，直接粘贴即可",
            "H5：复制URL并粘贴，或者直接输入纯数字歌单ID即可",
            "导入时间和歌单大小有关，请耐心等待"
        ],
        importMusicItem: [
            "酷我音乐：APP点击分享，然后复制链接",
            "H5：复制URL并粘贴，或者直接输入纯数字歌曲ID即可"
        ]
    },
    userVariables: [{
        key: "source",
        name: "渠道标识",
        hint: "source"
    }, {
        key: "ikun_key",
        name: "ikun音源卡密",
        hint: "key"
    }],
    supportedSearchType: ["music", "album", "sheet", "artist", "lyric"],
    search, // 实现搜索内容
    importMusicSheet, // 支持导入歌单
    importMusicItem, // 支持导入歌曲

    getRecommendSheetTags, // 获取歌单标签
    getRecommendSheetsByTag, // 获取歌单列表
    getMusicSheetInfo, // 获取歌单详情

    getTopLists, // 获取榜单列表
    getTopListDetail, // 获取榜单详情

    getArtistWorks, // 获取歌手详情
    getAlbumInfo, // 获取专辑详情

    getMusicInfo, // 获取歌曲详情
    getMediaSource, // 获取播放链接
    getLyric, // 获取歌词
    getMusicComments, // 获取歌曲评论
};