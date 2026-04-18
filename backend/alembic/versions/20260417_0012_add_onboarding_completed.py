"""add_onboarding_completed

Revision ID: 20260417_0012
Revises: b47ae6fdebb3
Create Date: 2026-04-17 19:59:16.310628
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20260417_0012'
down_revision = 'b47ae6fdebb3'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'users',
        sa.Column(
            'onboarding_completed',
            sa.Boolean(),
            server_default=sa.text('false'),
            nullable=False,
        ),
    )


def downgrade() -> None:
    op.drop_column('users', 'onboarding_completed')
