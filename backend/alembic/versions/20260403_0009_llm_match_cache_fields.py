"""add llm match cache fields

Revision ID: 20260403_0009
Revises: 20260401_0008
Create Date: 2026-04-03 00:00:00
"""

from alembic import op
import sqlalchemy as sa


revision = "20260403_0009"
down_revision = "20260401_0008"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("user_scholarship_matches", sa.Column("rule_score", sa.Integer(), nullable=True))
    op.add_column("user_scholarship_matches", sa.Column("llm_score", sa.Integer(), nullable=True))
    op.add_column("user_scholarship_matches", sa.Column("llm_confidence", sa.Integer(), nullable=True))
    op.add_column("user_scholarship_matches", sa.Column("profile_fingerprint", sa.String(length=64), nullable=True))
    op.add_column("user_scholarship_matches", sa.Column("match_summary", sa.Text(), nullable=True))
    op.add_column("user_scholarship_matches", sa.Column("personalized_reasoning", sa.Text(), nullable=True))
    op.create_index(
        "ix_user_scholarship_matches_profile_fingerprint",
        "user_scholarship_matches",
        ["profile_fingerprint"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_user_scholarship_matches_profile_fingerprint", table_name="user_scholarship_matches")
    op.drop_column("user_scholarship_matches", "personalized_reasoning")
    op.drop_column("user_scholarship_matches", "match_summary")
    op.drop_column("user_scholarship_matches", "profile_fingerprint")
    op.drop_column("user_scholarship_matches", "llm_confidence")
    op.drop_column("user_scholarship_matches", "llm_score")
    op.drop_column("user_scholarship_matches", "rule_score")
