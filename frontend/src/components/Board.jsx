import { useState, useEffect } from 'react';
import { tasks, projects } from '../api';
import { Plus, MoreHorizontal, Clock, AlertCircle, CheckCircle2, Trash2, User as UserIcon } from 'lucide-react';

const Board = ({ project }) => {
    const [taskList, setTaskList] = useState([]);
    const [members, setMembers] = useState([]);
    const [showNewTaskId, setShowNewTaskId] = useState(null);
    const [newTask, setNewTask] = useState({ title: '', priority: 'MEDIUM', assignee_uid: '' });

    useEffect(() => {
        if (project) {
            loadTasks();
            loadMembers();
        }
    }, [project]);

    const loadTasks = async () => {
        try {
            const res = await tasks.list(project.uid);
            setTaskList(res.data.tasks);
        } catch (err) {
            console.error(err);
        }
    };

    const loadMembers = async () => {
        try {
            const res = await projects.getMembers(project.uid);
            setMembers(res.data.members);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateTask = async (status) => {
        if (!newTask.title.trim()) return;
        try {
            await tasks.create(
                project.uid,
                newTask.title,
                '',
                newTask.priority,
                newTask.assignee_uid || null
            );
            setNewTask({ title: '', priority: 'MEDIUM', assignee_uid: '' });
            setShowNewTaskId(null);
            loadTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleMoveTask = async (taskUid, newStatus) => {
        try {
            await tasks.updateStatus(taskUid, newStatus);
            loadTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteTask = async (taskUid) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await tasks.delete(taskUid);
            loadTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const columns = [
        { id: 'TODO', title: 'To Do', color: '#6366f1', icon: <AlertCircle size={16} /> },
        { id: 'IN_PROGRESS', title: 'In Progress', color: '#f59e0b', icon: <Clock size={16} /> },
        { id: 'DONE', title: 'Done', color: '#10b981', icon: <CheckCircle2 size={16} /> }
    ];

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return '#ef4444';
            case 'MEDIUM': return '#f59e0b';
            case 'LOW': return '#10b981';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', height: 'calc(100vh - 250px)' }}>
            {columns.map(col => (
                <div key={col.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'rgba(15, 23, 42, 0.3)' }}>
                    {/* Column Header */}
                    <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ color: col.color }}>{col.icon}</div>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.01em' }}>{col.title}</h3>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--glass-border)', padding: '0.1rem 0.5rem', borderRadius: '20px' }}>
                                {taskList.filter(t => t.status === col.id).length}
                            </span>
                        </div>
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><MoreHorizontal size={18} /></button>
                    </div>

                    {/* Task List */}
                    <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {taskList.filter(t => t.status === col.id).map(task => (
                            <div
                                key={task.uid}
                                className="animate-fade"
                                style={{
                                    background: 'var(--bg-card)',
                                    padding: '1.25rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--glass-border)',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.2s ease',
                                    position: 'relative'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                        color: getPriorityColor(task.priority),
                                        background: `${getPriorityColor(task.priority)}15`,
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '4px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        {task.status === 'DONE' ? 'DONE' : (task.priority || 'MEDIUM')}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteTask(task.uid)}
                                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                <div style={{ marginBottom: '1.25rem', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text)' }}>
                                    {task.title}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {task.assignee ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '0.6rem', fontWeight: 700 }}>
                                                    {task.assignee.name.charAt(0).toUpperCase()}
                                                </div>
                                                {task.assignee.name}
                                            </div>
                                        ) : (
                                            <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}>
                                                <UserIcon size={12} /> Unassigned
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                        {col.id !== 'TODO' && (
                                            <button onClick={() => handleMoveTask(task.uid, 'TODO')} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', cursor: 'pointer' }}>Todo</button>
                                        )}
                                        {col.id !== 'IN_PROGRESS' && (
                                            <button onClick={() => handleMoveTask(task.uid, 'IN_PROGRESS')} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', cursor: 'pointer' }}>Prog</button>
                                        )}
                                        {col.id !== 'DONE' && (
                                            <button onClick={() => handleMoveTask(task.uid, 'DONE')} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--primary)', border: 'none', color: 'white', cursor: 'pointer' }}>Done</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Inline Add Task */}
                        {col.id === 'TODO' && (
                            <div style={{ marginTop: '0.5rem' }}>
                                {showNewTaskId === col.id ? (
                                    <div className="glass-panel animate-fade" style={{ padding: '1rem', background: 'var(--bg-card)' }}>
                                        <input
                                            className="input-field"
                                            placeholder="Task title..."
                                            value={newTask.title}
                                            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                            autoFocus
                                            style={{ background: 'rgba(0,0,0,0.2)', marginBottom: '0.75rem' }}
                                        />
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                            <select
                                                className="input-field"
                                                style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)' }}
                                                value={newTask.priority}
                                                onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                                            >
                                                <option value="LOW">Low</option>
                                                <option value="MEDIUM">Medium</option>
                                                <option value="HIGH">High</option>
                                            </select>
                                            <select
                                                className="input-field"
                                                style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)' }}
                                                value={newTask.assignee_uid}
                                                onChange={e => setNewTask({ ...newTask, assignee_uid: e.target.value })}
                                            >
                                                <option value="">Assignee</option>
                                                {members.map(m => (
                                                    <option key={m.uid} value={m.uid}>{m.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => handleCreateTask(col.id)} className="btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}>Add</button>
                                            <button onClick={() => setShowNewTaskId(null)} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowNewTaskId(col.id)}
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            border: '1px dashed var(--glass-border)',
                                            background: 'transparent',
                                            color: 'var(--text-muted)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseOver={e => {
                                            e.currentTarget.style.borderColor = 'var(--primary)';
                                            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)';
                                            e.currentTarget.style.color = 'var(--text)';
                                        }}
                                        onMouseOut={e => {
                                            e.currentTarget.style.borderColor = 'var(--glass-border)';
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = 'var(--text-muted)';
                                        }}
                                    >
                                        <Plus size={18} /> Add New Task
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Board;
