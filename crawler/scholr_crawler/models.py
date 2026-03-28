from __future__ import annotations

from dataclasses import asdict, dataclass, field
from enum import StrEnum
from typing import Any


class FetcherKind(StrEnum):
    PLAYWRIGHT = "playwright"
    TINYFISH = "tinyfish"


@dataclass(frozen=True)
class ScholarshipSource:
    key: str
    name: str
    base_url: str
    country: str
    region: str
    fetcher: FetcherKind = FetcherKind.PLAYWRIGHT
    enabled: bool = True
    official: bool = True
    tags: tuple[str, ...] = ()
    notes: str | None = None


@dataclass
class FetchedPage:
    source: ScholarshipSource
    final_url: str
    html: str


@dataclass
class ScholarshipRecord:
    source_key: str
    source_name: str
    source_url: str
    title: str
    country: str
    region: str
    deadline: str | None
    eligibility_text: str
    official: bool
    tags: list[str] = field(default_factory=list)
    notes: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)
