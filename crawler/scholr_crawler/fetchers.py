from __future__ import annotations

from collections import defaultdict

from playwright.async_api import async_playwright

from scholr_crawler.models import FetchedPage, FetcherKind, ScholarshipSource


class SourceFetcher:
    async def fetch_many(self, sources: list[ScholarshipSource]) -> list[FetchedPage]:
        raise NotImplementedError


class PlaywrightFetcher(SourceFetcher):
    async def fetch_many(self, sources: list[ScholarshipSource]) -> list[FetchedPage]:
        pages: list[FetchedPage] = []
        async with async_playwright() as playwright:
            browser = await playwright.chromium.launch(headless=True)
            page = await browser.new_page()
            for source in sources:
                await page.goto(source.base_url, wait_until="domcontentloaded")
                pages.append(
                    FetchedPage(
                        source=source,
                        final_url=page.url,
                        html=await page.content(),
                    )
                )
            await browser.close()
        return pages


class TinyfishFetcher(SourceFetcher):
    async def fetch_many(self, sources: list[ScholarshipSource]) -> list[FetchedPage]:
        raise NotImplementedError(
            "Tinyfish fetcher is not wired yet. Register sources with fetcher='tinyfish' now, then implement the adapter here."
        )


class FetcherRegistry:
    def __init__(self) -> None:
        self._fetchers: dict[FetcherKind, SourceFetcher] = {
            FetcherKind.PLAYWRIGHT: PlaywrightFetcher(),
            FetcherKind.TINYFISH: TinyfishFetcher(),
        }

    async def fetch(self, sources: list[ScholarshipSource]) -> list[FetchedPage]:
        grouped: dict[FetcherKind, list[ScholarshipSource]] = defaultdict(list)
        for source in sources:
            grouped[source.fetcher].append(source)

        pages: list[FetchedPage] = []
        for fetcher_kind, fetcher_sources in grouped.items():
            pages.extend(await self._fetchers[fetcher_kind].fetch_many(fetcher_sources))
        return pages
