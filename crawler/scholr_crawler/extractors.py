from __future__ import annotations

import re
from datetime import datetime

from bs4 import BeautifulSoup

from scholr_crawler.models import FetchedPage, ScholarshipRecord


class ScholarshipExtractor:
    def extract(self, page: FetchedPage) -> ScholarshipRecord:
        soup = BeautifulSoup(page.html, "lxml")
        title = soup.title.string.strip() if soup.title and soup.title.string else page.source.name
        text = soup.get_text(" ", strip=True)
        return ScholarshipRecord(
            source_key=page.source.key,
            source_name=page.source.name,
            source_url=page.final_url,
            title=title,
            country=page.source.country,
            region=page.source.region,
            deadline=self._find_deadline(text),
            eligibility_text=self._extract_eligibility(text),
            official=page.source.official,
            tags=list(page.source.tags),
            notes=page.source.notes,
        )

    def _find_deadline(self, text: str) -> str | None:
        month_day_year = re.search(
            r"((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}, \d{4})",
            text,
        )
        if month_day_year:
            return datetime.strptime(month_day_year.group(1), "%B %d, %Y").date().isoformat()

        day_month_year = re.search(
            r"(\d{1,2} (?:January|February|March|April|May|June|July|August|September|October|November|December) \d{4})",
            text,
        )
        if day_month_year:
            return datetime.strptime(day_month_year.group(1), "%d %B %Y").date().isoformat()
        return None

    def _extract_eligibility(self, text: str) -> str:
        match = re.search(r"(eligibility.*?)(deadline|apply|application)", text, re.IGNORECASE)
        if match:
            return match.group(1)[:1500]
        return text[:1500]
