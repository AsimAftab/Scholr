from __future__ import annotations

import re
from datetime import datetime

from bs4 import BeautifulSoup
from playwright.async_api import async_playwright


class ScholarshipScraper:
    def __init__(self, urls: list[str]) -> None:
        self.urls = urls

    async def scrape(self) -> list[dict]:
        records: list[dict] = []
        async with async_playwright() as playwright:
            browser = await playwright.chromium.launch(headless=True)
            page = await browser.new_page()
            for url in self.urls:
                await page.goto(url, wait_until="domcontentloaded")
                html = await page.content()
                records.append(self._extract_from_html(url, html))
            await browser.close()
        return records

    def _extract_from_html(self, url: str, html: str) -> dict:
        soup = BeautifulSoup(html, "lxml")
        title = soup.title.string.strip() if soup.title and soup.title.string else "Scholarship Listing"
        text = soup.get_text(" ", strip=True)
        return {
            "source_url": url,
            "title": title,
            "country": self._find_country(text),
            "deadline": self._find_deadline(text),
            "eligibility_text": self._extract_eligibility(text),
        }

    def _find_country(self, text: str) -> str:
        for country in ["Canada", "Australia", "United Kingdom", "Germany", "United States"]:
            if country.lower() in text.lower():
                return country
        return "Unknown"

    def _find_deadline(self, text: str) -> str | None:
        match = re.search(r"((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}, \d{4})", text)
        if not match:
            return None
        return datetime.strptime(match.group(1), "%B %d, %Y").date().isoformat()

    def _extract_eligibility(self, text: str) -> str:
        match = re.search(r"(eligibility.*?)(deadline|apply|application)", text, re.IGNORECASE)
        return match.group(1)[:1000] if match else text[:1000]

