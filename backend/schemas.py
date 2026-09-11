from typing import Optional
from pydantic import BaseModel, Field


class MedicineInfo(BaseModel):
    medicine_name: Optional[str] = None
    strength: Optional[str] = None
    form: Optional[str] = None

    ingredients: list[str] = Field(default_factory=list)
    uses: list[str] = Field(default_factory=list)

    directions: list[str] = Field(default_factory=list)

    storage: Optional[str] = None
    warnings: list[str] = Field(default_factory=list)