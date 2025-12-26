import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  FolderPlusIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  EnvelopeIcon,
  LinkIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
import DashboardOverview from '../components/dashboard/DashboardOverview';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Edit Profile',
      description: 'Update your professional information',
      icon: UserCircleIcon,
      color: 'blue',
      onClick: () => navigate('/profile'),
    },
    {
      title: 'Add Project',
      description: 'Showcase your work',
      icon: FolderPlusIcon,
      color: 'emerald',
      onClick: () => navigate('/projects/new'),
    },
    {
      title: 'Preview Portfolio',
      description: 'See your public portfolio',
      icon: EyeIcon,
      color: 'violet',
      onClick: () => user?.username && navigate(`/u/${user.username}`),
    },
    {
      title: 'Download Resume',
      description: 'Get your ATS-friendly PDF',
      icon: DocumentArrowDownIcon,
      color: 'purple',
      onClick: () => navigate('/resume'),
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { card: string; iconBg: string }> = {
      blue: { card: 'bg-blue-50 border-blue-100 text-blue-700', iconBg: 'bg-blue-100' },
      emerald: { card: 'bg-emerald-50 border-emerald-100 text-emerald-700', iconBg: 'bg-emerald-100' },
      violet: { card: 'bg-violet-50 border-violet-100 text-violet-700', iconBg: 'bg-violet-100' },
      purple: { card: 'bg-purple-50 border-purple-100 text-purple-700', iconBg: 'bg-purple-100' },
    };
    return colors[color] || colors.blue;
  };

  const portfolioUrl = user?.username ? `${window.location.origin}/u/${user.username}` : '';

  const copyToClipboard = () => {
    if (portfolioUrl) {
      navigator.clipboard.writeText(portfolioUrl);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="panel-blue">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.username || 'there'} 👋
              </h1>
              <p className="text-lg text-gray-600">
                Manage your developer profile and portfolio
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const colorClasses = getColorClasses(action.color);
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`card card-hover p-6 text-left group ${colorClasses.card}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-lg bg-white/60 ${colorClasses.iconBg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-gray-900">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {action.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard Overview - Health, Analytics, Suggestions, Recent Projects */}
        <DashboardOverview />

        {/* Account Overview */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-6">
            <ClipboardDocumentCheckIcon className="w-5 h-5 text-gray-500" />
            <h2 className="text-xl font-semibold text-gray-900">Account Overview</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <EnvelopeIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <dt className="text-sm font-medium text-gray-500 mb-1">Email</dt>
                  <dd className="text-sm text-gray-900">{user?.email}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserCircleIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <dt className="text-sm font-medium text-gray-500 mb-1">Username</dt>
                  <dd className="text-sm text-gray-900">{user?.username}</dd>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {portfolioUrl && (
                <div className="flex items-start gap-3">
                  <LinkIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <dt className="text-sm font-medium text-gray-500 mb-1">Public Portfolio URL</dt>
                    <div className="flex items-center gap-2">
                      <dd className="text-sm text-gray-900 font-mono flex-1 truncate">{portfolioUrl}</dd>
                      <button
                        onClick={copyToClipboard}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
