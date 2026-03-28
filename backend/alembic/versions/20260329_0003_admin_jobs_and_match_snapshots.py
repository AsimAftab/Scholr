"""add admin jobs, source registry, and user match snapshots

Revision ID: 20260329_0003
Revises: 20260328_0002
Create Date: 2026-03-29 00:00:03
"""

from alembic import op
import sqlalchemy as sa


revision = "20260329_0003"
down_revision = "20260328_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("role", sa.String(length=50), nullable=False, server_default="user"))
    op.create_index("ix_users_role", "users", ["role"], unique=False)

    op.create_table(
        "scholarship_sources",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("source_key", sa.String(length=120), nullable=False),
        sa.Column("source_name", sa.String(length=255), nullable=False),
        sa.Column("base_url", sa.String(length=500), nullable=False),
        sa.Column("country", sa.String(length=120), nullable=False),
        sa.Column("region", sa.String(length=120), nullable=False),
        sa.Column("fetcher_kind", sa.String(length=50), nullable=False, server_default="playwright"),
        sa.Column("official", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("enabled", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("last_crawled_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_scholarship_sources_id", "scholarship_sources", ["id"], unique=False)
    op.create_index("ix_scholarship_sources_source_key", "scholarship_sources", ["source_key"], unique=True)
    op.create_index("ix_scholarship_sources_country", "scholarship_sources", ["country"], unique=False)
    op.create_index("ix_scholarship_sources_region", "scholarship_sources", ["region"], unique=False)

    op.create_table(
        "crawl_jobs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("job_type", sa.String(length=50), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False, server_default="pending"),
        sa.Column("triggered_by_user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("target_user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("source_key", sa.String(length=120), nullable=True),
        sa.Column("country_filter", sa.String(length=120), nullable=True),
        sa.Column("region_filter", sa.String(length=120), nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("finished_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_crawl_jobs_id", "crawl_jobs", ["id"], unique=False)
    op.create_index("ix_crawl_jobs_job_type", "crawl_jobs", ["job_type"], unique=False)
    op.create_index("ix_crawl_jobs_status", "crawl_jobs", ["status"], unique=False)

    op.create_table(
        "user_scholarship_matches",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("scholarship_id", sa.Integer(), sa.ForeignKey("scholarships.id"), nullable=False),
        sa.Column("match_score", sa.Integer(), nullable=False),
        sa.Column("missing_requirements", sa.JSON(), nullable=False),
        sa.Column("computed_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("user_id", "scholarship_id", name="uq_user_scholarship_match"),
    )
    op.create_index("ix_user_scholarship_matches_id", "user_scholarship_matches", ["id"], unique=False)
    op.create_index("ix_user_scholarship_matches_user_id", "user_scholarship_matches", ["user_id"], unique=False)
    op.create_index(
        "ix_user_scholarship_matches_scholarship_id",
        "user_scholarship_matches",
        ["scholarship_id"],
        unique=False,
    )
    op.create_index("ix_user_scholarship_matches_match_score", "user_scholarship_matches", ["match_score"], unique=False)
    op.create_index("ix_user_scholarship_matches_computed_at", "user_scholarship_matches", ["computed_at"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_user_scholarship_matches_computed_at", table_name="user_scholarship_matches")
    op.drop_index("ix_user_scholarship_matches_match_score", table_name="user_scholarship_matches")
    op.drop_index("ix_user_scholarship_matches_scholarship_id", table_name="user_scholarship_matches")
    op.drop_index("ix_user_scholarship_matches_user_id", table_name="user_scholarship_matches")
    op.drop_index("ix_user_scholarship_matches_id", table_name="user_scholarship_matches")
    op.drop_table("user_scholarship_matches")

    op.drop_index("ix_crawl_jobs_status", table_name="crawl_jobs")
    op.drop_index("ix_crawl_jobs_job_type", table_name="crawl_jobs")
    op.drop_index("ix_crawl_jobs_id", table_name="crawl_jobs")
    op.drop_table("crawl_jobs")

    op.drop_index("ix_scholarship_sources_region", table_name="scholarship_sources")
    op.drop_index("ix_scholarship_sources_country", table_name="scholarship_sources")
    op.drop_index("ix_scholarship_sources_source_key", table_name="scholarship_sources")
    op.drop_index("ix_scholarship_sources_id", table_name="scholarship_sources")
    op.drop_table("scholarship_sources")

    op.drop_index("ix_users_role", table_name="users")
    op.drop_column("users", "role")
