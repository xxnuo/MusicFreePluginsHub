"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const CryptoJs = require("crypto-js");
const axios_1 = require("axios");
const pageSize = 30;



// 格式化歌曲信息
function formatMusicItem(_) {
    let qualitys = _.relate_goods || [];
    if (qualitys.length == 0) {
        for (let k of ['', '320', 'sq', 'hign']) {
            if (_[k + 'filesize']) {
                qualitys.push({
                    type: {
                        '': "128k",
                        '320': "320k",
                        'sq': "flac",
                        'high': "flac24bit"
                    } [k],
                    size: _[k + 'filesize'],
                    hash: _[k + 'hash'].toUpperCase()
                });
            }
        }
    } else {
        _ = qualitys[0];
        qualitys = qualitys.slice(0, 4).filter(_ => /^(128|320|flac|high)$/i.test(_.quality)).map(_ => {
            return {
                type: {
                    '128': '128k',
                    '320': '320k',
                    'flac': 'flac',
                    'high': 'flac24bit'
                } [_.quality],
                size: _.info.filesize,
                hash: _.hash.toUpperCase()
            }
        });
    };
    let qualities = {};
    qualitys.map(_ => {
        let quality = {
            '128k': 'low',
            '320k': 'standard',
            'flac': 'high',
            'flac24bit': 'super'
        } [_.type]
        qualities[quality] = {};
        qualities[quality].size = _.size;
        qualities[quality].hash = _.hash;
    });
    let [artist, title] = String(_.filename || _.name).split(' - ');
    return {
        /* 类型 */ // 0免费 1会员
        type: (_.privilege == 0 || _.privilege == 8) ? "0" : "1",
        /* 标识 */
        id: _.audio_id || _.id, // #songId
        /* 标识2 - 优先获取✩ */
        mid: _.hash.toUpperCase(), // #mediaHash
        /* 曲名 */
        title,
        /* 作者 */
        artist,
        /* 时长(s) */
        duration: (_.info && _.info.duration) || (_.duration), // #interval
        /* 专辑 */
        album: _.albumname || _.remark,
        /* 封面 */
        artwork: (_.album_sizable_cover || (_.info && _.info.image))?.replace("{size}", "480"),
        /* 音质 */
        qualities,
        /* 其他 */ // 支持自定义
        albumId: _.album_id, //专辑id
        // artistId, //歌手id
        vid: _.MvHash || _.mvhash, //视频id video
        // rid, //播客id radio

        hash: _.hash.toUpperCase(),
        album_audio_id: _.album_audio_id,
        MixSongID: _.MixSongID,
        MvID: _.MvID
    }
}



// 格式化歌单信息
function formatSheetItem(_) {
    return {
        /* 类型 */ // 2歌单
        type: "2",
        /* 歌单id */
        id: _.specialid || _.rankid || _.albumid || _.AuthorId,
        /* 标题 */
        title: _.specialname || _.rankname || _.albumname || _.title || _.AuthorName,
        /* 封面 */
        artwork: (_.img || _.flexible_cover || _.imgurl || _.Avatar)?.replace("{size}", "480"),
        /* 描述 */
        description: _.intro,
        /* 作品总数 */
        worksNum: _.song_count || _.songcount || (_.extra && _.extra.resp && _.extra.resp.all_total),
        /* 其他参数 */
        date: _.rank_id_publish_date || _.publish_time, // 更新时间
        tags: [], // 歌单标签
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
        id: _.AuthorId || _.singerid,
        /* 歌手名称 */
        name: _.AuthorName || _.singername,
        /* 作者名称 */
        // artist: title,
        /* 头像 */
        avatar: _.Avatar || _.imgurl,
        /* 简介 */
        // description,
        /* 作品总数 */
        worksNum: _.AudioCount || _.AlbumCount || _.songcount || undefined,
        /* 粉丝数 */
        // fans: _.FansNum,
        /* 其他参数 */
    };
}
// 随机返回字符串
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



