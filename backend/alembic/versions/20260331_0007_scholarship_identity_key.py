"""add scholarship identity key and relax source_url uniqueness

Revision ID: 20260331_0007
Revises: 20260329_0006
Create Date: 2026-03-31 00:07:00
"""

from __future__ import annotations

import hashlib

from alembic import op
import sqlalchemy as sa


revision = "20260331_0007"
down_revision = "20260329_0006"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("scholarships", sa.Column("scholarship_key", sa.String(length=64), nullable=True))

    connection = op.get_bind()
    rows = connection.execute(
        sa.text("SELECT id, COALESCE(source_key, '') AS source_key, source_url, title FROM scholarships")
    ).mappings()

    for row in rows:
        payload = f"{row['source_key']}|{row['source_url']}|{row['title']}".encode("utf-8")
        scholarship_key = hashlib.sha1(payload).hexdigest()
        connection.execute(
            sa.text("UPDATE scholarships SET scholarship_key = :scholarship_key WHERE id = :id"),
            {"id": row["id"], "scholarship_key": scholarship_key},
        )

    op.alter_column("scholarships", "scholarship_key", existing_type=sa.String(length=64), nullable=False)
    op.drop_constraint("uq_scholarships_source_url", "scholarships", type_="unique")
    op.create_unique_constraint("uq_scholarships_scholarship_key", "scholarships", ["scholarship_key"])
    op.create_index("ix_scholarships_scholarship_key", "scholarships", ["scholarship_key"], unique=False)
    op.create_index("ix_scholarships_source_url", "scholarships", ["source_url"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_scholarships_source_url", table_name="scholarships")
    op.drop_index("ix_scholarships_scholarship_key", table_name="scholarships")
    op.drop_constraint("uq_scholarships_scholarship_key", "scholarships", type_="unique")
    op.create_unique_constraint("uq_scholarships_source_url", "scholarships", ["source_url"])
    op.drop_column("scholarships", "scholarship_key")
