# app/registry.py

from .comparators.c945 import Comparator945
from .comparators.c944 import Comparator944
from .comparators.c214 import Comparator214


class DocSpec:
    def __init__(self, comparator, accepted_extensions, description):
        self.comparator = comparator
        self.accepted_extensions = accepted_extensions
        self.description = description


REGISTRY = {
    "945": DocSpec(
        comparator=Comparator945,
        accepted_extensions={".csv", ".xlsx"},
        description="945 comparison",
    ),

    "944": DocSpec(
        comparator=Comparator944,
        accepted_extensions={".csv", ".xlsx"},
        description="944 Receipt Advice",
    ),

    "214": DocSpec(
        comparator=Comparator214,
        accepted_extensions={".csv", ".xlsx"},
        description="214 Shipment Status",
    ),
}


def get_spec(doc_type: str) -> DocSpec:
    if doc_type not in REGISTRY:
        raise ValueError(f"Unsupported doc_type: {doc_type}")
    return REGISTRY[doc_type]


def get_comparator(doc_type: str):
    spec = get_spec(doc_type)
    return spec.comparator()
