"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const dayjs = require("dayjs");
function formatMusicItem(_) {
    return {
        id: _.id ?? _.trackId,
        artist: _.nickname,
        title: _.title,
        album: _.albumTitle,
        duration: _.duration,
        artwork: _.coverPath?.startsWith("//")
            ? `https:${_.coverPath}`
            : _.coverPath,
    };
}
function formatAlbumItem(_) {
    return {
        id: _.albumId ?? _.id,
        artist: _.nickname,
        title: _.title,
        artwork: _.coverPath?.startsWith("//")
            ? `https:${_.coverPath}`
            : _.coverPath,
        description: _.intro ?? _.description,
        date: _.updatedAt ? dayjs(_.updatedAt).format("YYYY-MM-DD") : null,
    };
}
function formatArtistItem(_) {
    return {
        name: _.nickname,
        id: _.uid,
        fans: _.followersCount,
        description: _.description,
        avatar: _.logoPic,
        worksNum: _.tracksCount,
    };
}
function paidAlbumFilter(raw) {
    return !raw.priceTypes?.length;
}
function paidMusicFilter(raw) {
    return raw.tag === 0 || raw.isPaid === false || parseFloat(raw.price) === 0;
}
async function searchBase(query, page, core) {
    return (await axios_1.default.get("https://www.ximalaya.com/revision/search/main", {
        params: {
            kw: query,
            page: page,
            spellchecker: true,
            condition: "relation",
            rows: 20,
            device: "iPhone",
            core,
            paidFilter: true,
        },
    })).data;
}
async function searchMusic(query, page) {
    const res = (await searchBase(query, page, "track")).data.track;
    return {
        isEnd: page >= res.totalPage,
        data: res.docs.filter(paidMusicFilter).map(formatMusicItem),
    };
}
async function searchAlbum(query, page) {
    const res = (await searchBase(query, page, "album")).data.album;
    return {
        isEnd: page >= res.totalPage,
        data: res.docs.filter(paidAlbumFilter).map(formatAlbumItem),
    };
}
async function searchArtist(query, page) {
    const res = (await searchBase(query, page, "user")).data.user;
    return {
        isEnd: page >= res.totalPage,
        data: res.docs.map(formatArtistItem),
    };
}
async function getAlbumInfo(albumItem, page = 1) {
    const res = await axios_1.default.get("https://www.ximalaya.com/revision/album/v1/getTracksList", {
        params: {
            albumId: albumItem.id,
            pageNum: page,
            pageSize: 50,
        },
    });
    return {
        isEnd: page * 50 >= res.data.data.trackTotalCount,
        albumItem: {
            worksNum: res.data.data.trackTotalCount
        },
        musicList: res.data.data.tracks.filter(paidMusicFilter).map((_) => {
            const r = formatMusicItem(_);
            r.artwork = albumItem.artwork;
            r.artist = albumItem.artist;
            return r;
        }),
    };
}
async function search(query, page, type) {
    if (type === "music") {
        return searchMusic(query, page);
    }
    else if (type === "album") {
        return searchAlbum(query, page);
    }
    else if (type === 'artist') {
        return searchArtist(query, page);
    }
}
async function getMediaSource(musicItem, quality) {
    if (quality !== "standard") {
        return;
    }
    const data = await axios_1.default.get("https://www.ximalaya.com/revision/play/v1/audio", {
        params: {
            id: musicItem.id,
            ptype: 1,
        },
        headers: {
            referer: `https://www.ximalaya.com/sound/${musicItem.id}`,
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.61",
        },
    });
    return {
        url: data.data.data.src,
    };
}
async function getArtistWorks(artistItem, page, type) {
    if (type === "music") {
        const res = (await axios_1.default.get("https://www.ximalaya.com/revision/user/track", {
            params: {
                page,
                pageSize: 30,
                uid: artistItem.id,
            },
        })).data.data;
        return {
            isEnd: res.page * res.pageSize >= res.totalCount,
            data: res.trackList.filter(paidMusicFilter).map((_) => ({
                ...formatMusicItem(_),
                artist: artistItem.name,
            })),
        };
    }
    else {
        const res = (await axios_1.default.get("https://www.ximalaya.com/revision/user/pub", {
            params: {
                page,
                pageSize: 30,
                uid: artistItem.id,
            },
        })).data.data;
        return {
            isEnd: res.page * res.pageSize >= res.totalCount,
            data: res.albumList.filter(paidAlbumFilter).map((_) => ({
                ...formatAlbumItem(_),
                artist: artistItem.name,
            })),
        };
    }
}
async function getTopLists() {
    const resHost = (await axios_1.default.get(`
    https://m.ximalaya.com/revision/rank/v4/element?rankingId=100006`)).data;
    const Host = {
        title: "热榜",
        data: resHost.data.rankList[0].albums.map((_) => {
            return {
                id: _.id,
                title: _.albumTitle,
                description: _.description,
                coverImg: `https://imagev2.xmcdn.com/${_.cover}!op_type=3&columns=144&rows=144&magick=webp`
            };
        }),
    };
    return [Host];
}
async function getTopListDetail(topListItem) {
    const res = (await axios_1.default.get(`https://m.ximalaya.com/m-revision/common/album/queryAlbumTrackRecordsByPage?albumId=${topListItem.id}&page=1&pageSize=100&asc=true`)).data;
    return {
        ...topListItem,
        musicList: res.data.trackDetailInfos.map(_ => {
            return {
                id: _.id,
                albumId: _.trackInfo.albumId,
                title: _.trackInfo.title,
            };
        }),
    };
    console.log(res);
}
module.exports = {
    platform: "喜马拉雅",
    version: "0.1.20",
    order: 10,
    srcUrl: "http://adad23u.appinstall.life/dist/xmly/index.js",
    cacheControl: "no-cache",
    search,
    getAlbumInfo,
    getMediaSource,
    getArtistWorks,
    getTopLists,
    getTopListDetail
};
