class configuration:
    DEBUG = False
    SQL_ALCHEMY_TRACK_MODIFICATIONS = False

class development(configuration):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///database.sqlite3"
    SECURITY_PASSWORD_HASH = 'bcrypt'
    SECURITY_PASSWORD_SALT = 'a_secret_to_be_kept'
    SECRET_KEY = "things_to_be_kept_secret"
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'
    
    WTF_CSRF_ENABLED = False