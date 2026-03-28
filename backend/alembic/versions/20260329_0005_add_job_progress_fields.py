"""add crawl job progress fields

Revision ID: 20260329_0005
Revises: 20260329_0004
Create Date: 2026-03-29 00:00:05
"""

from alembic import op
import sqlalchemy as sa


revision = "20260329_0005"
down_revision = "20260329_0004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("crawl_jobs", sa.Column("total_items", sa.Integer(), nullable=False, server_default="0"))
    op.add_column("crawl_jobs", sa.Column("processed_items", sa.Integer(), nullable=False, server_default="0"))
    op.add_column("crawl_jobs", sa.Column("success_count", sa.Integer(), nullable=False, server_default="0"))
    op.add_column("crawl_jobs", sa.Column("failed_count", sa.Integer(), nullable=False, server_default="0"))
    op.add_column("crawl_jobs", sa.Column("log_output", sa.Text(), nullable=True))
    op.add_column(
        "crawl_jobs",
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
    )


def downgrade() -> None:
    op.drop_column("crawl_jobs", "updated_at")
    op.drop_column("crawl_jobs", "log_output")
    op.drop_column("crawl_jobs", "failed_count")
    op.drop_column("crawl_jobs", "success_count")
    op.drop_column("crawl_jobs", "processed_items")
    op.drop_column("crawl_jobs", "total_items")
