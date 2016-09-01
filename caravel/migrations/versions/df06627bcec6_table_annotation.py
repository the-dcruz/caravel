"""empty message

Revision ID: df06627bcec6
Revises: f162a1dea4c4
Create Date: 2016-08-24 18:00:56.437531

"""

# revision identifiers, used by Alembic.
revision = 'df06627bcec6'
down_revision = 'f162a1dea4c4'

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
