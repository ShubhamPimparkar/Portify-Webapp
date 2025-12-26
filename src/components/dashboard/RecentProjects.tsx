import { useNavigate } from 'react-router-dom';
import { ClockIcon } from '@heroicons/react/24/outline';

interface RecentProject {
  id: string;
  title: string;
  createdAt: string;
}

interface RecentProjectsProps {
  projects: RecentProject[];
  total: number;
}

const RecentProjects = ({ projects, total }: RecentProjectsProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (projects.length === 0) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 mb-4">No projects yet</p>
          <button
            onClick={() => navigate('/projects/new')}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Add Your First Project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
        <span className="text-sm text-gray-500">{total} total</span>
      </div>
      <div className="space-y-3">
        {projects.slice(0, 3).map((project) => (
          <button
            key={project.id}
            onClick={() => navigate(`/projects/edit/${project.id}`)}
            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate">
                  {project.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                  <ClockIcon className="w-3.5 h-3.5" />
                  <span>{formatDate(project.createdAt)}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      {total > 3 && (
        <button
          onClick={() => navigate('/projects')}
          className="mt-4 w-full text-sm font-medium text-blue-600 hover:text-blue-700 text-center py-2"
        >
          View All Projects →
        </button>
      )}
    </div>
  );
};

export default RecentProjects;
