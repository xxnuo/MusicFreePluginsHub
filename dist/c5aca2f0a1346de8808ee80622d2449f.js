"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const axios_1 = require("axios");
const pageSize = 30;
// 音质参数
const qualityMap = {
    "low": {
        s: "M500",
        e: ".mp3",
    },
    "standard": {
        s: "M800",
        e: ".mp3",
    },
    "high": {
        s: "F000",
        e: ".flac",
    },
    "super": {
        s: "RS01",
        e: ".flac",
    },

    "size_24aac": {},
    "size_48aac": {
        s: "C200",
        e: ".m4a",
    },
    "size_96aac": {
        s: "C400",
        e: ".m4a",
    },
    "size_192aac": {
        s: "C600",
        e: ".m4a",
    },
    "size_128mp3": {
        s: "M500",
        e: ".mp3",
    },
    "size_320mp3": {
        s: "M800",
        e: ".mp3",
    },
    "size_96ogg": {
        s: "O400",
        e: ".ogg",
    },
    "size_192ogg": {
        s: "O600",
        e: ".ogg",
    },
    "size_ape": {
        s: "A000",
        e: ".ape",
    },
    "size_flac": {
        s: "F000",
        e: ".flac",
    },
    "size_hires": {
        s: "RS01",
        e: ".flac",
    },
    "size_new[2]": { // 杜比全景声?
        s: "Q001",
        e: ".flac",
    },
    "size_new[1]": { // 臻品全景声?
        s: "Q000",
        e: ".flac",
    },
    "size_new[0]": { // 臻品母带2.0
        s: "AI00",
        e: ".flac",
    },
    "size_360ra": {},
    "size_dolby": {},
    "size_dts": {},
    "size_try": { // 试听接口
        s: "RS02",
        e: ".mp3",
    }
};
// 获取 "登录" 信息
function getLogin() {
    let {
        uin,
        qm_keyst
    } = env && env.getUserVariables();
    let _a = String(qm_keyst).split(/qm_keyst=/i);
    qm_keyst = (_a[1] || _a[0]).split(/;|&|\n/i)[0];
    let _b = String(uin).split(/uin=/i);
    uin = (_b[1] || _b[0]).split(/;|&|\n/i)[0];
    if (!qm_keyst || !uin || !(qm_keyst.includes('W_X') || qm_keyst.includes('Q_H_L'))) {
        qm_keyst = false;
        uin = 0;
    } else {
        uin = Number(uin);
    }
    return {
        isLogin: uin && qm_keyst && true,
        qm_keyst,
        uin
    }
};
// 基础参数
function getComm(headerx = {}, isHead) {
    let ct = 11;
    let {
        uin,
        qm_keyst
    } = getLogin();
    let cv = uin || 948168827; // 0
    let tk = qm_keyst || "Q_H_L_5FBMRs-uicpIQo8Ymt3v0w1f0DAyJwQMdLJPVKmmOQZRQZkuz8AfB1Q";
    let headers = Object.assign({
        "Referer": "https://y.qq.com/",
        "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)",
        "Cookie": "qm_keyst=" + tk + "; uin=" + cv
    }, headerx || {});
    if (isHead) {
        return headers
    }
    return {
        headers,
        params: {
            comm: { // 基础信息
                "cv": cv + "",
                "ct": ct + "",
                "format": "json",
                "inCharset": "utf-8",
                "outCharset": "utf-8",
                "notice": 0,
                "platform": "yqq.json", // wk_v15.json, h5
                "needNewCode": 1,
                "uin": cv,
                "g_tk_new_20200303": cv,
                "g_tk": cv,


                // APP信息相关？
                "tmeAppID": "qqmusiclight", // qqmusic
                "nettype": 'NETWORK_WIFI', // 网络状态？
                "tmeLoginType": "2", // 1-微信，2-QQ？
                "devicelevel": "31", // 装置等级？
                "os_ver": ct, // 系统版本
                "v": cv + "",


                // 账号信息相关？
                "qq": cv + "", // qq号
                "authst": tk, // 未知
                "tmeLoginMethod": "1",
                "fPersonality": "0",
                "phonetype": '0',
            }
        }
    }
};
// post请求
async function ajax(data = {}, headerx = {}) {
    let {
        headers,
        params
    } = getComm(headerx);
    let body = function(body) {
        if (data.method == "CgiGetVkey") {
            delete body.comm.tmeAppID;
        }
        if (data.req_1 != undefined) {
            body = Object.assign(data, body);
        } else {
            body.data = data;
        }
        return JSON.stringify(body)
    }(params);
    body = (await (0, axios_1.default)({
        url: "https://u6.y.qq.com/cgi-bin/musicu.fcg",
        method: "POST",
        data: body,
        headers: headers,
        xsrfCookieName: "XSRF-TOKEN",
        withCredentials: true,
    })).data || {};
    if (!data.req_1) {
        body = body.data || {};
    }
    return body.data || {};
}





