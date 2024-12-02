from celery.schedules import crontab
from flask import current_app as app
from backend.celery.task import email_reminder, send_monthly_stats

celery_app = app.extensions['celery']

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # every 10 seconds
    # sender.add_periodic_task(10.0, email_reminder.s('students@gmail', 'reminder to login', '<h1> hello everyone </h1>') )

    sender.add_periodic_task(crontab(hour=18, minute=55), email_reminder.s('students@gmail', 'reminder to login', '<h1> hello everyone </h1>'), name='daily reminder' )

    # weekly messages
    sender.add_periodic_task(crontab(hour=18, minute=55, day_of_week='monday'), email_reminder.s('students@gmail', 'reminder to login', '<h1> hello everyone </h1>'), name = 'weekly reminder' ) 

    # Schedule the task to run at midnight on the first day of every month
    sender.add_periodic_task(
        crontab(hour=0, minute=0, day_of_month='1'),
        send_monthly_stats.s(),
        name='send_monthly_stats'
    )

@celery_app.task
def test(arg):
    print(arg)