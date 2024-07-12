import json
import requests

# from packaging import version

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


# def is_version_smaller(ver_str, target_ver_str):
#     try:
#         ver = version.parse(ver_str)
#         target_ver = version.parse(target_ver_str)
#         return ver < target_ver
#     except:
#         return True


def merge_json(json1, json2):
    """
    将 json2 的内容覆盖合并到 json1 中
    """
    if isinstance(json1, dict) and isinstance(json2, dict):
        for key in json2:
            if key in json1:
                json1[key] = merge_json(json1[key], json2[key])
            else:
                json1[key] = json2[key]
        return json1
    elif isinstance(json1, list) and isinstance(json2, list):
        # 如果需要合并列表，可以根据具体需求实现
        # 这里简单地将 json2 追加到 json1 后面
        json1.extend(json2)
        return json1
    else:
        return json2


def main():
    """主函数"""
    # 读取 JSON 文件
    with open("subscriptions.json", "r", encoding="utf-8") as file:
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

    pluginsDataMerged = []
    for i in pluginsDataRaw:
        pluginsDataMerged = merge_json(pluginsDataMerged, i)

    # print(pluginsDataMerged)
    with open("extras.json", "r", encoding="utf-8") as file:
        data = json.load(file)
        extras = data["extras"]
        for extra in extras:
            pluginsDataMerged.update(extra)
    resultData = {"plugins": pluginsDataMerged}

    with open("plugins.json", "w", encoding="utf-8") as file:
        json.dump(resultData, file, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