// 歌曲信息
function formatMusicItem(__) {
    let _ = __.songInfo || __;
    let f = _.file;
    let name = _.name || _.songname || _.title || _.mvname;
    let singer = (_.singer && _.singer.map(_ => _.name).join('&')) || _.singername || "";
    let songId = _.mid || _.songmid;
    let albumName = _.albumname || (_.album && (_.album.name || _.album.title)) || _.uploader_nick;
    let albumId = _.albummid || (_.album && _.album.mid) || "";
    let picUrl = (albumId && `T002 _ ${albumId}`) || (_.vs && _.vs[1] && `T062 _ ${_.vs[1]}`) || _.pic || "";
    if (picUrl != "") picUrl = _.pic || ("https://y.gtimg.cn/music/photo_new/" + picUrl.replace(" _ ", "R500x500M000") + ".jpg");
    let qualities = {};
    for (let k of ['128mp3', '320mp3', 'flac', 'hires']) {
        if (f['size_' + k]) {
            let t = {
                '128mp3': "low",
                '320mp3': "standard",
                'flac': "high",
                'hires': "super"
            } [k];
            qualities[t] = {};
            qualities[t].size = f['size_' + k];
            // qualities[t].url = "";
        }
    }
    return {
        /* 类型 */ // 0免费 1会员
        type: String(_.pay.payplay || _.pay.pay_play || "0"),
        /* 歌曲在平台的唯一编号 */
        id: String(_.id || _.songid || "") || undefined,
        mid: songId,
        /* 作者 */
        artist: singer.replace(/<\/?em>/g, ""),
        /* 标题 */
        title: name,
        /* 别名 */
        // alias: "",
        /* 时长(s) */
        duration: _.interval || _.duration,
        /* 专辑名 */
        album: albumName,
        /* 专辑封面图 */
        artwork: picUrl,
        /* 音质信息 */
        qualities,
        /* 其他信息 */
        songmid: songId,
        strMediaMid: f.media_mid,
        albumid: _.albumid || (_.album && _.album.id),
        albummid: albumId,
        vid: _.vid || (_.mv && _.mv.vid),

        /* 默认音源 */
        // url: `http://music.163.com/song/media/outer/url?id=${songId}.mp3`
        /* 音源 */
        // source?: Partial<Record<IQualityKey, IMediaSource>>

        rawLrc: _.lyric,
        rawLrcTxt: _.content
    }
}

// 格式化歌单信息
function formatSheetItem(__) {
    let _ = __.dirinfo || __;
    return {
        /* 类型 */ // 2歌单
        type: "2",
        /* 歌单id */
        id: _.topId || _.dissid || _.tid,
        /* 标题 */
        title: String(_.dissname || _.title || _.name || "").replace(/<\/?em>/gi, ""),
        /* 作者 */
        artist: _.nickname || _.host_nick || (_.creator && _.creator.name),
        /* 封面图 */
        // coverImg: "",
        artwork: _.imgurl || _.cover_url_big || _.cover_url_medium || _.cover_url_small || (_.cover && (_.cover.big_url || _.cover.medium_url || _.cover.small_url)) || _.logo || _.pic || _.picurl,
        /* 描述 */
        description: _.introduction || _.intro || _.desc,
        /* 作品总数 */
        worksNum: _.song_count || _.songnum || _.total_song_num || _.totalNum,
        /* 其他参数 */
        date: _.updateTime || _.createtime || _.createTime || (_.ctime * 1000), // 更新时间
        tags: [], // 歌单标签
        playCount: _.listennum, // 播放数
    };
}

