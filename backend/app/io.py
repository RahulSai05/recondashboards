# from __future__ import annotations

# from pathlib import Path
# import polars as pl

# EXCEL_EXTS = {".xlsx", ".xls", ".xlsm", ".xlsb"}
# CSV_EXTS = {".csv", ".tsv"}


# def _norm_col(name: str) -> str:
#     return "".join(ch for ch in (name or "").strip().lower() if ch.isalnum())


# def normalize_columns(df: pl.DataFrame) -> pl.DataFrame:
#     return df.rename({c: _norm_col(c) for c in df.columns})


# def _read_csv_all_text(path: str, sep: str) -> pl.DataFrame:
#     """
#     Enterprise-safe CSV ingestion:
#       - Force ALL columns to Utf8 to avoid mixed-type inference explosions
#         (tracking numbers, SSCC, IDs, leading zeros, etc.)
#     """
#     header = pl.read_csv(path, separator=sep, n_rows=0, infer_schema_length=0)
#     schema_overrides = {c: pl.Utf8 for c in header.columns}

#     return pl.read_csv(
#         path,
#         separator=sep,
#         schema_overrides=schema_overrides,
#         infer_schema_length=0,
#         ignore_errors=True,
#     )


# def _read_csv_with_best_sep(path: str) -> pl.DataFrame:
#     seps = ["\t", ",", ";", "|"]
#     last_err: Exception | None = None

#     for sep in seps:
#         try:
#             df = _read_csv_all_text(path, sep)
#             if len(df.columns) > 1:
#                 return df
#         except Exception as e:
#             last_err = e

#     if last_err:
#         raise last_err
#     return _read_csv_all_text(path, ",")  # last resort


# def read_table(path: str, *, normalize_headers: bool = False) -> pl.DataFrame:
#     p = Path(path)
#     ext = p.suffix.lower()

#     if ext in EXCEL_EXTS:
#         df = pl.read_excel(path)
#         return normalize_columns(df) if normalize_headers else df

#     if ext in CSV_EXTS:
#         df = _read_csv_with_best_sep(path)
#         return normalize_columns(df) if normalize_headers else df

#     # fallback: try excel then csv
#     try:
#         df = pl.read_excel(path)
#         return normalize_columns(df) if normalize_headers else df
#     except Exception:
#         df = _read_csv_with_best_sep(path)
#         return normalize_columns(df) if normalize_headers else df


from __future__ import annotations

from pathlib import Path
import polars as pl

EXCEL_EXTS = {".xlsx", ".xls", ".xlsm", ".xlsb"}
CSV_EXTS = {".csv", ".tsv"}


def _norm_col(name: str) -> str:
    # "Pick Number" -> "picknumber", "AXReferenceID" -> "axreferenceid"
    return "".join(ch for ch in (name or "").strip().lower() if ch.isalnum())


def normalize_columns(df: pl.DataFrame) -> pl.DataFrame:
    return df.rename({c: _norm_col(c) for c in df.columns})


def _read_csv_all_text(path: str, sep: str) -> pl.DataFrame:
    """
    Enterprise-safe CSV ingestion:
      - Force ALL columns to Utf8 so mixed numeric/alphanumeric columns never crash
        (SSCCNumber / tracking numbers / IDs / leading zeros).
    """
    header = pl.read_csv(path, separator=sep, n_rows=0, infer_schema_length=0)
    schema_overrides = {c: pl.Utf8 for c in header.columns}

    return pl.read_csv(
        path,
        separator=sep,
        schema_overrides=schema_overrides,
        infer_schema_length=0,
        ignore_errors=True,
    )


def _read_csv_with_best_sep(path: str) -> pl.DataFrame:
    seps = ["\t", ",", ";", "|"]
    last_err: Exception | None = None

    for sep in seps:
        try:
            df = _read_csv_all_text(path, sep)
            if len(df.columns) > 1:
                return df
        except Exception as e:
            last_err = e

    if last_err:
        raise last_err
    return _read_csv_all_text(path, ",")  # last resort


def read_table(path: str, *, normalize_headers: bool = False) -> pl.DataFrame:
    p = Path(path)
    ext = p.suffix.lower()

    if ext in EXCEL_EXTS:
        df = pl.read_excel(path)
        return normalize_columns(df) if normalize_headers else df

    if ext in CSV_EXTS:
        df = _read_csv_with_best_sep(path)
        return normalize_columns(df) if normalize_headers else df

    # fallback: try excel then csv
    try:
        df = pl.read_excel(path)
        return normalize_columns(df) if normalize_headers else df
    except Exception:
        df = _read_csv_with_best_sep(path)
        return normalize_columns(df) if normalize_headers else df
