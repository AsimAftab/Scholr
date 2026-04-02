"""add admin runtime ai settings

Revision ID: 20260403_0010
Revises: 20260403_0009
Create Date: 2026-04-03 00:10:00
"""

from alembic import op
import sqlalchemy as sa


revision = "20260403_0010"
down_revision = "20260403_0009"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "admin_runtime_settings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("ai_provider", sa.String(length=50), nullable=False),
        sa.Column("ai_fallback_order", sa.Text(), nullable=False),
        sa.Column("openai_model", sa.String(length=120), nullable=False),
        sa.Column("cerebras_model", sa.String(length=120), nullable=False),
        sa.Column("cerebras_max_completion_tokens", sa.Integer(), nullable=False),
        sa.Column("glm_model", sa.String(length=120), nullable=False),
        sa.Column("glm_base_url", sa.String(length=500), nullable=False),
        sa.Column("ollama_model", sa.String(length=120), nullable=False),
        sa.Column("ollama_base_url", sa.String(length=500), nullable=False),
        sa.Column("ollama_timeout_seconds", sa.Integer(), nullable=False),
        sa.Column("ollama_keep_alive", sa.String(length=50), nullable=False),
        sa.Column("llm_match_top_n", sa.Integer(), nullable=False),
        sa.Column("llm_match_rule_weight", sa.String(length=20), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_admin_runtime_settings_id", "admin_runtime_settings", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_admin_runtime_settings_id", table_name="admin_runtime_settings")
    op.drop_table("admin_runtime_settings")