// 格式化榜单信息
function formatToplistItem(__) {
    let _ = formatSheetItem(__);
    _.type = "3" // 3榜单
    _.coverImg = __.headPicUrl || __.frontPicUrl || __.mbHeadPicUrl;
    return _;
}

// 格式化专辑信息
function formatAlbumItem(_) {
    _ = _.songInfo || _;
    let albumMID = _.albumMid || _.albumMID || _.album_mid || _.albummid;
    return {
        /* 类型 */ // 4专辑
        type: "4",
        /* 标识 */
        id: _.albumID || _.albumid || _.id,
        /* 标识2 - 优先获取✩ */
        mid: albumMID,
        /* 标题 */
        title: _.albumName || _.album_name || _.name,
        /* 作者 */
        artist: String(_.singerName || _.singer_name || _.singer || "").replace(/<\/?em>/gi, ""),
        /* 封面 */
        artwork: _.albumPic || (albumMID && `https://y.gtimg.cn/music/photo_new/T002R500x500M000${albumMID}.jpg`) || _.pic,
        /* 描述 */
        description: _.desc || _.description,
        /* 作品总数 */
        worksNum: _.musicSize || _.song_count,
        /* 其他参数 */
        date: _.publicTime || _.pub_time || _.publish_date, // 更新时间

        singerID: _.singerID || _.singer_id,
        singerMID: _.singerMID || _.singer_mid,
        albumMID: albumMID,
    };
}

// 格式化歌手信息
function formatArtistItem(_) {
    return {
        /* 类型 */ // 5歌手
        type: "5",
        /* 歌手id */
        id: _.id || _.singerID || _.singer_id,
        /* 标识2 - 优先获取✩ */
        mid: _.singerMID || _.singer_mid,
        /* 歌手名称 */
        name: _.dissname || _.name || _.singerName || _.singer_name,
        /* 作者名称 */
        // artist: _.dissname || _.name || _.singerName,
        /* 头像 */
        avatar: _.logo || _.pic || _.singerPic || _.singer_pic,
        /* 简介 */
        description: _.briefDesc || _.description,
        /* 作品总数 */
        worksNum: _.songNum,
        /* 粉丝数 */
        // fans: 0,
        /* 其他参数 */
        singerMID: _.singerMID || _.singer_mid,
    };
}



// 歌单分类
async function getRecommendSheetTags() {
    let group1, group2 = [];
    let group3 = await ajax({
        module: "music.playlist.PlaylistSquare",
        method: "GetAllTag",
        param: {}
    });
    group3.v_group.map(_ => {
        if (_.group_id) {
            let name = _.group_name.replace('热门', '推荐').replace("流派", "风格");
            let group4 = [];
            (_.v_item || []).map(_ => {
                group4.push({
                    title: _.name.replace("歌单", ""),
                    id: _.id
                });
            });
            if (name == '推荐') {
                group4.push({
                    title: '最新',
                    id: 'new'
                }, {
                    title: '最热',
                    id: 'hot'
                }, {
                    title: '免费',
                    id: 3418
                });
                group1 = group4;
            } else {
                group2.push({
                    title: name,
                    data: group4
                });
            }
        }
    });
    return {
        pinned: group1,
        data: group2,
    };
}



