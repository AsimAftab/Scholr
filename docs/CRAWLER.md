# Crawler Guide

## Stack

- Python
- Playwright
- BeautifulSoup

Root:

- `crawler/`

## Important Files

- [main.py](C:\Users\asima\Desktop\Projects\Scholr\crawler\scholr_crawler\main.py)
- [scraper.py](C:\Users\asima\Desktop\Projects\Scholr\crawler\scholr_crawler\scraper.py)
- [sources.py](C:\Users\asima\Desktop\Projects\Scholr\crawler\scholr_crawler\sources.py)
- [fetchers.py](C:\Users\asima\Desktop\Projects\Scholr\crawler\scholr_crawler\fetchers.py)
- [extractors.py](C:\Users\asima\Desktop\Projects\Scholr\crawler\scholr_crawler\extractors.py)
- [models.py](C:\Users\asima\Desktop\Projects\Scholr\crawler\scholr_crawler\models.py)

## Current Behavior

The crawler now:

1. loads scholarship source manifests from a registry
2. groups sources by fetcher type
3. fetches pages through a fetcher adapter such as Playwright
4. parses HTML with a shared extractor
5. returns normalized records with source metadata

Current extracted fields:

- `source_key`
- `source_name`
- `source_url`
- `title`
- `country`
- `region`
- `deadline`
- `eligibility_text`
- `official`
- `tags`
- `notes`

## Current Limitations

- no DB write path
- no job queue
- no retry strategy
- no crawl result persistence
- no anti-bot handling
- no admin ingestion integration
- heuristic extraction is still basic
- Tinyfish adapter is registered but not implemented yet

## Intended Future Role

The crawler should eventually become:

- a background ingestion worker
- an input into scholarship persistence
- a source of raw text for eligibility structuring
- part of an admin/operator pipeline

## Safe Editing Guidance

- keep the output schema normalized and stable
- avoid hardcoding too many source-specific selectors unless isolated by source strategy
- do not couple crawler internals directly to frontend assumptions
- prefer structured output that backend ingestion can consume

## Highest-Value Next Crawler Work

1. persistent crawl result model
2. integration with backend ingestion endpoint or DB layer
3. retry/error handling
4. source-specific extraction strategies
5. background execution model

## Registry Design

The source system is now intended to be plug and play:

- each source lives as a `ScholarshipSource` manifest in `sources.py`
- every source is tagged with `country`, `region`, `official`, and `fetcher`
- orchestration code never hardcodes URLs directly
- a source can switch from `playwright` to `tinyfish` by changing only its manifest

Examples:

```powershell
python -m scholr_crawler.main list
python -m scholr_crawler.main list Germany
python -m scholr_crawler.main crawl "United Kingdom"
python -m scholr_crawler.main crawl "" GCC
```
