from flask import Flask
from flask_security import Security, SQLAlchemyUserDatastore
from backend.configuration import development
from backend.models import db, Customer, Role
from backend.resources import api

def create_app():
    app = Flask(
        __name__,
        template_folder='frontend',
        static_folder='frontend'
    )
    app.config.from_object(development)

    db.init_app(app)

    # with app.app_context():
    #     db.create_all()

    datastore = SQLAlchemyUserDatastore(db, Customer, Role)
    app.security = Security(app, datastore=datastore, register_blueprint=False)
    app.app_context().push()

    api.init_app(app)

    return app

app = create_app()

import backend.innit_data
import backend.routes

if __name__ == '__main__':
    app.run()