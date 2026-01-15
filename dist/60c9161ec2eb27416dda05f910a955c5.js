"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const axios_1 = require("axios");
const picUrl = "data:image/png;base64,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";



// 获取用户变量
function getUserVariables() {
    let {
        owner,
        repo,
        token
    } = env && env.getUserVariables();
    return {
        owner: owner || 'ikun_0014', // Gitcode用户名
        repo: repo || 'music', // 仓库名
        token: token || 'WzsER9knWNgC_4tjeJCtHKcN' // 访问令牌
    }
}



// 获取gitcode链接
function getGitcodeUrl(relativePath = "audio_database.json") {
    let GITCODE_CONFIG = getUserVariables();
    let encodedPath = encodeURIComponent(relativePath.replace(/\\/g, '/'))
    return `https://api.gitcode.com/api/v5/repos/${GITCODE_CONFIG.owner}/${GITCODE_CONFIG.repo}/raw/${encodedPath}?access_token=${GITCODE_CONFIG.token}`;
};



// 格式化歌曲信息
function formatMusicItem(_ = {}) {
    return {
        /* 歌曲在平台的唯一编号 */
        id: _.relative_path,
        /* 作者 */
        artist: _.artist || '未知歌手',
        /* 标题 */
        title: _.title || extractNameFromFile(_.filename),
        /* 专辑名 */
        album: _.album || '未知专辑',
        /* 专辑封面图 */
        artwork: _.img,
        /* 音质信息 */
        qualities: getTypes(_),
        /* 音源直链 */
        url: _.download_url,
        /* 歌词文本 */
        rawLrc: _.lyrics,
        /* 其他信息 */
        // source: 'git',
        _gitcodeData: _,
    }
}



// 从文件名提取歌曲名
function extractNameFromFile(filename) {
    if (!filename) return '未知歌曲'
    // 移除扩展名
    let name = filename.replace(/\.[^.]+$/, '')
    // 尝试提取歌曲名（处理常见格式：歌手 - 歌名）
    let match = name.match(/^(?:.*?[-–—]\s*)?(.+)$/)
    return match ? match[1].trim() : name
}



// 根据格式判断音质
function getTypes(item) {
    let types = {};
    let format = item.format?.toLowerCase();
    if (format == 'flac') {
        types.high = {
            // type: 'flac',
            size: item.filesize,
            url: item.download_url
        }
    } else if (format == 'mp3') {
        types.standard = {
            // type: '320k',
            size: item.filesize,
            url: item.download_url
        };
    } else if (format == 'm4a' || format == 'mp4') {
        types.low = {
            // type: '128k',
            size: item.filesize,
            url: item.download_url
        }
    } else {
        types.low = {
            // type: '128k',
            size: item.filesize,
            url: item.download_url
        }
    }
    return types
}



// 歌单分类
async function getRecommendSheetTags() {
    return {};
}



// 歌单列表
async function getRecommendSheetsByTag(tag, page) {
    return {
        isEnd: true,
        data: [{
            /* 歌单id */
            id: "ikun_0014",
            /* 标题 */
            title: "只音歌单",
            /* 作者 */
            artist: "ikun_0014",
            /* 封面图 */
            // coverImg: "",
            artwork: picUrl,
            /* 描述 */
            description: "下架歌曲整理",
            /* 作品总数 */
            // worksNum: "未知",
            /* 其他参数 */
        }]
    };
}



// 歌单详情
async function getMusicSheetInfo(sheet, page = 1) {
    let list = (
        await axios_1.default.get(getGitcodeUrl())
    ).data;
    // console.log(getGitcodeUrl());
    return {
        isEnd: true,
        musicList: list.map(formatMusicItem)
    };
}



// 搜索歌曲
async function search(query, page, type) {
    let list = (await getMusicSheetInfo()).musicList;
    // 一个简易的模糊搜索正则
    let regex = new RegExp(`(${query.split('').map(char => `.*${char}.*`).join('|')})`, 'i');
    return {
        isEnd: true,
        data: list.filter(item => (
            regex.test(item.artist) ||
            regex.test(item.title) ||
            regex.test(item.album)
        ))
    };
}



// 返回函数
module.exports = {
    platform: "GitCode",
    author: '反馈Q群@365976134',
    version: "2025.08.26",
    srcUrl: "https://raw.githubusercontent.com/ThomasBy2025/musicfree/refs/heads/main/plugins/git.js",
    cacheControl: "no-cache",
    description: "## By: Thomas喲  \n#### 版本: 2025.08.26  \n提取自[ikun音乐](https://qun.qq.com/universal-share/share?ac=1&authKey=X9rKU4LnqTSc9LZowxAB%2FCM0FLxNsXqi7cetlgvOdrKlqSQl1jItUipSr7Z1Gfzc&busi_data=eyJncm91cENvZGUiOiI5NzA1ODY4NjQiLCJ0b2tlbiI6IkJSRnN0aFB5UE9WcXJaT2tGNjRLWHh3K1RKeVlNUll3emdIV0s0dEl2bVI3Um1VY3hZY2pIWkhnMzdUejNwZHgiLCJ1aW4iOiIxNTg1NTY4ODY1In0%3D&data=ksdi6vWGXCAjnTuhNbpEzbDSq6XiiKLhiXa3PqNP0oWWZY_CQ80ozmyZmw-uHdrz6qjDvvMcfohuEdAzheH98g&svctype=4&tempid=h5_group_info)，一些下架歌曲合集  \n支持简易的搜索，建议在歌单页面收藏  \n可以通过用户变量实现切换仓库(没啥用)  \n#### 音源重定向  \n该插件不支持音源重定向  \n#### Bug反馈  \n[点我加入反馈群](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=x8r6m0bYYon_pCgT0BRc1ohwZmkkY61Q&authKey=DpmUioCvx45WjRRBnbRT2DsJ7LL6DNY3uau%2BFKPgR%2FSKz4EgYqUjEU5tJNi%2BkNPl&noverify=0&group_code=365976134)  \n#### 支持作者  \n![支持作者](https://raw.githubusercontent.com/ThomasBy2025/hikerview/refs/heads/main/mm_facetoface_collect_qrcode_1757315185814.png)",
    userVariables: [{
            key: "owner",
            name: "用户名",
            hint: "owner"
        },
        {
            key: "repo",
            name: "仓库名",
            hint: "repo"
        },
        {
            key: "token",
            name: "访问令牌",
            hint: "token"
        }
    ],
    // 搜索内容
    supportedSearchType: ["music"],
    search,

    // 发现歌单
    getRecommendSheetTags,
    getRecommendSheetsByTag,
    getMusicSheetInfo
};