import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../context/auth';
import {
  LayoutDashboard, MessageSquare, GitBranch, Users, Brain, BookOpen,
  Settings, Variable, BarChart3, LogOut, ChevronLeft, ChevronRight, Menu,
  Bot
} from 'lucide-react';

const navSections = [
  {
    label: 'Main',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
      { icon: MessageSquare, label: 'Inbox', to: '/inbox' },
      { icon: Bot, label: 'Bots', to: '/bots' },
    ],
  },
  {
    label: 'Automation',
    items: [
      { icon: GitBranch, label: 'Flows', to: '/flows' },
    ],
  },
  {
    label: 'Audience',
    items: [
      { icon: Users, label: 'Subscribers', to: '/subscribers' },
    ],
  },
  {
    label: 'AI',
    items: [
      { icon: Brain, label: 'NLU', to: '/nlu' },
      { icon: BookOpen, label: 'Knowledge Base', to: '/knowledge' },
      { icon: Variable, label: 'Context Variables', to: '/context-variables' },
    ],
  },
  {
    label: 'System',
    items: [
      { icon: BarChart3, label: 'Analytics', to: '/analytics' },
      { icon: Settings, label: 'Settings', to: '/settings' },
    ],
  },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { botId } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return <Outlet />;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between h-14 px-3 border-b border-gray-700">
        {!collapsed && <span className="text-lg font-bold text-white truncate">ChatBot Platform</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-700 text-gray-400 hidden md:block"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        {navSections.map((section) => (
          <div key={section.label} className="mb-4">
            {!collapsed && (
              <div className="px-3 mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.label}
              </div>
            )}
            {section.items.map((item) => {
              const isActive = location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 mx-1 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-teal-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={18} className="shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-700 p-3">
        <div className={`flex items-center gap-2 mb-2 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          {!collapsed && <span className="text-sm text-gray-300 truncate">{user.name}</span>}
        </div>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm text-gray-400 hover:text-white hover:bg-gray-700 ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={16} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex bg-gray-900">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform transition-transform md:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </div>

      <aside className={`hidden md:flex flex-col bg-gray-800 border-r border-gray-700 shrink-0 transition-all duration-200 ${collapsed ? 'w-16' : 'w-56'}`}>
        {sidebarContent}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-3 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-1 rounded hover:bg-gray-700 text-gray-400"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          {botId && (
            <Link to={`/bots/${botId}`} className="text-sm text-gray-400 hover:text-white">
              Back to Bots
            </Link>
          )}
        </header>

        <main className="flex-1 overflow-auto bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
