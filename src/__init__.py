import asyncio
import ujson as json
from pathlib import Path
from loguru import logger
from httpx import AsyncClient
from packaging.version import parse

from utils import get_json


async def check_link(url: str, client: AsyncClient) -> bool:
    try:
        response = await client.get(url)
        response.raise_for_status()
        logger.success(f"链接 {url} 有效")
        return True
    except Exception as e:
        logger.error(f"链接 {url} 无效")
        return False


async def check_sources(plugins: dict[any, any], client: AsyncClient):
    tasks = [check_link(plugin["url"], client) for plugin in plugins]
    results = await asyncio.gather(*tasks)
    return [plugin for plugin, result in zip(plugins, results) if result]


async def main(client: AsyncClient):
    logger.info("开始执行任务......")
    origins = get_json("origins.json")
    all_plugins = []

    # 处理各个插件源
    logger.info("执行插件订阅源聚合任务......")
    for i in origins.get("sources", []):
        logger.info(f"处理订阅源：{i}")
        try:
            data = await client.get(i)
            data.raise_for_status()
            data = data.json()
            plugins = await check_sources(data.get("plugins", []), client)
            all_plugins.extend(plugins)
        except Exception as e:
            logger.error(f"处理订阅源 {i} 失败")

    # 处理单独插件
    logger.info("执行单独插件任务......")
    singles = await check_sources(origins.get("singles", []), client)
    all_plugins.extend(singles)

    # 整理保留最新的版本
    await client.aclose()
    logger.info("整理插件......")
    results = {
        "plugins": [
            max(
                (plugin for plugin in all_plugins if plugin["name"] == name),
                key=lambda p: parse(p["version"]),
            )
            for name in {plugin["name"] for plugin in all_plugins}
        ]
    }
    with open(
        Path(__file__).parent.parent / "dist" / "plugins.json", "w", encoding="utf-8"
    ) as file:
        json.dump(results, file, ensure_ascii=False, indent=2)
    logger.success("本次运行已成功完成！")


if __name__ == "__main__":
    client = AsyncClient()
    asyncio.run(main(client))
