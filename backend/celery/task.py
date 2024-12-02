from celery import shared_task
import time
import flask_excel
from backend.models import Services, Booking, Customer
from backend.celery.mail import mail_them
from datetime import datetime, timedelta


@shared_task(bind = True, ignore_result = False)
def create_csv(self):
    resource = Services.query.all()
    task_id = self.request.id
    filename = f'blog_data_{task_id}.csv'
    column_names = [column.name for column in Services.__table__.columns]
    # print(column_names)
    csv_out = flask_excel.make_response_from_query_sets(resource, column_names = column_names, file_type='csv' )

    with open(f'./backend/celery/user_download/{filename}', 'wb') as file:
        file.write(csv_out.data)
    
    return filename

@shared_task(ignore_results = True)
def email_reminder(to, sub, content):
    mail_them(to,sub,content)

@shared_task
def send_stats_email(to_email):
    # Fetch booking stats
    bookings = Booking.query.all()
    status_counts = {}
    for booking in bookings:
        status_counts[booking.status] = status_counts.get(booking.status, 0) + 1

    # Fetch user stats
    users = Customer.query.all()
    user_counts = {'customer': 0, 'emp': 0}
    for user in users:
        for role in user.roles:
            if role.name in user_counts:
                user_counts[role.name] += 1

    # Create email content
    content = f"""
    <h1>Stats Summary</h1>
    <h2>Booking Status</h2>
    <ul>
        {''.join([f'<li>{status}: {count}</li>' for status, count in status_counts.items()])}
    </ul>
    <h2>User Distribution</h2>
    <ul>
        <li>Customers: {user_counts['customer']}</li>
        <li>Employees: {user_counts['emp']}</li>
    </ul>
    """

    mail_them(to_email, "Stats Summary", content)

@shared_task
def send_monthly_stats():
    # Get the first and last day of the previous month
    today = datetime.today()
    first_day_of_month = today.replace(day=1)
    last_day_of_last_month = first_day_of_month - timedelta(days=1)
    first_day_of_last_month = last_day_of_last_month.replace(day=1)

    # Fetch all employees
    employees = Customer.query.filter(Customer.roles.any(name='emp')).all()

    for employee in employees:
        # Fetch bookings for the employee in the last month
        bookings = Booking.query.filter(
            Booking.emp_id == employee.id,
            Booking.date >= first_day_of_last_month,
            Booking.date <= last_day_of_last_month
        ).all()

        # Calculate stats
        total_services = len(bookings)
        total_earnings = sum(booking.service.price for booking in bookings)
        total_ratings = sum(booking.rating for booking in bookings if booking.rating is not None)
        count_ratings = sum(1 for booking in bookings if booking.rating is not None)
        average_rating = total_ratings / count_ratings if count_ratings > 0 else 0

        # Generate email content
        email_content = f"""
        <h1>Monthly Summary for {last_day_of_last_month.strftime('%B %Y')}</h1>
        <p>Total Services Provided: {total_services}</p>
        <p>Total Earnings: ₹{total_earnings}</p>
        <p>Average Rating: {average_rating:.2f}</p>
        <p>Total Ratings: {count_ratings}</p>
        <h2>Detailed List of Services</h2>
        <ul>
        """
        for booking in bookings:
            email_content += f"<li>{booking.date.strftime('%Y-%m-%d')}: {booking.service.name} - Rating: {booking.rating}</li>"
        email_content += "</ul>"

        # Send email
        mail_them(employee.email, "Monthly Service Summary", email_content)
