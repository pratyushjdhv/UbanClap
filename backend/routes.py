from flask import jsonify, request, render_template, current_app as app , send_file
from flask_security import auth_required, hash_password, verify_password
from backend.models import db
from backend.celery.task import create_csv
from celery.result import AsyncResult


datastore = app.security.datastore
cache = app.cache

@app.route('/')
def home():
    return render_template('index.html')

@auth_required("token")
@app.get('/getcsv/<id>')
def getCSV(id):
    result = AsyncResult(id)
    print('hi')
    print(result)
    print(result.ready())

    if result.ready():
        filename = result.result
        return send_file(f'./backend/celery/user_download/{filename}') #, as_attachment=True
    else:
        return {"status": "Processing"}, 202
    
    
@auth_required('token') 
@app.get('/createcsv')
def createCSV():
    task = create_csv.delay()
    return {'task_id' : task.id}, 200

# @app.get('/export/<id>')
# def export(id):
#     res = AsyncResult(id)
#     print(res)
#     print(res.ready())
#     if res.ready():
#         filename = res.result
#         print(filename)
#         return send_file(f'./backend/celery/downloadsservices{filename}'), 200
#     return jsonify({'message': 'Task not ready'}), 202

# @app.get('/create-csv')
# def create_csv():
#     task = export_services.delay()
#     return {'task_id': task.id}, 202


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400
    
    user = datastore.find_user(email=email)
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    if verify_password(password, user.password):
        return jsonify({
            'token': user.get_auth_token(),
            'email': user.email,
            'role': user.roles[0].name,
            'id': user.id,
            'name': user.name
        }), 200
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

    if not email or not password or not name or not phone or not address or not pincode or role not in ['admin', 'customer', 'emp']:
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
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Something went wrong: ' + str(e)}), 500
