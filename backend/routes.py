from flask import current_app as app, jsonify, request, render_template
from flask_security import auth_required, hash_password, verify_password
from backend.models import db

datastore = app.security.datastore

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400
    
    user = datastore.find_user(email=email)
    print(user)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    if verify_password(password, user.password):
        return jsonify({'user_name': user.name,'token': user.get_auth_token(), 'email': user.email, 'role': user.roles[0].name, 'id': user.id, }), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    phone = data.get('phone')
    address = data.get('address')
    pincode = data.get('pincode')
    role = data.get('role')

    if not email or not password or role not in ['admin', 'customer', 'emp']:
        return jsonify({'message': 'All fields are required'}), 400
    
    if datastore.find_user(email=email):
        return jsonify({'message': 'User already exists'}), 409
    
    try:
        datastore.create_user(
            email=email,
            password=hash_password(password),
            name=name,
            phone=phone,
            address=address,
            pincode=pincode,
            roles=[datastore.find_or_create_role(role)]
        )
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
    except:
        db.session.rollback()
        return jsonify({'message': 'Something went wrong'}), 500
