"""Annotation Support

Revision ID: 3196bd55582b
Revises: 3b626e2a6783
Create Date: 2016-09-28 17:08:46.950505

"""

# revision identifiers, used by Alembic.
revision = '3196bd55582b'
down_revision = '3b626e2a6783'

from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('tables', sa.Column('annotation', sa.Boolean(), server_default='0'))
    op.add_column('table_columns', sa.Column('annotation_time', sa.Boolean(), server_default='0'))
    op.add_column('table_columns', sa.Column('annotation_value', sa.Boolean(), server_default='0'))
    op.add_column('table_columns', sa.Column('annotation_text', sa.Boolean(), server_default='0'))


def downgrade():
    op.drop_column('tables', 'annotation')
    op.drop_column('table_columns', 'annotation_time')
    op.drop_column('table_columns', 'annotation_value')
    op.drop_column('table_columns', 'annotation_text')
