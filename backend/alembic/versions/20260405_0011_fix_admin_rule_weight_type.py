"""fix admin rule weight type

Revision ID: 20260405_0011
Revises: 20260403_0010
Create Date: 2026-04-05 14:50:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20260405_0011'
down_revision = '20260403_0010'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Change llm_match_rule_weight from String to Float
    # Using postgres specific casting
    op.execute("ALTER TABLE admin_runtime_settings ALTER COLUMN llm_match_rule_weight TYPE FLOAT USING llm_match_rule_weight::double precision")
    
    # Add check constraints for AI parameters
    op.create_check_constraint(
        "ck_cerebras_max_tokens_positive",
        "admin_runtime_settings",
        "cerebras_max_completion_tokens > 0"
    )
    op.create_check_constraint(
        "ck_ollama_timeout_positive",
        "admin_runtime_settings",
        "ollama_timeout_seconds > 0"
    )
    op.create_check_constraint(
        "ck_llm_match_top_n_positive",
        "admin_runtime_settings",
        "llm_match_top_n > 0"
    )
    
    # Add server defaults missing in previous migration
    op.alter_column("admin_runtime_settings", "llm_match_top_n", server_default="12")
    op.alter_column("admin_runtime_settings", "llm_match_rule_weight", server_default="0.6")


def downgrade() -> None:
    op.drop_constraint("ck_llm_match_top_n_positive", "admin_runtime_settings")
    op.drop_constraint("ck_ollama_timeout_positive", "admin_runtime_settings")
    op.drop_constraint("ck_cerebras_max_tokens_positive", "admin_runtime_settings")
    
    op.execute("ALTER TABLE admin_runtime_settings ALTER COLUMN llm_match_rule_weight TYPE VARCHAR(20) USING llm_match_rule_weight::text")
    
    op.alter_column("admin_runtime_settings", "llm_match_top_n", server_default=None)
    op.alter_column("admin_runtime_settings", "llm_match_rule_weight", server_default=None)
