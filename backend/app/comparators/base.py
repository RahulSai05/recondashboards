from __future__ import annotations
from dataclasses import dataclass
import polars as pl

@dataclass
class CompareResult:
    missing: pl.DataFrame
    summary: dict

class BaseComparator:
    """
    Each doc-type comparator must implement compare().
    """
    doc_type: str

    def compare(self, source_path: str, dest_path: str) -> CompareResult:
        raise NotImplementedError
