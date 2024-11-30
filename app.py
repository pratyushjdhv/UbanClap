from flask import Flask
from flask_security import Security, SQLAlchemyUserDatastore, auth_required
from backend.configuration import development
from backend.models import db, Customer, Role
from flask_login import login_required
from flask_caching import Cache
from backend.celery.celery_init import celery_init_app
import flask_excel as excel


def create_app():
    app = Flask(
        __name__,
        template_folder='frontend',
        static_folder='frontend'
    )
    app.config.from_object(development)
    app.config.update({
        'SECURITY_REGISTERABLE': False,
        'SECURITY_RECOVERABLE': False,
        'SECURITY_CHANGEABLE': False,
        'SECURITY_LOGIN_URL': '/login',
    })
    db.init_app(app)

    cache = Cache(app)

    # with app.app_context():
    #     db.create_all()

    datastore = SQLAlchemyUserDatastore(db, Customer, Role)

    app.cache = cache

    app.security = Security(app, datastore=datastore, register_blueprint=False)
    app.app_context().push()
    
    from backend.resources import api

    api.init_app(app)

    return app

app = create_app()

celery_app = celery_init_app(app)


import backend.innit_data
import backend.routes
import backend.celery.celery_schedule

excel.init_excel(app)


if __name__ == '__main__':
    app.run()