// 歌单列表
async function getRecommendSheetsByTag(tag, page) {
    let _, t1 = tag === null || tag === void 0 || (tag && tag.id);
    if (t1 === "" || t1 === true) { // 推荐
        _ = await ajax({
            module: "music.playlist.PlaylistSquare",
            method: "GetRecommendWhole",
            param: {
                IsReqFeed: true,
                FeedReq: {
                    From: (page - 1) * pageSize,
                    Size: pageSize
                }
            }
        }, {
            Cookie: ""
        });
    } else if (t1 == 9527) { // ai
        _ = await ajax({
            module: 'music.playlist.AiPlCategory',
            method: 'get_ai_category_content',
            param: {
                category_id: 9527,
                size: pageSize,
                page: (page - 1),
                use_page: page
            }
        });
    } else if (t1 == 'new' || t1 == 'hot') { // 最新/最热
        _ = await ajax({
            module: 'playlist.PlayListPlazaServer',
            method: 'get_playlist_by_tag',
            param: {
                id: 10000000,
                sin: (page - 1) * pageSize,
                size: pageSize,
                order: t1 == 'new' ? 2 : 5,
                cur_page: page
            }
        });
    } else {
        _ = await ajax({
            module: 'playlist.PlayListCategoryServer',
            method: 'get_category_content',
            param: {
                titleid: +t1,
                caller: '0',
                category_id: +t1,
                size: pageSize,
                page: page - 1,
                use_page: 1,
            }
        });
    }
    _ = _.FeedRsp || _.content || _;
    let list1 = _.list || _.List || _.v_item || _.v_playlist || [];
    let list2 = [];
    let total1 = page * pageSize;
    let total2 = _.sum || _.total || _.total_cnt || _.FromLimit || (total1 - pageSize + list.length);

    list1.map(_ => {
        _ = _.Playlist ? _.Playlist.basic : _.basic || _;
        list2.push(formatSheetItem(_));
    });
    return {
        isEnd: total2 <= total1,
        data: list2,
    };
}



// 歌单详情
async function getMusicSheetInfo(sheet, page = 1) {
    let total1 = page * pageSize;
    let _ = await ajax({
        module: "music.srfDissInfo.aiDissInfo",
        method: "uniform_get_Dissinfo",
        param: {
            "disstid": +sheet.id,
            "enc_host_uin": "",
            "tag": 1,
            "userinfo": 1,
            "song_begin": total1 - pageSize,
            "song_num": pageSize,
            // "orderlist": 1,
            // "onlysonglist": 0,
        }
    });
    let musicList = _.songlist || [];
    let total2 = _.songnum || _.total_song_num || (total1 - pageSize + musicList.length);
    if (musicList.length == total2) total2 = 1;
    return {
        isEnd: total2 <= total1,
        musicList: musicList.map(formatMusicItem)
    };
}



// 排行分类
async function getTopLists() {
    let group1 = [];
    let group2 = await ajax({
        module: "musicToplist.ToplistInfoServer",
        method: "GetAll",
        param: {}
    });
    group2.group.map(_ => {
        let group3 = [];
        _.toplist.map(__ => {
            if (!/MV|畅销|有声/.test(__.title)) {
                group3.push(formatToplistItem(__));
            }
        });
        group1.push({
            title: _.groupName,
            data: group3
        });
    });
    return group1;
}



// 排行详情
async function getTopListDetail(topListItem, page = 1) {
    let _ = await ajax({
        module: "musicToplist.ToplistInfoServer",
        method: "GetDetail",
        param: {
            "topId": +topListItem.id,
            "offset": (page - 1) * pageSize,
            "num": pageSize,
            "period": ""
        }
    });
    return Object.assign(Object.assign({}, topListItem), {
        isEnd: _.data.totalNum <= page * pageSize,
        musicList: _.songInfoList
            .map(formatMusicItem)
    });
}



// 获取歌手详情
async function getArtistWorks(artistItem, page, type) {
    let param, order = type === "music" ? 1 : 0;
    if (order) {
        param = {
            module: "musichall.song_list_server",
            method: "GetSingerSongList"
        }
    } else {
        param = {
            module: "music.musichallAlbum.AlbumListServer",
            method: "GetAlbumList"
        }
    }
    param.param = {
        "singerMid": artistItem.singerMID,
        "order": order,
        "begin": (page - 1) * pageSize,
        "num": pageSize,
        // "songNumTag": 0,
        // "singerID": 0
    }
    let _ = await ajax(param);
    let list = _[order ? "songList" : "albumList"] || [];
    let total1 = page * pageSize;
    let total2 = _.totalNum || _.total || (total1 - pageSize + list.length);
    if (order) {
        list = list.map(formatMusicItem);
    } else {
        list = list.map(formatAlbumItem);
    };
    return {
        isEnd: total2 <= total1,
        // artistItem: formatArtistItem(res.artist),
        data: list
    };
}



// 获取专辑详情
async function getAlbumInfo(albumItem) {
    let _ = await ajax({
        module: "music.musichallAlbum.AlbumSongList",
        method: "GetAlbumSongList",
        param: {
            "albumMid": albumItem.albumMID,
            "order": 2,
            "begin": 0,
            "num": -1
        },
    });
    return {
        isEnd: true,
        // albumItem: formatAlbumItem(res.album),
        musicList: (_.songList || []).map(formatMusicItem),
    };
}



