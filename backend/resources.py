from flask import jsonify, request
from flask_restful import Api, Resource, fields, marshal_with
from flask_security import auth_required, current_user
from backend.models import db, Customer, Services

api = Api(prefix='/api')

service_fields = {
    'id': fields.Integer,
    'service': fields.String,
    'name': fields.String,
    'description': fields.String,
    'price': fields.String
}

class services_api(Resource):
    @auth_required('token')
    @marshal_with(service_fields)
    def get(self, id):
        service_instance = Services.query.get(id)
        if not service_instance:
            return {'message': 'No such service found'}, 404
        return service_instance
    
    @auth_required('token')
    @marshal_with(service_fields)
    def put(self, id):
        res = Services.query.get(id)
        if not res:
            return {'message': 'No such service found'}, 404
        if (res.user_id == current_user.id) or (current_user.has_role('admin')):
            data = request.get_json()
            res.service = data.get('service')
            res.name = data.get('name')
            res.description = data.get('description')
            res.price = data.get('price')
            try:
                db.session.commit()
                return {'message': 'Service updated'}, 200
            except:
                db.session.rollback()
                return {'message': 'Something went wrong'}, 500
        else:
            return {'message': 'not authorized to edit this'}, 403

    @auth_required('token')
    @marshal_with(service_fields)
    def delete(self, id):
        res = Services.query.get(id)
        if not res:
            return {'message': 'No such service found'}, 404
        if (res.user_id == current_user.id) or (current_user.has_role('admin')):
            try:
                db.session.delete(res)
                db.session.commit()
                return {'message': 'Service deleted'}, 200
            except:
                db.session.rollback()
                return {'message': 'Something went wrong'}, 500
        else:
            return {'message': 'not authorized to delete this'}, 403
        
class service_list_api(Resource):
    @auth_required('token')
    @marshal_with(service_fields)
    def get(self):
        serv = Services.query.all()
        service_instance = [
            {
                'id': s.id,
                'service': s.service,
                'name': s.name,
                'description': s.description,
                'price': s.price
            }
            for s in serv
        ]
        return service_instance
    
    @auth_required('token')
    def post(self):
        data = request.get_json()
        service = Services(
            service=data.get('service'),
            name=data.get('name'),
            description=data.get('description'),
            price=data.get('price'),
        )
        try:
            db.session.add(service)
            db.session.commit()
            return {'message': 'Service added'}, 200
        except:
            db.session.rollback()
            return {'message': 'Something went wrong'}, 500

api.add_resource(services_api, '/service/<int:id>')
api.add_resource(service_list_api, '/services')