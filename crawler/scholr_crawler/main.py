import asyncio
import json
import sys

from scholr_crawler.models import ScholarshipSource
from scholr_crawler.scraper import ScholarshipScraper
from scholr_crawler.sources import list_sources


def _parse_args(argv: list[str]) -> tuple[str, str | None, str | None]:
    command = argv[1] if len(argv) > 1 else "crawl"
    country = argv[2] if len(argv) > 2 else None
    region = argv[3] if len(argv) > 3 else None
    return command, country, region


def _print_sources(sources: list[ScholarshipSource]) -> None:
    for source in sources:
        print(
            f"{source.country:22} | {source.region:14} | {source.fetcher:10} | "
            f"{source.key:24} | {source.base_url}"
        )


async def run(argv: list[str] | None = None) -> None:
    args = argv or sys.argv
    command, country, region = _parse_args(args)
    sources = list_sources(country=country, region=region)

    if command == "list":
        _print_sources(sources)
        return

    scraper = ScholarshipScraper(sources)
    results = await scraper.scrape()
    for item in results:
        print(json.dumps(item.to_dict(), ensure_ascii=False))


if __name__ == "__main__":
    asyncio.run(run())