// 获取歌曲详情
async function getMusicInfo(musicItem) {
    let _ = await ajax({
        module: 'music.pf_song_detail_svr',
        method: 'get_song_detail_yqq',
        param: {
            song_mid: musicItem.songmid
        }
    });
    return formatMusicItem(_.track_info);
}



// 格式化歌曲评论
function formatComment(_) {
    return {
        // 评论ID
        id: _.CmId,
        // 用户名
        nickName: _.Nick,
        // 头像
        avatar: _.Avatar,
        // 评论内容
        comment: _.Content,
        // 点赞数
        like: _.PraiseNum,
        // 评论时间
        createAt: _.PubTime * 1000,
        // 地址
        location: undefined,
        // 回复
        replies: (_.SubComments || []).map(formatComment),
        /* 其他参数 */
        type: "11" // 11评论
    };
}
// 获取歌曲评论
async function getMusicComments(musicItem, page = 1) {
    let res = await ajax({
        "method": "GetHotCommentList",
        "module": "music.globalComment.CommentRead",
        "param": {
            "BizId": String(musicItem.id),
            "BizType": 1,
            "HotType": 1,
            "LastCommentSeqNo": "",
            "PageNum": page - 1,
            "PageSize": 10,
            "PicEnable": 1,
            "WithAirborne": 0
        }
    })
    // console.log(res);
    let list = res.CommentList.Comments;
    return {
        isEnd: list.length < 10,
        data: list.map(formatComment)
    }
}



// 获取歌词
async function getLyric(musicItem) {
    let res = (
        await axios_1.default.get(`http://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?songmid=${musicItem.songmid}&pcachetime=${new Date().getTime()}&g_tk=5381&loginUin=0&hostUin=0&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&format=json&nobase64=1`, {
            headers: getComm({}, true)
        })
    ).data;
    return {
        rawLrc: res.lyric,
    };
}



