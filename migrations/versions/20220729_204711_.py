"""empty message

Revision ID: fb45a9754301
Revises: 
Create Date: 2022-07-29 20:47:11.142493

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fb45a9754301'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=40), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.Column('photo_url', sa.String(length=2000), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('playlists',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('description', sa.String(length=255), nullable=True),
    sa.Column('cover_img_url', sa.String(length=2000), nullable=True),
    sa.Column('user_Id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_Id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('songs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('album', sa.String(length=50), nullable=False),
    sa.Column('albumImgUrl', sa.String(length=2000), nullable=True),
    sa.Column('genre', sa.String(length=25), nullable=False),
    sa.Column('artist', sa.String(length=50), nullable=False),
    sa.Column('source', sa.String(length=2000), nullable=True),
    sa.Column('user_Id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_Id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('playlist_songs',
    sa.Column('songs', sa.Integer(), nullable=False),
    sa.Column('playlists', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['playlists'], ['playlists.id'], ),
    sa.ForeignKeyConstraint(['songs'], ['songs.id'], ),
    sa.PrimaryKeyConstraint('songs', 'playlists')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('playlist_songs')
    op.drop_table('songs')
    op.drop_table('playlists')
    op.drop_table('users')
    # ### end Alembic commands ###
