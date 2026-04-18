"""consolidate_scholarship_key_index

Revision ID: 20260417_0014
Revises: 20260417_0013
Create Date: 2026-04-17 19:59:16.310628
"""
from alembic import op


# revision identifiers, used by Alembic.
revision = '20260417_0014'
down_revision = '20260417_0013'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_constraint('uq_scholarships_scholarship_key', 'scholarships', type_='unique')
    op.drop_index('ix_scholarships_scholarship_key', table_name='scholarships')
    op.create_index(
        op.f('ix_scholarships_scholarship_key'),
        'scholarships',
        ['scholarship_key'],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index(op.f('ix_scholarships_scholarship_key'), table_name='scholarships')
    op.create_index('ix_scholarships_scholarship_key', 'scholarships', ['scholarship_key'], unique=False)
    op.create_unique_constraint('uq_scholarships_scholarship_key', 'scholarships', ['scholarship_key'])
