from app.db.session import engine
from app import models


def init_db():
    print('Creating database tables...')
    models.Base.metadata.create_all(bind=engine)
    print('Done.')


if __name__ == '__main__':
    init_db()
