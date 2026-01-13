import { useState, useEffect } from 'react';
import { tasks } from '../api';
import { Plus, MoreHorizontal, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

const Board = ({ project }) => {
    const [taskList, setTaskList] = useState([]);
    const [showNewTaskId, setShowNewTaskId] = useState(null);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    useEffect(() => {
        if (project) {
            loadTasks();
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

    const handleCreateTask = async (status) => {
        if (!newTaskTitle.trim()) return;
        try {
            await tasks.create(project.uid, newTaskTitle, '', 'MEDIUM', null);
            setNewTaskTitle('');
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
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
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
                                        {task.priority || 'MEDIUM'}
                                    </span>
                                </div>

                                <div style={{ marginBottom: '1.25rem', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text)' }}>
                                    {task.title}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                                    {col.id !== 'TODO' && (
                                        <button onClick={() => handleMoveTask(task.uid, 'TODO')} style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '6px', background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', cursor: 'pointer' }}>Todo</button>
                                    )}
                                    {col.id !== 'IN_PROGRESS' && (
                                        <button onClick={() => handleMoveTask(task.uid, 'IN_PROGRESS')} style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '6px', background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', cursor: 'pointer' }}>Prog</button>
                                    )}
                                    {col.id !== 'DONE' && (
                                        <button onClick={() => handleMoveTask(task.uid, 'DONE')} style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '6px', background: 'var(--primary)', border: 'none', color: 'white', cursor: 'pointer' }}>Done</button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Inline Add Task */}
                        {col.id === 'TODO' && (
                            <div style={{ marginTop: '0.5rem' }}>
                                {showNewTaskId === col.id ? (
                                    <form
                                        className="animate-fade"
                                        onSubmit={(e) => { e.preventDefault(); handleCreateTask(col.id); }}
                                    >
                                        <input
                                            className="input-field"
                                            placeholder="What needs to be done?"
                                            value={newTaskTitle}
                                            onChange={e => setNewTaskTitle(e.target.value)}
                                            autoFocus
                                            onBlur={() => !newTaskTitle && setShowNewTaskId(null)}
                                            style={{ background: 'var(--bg-card)', marginBottom: '0.5rem' }}
                                        />
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button type="submit" className="btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}>Add</button>
                                            <button type="button" onClick={() => setShowNewTaskId(null)} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Cancel</button>
                                        </div>
                                    </form>
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
