import polars as pl
from .base import BaseComparator, CompareResult


def _require_cols(df: pl.DataFrame, required: list[str], label: str) -> None:
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"[{label}] Missing required column(s): {missing}")


def _to_trimmed_str(df: pl.DataFrame, col: str) -> pl.DataFrame:
    return df.with_columns(
        pl.col(col).cast(pl.Utf8).str.strip_chars().alias(col)
    )


class ComparatorAxLoadFailure(BaseComparator):
    """
    INPUTS (both CSV):
      - source: EDI B2Bi report (EDIB2BiReportV2...) with columns:
          StatusSummary, AXReferenceID
      - dest: Tempur shipped orders with column:
          PickNumber

    OUTPUT:
      - 'missing' dataframe = Tempur rows whose PickNumber appears in
        EDI rows where StatusSummary == 'AX Load Failure'.
        (Yes, the naming is 'missing' due to your framework, but it's really the result set.)
    """
    doc_type = "ax_load_failure"

    def compare(self, source_path: str, dest_path: str) -> CompareResult:
        edi = pl.read_csv(source_path, infer_schema_length=1000)
        tempur = pl.read_csv(dest_path, infer_schema_length=1000)

        _require_cols(edi, ["StatusSummary", "AXReferenceID"], "ax_load_failure:EDI")
        _require_cols(tempur, ["PickNumber"], "ax_load_failure:Tempur")

        # Normalize key fields
        edi = _to_trimmed_str(edi, "StatusSummary")
        edi = _to_trimmed_str(edi, "AXReferenceID")
        tempur = _to_trimmed_str(tempur, "PickNumber")

        # Filter EDI failures (case-insensitive match)
        failures = edi.filter(
            pl.col("StatusSummary").str.to_lowercase() == pl.lit("ax load failure")
        )

        # Unique failing AXReferenceIDs
        fail_ids = failures.select(pl.col("AXReferenceID")).unique()

        # Keep only Tempur rows where PickNumber matches an AXReferenceID failure
        result = tempur.join(
            fail_ids,
            left_on="PickNumber",
            right_on="AXReferenceID",
            how="inner",
        ).drop("AXReferenceID")

        summary = {
            "doc_type": self.doc_type,
            "edi_rows": edi.height,
            "edi_fail_rows": failures.height,
            "unique_fail_ids": fail_ids.height,
            "tempur_rows": tempur.height,
            "result_rows": result.height,
        }

        return CompareResult(missing=result, summary=summary)
