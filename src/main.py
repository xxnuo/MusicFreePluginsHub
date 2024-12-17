import asyncio
import ujson as json
from pathlib import Path
from loguru import logger
from httpx import AsyncClient
import hashlib
# 定义路径
data_dir = Path(__file__).parent / "data"
data_dir.mkdir(exist_ok=True)
data_json_path = data_dir / "origins.json"

dist_dir = Path(__file__).parent.parent / "dist"
dist_dir.mkdir(exist_ok=True)
dist_json_path = dist_dir / "plugins.json"

async def fetch_sub_plugins(url: str, client: AsyncClient) -> list:
    """从订阅源获取单个插件列表"""
    for retry in range(3):
        try:
            response = await client.get(url, timeout=10.0)  # 添加超时设置
            response.raise_for_status()
            data = response.json()
            return data.get("plugins", [])
        except Exception as e:
            if retry == 2:  # 最后一次重试失败
                logger.error(f"订阅源 {url} 获取失败(重试{retry+1}/3): {str(e)}")
                return []
            logger.warning(f"订阅源 {url} 获取失败(重试{retry+1}/3): {str(e)}")
            await asyncio.sleep(1)  # 等待1秒后重试
    
async def fetch_plugins(plugins: list, client: AsyncClient) -> list:
    """获取有效的插件列表"""
    seen_urls = set()  # 用于去重
    
    async def download_and_process_plugin(plugin: dict) -> tuple[bool, dict]:
        """下载插件并处理URL"""
        url = plugin["url"]
        if url in seen_urls:  # 检查重复
            return False, plugin
        seen_urls.add(url)
        
        for retry in range(3):
            try:
                response = await client.get(url, timeout=10.0)
                response.raise_for_status()
                
                md5 = hashlib.md5(url.encode('utf-8')).hexdigest()
                output_path = dist_dir / f"{md5}.json"
                output_path.write_bytes(response.content)
                
                logger.success(f"插件 {plugin.get('name', url)} 下载成功")
                            
                # TODO: 校验插件功能
                
                # 更新插件URL
                new_plugin = plugin.copy()
                new_plugin["url"] = f"https://musicfreepluginshub.2020818.xyz/{md5}.js"
                
                return True, new_plugin
                
            except Exception as e:
                if retry == 2:  # 最后一次重试失败
                    logger.error(f"插件 {plugin.get('name', url)} 下载失败(重试{retry+1}/3): {str(e)}")
                    return False, plugin
                logger.warning(f"插件 {plugin.get('name', url)} 下载失败(重试{retry+1}/3): {str(e)}")
                await asyncio.sleep(1)  # 等待1秒后重试

    tasks = [download_and_process_plugin(plugin) for plugin in plugins]
    results = await asyncio.gather(*tasks)
    
    return [new_plugin for success, new_plugin in results if success]

async def main():
    logger.info("开始执行任务......")
    
    # 1. 读取配置文件
    try:
        with open(data_json_path, encoding="utf8") as f:
            origins = json.loads(f.read())
    except Exception as e:
        logger.error(f"读取源列表文件失败: {str(e)}")
        return

    all_plugins = []
    async with AsyncClient(timeout=10.0, follow_redirects=True) as client:  # 添加重定向支持
        # 2. 获取所有订阅源插件
        logger.info("获取订阅源插件......")
        for source_url in origins.get("sources", []):
            logger.info(f"获取订阅源：{source_url}")
            plugins = await fetch_sub_plugins(source_url, client)
            all_plugins.extend(plugins)

        # 3. 添加单独插件
        logger.info("添加单独插件......")
        all_plugins.extend(origins.get("singles", []))

        # 4. 统一校验所有插件
        logger.info("下载并校验所有插件......")
        all_plugins = await fetch_plugins(all_plugins, client)

    logger.info("整理插件......")
    
    results = {
        "plugins": sorted(all_plugins, key=lambda x: x.get("name", ""))  # 按名称排序
    }
    
    # 7. 保存结果
    try:
        with open(dist_json_path, "w", encoding="utf-8") as file:
            json.dump(results, file, ensure_ascii=False, indent=2)
        logger.success(f"本次运行已成功完成！输出文件: {dist_json_path}")
    except Exception as e:
        logger.error(f"保存结果文件失败: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main())
