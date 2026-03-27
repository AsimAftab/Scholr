import asyncio

from scholr_crawler.scraper import ScholarshipScraper


async def run() -> None:
    scraper = ScholarshipScraper(
        [
            "https://www.daad.de/en/studying-in-germany/scholarships/",
            "https://www.scholars4dev.com/category/scholarships-by-country/",
        ]
    )
    results = await scraper.scrape()
    for item in results:
        print(item)


if __name__ == "__main__":
    asyncio.run(run())

