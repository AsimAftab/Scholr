"""add_crawl_jobs_source_key_fk

Revision ID: 20260417_0013
Revises: 20260417_0012
Create Date: 2026-04-17 19:59:16.310628
"""
from alembic import op


# revision identifiers, used by Alembic.
revision = '20260417_0013'
down_revision = '20260417_0012'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_foreign_key(
        'fk_crawl_jobs_source_key_scholarship_sources',
        'crawl_jobs',
        'scholarship_sources',
        ['source_key'],
        ['source_key'],
    )


def downgrade() -> None:
    op.drop_constraint(
        'fk_crawl_jobs_source_key_scholarship_sources',
        'crawl_jobs',
        type_='foreignkey',
    )
