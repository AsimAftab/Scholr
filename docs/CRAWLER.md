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

## Current Behavior

The crawler:

1. launches a Playwright browser
2. visits configured scholarship URLs
3. extracts HTML
4. parses with BeautifulSoup
5. returns normalized dictionaries

Current extracted fields:

- `source_url`
- `title`
- `country`
- `deadline`
- `eligibility_text`

## Current Limitations

- no DB write path
- no job queue
- no retry strategy
- no crawl result persistence
- no anti-bot handling
- no admin ingestion integration
- heuristic extraction is basic

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

