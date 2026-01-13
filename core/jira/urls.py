from django.urls import path
from . import views

urlpatterns = [
    path('auth/register', views.register, name='register'),
    path('auth/login', views.login, name='login'),
    path('projects/create', views.create_project, name='create_project'),
    path('projects/list', views.get_projects, name='get_projects'),
    path('tasks/create', views.create_task, name='create_task'),
    path('tasks/list', views.get_tasks, name='get_tasks'),
    path('tasks/update', views.update_task_status, name='update_task_status'),
]