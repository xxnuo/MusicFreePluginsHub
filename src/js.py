from pathlib import Path
from pythonmonkey import eval as js_eval


def validate_plugin(js_path: str):
    # 首先创建模拟的 Node.js 环境
    js_env = """
    var exports = {};
    var module = { exports: exports };
    var require = function(module) {
        if (module === 'axios') {
            return {
                default: {
                    get: async function() { return { data: {} }; }
                }
            };
        }
        return {};
    };
    """
    
    with open(js_path, "r", encoding="utf-8") as file:
        content = file.read()
    
    # 先执行环境设置,再执行实际代码
    js_eval(js_env)
    script = js_eval(content)
    # 执行脚本
    script()

def test():
    # 正常插件
    # test_path = Path(__file__).parent.parent / "dist" / "7735f9b122a825d66b5bc14d3f8a1632.json"
    # 混淆插件
    test_path = Path(__file__).parent.parent / "dist" / "292415ca8fbabfa027fb0b55bf43fd05.json"
    validate_plugin(test_path)

if __name__ == "__main__":
    test()