// 匹配歌单链接，返回歌曲列表
async function importMusicSheet(urlLike) {
    let id = (urlLike.match(/^(\d+)$/) || [])[1];
    if (!urlLike.match(/y\.qq\.com|(music|wx\.y)\.gtimg\.cn/i)) {
        return false;
    }
    if (!id) {
        id = (urlLike.match(/.*(\/details\/.*id=|\/playlist\/|playlist_v2.*?[\?&]id=)(\d+)/i) || [])[2];
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



// 匹配歌曲链接，返回歌曲详情
async function importMusicItem(urlLike) {
    let id;
    if (!urlLike.match(/y\.qq\.com|(music|wx\.y)\.gtimg\.cn/i)) {
        return false;
    }
    if (!id) {
        id = (urlLike.match(/[\/\?\&]song(Detail\/|mid\=|\/)([a-z0-9]+)/i) || [])[2];
    }
    if (!id) {
        return false;
    }
    return await getMusicInfo({
        songmid: id
    });
}



// 搜索内容
async function search(query, page, type) {
    let _type = {
        music: {
            type: 0,
            path: "item_song",
            mapJs: formatMusicItem
        },
        album: {
            type: 2,
            path: "item_album",
            mapJs: formatAlbumItem
        },
        sheet: {
            type: 3,
            path: "item_songlist",
            mapJs: formatSheetItem
        },
        artist: {
            type: 1,
            path: "singer",
            mapJs: formatArtistItem
        },
        lyric: {
            type: 7,
            path: "item_song",
            mapJs: formatMusicItem
        }
    } [type];
    let _ = await ajax({
        module: "music.search.SearchCgiService",
        method: "DoSearchForQQMusicLite", // DoSearchForQQMusicDesktop
        param: {
            // "remoteplace": "txt.yqq.top", // txt.mqq.all
            // "searchid": R(17,"1234567890"),
            "query": query,
            "search_type": _type.type,
            "num_per_page": pageSize,
            "page_num": page,
            "nqc_flag": 0,
            "grp": 1
        }
    });

    let list = _.body[_type.path] || [];
    let total1 = page * pageSize;
    let total2 = _.meta.sum || (total1 - pageSize + list.length);
    return {
        isEnd: total2 <= total1,
        data: list.map(_type.mapJs)
    };
}





// 获取链接
async function getMediaSource(musicItem, quality) {
    // 获取歌曲支持的最大音质
    if (!musicItem.qualities[quality]) {
        return false
    }

    let {
        uin,
        isLogin
    } = getLogin();
    let url, rawLrc, artwork;
    try {
        if (!isLogin && musicItem.type == "1") {
            throw new Error('is vip music');
        }
        let guid = (Math.random() * 10000000).toFixed(0);
        let songId = musicItem.songmid;
        let strMediaMid = musicItem.strMediaMid; // songId | vs[4] | vs[3]
        let id = ""; // songId
        let typeObj = qualityMap[quality];
        let filename = `${typeObj.s}${id}${strMediaMid}${typeObj.e}`;
        let __ = await ajax({
            module: "vkey.GetVkeyServer", // music.vkey.GetVkey
            method: "CgiGetVkey", // GetUrl
            param: {
                "guid": String(guid),
                "platform": "20",
                "filename": [filename],
                "songmid": [songId],
                "songtype": [0],
                "uin": uin || "",
                "loginflag": 1
            }
        });
        url = __.midurlinfo[0].purl;
        if (url && url != "") {
            return {
                url: __.sip[0] + url
            }
        } else {
            throw new Error('no get purl');
        }
    } catch (isVipMusic) { // 没有登录 / 登录过期 / 没有会员
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
                            source: "tx",
                            songId: musicItem.songmid,
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
                    await axios_1.default.get(`https://music.haitangw.cc/music/qq_song_kw.php`, {
                        params: {
                            level: {
                                "low": "standard",
                                "standard": "exhigh",
                                "high": "lossless",
                                "super": "hires"
                            } [quality],
                            type: "json",
                            id: musicItem.songmid
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
                    await axios_1.default.get(`https://lxmusicapi.onrender.com/url/tx/${musicItem.songmid}/${ quality=="low"?"128k":"320k" }`, {
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



// 返回函数
module.exports = {
    platform: "腾讯音乐",
    author: '反馈Q群@365976134',
    version: "2025.09.13",
    appVersion: ">0.4.0-alpha.0",
    srcUrl: "https://raw.githubusercontent.com/ThomasBy2025/musicfree/refs/heads/main/plugins/tx.js",
    cacheControl: "no-store",
    description: "## By: Thomas喲  \n#### 版本: 2025.09.13  \n支持导入单曲，获取评论  \n增加酷我渠道，修复解析  \n#### 音源重定向  \n支持的插件如下  \n腾讯音乐, QQ音乐, 小秋音乐, 元力QQ  \n#### Bug反馈  \n[点我加入反馈群](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=x8r6m0bYYon_pCgT0BRc1ohwZmkkY61Q&authKey=DpmUioCvx45WjRRBnbRT2DsJ7LL6DNY3uau%2BFKPgR%2FSKz4EgYqUjEU5tJNi%2BkNPl&noverify=0&group_code=365976134)  \n#### 支持作者  \n![支持作者](https://raw.githubusercontent.com/ThomasBy2025/hikerview/refs/heads/main/mm_facetoface_collect_qrcode_1757315185814.png)",
    hints: {
        importMusicSheet: [
            "QQ音乐APP：自建歌单-分享-分享到微信好友/QQ好友；然后点开并复制链接，直接粘贴即可",
            "H5：复制URL并粘贴，或者直接输入纯数字歌单ID即可",
            "导入时间和歌单大小有关，请耐心等待",
        ],
        importMusicItem: [
            "QQ音乐：APP点击分享，然后复制链接",
            "链接需要有songmid"
        ]
    },
    userVariables: [{
        key: "uin",
        name: "用户标识",
        hint: "uin"
    }, {
        key: "qm_keyst",
        name: "用户数据",
        hint: "qm_keyst"
    }, {
        key: "ikun_key",
        name: "ikun音源卡密",
        hint: "key"
    }, {
        key: "source",
        name: "酷我渠道",
        hint: "source"
    }],
    primaryKey: ['id', 'songmid'],
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