from io import BytesIO
import json
from tkinter import E
from typing import List
from xml.etree.ElementTree import Element
import requests
from lxml import etree
from zipfile import ZipFile


def get_nested_content(item: Element, path: List[str]):
    if not path:
        return item.text
    subitem = item.find(path[0])
    if subitem is None:
        return None
    return get_nested_content(subitem, path[1:])


def get_gesetz(abk):
    response = requests.get(f"http://www.gesetze-im-internet.de/{abk}/xml.zip")

    if response.status_code != 200:
        raise Exception("Request failed")
    with ZipFile(BytesIO(response.content)) as zip:
        xml_files = [f for f in zip.filelist if f.filename.endswith(".xml")]
        (xml_file,) = xml_files
        xml_content = zip.read(xml_file)
    xml_root = etree.parse(BytesIO(xml_content))

    data = []

    for norm in xml_root.findall("norm"):
        norm_data = {}
        for norm_children in norm.iterchildren():
            norm_data[norm_children.tag] = b"".join(
                etree.tostring(f, encoding="utf8") for f in norm_children
            ).decode("utf8")

        for metadatenitemtag in [["enbez"], ["amtabk"], ["jurabk"], ["titel"], ['gliederungseinheit', 'gliederungsbez'], ['gliederungseinheit', 'gliederungstitel']]:
            text = get_nested_content(norm, ["metadaten", *metadatenitemtag])
            if text:
                norm_data[metadatenitemtag[-1]] = text

        if "enbez" in norm_data:
            if norm_data["enbez"].startswith("§ "):
                norm_data["index"] = norm_data["enbez"][2:]
            elif norm_data["enbez"].startswith("Art "):
                norm_data["index"] = norm_data["enbez"][4:]

        data.append(norm_data)

    with open(f"public/data/{abk}.json", "w") as f:
        json.dump(data, f, ensure_ascii=False)


for abk in set(json.load(open("src/gesetze.json")).values()):
    try:
        get_gesetz(abk)
    except:
        print(abk)
        raise
