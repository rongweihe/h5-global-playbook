"""检查静态报告内部导航与资源依赖，不请求外部来源网站。"""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path


class ReportParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.anchors = []
        self.assets = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if "id" in values:
            self.ids.append(values["id"])
        href = values.get("href", "")
        if href.startswith("#"):
            self.anchors.append(href[1:])
        if tag == "script" and values.get("src"):
            self.assets.append(values["src"])
        if tag == "link" and values.get("rel") == "stylesheet":
            self.assets.append(href)


root = Path(__file__).resolve().parents[1] / "dist"
parser = ReportParser()
parser.feed((root / "index.html").read_text(encoding="utf-8"))
duplicates = [name for name, count in Counter(parser.ids).items() if count > 1]
missing_anchors = sorted(set(parser.anchors) - set(parser.ids))
missing_assets = [name for name in parser.assets if not (root / name).is_file()]
if duplicates or missing_anchors or missing_assets:
    raise SystemExit(f"Invalid report: duplicate IDs={duplicates}, missing anchors={missing_anchors}, missing assets={missing_assets}")
print(f"Report verified: {len(parser.ids)} unique IDs, {len(parser.anchors)} anchors, {len(parser.assets)} local assets.")
