from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text

from database import Base


class MedicineAnalysis(Base):
    __tablename__ = "medicine_analyses"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(String(255), nullable=False, index=True)
    filename = Column(String(255), nullable=False)

    medicine_name = Column(String(255), nullable=True)

    strength = Column(String(100), nullable=True)

    form = Column(String(100), nullable=True)

    ingredients = Column(Text, nullable=False, default="[]")

    uses = Column(Text, nullable=False, default="[]")

    storage = Column(Text, nullable=True)

    warnings = Column(Text, nullable=False, default="[]")

    simple_explanation = Column(Text, nullable=False)

    directions=Column(Text,nullable=False,default="[]")
    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )