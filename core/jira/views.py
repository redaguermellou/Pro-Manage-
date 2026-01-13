import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from neomodel import db
from .models import User, Project, Task
from .utils import hash_password, check_password, validate_email, validate_password

@csrf_exempt
def register(request):
    if request.method == 'POST':
        try:
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON in request body'}, status=400)

            email = data.get('email')
            password = data.get('password')
            name = data.get('name')

            if not email or not password or not name:
                return JsonResponse({'error': 'Name, email and password are required'}, status=400)

            if not validate_email(email):
                return JsonResponse({'error': 'Invalid email format'}, status=400)
            
            # Temporarily relaxed password validation for easier testing if needed, or keep it strict
            if not validate_password(password):
                return JsonResponse({'error': 'Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character'}, status=400)

            if User.nodes.get_or_none(email=email):
                return JsonResponse({'error': 'User with this email already exists'}, status=400)

            hashed = hash_password(password)
            user = User(email=email, password=hashed, name=name).save()
            
            return JsonResponse({
                'message': 'User registered successfully', 
                'uid': user.uid,
                'name': user.name
            }, status=201)
        except Exception as e:
            print(f"Registration Error: {str(e)}")
            return JsonResponse({'error': 'Internal server error during registration'}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON in request body'}, status=400)

            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return JsonResponse({'error': 'Email and password are required'}, status=400)

            user = User.nodes.get_or_none(email=email)
            if not user or not check_password(password, user.password):
                return JsonResponse({'error': 'Invalid email or password'}, status=401)

            return JsonResponse({
                'message': 'Login successful', 
                'uid': user.uid, 
                'name': user.name,
                'email': user.email
            }, status=200)
        except Exception as e:
            print(f"Login Error: {str(e)}")
            return JsonResponse({'error': 'Internal server error during login'}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def create_project(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_uid = data.get('user_uid')
            name = data.get('name')
            description = data.get('description', '')

            if not user_uid or not name:
                return JsonResponse({'error': 'User UID and Name are required'}, status=400)

            user = User.nodes.get_or_none(uid=user_uid)
            if not user:
                return JsonResponse({'error': 'User not found'}, status=404)

            project = Project(name=name, description=description).save()
            user.projects.connect(project)
            
            return JsonResponse({
                'message': 'Project created successfully', 
                'uid': project.uid,
                'name': project.name
            }, status=201)
        except Exception as e:
            print(f"Create Project Error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

def get_projects(request):
    if request.method == 'GET':
        try:
            user_uid = request.GET.get('user_uid')
            if not user_uid:
                return JsonResponse({'error': 'user_uid is required'}, status=400)

            user = User.nodes.get_or_none(uid=user_uid)
            if not user:
                return JsonResponse({'error': 'User not found'}, status=404)
            
            project_list = []
            for proj in user.projects.all():
                project_list.append({
                    'uid': proj.uid,
                    'name': proj.name,
                    'description': proj.description,
                    'start_date': proj.start_date.isoformat() if proj.start_date else None
                })
            return JsonResponse({'projects': project_list}, status=200)
        except Exception as e:
            print(f"Get Projects Error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

def get_project_members(request):
    if request.method == 'GET':
        try:
            project_uid = request.GET.get('project_uid')
            if not project_uid:
                return JsonResponse({'error': 'project_uid is required'}, status=400)

            project = Project.nodes.get_or_none(uid=project_uid)
            if not project:
                return JsonResponse({'error': 'Project not found'}, status=404)
            
            members = []
            for member in project.members.all():
                members.append({
                    'uid': member.uid,
                    'name': member.name,
                    'email': member.email
                })
            return JsonResponse({'members': members}, status=200)
        except Exception as e:
            print(f"Get Project Members Error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def add_project_member(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            project_uid = data.get('project_uid')
            email = data.get('email')

            if not project_uid or not email:
                return JsonResponse({'error': 'Project UID and User Email are required'}, status=400)

            project = Project.nodes.get_or_none(uid=project_uid)
            if not project:
                return JsonResponse({'error': 'Project not found'}, status=404)

            user = User.nodes.get_or_none(email=email)
            if not user:
                return JsonResponse({'error': 'User with this email not found'}, status=404)

            if project.members.is_connected(user):
                return JsonResponse({'error': 'User is already a member of this project'}, status=400)

            project.members.connect(user)
            return JsonResponse({'message': 'Member added successfully'}, status=200)
        except Exception as e:
            print(f"Add Member Error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def create_task(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            project_uid = data.get('project_uid')
            title = data.get('title')
            description = data.get('description', '')
            priority = data.get('priority', 'MEDIUM')
            assignee_uid = data.get('assignee_uid')

            if not project_uid or not title:
                return JsonResponse({'error': 'Project UID and Title are required'}, status=400)

            project = Project.nodes.get_or_none(uid=project_uid)
            if not project:
                return JsonResponse({'error': 'Project not found'}, status=404)

            task = Task(title=title, description=description, priority=priority).save()
            project.tasks.connect(task)

            if assignee_uid:
                assignee = User.nodes.get_or_none(uid=assignee_uid)
                if assignee:
                    task.assignee.connect(assignee)

            return JsonResponse({'message': 'Task created successfully', 'uid': task.uid}, status=201)
        except Exception as e:
            print(f"Create Task Error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

def get_tasks(request):
    if request.method == 'GET':
        try:
            project_uid = request.GET.get('project_uid')
            if not project_uid:
                return JsonResponse({'error': 'project_uid is required'}, status=400)

            project = Project.nodes.get_or_none(uid=project_uid)
            if not project:
                return JsonResponse({'error': 'Project not found'}, status=404)

            task_list = []
            for task in project.tasks.all():
                assignee = task.assignee.single()
                task_list.append({
                    'uid': task.uid,
                    'title': task.title,
                    'description': task.description,
                    'status': task.status,
                    'priority': task.priority,
                    'assignee': {
                        'uid': assignee.uid,
                        'name': assignee.name
                    } if assignee else None,
                    'created_at': task.created_at.isoformat() if task.created_at else None
                })
            return JsonResponse({'tasks': task_list}, status=200)
        except Exception as e:
            print(f"Get Tasks Error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def update_task_status(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            task_uid = data.get('task_uid')
            new_status = data.get('status')

            if not task_uid or not new_status:
                return JsonResponse({'error': 'Task UID and new status are required'}, status=400)

            task = Task.nodes.get_or_none(uid=task_uid)
            if not task:
                return JsonResponse({'error': 'Task not found'}, status=404)

            if new_status in ['TODO', 'IN_PROGRESS', 'DONE']:
                task.status = new_status
                task.save()
                return JsonResponse({'message': 'Task status updated successfully'}, status=200)
            else:
                return JsonResponse({'error': f'Invalid status: {new_status}. Must be one of TODO, IN_PROGRESS, DONE.'}, status=400)
        except Exception as e:
            print(f"Update Task Error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def delete_task(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            task_uid = data.get('task_uid')
            if not task_uid:
                return JsonResponse({'error': 'task_uid is required'}, status=400)
            
            task = Task.nodes.get_or_none(uid=task_uid)
            if not task:
                return JsonResponse({'error': 'Task not found'}, status=404)
            
            task.delete()
            return JsonResponse({'message': 'Task deleted successfully'}, status=200)
        except Exception as e:
            print(f"Delete Task Error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)
