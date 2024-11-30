from flask import current_app as app
from backend.models import db
from flask_security import SQLAlchemyUserDatastore, hash_password

with app.app_context():
    db.create_all()
    userdatastore: SQLAlchemyUserDatastore = app.security.datastore
    
    userdatastore.find_or_create_role(name='admin', description='Administrator')
    userdatastore.find_or_create_role(name='customer', description='User')
    userdatastore.find_or_create_role(name='emp', description='Service Provider')

    if not userdatastore.find_user(email='admin@gmail.com'):
        userdatastore.create_user(
            name='admin',
            email='admin@gmail.com',
            password=hash_password('1234'),
            phone='1234567890',
            address='admin address',
            pincode='123456',
            roles=[userdatastore.find_role('admin')]
        )
    if not userdatastore.find_user(email='user@gmail.com'):
        userdatastore.create_user(
            name='user',
            email='user@gmail.com',
            password=hash_password('1234'),
            phone='1234567890',
            address='user address',
            pincode='123456',
            roles=[userdatastore.find_role('customer')]
        )
    if not userdatastore.find_user(email='emp@gmail.com'):
        userdatastore.create_user(
            name='employee',
            email='emp@gmail.com',
            password=hash_password('1234'),
            phone='1234567890',
            address='employee address',
            pincode='123456',
            roles=[userdatastore.find_role('emp')]
        )
    db.session.commit()