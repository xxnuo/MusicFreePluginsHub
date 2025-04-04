"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const pageSize = 20;
function formatMusicItem(it) {
    return {
        id: it.photo.id,
        title: it.photo.caption,
        artist: it.author.name,
        artwork: it.photo.coverUrl || it.photo.photoUrl,
        manifest: it.photo.manifest
    };
}
async function searchMusic(query, page) {
    var _a, _b;
    const body = {
        query: `fragment photoContent on PhotoEntity {
  __typename
  id
  duration
  caption
  originCaption
  likeCount
  viewCount
  commentCount
  realLikeCount
  coverUrl
  photoUrl
  photoH265Url
  manifest
  manifestH265
  videoResource
  coverUrls {
    url
    __typename
  }
  timestamp
  expTag
  animatedCoverUrl
  distance
  videoRatio
  liked
  stereoType
  profileUserTopPhoto
  musicBlocked
  riskTagContent
  riskTagUrl
}

fragment recoPhotoFragment on recoPhotoEntity {
  __typename
  id
  duration
  caption
  originCaption
  likeCount
  viewCount
  commentCount
  realLikeCount
  coverUrl
  photoUrl
  photoH265Url
  manifest
  manifestH265
  videoResource
  coverUrls {
    url
    __typename
  }
  timestamp
  expTag
  animatedCoverUrl
  distance
  videoRatio
  liked
  stereoType
  profileUserTopPhoto
  musicBlocked
  riskTagContent
  riskTagUrl
}

fragment feedContent on Feed {
  type
  author {
    id
    name
    headerUrl
    following
    headerUrls {
      url
      __typename
    }
    __typename
  }
  photo {
    ...photoContent
    ...recoPhotoFragment
    __typename
  }
  canAddComment
  llsid
  status
  currentPcursor
  tags {
    type
    name
    __typename
  }
  __typename
}

query visionSearchPhoto($keyword: String, $pcursor: String, $searchSessionId: String, $page: String, $webPageArea: String) {
  visionSearchPhoto(keyword: $keyword, pcursor: $pcursor, searchSessionId: $searchSessionId, page: $page, webPageArea: $webPageArea) {
    result
    llsid
    webPageArea
    feeds {
      ...feedContent
      __typename
    }
    searchSessionId
    pcursor
    aladdinBanner {
      imgUrl
      link
      __typename
    }
    __typename
  }
}`,
        variables: {
            keyword: query,
            page: "search",
            pcursor: `${page - 1}`,
        },
    };
    const result = (await axios_1.default.post("https://www.kuaishou.com/graphql", body, {
        headers: {
            'user-agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
            host: 'www.kuaishou.com',
            origin: 'https://www.kuaishou.com',
            referer: `https://www.kuaishou.com/search/video?searchKey=${encodeURIComponent((query))}`,
        }
    })).data.data.visionSearchPhoto;
    return {
        isEnd: !(result === null || result === void 0 ? void 0 : result.pcursor) || (result === null || result === void 0 ? void 0 : result.pcursor) === 'no_more',
        data: (_b = (_a = result === null || result === void 0 ? void 0 : result.feeds) === null || _a === void 0 ? void 0 : _a.map) === null || _b === void 0 ? void 0 : _b.call(_a, formatMusicItem)
    };
}
module.exports = {
    platform: "快手",
    version: "0.0.2",
    author: '猫头猫',
    srcUrl: "https://musicfreepluginshub.2020818.xyz/49f2e338273dc5d6701f6cb10aefee3f.js",
    cacheControl: "no-cache",
    supportedSearchType: ["music"],
    async search(query, page, type) {
        if (type === "music") {
            return await searchMusic(query, page);
        }
    },
    async getMediaSource(musicItem, quality) {
        if (!musicItem.manifest) {
            return;
        }
        const adaptationSet = musicItem.manifest.adaptationSet;
        const representation = adaptationSet[0].representation;
        return {
            url: representation[0].url
        };
    },
};
