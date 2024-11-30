from celery import shared_task
import time
import flask_excel
from backend.models import Services
from backend.celery.mail import mail_them


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

