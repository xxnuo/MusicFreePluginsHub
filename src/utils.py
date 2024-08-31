import ujson as json
from pathlib import Path

path = Path(__file__).parent / "data"


def get_json(file_name: str):
    with open(path / file_name, encoding="utf8") as f:
        file_text = f.read()
        return json.loads(file_text)