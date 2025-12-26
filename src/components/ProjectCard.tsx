import { ProjectResponse } from '../types/project.types';

interface ProjectCardProps {
  project: ProjectResponse;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
          {project.role && (
            <p className="text-sm text-gray-600 mb-2">{project.role}</p>
          )}
        </div>
        <span
          className={`px-2.5 py-1 text-xs font-medium rounded-full ${
            project.isPublic
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-gray-100 text-gray-800 border border-gray-200'
          }`}
        >
          {project.isPublic ? 'Public' : 'Private'}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4">{truncateDescription(project.description)}</p>

      {project.techStack.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md border border-blue-200"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 5 && (
            <span className="px-2 py-1 text-xs font-medium text-gray-500">
              +{project.techStack.length - 5} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        {project.githubRepoUrl && (
          <a
            href={project.githubRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            GitHub
          </a>
        )}
        {project.projectUrl && (
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            Live Demo
          </a>
        )}
        <div className="flex-1" />
        <button
          onClick={() => onEdit(project.id)}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(project.id)}
          className="px-3 py-1.5 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;

