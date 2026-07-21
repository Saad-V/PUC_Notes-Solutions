import requests
import pandas as pd
from bs4 import BeautifulSoup

urls = pd.read_csv("all_urls.csv")

rows = []

for url in urls["url"]:
    try:
        r = requests.get(url, timeout=15)

        soup = BeautifulSoup(r.text, "html.parser")

        title = soup.title.text.strip() if soup.title else ""

        desc = ""

        meta = soup.find(
            "meta",
            attrs={"name":"description"}
        )

        if meta:
            desc = meta.get("content","")

        rows.append({
            "url":url,
            "title":title,
            "description":desc
        })

    except:
        pass

pd.DataFrame(rows).to_csv(
    "seo_metadata.csv",
    index=False
)