// 拼接链接参数
function md5(data) {
    return CryptoJs.MD5(data)
        .toString(CryptoJs.enc.Hex);
}

function getParams(params, signkey, body, noSign) {
    if (noSign) return params.sort().join("&");
    body = body || "";
    params = params.sort();
    return params.join("&") + "&signature=" + md5(signkey + params.join("") + body + signkey);
}

// 1058加密
async function webSign(url, params, path = "data", page = 1) {
    let mid = new Date().getTime() + "";
    params = [
        "dfid=-",
        "mid=" + mid,
        "uuid=" + mid,
        "appid=1058",
        "srcappid=2919",
        "clientver=1000", // 11409
        "clienttime=" + mid,
        "pagesize=" + pageSize,
        "page=" + page,
        "userid=440908392",
        "token=f7524337c1ae877929a1497cf3d5d37e5c4cb8073fc298e492a67babc376a9d4",
        // "callback=callback123",
        // "bitrate=0",
        // "isfuzzy=0",
        // "inputtype=0",
        // "iscorrection=1",
        // "privilege_filter=0",
        // "platid=4",
        // "plat=0",
        // "filter=10",
        // "format=jsonp",
        // "version=8000",
    ].concat(params);
    let _res = (await axios_1.default.get(url + "?" + getParams(params, "NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt"), {
        headers: {
            'dfid': '-',
            'mid': mid,
            'clienttime': mid,
            "User-Agent": "Android712-AndroidPhone-10518-18-0-NetMusic-wifi",
            "KG-FAKE": "440908392", // userid
            "KG-THash": "3e5ec6b",
            "KG-Tid": "1",
            "KG-Rec": "1",
            "KG-RC": "1",
            "KG-RF": "00869891"
        }
    })).data;
    return _res[path] || {};
}




// 歌单分类
async function getRecommendSheetTags() {
    let pinned = [{
        title: "热门",
        data: [{
            title: "最新",
            id: " "
        }]
    }];
    let group = [];
    let _ = (await axios_1.default.get("http://www2.kugou.kugou.com/yueku/v9/special/getSpecial?is_smarty=1")).data;
    let __ = _.data.hotTag.data;
    for (let i in __) {
        pinned.push({
            title: __[i].special_name,
            id: __[i].special_id + ""
        });
    }
    _ = _.data.tagids;
    let i = 0;
    for (let name in _) {
        group[i] = {
            title: name,
            data: []
        }
        _[name].data.map(_ => {
            group[i].data.push({
                title: _.name,
                id: _.id + ""
            });
        });
        i++;
    }
    return {
        pinned: pinned,
        data: group,
    };
}



// 歌单列表
async function getRecommendSheetsByTag(tag, page) {
    let _, list, t1 = tag === null || tag === void 0 || (tag && tag.id);
    if (t1 === "" || t1 === true) { // 推荐
        _ = (await (0, axios_1.default)({
            url: "http://everydayrec.service.kugou.com/guess_special_recommend",
            method: "POST",
            data: {
                appid: 1001,
                clienttime: 1566798337219,
                clientver: 8275,
                key: 'f1f93580115bb106680d2375f8032d96',
                mid: '21511157a05844bd085308bc76ef3343',
                platform: 'pc',
                userid: '262643156',
                return_min: 6,
                return_max: 15,
            },
            headers: {
                'User-Agent': 'KuGou2012-8275-web_browser_event_handler'
            },
            xsrfCookieName: "XSRF-TOKEN",
            withCredentials: true,
        })).data || {};
        list = _.data.special_list;
    } else {
        _ = (await axios_1.default.get("http://www2.kugou.kugou.com/yueku/v9/special/getSpecial?is_ajax=1&cdn=cdn&t=5&pagesize=30&c=" + t1.trim() + "&p=" + page)).data;
        list = _.special_db;
    }
    return {
        isEnd: list.length < pageSize,
        data: list.map(formatSheetItem)
    }
}



