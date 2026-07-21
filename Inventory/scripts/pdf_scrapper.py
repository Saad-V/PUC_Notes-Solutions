import requests
import pandas as pd
from bs4 import BeautifulSoup
from urllib.parse import urljoin

urls = pd.read_csv("all_urls.csv")

results = []

for page_url in urls["url"]:

    try:
        html = requests.get(page_url, timeout=15).text

        soup = BeautifulSoup(html, "html.parser")

        for link in soup.find_all("a"):

            href = link.get("href")

            if not href:
                continue

            full_url = urljoin(page_url, href)

            if (
                "drive.google.com" in full_url
                or "docs.google.com" in full_url
                or ".pdf" in full_url.lower()
            ):
                results.append([
                    page_url,
                    full_url
                ])

    except Exception as e:
        print(page_url, e)

pd.DataFrame(
    results,
    columns=["page_url", "pdf_link"]
).to_csv(
    "pdf_inventory.csv",
    index=False
)

print("Done")