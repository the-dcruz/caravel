"""Add columns for annotation support

Revision ID: bc4ec44dd6d3
Revises: 41f6a59a61f2
Create Date: 2016-09-12 14:57:35.706872

"""

# revision identifiers, used by Alembic.
revision = 'bc4ec44dd6d3'
down_revision = '41f6a59a61f2'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('tables', sa.Column('annotation', sa.Boolean(), default=False))
    op.add_column('table_columns', sa.Column('annotation_time', sa.Boolean(), default=False))
    op.add_column('table_columns', sa.Column('annotation_value', sa.Boolean(), default=False))


def downgrade():
    op.drop_column('tables', 'annotation')
    op.drop_column('table_columns', 'annotation_time')
    op.drop_column('table_columns', 'annotation_value')
