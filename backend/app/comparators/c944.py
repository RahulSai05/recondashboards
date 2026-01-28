import polars as pl
from .base import BaseComparator, CompareResult

def _normalize(df: pl.DataFrame, keys: list[str]) -> pl.DataFrame:
    for k in keys:
        df = df.with_columns(pl.col(k).cast(pl.Utf8).str.strip_chars().alias(k))
    return df

class Comparator944(BaseComparator):
    doc_type = "944"

    # TODO: set real key columns for 944 (often composite)
    KEYS = ["id"]

    def compare(self, source_path: str, dest_path: str) -> CompareResult:
        src = pl.read_excel(source_path)
        dst = pl.read_excel(dest_path)

        for k in self.KEYS:
            if k not in src.columns or k not in dst.columns:
                raise ValueError(f"[944] Missing key column '{k}' in one of the files.")

        src = _normalize(src, self.KEYS)
        dst = _normalize(dst, self.KEYS)

        missing = src.join(dst.select(self.KEYS), on=self.KEYS, how="anti")

        summary = {
            "doc_type": self.doc_type,
            "source_rows": src.height,
            "dest_rows": dst.height,
            "missing_rows": missing.height,
        }
        return CompareResult(missing=missing, summary=summary)
