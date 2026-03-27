"""initial schema

Revision ID: 20260328_0001
Revises:
Create Date: 2026-03-28 00:00:01
"""

from alembic import op
import sqlalchemy as sa


revision = "20260328_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "profiles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("country", sa.String(length=120), nullable=False),
        sa.Column("target_country", sa.String(length=120), nullable=False),
        sa.Column("degree", sa.String(length=120), nullable=False),
        sa.Column("gpa", sa.Float(), nullable=False),
        sa.Column("ielts_score", sa.Float(), nullable=False),
    )
    op.create_index("ix_profiles_id", "profiles", ["id"], unique=False)

    op.create_table(
        "scholarships",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("country", sa.String(length=120), nullable=False),
        sa.Column("degree", sa.String(length=120), nullable=False),
        sa.Column("source_url", sa.String(length=500), nullable=False),
        sa.Column("deadline", sa.Date(), nullable=False),
        sa.Column("eligibility_text", sa.Text(), nullable=False),
        sa.Column("structured_eligibility", sa.JSON(), nullable=False),
    )
    op.create_index("ix_scholarships_id", "scholarships", ["id"], unique=False)
    op.create_index("ix_scholarships_title", "scholarships", ["title"], unique=False)
    op.create_index("ix_scholarships_country", "scholarships", ["country"], unique=False)
    op.create_unique_constraint("uq_scholarships_source_url", "scholarships", ["source_url"])

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("profile_id", sa.Integer(), sa.ForeignKey("profiles.id"), nullable=True),
    )
    op.create_index("ix_users_id", "users", ["id"], unique=False)
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_unique_constraint("uq_users_profile_id", "users", ["profile_id"])


def downgrade() -> None:
    op.drop_constraint("uq_users_profile_id", "users", type_="unique")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_index("ix_users_id", table_name="users")
    op.drop_table("users")

    op.drop_constraint("uq_scholarships_source_url", "scholarships", type_="unique")
    op.drop_index("ix_scholarships_country", table_name="scholarships")
    op.drop_index("ix_scholarships_title", table_name="scholarships")
    op.drop_index("ix_scholarships_id", table_name="scholarships")
    op.drop_table("scholarships")

    op.drop_index("ix_profiles_id", table_name="profiles")
    op.drop_table("profiles")

