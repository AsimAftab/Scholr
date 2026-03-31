"""make ielts_score optional

Revision ID: 20260401_0008
Revises: 20260331_0007
Create Date: 2026-04-01

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '20260401_0008'
down_revision: Union[str, None] = '20260331_0007'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Make ielts_score nullable in profiles table
    op.alter_column('profiles', 'ielts_score',
                    existing_type=sa.Float(),
                    nullable=True)


def downgrade() -> None:
    # Revert ielts_score to non-nullable
    # IMPORTANT: NULL values are set to -1 (sentinel for "missing data")
    # Application code should treat -1 as invalid/missing IELTS score
    # Valid IELTS scores are 0-9 (where 0 = "not attempted")
    op.execute("UPDATE profiles SET ielts_score = -1 WHERE ielts_score IS NULL")
    op.alter_column('profiles', 'ielts_score',
                    existing_type=sa.Float(),
                    nullable=False)
