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
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
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

    const handleInviteMember = async (e) => {
        e.preventDefault();
        try {
            await projects.addMember(currentProject.uid, inviteEmail);
            setShowInviteModal(false);
            setInviteEmail('');
            alert('Member invited successfully!');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to invite member');
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1.5rem 0' }}>
                    <div style={{ background: 'var(--primary)', padding: '0.6rem', borderRadius: '10px', boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)' }}>
                        <Kanban size={22} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Pro Manage</h2>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', padding: '0 0.5rem' }}>
                        <h3 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', fontWeight: 700 }}>Workspaces</h3>
                        <button
                            onClick={() => setShowNewProjectModal(true)}
                            style={{ background: 'rgba(99, 102, 241, 0.1)', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '4px', borderRadius: '6px' }}
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {projectList.map(proj => (
                            <button
                                key={proj.uid}
                                onClick={() => setCurrentProject(proj)}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '0.9rem 1rem',
                                    borderRadius: '10px',
                                    background: currentProject?.uid === proj.uid ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                    color: currentProject?.uid === proj.uid ? 'var(--primary)' : 'var(--text-muted)',
                                    border: '1px solid',
                                    borderColor: currentProject?.uid === proj.uid ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    fontWeight: currentProject?.uid === proj.uid ? 600 : 400
                                }}
                            >
                                <Folder size={18} style={{ opacity: currentProject?.uid === proj.uid ? 1 : 0.6 }} />
                                {proj.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', background: 'none', border: 'none', padding: '0.8rem 1rem', cursor: 'pointer', fontSize: '0.9rem', borderRadius: '8px' }}>
                        <Settings size={18} /> Settings
                    </button>
                    <button
                        onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)', border: 'none', padding: '0.8rem 1rem', cursor: 'pointer', fontSize: '0.9rem', borderRadius: '8px' }}
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="content">
                {/* Top Nav */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                className="input-field"
                                placeholder="Search tasks..."
                                style={{ width: '350px', paddingLeft: '3rem', background: 'var(--bg-card)', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px' }}><Bell size={20} /></button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-card)', padding: '0.5rem 1.25rem 0.5rem 0.5rem', borderRadius: '40px', border: '1px solid var(--glass-border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #818cf8)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: 'white', fontSize: '0.9rem' }}>
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>{userName}</span>
                        </div>
                    </div>
                </header>

                <section className="animate-fade">
                    {currentProject ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '3rem' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        <div style={{ width: '12px', height: '2px', background: 'var(--primary)' }}></div>
                                        Active Workspace
                                    </div>
                                    <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.75rem' }}>{currentProject.name}</h1>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', lineHeight: '1.6' }}>{currentProject.description || 'Manage your project tasks, collaborate with your team, and track progress in real-time.'}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', paddingBottom: '0.5rem' }}>
                                    <button onClick={() => setShowInviteModal(true)} className="btn-primary" style={{ background: 'var(--glass)', color: 'var(--text)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1.5rem' }}>
                                        <User size={18} /> Invite Team
                                    </button>
                                </div>
                            </div>

                            <Board project={currentProject} />
                        </>
                    ) : (
                        <div style={{ display: 'flex', height: '60vh', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)', gap: '2rem' }}>
                            <div style={{ padding: '2.5rem', borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 1)' }}>
                                <Folder size={64} style={{ opacity: 0.3 }} />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <h2 style={{ fontSize: '1.75rem', color: 'var(--text)', marginBottom: '0.75rem' }}>No Workspace Selected</h2>
                                <p style={{ maxWidth: '400px' }}>Select a project from the sidebar to start managing tasks or create a brand new workspace for your team.</p>
                            </div>
                            <button onClick={() => setShowNewProjectModal(true)} className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                                Create Your First Project
                            </button>
                        </div>
                    )}
                </section>
            </main>

            {/* New Project Modal */}
            {showNewProjectModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(12px)', zIndex: 1000 }} className="animate-fade">
                    <div className="glass-panel" style={{ padding: '3rem', width: '480px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>New Workspace</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Set up a professional environment for your project.</p>

                        <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>Project Name</label>
                                <input
                                    className="input-field"
                                    placeholder="e.g. Q1 Marketing Campaign"
                                    value={newProjectName}
                                    onChange={e => setNewProjectName(e.target.value)}
                                    autoFocus
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowNewProjectModal(false)} style={{ flex: 1, padding: '1rem', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 2 }}>Create Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Invite Modal */}
            {showInviteModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(12px)', zIndex: 1000 }} className="animate-fade">
                    <div className="glass-panel" style={{ padding: '3rem', width: '480px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Invite Collaborator</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Add a team member to <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{currentProject?.name}</span></p>

                        <form onSubmit={handleInviteMember} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>Team Member Email</label>
                                <input
                                    className="input-field"
                                    placeholder="name@company.com"
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                    autoFocus
                                    type="email"
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowInviteModal(false)} style={{ flex: 1, padding: '1rem', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 2 }}>Add to Workspace</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