// 歌单详情
async function getMusicSheetInfo(sheet, page = 1) {
    let _ = await webSign("https://mobiles.kugou.com/api/v5/special/song_v2", ['global_specialid=' + sheet.id, 'specialid=' + sheet.id], "data", page);
    let list1 = _.info;
    let list2 = await getMusicInfo(list1);
    list1 = list1.map((_, i) => Object.assign(list2[i], _));
    return {
        isEnd: list1.length < pageSize,
        musicList: list1.map(formatMusicItem)
    };
}



// 榜单列表
async function getTopLists() {
    let group = [null, "推荐", "新歌", "特色", "全球", "曲风"].map(title => {
        return {
            title: title,
            data: []
        }
    });
    let lists = (await axios_1.default.get("http://mobilecdnbj.kugou.com/api/v3/rank/list?version=9108&plat=0&showtype=2&parentid=0&apiver=6&area_code=1&withsong=0&with_res_tag=0")).data.data.info;
    lists.map(_ => {
        group[_.classify].data.push(formatToplistItem(_));
    });
    return group.slice(1);
}



// 榜单详情
async function getTopListDetail(topListItem, page = 1) {
    let _ = (
        await axios_1.default.get(`http://mobilecdnbj.kugou.com/api/v3/rank/song?version=9108&ranktype=0&plat=0&pagesize=${pageSize}&area_code=1&page=${page}&volid=35050&rankid=${topListItem.id}&with_res_tag=0`)
    ).data;
    let list1 = _.data.info;
    let list2 = await getMusicInfo(list1);
    list1 = list1.map((_, i) => Object.assign(list2[i], _));
    return {
        isEnd: ((page - 1) * pageSize + list1.length) >= _.data.total,
        musicList: list1.map(formatMusicItem),
    }
}



// 歌手详情
async function getArtistWorks(artistItem, page, type) {
    if (type === "music") {
        let _ = await webSign('https://gateway.kugou.com/openapi/kmr/v1/author/audios', ["author_id=" + artistItem.id], "data", page);
        let list1 = (_.songs || []).map(_ => _.audio_info);
        let list2 = await getMusicInfo(list1);
        list1 = list1.map((_, i) => Object.assign(list2[i], _));
        return {
            isEnd: ((page - 1) * pageSize + list1.length) >= _.total,
            data: list1.map(formatMusicItem),
        }
    } else {
        let res = (
            await axios_1.default.get(`http://mobilecdnbj.kugou.com/api/v3/singer/album?version=9108&plat=0&pagesize=${pageSize}&page=${page}&singerid=${artistItem.id}`)
        ).data;
        let list = res.data.info;
        return {
            isEnd: ((page - 1) * pageSize + list.length) >= res.data.total,
            data: list.map(formatAlbumItem),
        }
    }
}



// 专辑详情
async function getAlbumInfo(albumItem, page = 1) {
    let _ = await webSign("https://m3ws.kugou.com/api/v1/album/info", ["albumid=" + albumItem.id, "version=1000", "plat=5"], "data", page);
    let list1 = _.list;
    let list2 = await getMusicInfo(list1);
    list1 = list1.map((_, i) => Object.assign(list2[i], _));
    return {
        isEnd: ((page - 1) * pageSize + list1.length) >= _.songcount,
        albumItem: formatAlbumItem(_),
        musicList: list1.map(formatMusicItem),
    }
}



