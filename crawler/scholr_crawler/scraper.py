from __future__ import annotations

from scholr_crawler.extractors import ScholarshipExtractor
from scholr_crawler.fetchers import FetcherRegistry
from scholr_crawler.models import ScholarshipRecord, ScholarshipSource


class ScholarshipScraper:
    def __init__(self, sources: list[ScholarshipSource]) -> None:
        self.sources = sources
        self.fetchers = FetcherRegistry()
        self.extractor = ScholarshipExtractor()

    async def scrape(self) -> list[ScholarshipRecord]:
        fetched_pages = await self.fetchers.fetch(self.sources)
        return [self.extractor.extract(page) for page in fetched_pages]
