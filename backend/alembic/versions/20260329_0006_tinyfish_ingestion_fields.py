"""add tinyfish ingestion fields

Revision ID: 20260329_0006
Revises: 20260329_0005
Create Date: 2026-03-29 06:00:00
"""

from alembic import op
import sqlalchemy as sa


revision = "20260329_0006"
down_revision = "20260329_0005"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("scholarship_sources", sa.Column("last_success_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("scholarship_sources", sa.Column("last_run_id", sa.String(length=120), nullable=True))
    op.add_column("scholarship_sources", sa.Column("last_error", sa.Text(), nullable=True))

    op.add_column("scholarships", sa.Column("region", sa.String(length=120), nullable=True))
    op.add_column("scholarships", sa.Column("source_key", sa.String(length=120), nullable=True))
    op.add_column("scholarships", sa.Column("source_name", sa.String(length=255), nullable=True))
    op.add_column("scholarships", sa.Column("official_source", sa.Boolean(), nullable=False, server_default=sa.true()))
    op.add_column("scholarships", sa.Column("funding_type", sa.String(length=120), nullable=True))
    op.add_column("scholarships", sa.Column("coverage_summary", sa.Text(), nullable=True))
    op.add_column("scholarships", sa.Column("is_fully_funded", sa.Boolean(), nullable=True))
    op.add_column("scholarships", sa.Column("field_of_study", sa.JSON(), nullable=False, server_default=sa.text("'[]'")))
    op.add_column("scholarships", sa.Column("eligible_countries", sa.JSON(), nullable=False, server_default=sa.text("'[]'")))
    op.add_column("scholarships", sa.Column("raw_payload", sa.JSON(), nullable=False, server_default=sa.text("'{}'")))
    op.add_column("scholarships", sa.Column("extracted_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("scholarships", sa.Column("last_verified_at", sa.DateTime(timezone=True), nullable=True))

    op.alter_column("scholarships", "deadline", existing_type=sa.Date(), nullable=True)

    op.create_index("ix_scholarships_region", "scholarships", ["region"], unique=False)
    op.create_index("ix_scholarships_source_key", "scholarships", ["source_key"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_scholarships_source_key", table_name="scholarships")
    op.drop_index("ix_scholarships_region", table_name="scholarships")

    op.alter_column("scholarships", "deadline", existing_type=sa.Date(), nullable=False)

    op.drop_column("scholarships", "last_verified_at")
    op.drop_column("scholarships", "extracted_at")
    op.drop_column("scholarships", "raw_payload")
    op.drop_column("scholarships", "eligible_countries")
    op.drop_column("scholarships", "field_of_study")
    op.drop_column("scholarships", "is_fully_funded")
    op.drop_column("scholarships", "coverage_summary")
    op.drop_column("scholarships", "funding_type")
    op.drop_column("scholarships", "official_source")
    op.drop_column("scholarships", "source_name")
    op.drop_column("scholarships", "source_key")
    op.drop_column("scholarships", "region")

    op.drop_column("scholarship_sources", "last_error")
    op.drop_column("scholarship_sources", "last_run_id")
    op.drop_column("scholarship_sources", "last_success_at")