// 歌曲详情
async function getMusicInfo(resource) {
    let isObj = !Array.isArray(resource);
    if (isObj) {
        resource = [resource];
    }
    resource = resource.map(_ => ({
        "id": 0,
        "type": "audio",
        "hash": _.hash || _.FileHash || _.id,
        // album_audio_id: 0,
        // album_id: "0",
        // name: _.filename.replace(".mp3", ""),
        // page_id: 0,
    }));
    let body = JSON.stringify({
        "relate": 1,
        "userid": "2626431536",
        "vip": 1, // 0
        "token": "",
        // "userid": "0",
        "appid": 1001,
        "behavior": "play",
        "area_code": "1",
        "clientver": "8990", // 10112
        "need_hash_offset": 1,
        "resource": resource,
        // "dfid": "-",
        // "mid": R(32),
    });
    let _ = (await (0, axios_1.default)({
        url: [
            "http://media.store.kugou.com/v1/get_res_privilege",
            "https://gateway.kugou.com/v2/get_res_privilege/lite"
        ][1],
        method: "POST",
        data: body,
        headers: {
            'KG-THash': '13a3164',
            'KG-RC': '1',
            'KG-Fake': '0',
            'KG-RF': '00869891',
            'User-Agent': 'Android712-AndroidPhone-11451-376-0-FeeCacheUpdate-wifi',
            "x-router": "media.store.kugou.com"
        },
        xsrfCookieName: "XSRF-TOKEN",
        withCredentials: true,
    })).data || {};
    return isObj ? formatMusicItem(_.data[0]) : _.data;
}



