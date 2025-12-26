import { ResumePreviewResponse } from '../types/resume.types';

interface ResumePreviewProps {
  resume: ResumePreviewResponse;
}

const ResumePreview = ({ resume }: ResumePreviewProps) => {
  const { header, professionalSummary, skills, projects, education, achievements } = resume;

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const formatDateRange = (startDate: string, endDate?: string): string => {
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : 'Present';
    return `${start} - ${end}`;
  };

  const renderLinks = () => {
    const links: JSX.Element[] = [];
    if (header.githubUrl) {
      links.push(
        <a
          key="github"
          href={header.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900"
        >
          GitHub: {header.githubUrl}
        </a>
      );
    }
    if (header.linkedinUrl) {
      links.push(
        <a
          key="linkedin"
          href={header.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900"
        >
          LinkedIn: {header.linkedinUrl}
        </a>
      );
    }
    if (header.portfolioUrl) {
      links.push(
        <a
          key="portfolio"
          href={header.portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900"
        >
          Portfolio: {header.portfolioUrl}
        </a>
      );
    }
    return links;
  };

  const formatContactInfo = () => {
    const parts: string[] = [];
    if (header.email) parts.push(header.email);
    if (header.location) parts.push(header.location);
    if (header.yearsOfExperience > 0) {
      parts.push(`${header.yearsOfExperience} ${header.yearsOfExperience === 1 ? 'year' : 'years'} of experience`);
    }
    return parts.join(' | ');
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 p-8 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{header.fullName}</h1>
        {header.headline && (
          <p className="text-lg text-gray-700 mb-3">{header.headline}</p>
        )}
        <div className="text-sm text-gray-600 mb-2">
          {formatContactInfo()}
        </div>
        {renderLinks().length > 0 && (
          <div className="text-sm text-gray-600">
            {renderLinks().map((link, index, array) => (
              <span key={index}>
                {link}
                {index < array.length - 1 && ' | '}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {professionalSummary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Professional Summary</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{professionalSummary}</p>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Skills</h2>
          <p className="text-sm text-gray-700">{skills.join(', ')}</p>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Education</h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="mb-1">
                  <h3 className="text-base font-semibold text-gray-900">{edu.institution}</h3>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">{edu.degree}</span>
                    {edu.fieldOfStudy && <span> in {edu.fieldOfStudy}</span>}
                  </div>
                  <p className="text-sm text-gray-600">{formatDateRange(edu.startDate, edu.endDate)}</p>
                  {edu.grade && (
                    <p className="text-sm text-gray-600">Grade: {edu.grade}</p>
                  )}
                </div>
                {edu.description && (
                  <p className="text-sm text-gray-700 mt-1 leading-relaxed">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Achievements</h2>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="mb-2">
                <div className="mb-1">
                  <h3 className="text-base font-semibold text-gray-900">{achievement.title}</h3>
                  {achievement.issuer && (
                    <p className="text-sm text-gray-600">Issued by: {achievement.issuer}</p>
                  )}
                  {achievement.issueDate && (
                    <p className="text-sm text-gray-600">{formatDate(achievement.issueDate)}</p>
                  )}
                </div>
                {achievement.description && (
                  <p className="text-sm text-gray-700 mt-1 leading-relaxed">{achievement.description}</p>
                )}
                {achievement.link && (
                  <a
                    href={achievement.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-gray-900 mt-1 inline-block"
                  >
                    View Certificate →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Projects</h2>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index} className="mb-4">
                <div className="mb-1">
                  <h3 className="text-base font-semibold text-gray-900">{project.title}</h3>
                  {project.role && (
                    <p className="text-sm text-gray-600 italic">{project.role}</p>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-2 leading-relaxed">{project.description}</p>
                {project.techStack.length > 0 && (
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Technologies:</span> {project.techStack.join(', ')}
                  </p>
                )}
                <div className="text-sm text-gray-600">
                  {project.githubRepoUrl && (
                    <a
                      href={project.githubRepoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 mr-3"
                    >
                      GitHub: {project.githubRepoUrl}
                    </a>
                  )}
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Live: {project.projectUrl}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;

