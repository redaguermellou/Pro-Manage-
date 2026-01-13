import re
import hashlib
import os

def validate_email(email):
    regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(regex, email)

def validate_password(password):
    # At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
    return re.search(regex, password)

def hash_password(password):
    # Using Django's built-in hashers is better if available, but for standalone util:
    # We will use Django's make_password if running in Django context, 
    # but to be safe and simple here without importing django conf immediately if not ready:
    from django.contrib.auth.hashers import make_password
    return make_password(password)

def check_password(password, encoded):
    from django.contrib.auth.hashers import check_password as django_check_password
    return django_check_password(password, encoded)
