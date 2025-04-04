import asyncio
import ujson as json
from pathlib import Path
from loguru import logger
from httpx import AsyncClient
import hashlib

# 定义路径常量
DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)
DATA_JSON_PATH = DATA_DIR / "origins.json"

DIST_DIR = Path(__file__).parent.parent / "dist"
DIST_DIR.mkdir(exist_ok=True)
DIST_JSON_PATH = DIST_DIR / "plugins.json"

# 重试相关常量
MAX_RETRIES = 3
RETRY_DELAY = 1
REQUEST_TIMEOUT = 10.0


async def fetch_sub_plugins(url: str, client: AsyncClient) -> list:
    """从订阅源获取单个插件列表

    Args:
        url: 订阅源URL
        client: HTTP客户端实例

    Returns:
        插件列表,获取失败返回空列表
    """
    for retry in range(MAX_RETRIES):
        try:
            response = await client.get(url, timeout=REQUEST_TIMEOUT)
            response.raise_for_status()
            data = response.json()
            return data.get("plugins", [])
        except Exception as e:
            if retry == MAX_RETRIES - 1:
                logger.error(
                    f"订阅源 {url} 获取失败(重试{retry + 1}/{MAX_RETRIES}): {str(e)}"
                )
                return []
            logger.warning(
                f"订阅源 {url} 获取失败(重试{retry + 1}/{MAX_RETRIES}): {str(e)}"
            )
            await asyncio.sleep(RETRY_DELAY)


async def fetch_plugins(plugins: list, client: AsyncClient) -> list:
    """获取有效的插件列表

    Args:
        plugins: 待处理的插件列表
        client: HTTP客户端实例

    Returns:
        有效的插件列表
    """
    seen_urls = set()  # 用于去重
    name_count = {}  # 用于统计重名插件

    async def download_and_process_plugin(plugin: dict) -> tuple[bool, dict]:
        """下载插件并处理URL

        Args:
            plugin: 单个插件信息

        Returns:
            (成功标志, 处理后的插件信息)
        """
        url = plugin["url"]
        if url in seen_urls:
            return False, plugin
        seen_urls.add(url)

        for retry in range(MAX_RETRIES):
            try:
                response = await client.get(url, timeout=REQUEST_TIMEOUT)
                response.raise_for_status()

                # 保存插件文件
                md5 = hashlib.md5(url.encode("utf-8")).hexdigest()
                output_path = DIST_DIR / f"{md5}.js"
                output_path.write_bytes(response.content)

                # 处理插件信息
                new_plugin = plugin.copy()
                name = plugin.get("name", url)

                # 处理重名
                if name in name_count:
                    name_count[name] += 1
                    new_plugin["name"] = f"{name} ({name_count[name]})"
                else:
                    name_count[name] = 0
                    new_plugin["name"] = name

                logger.success(f"插件 {new_plugin['name']} 下载成功")
                return True, new_plugin

            except Exception as e:
                if retry == MAX_RETRIES - 1:
                    logger.error(
                        f"插件 {plugin.get('name', url)} 下载失败(重试{retry + 1}/{MAX_RETRIES}): {str(e)}"
                    )
                    return False, plugin
                logger.warning(
                    f"插件 {plugin.get('name', url)} 下载失败(重试{retry + 1}/{MAX_RETRIES}): {str(e)}"
                )
                await asyncio.sleep(RETRY_DELAY)

    # 并发下载和处理插件
    tasks = [download_and_process_plugin(plugin) for plugin in plugins]
    results = await asyncio.gather(*tasks)

    return [new_plugin for success, new_plugin in results if success]


async def load_origins() -> dict:
    """加载源配置文件

    Returns:
        源配置字典,加载失败返回空配置
    """
    try:
        with open(DATA_JSON_PATH, encoding="utf8") as f:
            return json.loads(f.read())
    except Exception as e:
        logger.error(f"读取源列表文件失败: {str(e)}")
        return {"sources": [], "singles": []}


async def save_results(results: dict) -> bool:
    """保存结果到文件

    Args:
        results: 要保存的结果数据

    Returns:
        保存是否成功
    """
    try:
        with open(DIST_JSON_PATH, "w", encoding="utf-8") as file:
            json_str = json.dumps(results, ensure_ascii=False, indent=2)
            json_str = json_str.replace("\\/", "/")
            file.write(json_str)
        logger.success(f"插件列表已保存至: {DIST_JSON_PATH}")
        return True
    except Exception as e:
        logger.error(f"保存结果文件失败: {str(e)}")
        return False


async def collect_plugins(origins: dict, client: AsyncClient) -> list:
    """收集所有插件

    Args:
        origins: 源配置信息
        client: HTTP客户端实例

    Returns:
        收集到的所有插件列表
    """
    all_plugins = []

    # 获取订阅源插件
    if sources := origins.get("sources", []):
        logger.info(f"正在获取 {len(sources)} 个订阅源的插件...")
        for source_url in sources:
            plugins = await fetch_sub_plugins(source_url, client)
            if plugins:
                logger.info(f"从 {source_url} 获取到 {len(plugins)} 个插件")
                all_plugins.extend(plugins)

    # 添加单独插件
    if singles := origins.get("singles", []):
        logger.info(f"添加 {len(singles)} 个单独插件...")
        all_plugins.extend(singles)

    return all_plugins


async def main():
    """主函数"""
    logger.info("开始执行插件更新任务...")

    # 1. 加载配置
    origins = await load_origins()
    if not origins:
        return

    # 2. 处理插件
    async with AsyncClient(timeout=REQUEST_TIMEOUT, follow_redirects=True) as client:
        # 收集所有插件
        all_plugins = await collect_plugins(origins, client)
        if not all_plugins:
            logger.warning("未获取到任何插件")
            return

        # 下载和验证插件
        logger.info(f"开始下载和验证 {len(all_plugins)} 个插件...")
        valid_plugins = await fetch_plugins(all_plugins, client)

        if not valid_plugins:
            logger.error("没有有效的插件")
            return

        logger.info(f"成功验证 {len(valid_plugins)} 个插件")

    # 3. 保存结果
    if await save_results({"plugins": valid_plugins}):
        logger.success(f"任务完成! 共更新 {len(valid_plugins)} 个插件")


if __name__ == "__main__":
    asyncio.run(main())
