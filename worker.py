import json
import requests
from packaging import version

DEBUG = False


# def md5_hash(url):
#     """计算字符串的 MD5 散列值"""
#     import hashlib
#     m = hashlib.md5()
#     m.update(url.encode("utf-8"))
#     return m.hexdigest()


def download_file(url):
    """下载并返回json数据"""

    # # 调试模式
    # if DEBUG:
    #     import os

    #     with open(
    #         os.path.join("debug", md5_hash(url), "plugins.json"), "r", encoding="utf-8"
    #     ) as file:
    #         return json.load(file)

    # 下载文件
    response = requests.get(url)
    if response.status_code == 200:
        print(f"下载成功，{url}")
        return (
            response.json()
        )  # 正确的方法是使用 response.json() 而不是 response.content.json()
    else:
        print(f"下载失败，状态码: {response.status_code}")
        return {}  # 在失败时返回一个空字典，这里应直接返回空字典，不需要调用 .json()


def main():
    """主函数"""
    # 读取 JSON 文件
    with open("subscriptions.json", "r") as file:
        data = json.load(file)
        subscriptions = data["subscriptions"]

    subsData = []
    # 遍历每个 URL
    for url in subscriptions:
        subsData.append(download_file(url))

    subsData.append({})

    pluginsDataRaw = []
    for i in subsData:
        if i == {}:
            # json 数据为空
            continue
        try:
            ps = i["plugins"]
        except KeyError:
            # 返回的 json 数据没有 plugins 订阅列表
            continue

        for p in ps:
            pluginsDataRaw.append(p)

    # print(pluginsDataRaw)
    # print("\n")

    pluginsDataMerged = []
    for n in pluginsDataRaw:
        nextNew = False

        for o in pluginsDataMerged:
            if nextNew:
                nextNew = False
                break

            if n["name"] == o["name"]:
                nextNew = True
                if n["url"] == o["url"]:
                    break
                if version.parse(n["version"]) > version.parse(o["version"]):
                    o["url"] = n["url"]
                    o["version"] = n["version"]

        if not nextNew:
            pluginsDataMerged.append(n)

    # print(pluginsDataMerged)
    pluginsDataMerged.append(
        {
            "name": "云电台",
            "url": "https://cdn.jsdelivr.net/gh/GuGuMur/MusicFreePlugin-NeteaseRadio@master/dist/plugin.js",
            "version": "0.0.0",
        },
    )
    resultData = {"plugins": pluginsDataMerged}

    with open("plugins.json", "w", encoding="utf-8") as file:
        json.dump(resultData, file, ensure_ascii=False)  # , indent=4)


if __name__ == "__main__":
    main()