// 播放链接
async function getMediaSource(musicItem, quality) {


    // 判断音质是否存在
    let hash = musicItem.qualities ?
        // 新版获取
        (musicItem.qualities[quality] && musicItem.qualities[quality].hash) :
        // 兼容旧版
        ({
            'low': musicItem.hash || musicItem.id,
            'standard': musicItem["320hash"],
            'high': musicItem.sqhash,
            'super': musicItem.origin_hash
        } [quality]);
    if (!hash) {
        return;
    }
    hash = String(hash).toLowerCase();


    let kgQuality = {
        'low': '128',
        'standard': '320',
        'hign': 'flac',
        'super': 'high'
    } [quality] || "128";
    let album_id = musicItem.albumId || musicItem.album_id || "0";
    let album_audio_id = musicItem.album_audio_id || "0";
    let date = new Date().getTime();
    let mid = R(32);
    let {
        userid,
        token,
        appid,
        signkey
    } = env && env.getUserVariables();
    userid = userid || "440908392";
    token = token || "f7524337c1ae877929a1497cf3d5d37e5c4cb8073fc298e492a67babc376a9d4";
    appid = appid || "1005";
    signkey = signkey || "OIlwieks28dk2k092lksi2UIkp";

    let params = [
        'quality=' + kgQuality,
        'hash=' + hash,
        'mid=' + mid,
        'appid=' + appid,
        'userid=' + userid,
        'key=' + md5(hash + "57ae12eb6890223e355ccfcb74edf70d" + appid + mid + userid),
        'album_id=' + album_id,
        'album_audio_id=' + album_audio_id,
        'clienttime=' + Math.floor(date / 1000),
        // 'open_time=' + $.dateFormat(date, 'yyyyMMdd'),
        'token=' + token,
        'area_code=1',
        'module=',
        'ssa_flag=is_fromtrack',
        'clientver=12029', //10518
        'vipType=6',
        'ptype=0',
        'auth=',
        'mtype=0',
        'behavior=play',
        'pid=2',
        'dfid=-',
        'pidversion=3001',
        'secret=' + R(32),
        // 'behavior=play',
        // 'version=9209',
        // 'cmd=26',
    ];
    // body_ = "http://trackercdngz.kugou.com/i/v2/?" + params.join("&");
    let body_ = (
        await axios_1.default.get("https://gateway.kugou.com/v5/url?" + getParams(params, signkey), {
            "headers": {
                "User-Agent": "Android800-AndroidPhone-12029-56-0-starlive-ctnet(13)",
                "KG-THash": "595ff94",
                "KG-FAKE": userid,
                "KG-Rec": "1",
                "KG-RC": "1",
                "x-router": "tracker.kugou.com"
            }
        })
    ).data;
    if (body_.status == 1) {
        let url = body_["url"][0];
        if (url && url != "") {
            return {
                url
            };
        }
    }
    // console.log("调用解析");
    return await getMediaProxys(musicItem, quality);
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
                            source: "kg",
                            songId: musicItem.hash || musicItem.id,
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
                    await axios_1.default.get(`https://musicapi.haitangw.net/music/kg_song_kw.php`, {
                        params: {
                            level: {
                                "low": "standard",
                                "standard": "exhigh",
                                "high": "lossless",
                                "super": "hires"
                            } [quality],
                            type: "json",
                            id: musicItem.hash || musicItem.id
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
                    await axios_1.default.get(`https://lxmusicapi.onrender.com/url/kg/${musicItem.hash || musicItem.id}/${ quality=="low"?"128k":"320k" }`, {
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



// 获取歌词
async function getLyric(musicItem) {
    let res = await axios_1.default.get(`http://m.kugou.com/app/i/krc.php?cmd=100&timelength=999999&hash=${musicItem.hash || musicItem.id}`);
    return {
        rawLrc: res.data
    }
}



// 实现搜索
async function search(query, page, type) {
    let _type = {
        "免费": {
            v: "v3",
            s: "song",
            p: "", // 没有platform=WebFilter只返回免费歌曲
            m: formatMusicItem
        },
        "music": {
            v: "v3",
            s: "song",
            p: "platform=WebFilter",
            m: formatMusicItem
        },
        "lyric": {
            v: "v1",
            s: "lyric",
            p: "platform=WebFilter",
            m: formatMusicItem
        },
        "sheet": {
            v: "v1",
            s: "special",
            p: "searchsong=1",
            m: formatSheetItem
        },
        "album": {
            v: "v1",
            s: "album",
            p: "searchsong=1",
            m: formatAlbumItem
        },
        "artist": {
            v: "v1",
            s: "author",
            p: "searchsong=1",
            m: formatArtistItem
        },
    } [type];
    let url = "https://gateway.kugou.com/complexsearch/" + _type.v + "/search/" + _type.s;
    let _ = await webSign(url, ["keyword=" + query, _type.p], "data", page);
    let list = _.lists || [];
    if (type == "music") {
        list = await getMusicInfo(list);
    }
    return {
        isEnd: ((page - 1) * pageSize + list.length) >= _.total,
        data: list.map(_type.m),
    }
}



// 导入酷狗码
async function importMusicSheet(urlLike) {
    let id = urlLike.match(/^(?:.*?)(\d+)(?:.*?)$/)?.[1];
    if (!id) {
        return false;
    }
    let res = await axios_1.default.post(`http://t.kugou.com/command/`, {
        appid: 1001,
        clientver: 9020,
        mid: "21511157a05844bd085308bc76ef3343",
        clienttime: 640612895,
        key: "36164c4015e704673c588ee202b9ecb8",
        data: id,
    });
    let musicList = [];
    if (res.status === 200 && res.data.status === 1) {
        let data = res.data.data;
        let response = await axios_1.default.post(`http://www2.kugou.kugou.com/apps/kucodeAndShare/app/`, {
            appid: 1001,
            clientver: 10112,
            mid: "70a02aad1ce4648e7dca77f2afa7b182",
            clienttime: 722219501,
            key: "381d7062030e8a5a94cfbe50bfe65433",
            data: {
                id: data.info.id,
                type: 3,
                userid: data.info.userid,
                collect_type: data.info.collect_type,
                page: 1,
                pagesize: data.info.count,
            },
        });
        if (response.status === 200 && response.data.status === 1) {
            musicList = await getMusicInfo(response.data.data);
            musicList = musicList.map(formatMusicItem);
            if (data.info.count > 500 && musicList.length == 500) {
                musicList = musicList.slice(0, 490);
                let count = Math.ceil((data.info.count - 500) / 30) + 17;
                for (let page = 16; page < count; page++) {
                    try {
                        let sheetItem = (await getMusicSheetInfo({
                            id: (data.info.global_collection_id || ("collection_3_" + data.info.userid + "_" + data.info.id + "_0"))
                        }, page));
                        musicList.push(...sheetItem.musicList);
                    } catch (err) {}
                }
            }
        }
    }
    return musicList;
}



// 匹配歌曲链接，返回歌曲详情
async function importMusicItem(urlLike) {
    let id;
    if (!urlLike.match(/kugou\./i) && !urlLike.match(/5sing\./i)) {
        return false;
    }
    if (!id) {
        id = (urlLike.match(/(hash=)([a-z0-9]+)/i) || [])[2];
    }
    if (!id) {
        return false;
    }
    return await getMusicInfo({
        hash: id
    });
}



// 格式化歌曲评论
function formatComment(_) {
    return {
        // 评论ID
        id: _.id,
        // 用户名
        nickName: _.user_name,
        // 头像
        avatar: _.user_pic,
        // 评论内容
        comment: _.content,
        // 点赞数
        like: _.like?.likenum,
        // 评论时间
        createAt: _.addtime,
        // 地址
        location: _.location,
        // 回复
        replies: [].map(formatComment),
        /* 其他参数 */
        type: "11" // 11评论
    };
}
// 获取歌曲评论
async function getMusicComments(musicItem, page = 1) {
    let hash = musicItem.hash || musicItem.id;
    let list = await webSign("http://m.comment.service.kugou.com/r/v1/rank/topliked", [
        "extdata=" + hash,
        "schash=" + hash,
        "p=" + page,
        "code=fc4be23b4e972707f36b8a828a93ba8a",
        "clienttoken=",
        "ver=10",
        "kugouid=0"
    ], "list", page);
    return {
        isEnd: list.length < pageSize,
        data: list.map(formatComment)
    }
}



// 返回函数
module.exports = {
    platform: "酷狗音乐",
    author: '反馈Q群@365976134',
    version: "2025.10.01",
    appVersion: ">0.4.0-alpha.0",
    srcUrl: "https://raw.githubusercontent.com/ThomasBy2025/musicfree/refs/heads/main/plugins/kg.js",
    cacheControl: "no-store",
    description: "## By: Thomas喲\n#### 版本: 2025.10.01  \n修复酷狗码导入的歌曲没有信息显示  \n修复酷狗码最多导入500首歌的问题  \n#### 版本: 2025.09.14  \n支持导入单曲，获取评论  \n设置用户变量，发现歌单  \n增加酷我渠道，修复解析  \n#### 音源重定向  \n支持的插件如下  \n酷狗音乐, 小枸音乐, 元力KG  \n#### Bug反馈  \n[点我加入反馈群](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=x8r6m0bYYon_pCgT0BRc1ohwZmkkY61Q&authKey=DpmUioCvx45WjRRBnbRT2DsJ7LL6DNY3uau%2BFKPgR%2FSKz4EgYqUjEU5tJNi%2BkNPl&noverify=0&group_code=365976134)  \n#### 支持作者  \n![支持作者](https://raw.githubusercontent.com/ThomasBy2025/hikerview/refs/heads/main/mm_facetoface_collect_qrcode_1757315185814.png)",
    hints: {
        importMusicSheet: [
            "仅支持酷狗APP通过酷狗码导入，输入纯数字酷狗码即可。",
            "导入时间和歌单大小有关，请耐心等待",
        ],
        importMusicItem: [
            "酷狗音乐：APP点击分享，然后复制链接",
            "链接需要有hash"
        ]
    },
    userVariables: [{
        key: "userid",
        name: "用户标识",
        hint: "userid"
    }, {
        key: "token",
        name: "登录数据",
        hint: "token"
    }, {
        key: "appid",
        name: "平台标识",
        hint: "appid"
    }, {
        key: "signkey",
        name: "验证密匙",
        hint: "signkey"
    }, {
        key: "ikun_key",
        name: "ikun音源卡密",
        hint: "key"
    }, {
        key: "source",
        name: "酷我渠道",
        hint: "source"
    }],
    primaryKey: ["id", "album_id", "album_audio_id"],
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
