from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

db = SQLAlchemy()

class Customer(db.Model, UserMixin):
    __tablename__ = 'customer'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(10))
    address = db.Column(db.String(255))
    pincode = db.Column(db.String(255))
    fs_uniquifier = db.Column(db.String, unique=True, nullable=False)
    active = db.Column(db.Boolean, default=True)
    roles = db.relationship('Role', secondary='roles_users', backref=db.backref('customers', lazy='dynamic'))

class Role(db.Model, RoleMixin):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('customer.id', ondelete='CASCADE'))
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id', ondelete='CASCADE'))

class Services(db.Model):
    __tablename__ = 'services'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    service = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    price = db.Column(db.String(255), nullable=False)
    emp_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)

    employee = db.relationship('Customer', backref=db.backref('services', lazy=True))

class Booking(db.Model):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    emp_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='Pending')

    customer = db.relationship('Customer', foreign_keys=[customer_id], backref=db.backref('bookings', lazy=True))
    service = db.relationship('Services', backref=db.backref('bookings', lazy=True))
    employee = db.relationship('Customer', foreign_keys=[emp_id], backref=db.backref('assigned_bookings', lazy=True))
