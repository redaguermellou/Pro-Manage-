import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Plus, LogOut, Kanban, Search, Bell, Settings, User, Folder } from 'lucide-react';
import { projects } from '../api';
import Board from '../components/Board';

const Dashboard = () => {
    const navigate = useNavigate();
    const [projectList, setProjectList] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const userUid = localStorage.getItem('user_uid');
    const userName = localStorage.getItem('user_name') || 'User';

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const res = await projects.list(userUid);
            setProjectList(res.data.projects);
            if (res.data.projects.length > 0 && !currentProject) {
                setCurrentProject(res.data.projects[0]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            await projects.create(userUid, newProjectName, '');
            setShowNewProjectModal(false);
            setNewProjectName('');
            loadProjects();
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user_uid');
        localStorage.removeItem('user_name');
        navigate('/login');
    };

    return (
        <div className="layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.5rem 0' }}>
                    <div style={{ background: 'var(--primary)', padding: '0.6rem', borderRadius: '10px' }}>
                        <Kanban size={22} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.25rem' }}>Pro Manage</h2>
                </div>

                <div style={{ marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 0.5rem' }}>
                        <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Workspaces</h3>
                        <button
                            onClick={() => setShowNewProjectModal(true)}
                            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {projectList.map(proj => (
                            <button
                                key={proj.uid}
                                onClick={() => setCurrentProject(proj)}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '0.8rem 1rem',
                                    borderRadius: '10px',
                                    background: currentProject?.uid === proj.uid ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                    color: currentProject?.uid === proj.uid ? 'var(--primary)' : 'var(--text-muted)',
                                    border: '1px solid',
                                    borderColor: currentProject?.uid === proj.uid ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontWeight: currentProject?.uid === proj.uid ? 600 : 400
                                }}
                            >
                                <Folder size={16} />
                                {proj.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', background: 'none', border: 'none', padding: '0.8rem 1rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                        <Settings size={18} /> Settings
                    </button>
                    <button
                        onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--danger)', background: 'none', border: 'none', padding: '0.8rem 1rem', cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="content">
                {/* Top Nav */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                className="input-field"
                                placeholder="Search tasks..."
                                style={{ width: '300px', paddingLeft: '2.5rem', background: 'var(--bg-card)', border: 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Bell size={20} /></button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-card)', padding: '0.4rem 1rem 0.4rem 0.4rem', borderRadius: '30px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{userName}</span>
                        </div>
                    </div>
                </header>

                <section className="animate-fade">
                    {currentProject ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <div>
                                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{currentProject.name}</h1>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{currentProject.description || 'Manage your project tasks and workflow efficiently.'}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button className="btn-primary" style={{ background: 'var(--glass)', color: 'var(--text)', border: '1px solid var(--glass-border)' }}>
                                        <User size={18} /> Share
                                    </button>
                                    <button className="btn-primary">
                                        <Plus size={18} /> New Task
                                    </button>
                                </div>
                            </div>

                            <Board project={currentProject} />
                        </>
                    ) : (
                        <div style={{ display: 'flex', height: '60vh', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)', gap: '1.5rem' }}>
                            <Folder size={64} style={{ opacity: 0.2 }} />
                            <div style={{ textAlign: 'center' }}>
                                <h2>No Workspace Selected</h2>
                                <p>Select a project from the sidebar or create a new one to begin.</p>
                            </div>
                            <button onClick={() => setShowNewProjectModal(true)} className="btn-primary">
                                Create Your First Project
                            </button>
                        </div>
                    )}
                </section>
            </main>

            {/* Modal */}
            {showNewProjectModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(8px)', zIndex: 1000 }} className="animate-fade">
                    <div className="glass-panel" style={{ padding: '2.5rem', width: '450px', background: 'var(--bg-dark)' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Create New Project</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Define a new workspace for your team.</p>

                        <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>Project Name</label>
                                <input
                                    className="input-field"
                                    placeholder="e.g. Marketing Launch 2024"
                                    value={newProjectName}
                                    onChange={e => setNewProjectName(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowNewProjectModal(false)} style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create Workspace</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
