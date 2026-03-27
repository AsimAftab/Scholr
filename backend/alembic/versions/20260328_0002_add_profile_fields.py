"""add profile major and passout_year

Revision ID: 20260328_0002
Revises: 20260328_0001
Create Date: 2026-03-28 00:00:02
"""

from alembic import op
import sqlalchemy as sa


revision = "20260328_0002"
down_revision = "20260328_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("profiles", sa.Column("major", sa.String(length=120), nullable=True))
    op.add_column("profiles", sa.Column("passout_year", sa.Integer(), nullable=True))


def downgrade() -> None:
    op.drop_column("profiles", "passout_year")
    op.drop_column("profiles", "major")

