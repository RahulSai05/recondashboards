from __future__ import annotations

import polars as pl

from .base import BaseComparator, CompareResult
from app.io import read_table


def _require_cols(df: pl.DataFrame, required: list[str], label: str) -> None:
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"[{label}] Missing required columns: {missing}. Found: {df.columns}")


def _trim_str(df: pl.DataFrame, col: str) -> pl.DataFrame:
    if col not in df.columns:
        raise ValueError(f"Column '{col}' not found. Available: {df.columns}")
    return df.with_columns(pl.col(col).cast(pl.Utf8).str.strip_chars().alias(col))


class Comparator945(BaseComparator):
    """
    945 logic:
      - Find EDI rows with StatusSummary == "AX Load Failure"
      - Collect AXReferenceID values
      - Return ONLY Tempur rows where PickNumber matches a failure
      - Add columns: "Received in AX" and "AX Status" = "AX Load Failure"
    """

    doc_type = "945"

    REQ_TEMPUR = ["picknumber"]
    REQ_EDI = ["statussummary", "axreferenceid"]

    def compare(self, source_path: str, dest_path: str) -> CompareResult:
        # Load files with normalized headers
        tempur = read_table(source_path, normalize_headers=True)
        edi = read_table(dest_path, normalize_headers=True)

        # Validate required columns
        _require_cols(tempur, self.REQ_TEMPUR, "945:Tempur")
        _require_cols(edi, self.REQ_EDI, "945:EDI")

        # Trim whitespace from key columns
        tempur = _trim_str(tempur, "picknumber")
        edi = _trim_str(_trim_str(edi, "statussummary"), "axreferenceid")

        # Filter EDI for "AX Load Failure" rows (case-insensitive)
        failures = edi.filter(
            pl.col("statussummary").str.to_lowercase() == pl.lit("ax load failure")
        )
        
        # Get unique failure IDs
        fail_ids = failures.select(pl.col("axreferenceid")).unique()

        # INNER JOIN: Only keep Tempur rows that match a failure ID
        result = tempur.join(
            fail_ids,
            left_on="picknumber",
            right_on="axreferenceid",
            how="inner"
        )
        
        # Drop the duplicate axreferenceid column from join if it exists
        if "axreferenceid" in result.columns:
            result = result.drop("axreferenceid")
        
        # Add the status columns
        result = result.with_columns([
            pl.col("picknumber").alias("Received in AX"),
            pl.lit("AX Load Failure").alias("AX Status"),
        ])

        # Summary statistics
        summary = {
            "doc_type": self.doc_type,
            "tempur_rows": tempur.height,
            "edi_rows": edi.height,
            "edi_fail_rows": failures.height,
            "unique_fail_ids": fail_ids.height,
            "result_rows": result.height,
            "ax_load_failure_rows": result.height,
        }

        return CompareResult(missing=result, summary=summary)