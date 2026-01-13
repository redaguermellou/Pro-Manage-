from neomodel import StructuredNode, StringProperty, IntegerProperty, DateTimeProperty, RelationshipTo, RelationshipFrom, UniqueIdProperty, JSONProperty
import datetime

class User(StructuredNode):
    uid = UniqueIdProperty()
    name = StringProperty(required=True)
    email = StringProperty(unique_index=True, required=True)
    password = StringProperty(required=True)  # Hashed
    role = StringProperty(default='Member')
    avatar = StringProperty()
    
    # Relationships
    projects = RelationshipTo('Project', 'BELONGS_TO')
    tasks = RelationshipTo('Task', 'ASSIGNED_TO')

class Project(StructuredNode):
    uid = UniqueIdProperty()
    name = StringProperty(required=True)
    description = StringProperty()
    start_date = DateTimeProperty(default_now=True)
    end_date = DateTimeProperty()
    
    # Relationships
    members = RelationshipFrom('User', 'BELONGS_TO')
    tasks = RelationshipTo('Task', 'CONTAINS')

class Task(StructuredNode):
    uid = UniqueIdProperty()
    title = StringProperty(required=True)
    description = StringProperty()
    status = StringProperty(choices={'TODO': 'To Do', 'IN_PROGRESS': 'In Progress', 'DONE': 'Done'}, default='TODO')
    priority = StringProperty(choices={'LOW': 'Low', 'MEDIUM': 'Medium', 'HIGH': 'High'}, default='MEDIUM')
    created_at = DateTimeProperty(default_now=True)
    
    # Relationships
    project = RelationshipFrom('Project', 'CONTAINS')
    assignee = RelationshipFrom('User', 'ASSIGNED_TO')
