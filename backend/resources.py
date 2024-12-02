from flask import jsonify, request, current_app as app
from flask_restful import Api, Resource, fields, marshal_with
from flask_security import auth_required, current_user
from backend.models import db, Customer, Services, Booking, Role
from datetime import datetime
from flask_caching import Cache
from backend.celery.mail import mail_them

api = Api(prefix='/api')
cache = app.cache

service_fields = {
    'id': fields.Integer,
    'service': fields.String,
    'name': fields.String,
    'description': fields.String,
    'price': fields.String,
    'emp_id': fields.Integer,
    'employee': fields.Nested({
        'id': fields.Integer,
        'name': fields.String
    })
}

customer_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'email': fields.String,
    'phone': fields.String,
    'address': fields.String,
    'pincode': fields.String,
    'active': fields.Boolean,
    'roles': fields.List(fields.Nested({
        'name': fields.String
    }))
}

booking_fields = {
    'id': fields.Integer,
    'customer': fields.Nested(customer_fields),
    'service': fields.Nested(service_fields),
    'employee': fields.Nested(customer_fields),
    'date': fields.DateTime,
    'status': fields.String
}

class services_api(Resource):
    @auth_required('token')
    @cache.cached(timeout=10, key_prefix='service_{id}')
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
        if (res.emp_id == current_user.id) or (current_user.has_role('admin')):
            data = request.get_json()
            res.service = data.get('service')
            res.name = data.get('name')
            res.description = data.get('description')
            res.price = data.get('price')
            try:
                db.session.commit()
                cache.delete(f'service_{id}')  # Delete the cache for the specific service
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
        if (res.emp_id == current_user.id) or (current_user.has_role('admin')):
            try:
                db.session.delete(res)
                db.session.commit()
                cache.delete(f'service_{id}')  # Delete the cache for the specific service
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
        services = Services.query.all()
        return services
    
    @auth_required('token')
    def post(self):
        if not current_user.has_role('emp'):
            return {'message': 'Only employees can create services'}, 403

        data = request.get_json()
        if not data.get('service') or not data.get('name') or not data.get('description') or not data.get('price'):
            return {'message': 'All fields are required'}, 400

        new_service = Services(
            service=data.get('service'),
            name=data.get('name'),
            description=data.get('description'),
            price=data.get('price'),
            emp_id=current_user.id
        )
        try:
            db.session.add(new_service)
            db.session.commit()
            return {'message': 'Service added'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': 'Something went wrong: ' + str(e)}, 500

class booking_api(Resource):
    @auth_required('token')
    @marshal_with(booking_fields)
    def get(self, id):
        booking_instance = Booking.query.get(id)
        if not booking_instance:
            return {'message': 'No such booking found'}, 404
        return booking_instance
    
    @auth_required('token')
    def put(self, id):
        data = request.get_json()
        booking_instance = Booking.query.get(id)
        if not booking_instance:
            return {'message': 'No such booking found'}, 404

        if current_user.has_role('emp'):
            if data.get('status') == 'Completed':
                return {'message': 'Employees cannot mark bookings as completed'}, 403
            booking_instance.status = data.get('status')
        elif current_user.has_role('customer'):
            if booking_instance.customer_id != current_user.id:
                return {'message': 'Not authorized to update this booking'}, 403
            booking_instance.status = data.get('status')
            booking_instance.rating = data.get('rating', booking_instance.rating)
            booking_instance.review = data.get('review', booking_instance.review)
        else:
            return {'message': 'Not authorized to update booking status'}, 403

        try:
            db.session.commit()
            # Send email notification to the customer about the booking status
            if booking_instance.status in ['Confirmed', 'Rejected']:
                customer_email = booking_instance.customer.email
                subject = f"Booking {booking_instance.status}"
                content = f"Your booking for the service '{booking_instance.service.name}' has been {booking_instance.status.lower()}."
                mail_them.delay(customer_email, subject, content)
            # Send email notification to the employee about the rating and review
            if booking_instance.status == 'Completed':
                employee_email = booking_instance.employee.email
                subject = "Service Rating and Review Received"
                content = f"Your service '{booking_instance.service.name}' has been rated {booking_instance.rating} stars.\n\nReview:\n{booking_instance.review}"
                mail_them.delay(employee_email, subject, content)
            return {'message': 'Booking status updated'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': 'Something went wrong: ' + str(e)}, 500

class booking_list_api(Resource):
    @auth_required('token')
    @marshal_with(booking_fields)
    def get(self):
        if current_user.has_role('emp'):
            bookings = Booking.query.filter_by(emp_id=current_user.id).all()
        elif current_user.has_role('customer'):
            bookings = Booking.query.filter_by(customer_id=current_user.id).all()
        else:
            return {'message': 'Not authorized to view bookings'}, 403
        
        detailed_bookings = []
        for booking in bookings:
            detailed_bookings.append({
                'id': booking.id,
                'customer': {
                    'id': booking.customer.id,
                    'name': booking.customer.name,
                    'email': booking.customer.email,
                    'phone': booking.customer.phone,
                    'address': booking.customer.address,
                    'pincode': booking.customer.pincode
                },
                'service': {
                    'id': booking.service.id,
                    'service': booking.service.service,
                    'name': booking.service.name,
                    'description': booking.service.description,
                    'price': booking.service.price,
                    'emp_id': booking.service.emp_id,
                    'employee': {
                        'id': booking.service.employee.id,
                        'name': booking.service.employee.name
                    }
                },
                'employee': {
                    'id': booking.employee.id,
                    'name': booking.employee.name,
                    'email': booking.employee.email,
                    'phone': booking.employee.phone,
                    'address': booking.employee.address,
                    'pincode': booking.employee.pincode
                },
                'date': booking.date,
                'status': booking.status
            })
        return detailed_bookings

    @auth_required('token')
    def post(self):
        data = request.get_json()
        if not data.get('service_id') or not data.get('emp_id') or not data.get('date'):
            return {'message': 'All fields are required'}, 400

        new_booking = Booking(
            customer_id=current_user.id,
            service_id=data.get('service_id'),
            emp_id=data.get('emp_id'),
            date=datetime.strptime(data.get('date'), '%Y-%m-%dT%H:%M'),  # Adjust the format if necessary
            status='Pending'
        )
        try:
            db.session.add(new_booking)
            db.session.commit()
            return {'message': 'Booking created'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': 'Something went wrong: ' + str(e)}, 500

class customer_list_api(Resource):
    @auth_required('token')
    @marshal_with(customer_fields)
    def get(self):
        if current_user.has_role('admin'):
            customers = Customer.query.filter(Customer.roles.any(Role.name != 'admin')).all()
            return customers
        else:
            return {'message': 'Not authorized to view customers'}, 403

class customer_api(Resource):
    @auth_required('token')
    def put(self, id):
        if not current_user.has_role('admin'):
            return {'message': 'Not authorized to update customer status'}, 403

        customer = Customer.query.get(id)
        if not customer:
            return {'message': 'No such customer found'}, 404

        data = request.get_json()
        customer.active = data.get('active', customer.active)

        try:
            db.session.commit()
            return {'message': 'Customer status updated'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': 'Something went wrong: ' + str(e)}, 500

api.add_resource(services_api, '/service/<int:id>')
api.add_resource(service_list_api, '/services')
api.add_resource(booking_api, '/bookings/<int:id>')
api.add_resource(booking_list_api, '/bookings')
api.add_resource(customer_list_api, '/customers')
api.add_resource(customer_api, '/customers/<int:id>')