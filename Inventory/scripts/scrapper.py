import requests
import xml.etree.ElementTree as ET
import pandas as pd

xml = requests.get(
    "https://www.pucnotes-solutions.com/pages-sitemap.xml"
).text

root = ET.fromstring(xml)

urls = []

for loc in root.findall(".//{*}loc"):
    urls.append(loc.text)

pd.DataFrame(urls, columns=["url"]).to_csv(
    "all_urls.csv",
    index=False
)

print("Total URLs:", len(urls))