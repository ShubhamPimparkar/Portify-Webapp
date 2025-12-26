import { PublicPortfolioResponse } from '../types/publicPortfolio.types';

interface ModernTemplateProps {
  portfolio: PublicPortfolioResponse;
}

const ModernTemplate = ({ portfolio }: ModernTemplateProps) => {
  const { profile, projects, education, achievements, settings } = portfolio;

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

  const formatContactInfo = () => {
    const parts: string[] = [];
    if (profile.location) parts.push(profile.location);
    if (profile.yearsOfExperience > 0) {
      parts.push(`${profile.yearsOfExperience} ${profile.yearsOfExperience === 1 ? 'year' : 'years'} of experience`);
    }
    return parts.join(' | ');
  };

  const renderLinks = () => {
    const links: JSX.Element[] = [];
    if (profile.githubUrl) {
      links.push(
        <a
          key="github"
          href={profile.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 underline"
          style={settings.primaryColor ? { color: settings.primaryColor } : undefined}
        >
          GitHub
        </a>
      );
    }
    if (profile.linkedinUrl) {
      links.push(
        <a
          key="linkedin"
          href={profile.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 underline"
          style={settings.primaryColor ? { color: settings.primaryColor } : undefined}
        >
          LinkedIn
        </a>
      );
    }
    if (profile.portfolioUrl) {
      links.push(
        <a
          key="portfolio"
          href={profile.portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 underline"
          style={settings.primaryColor ? { color: settings.primaryColor } : undefined}
        >
          Portfolio
        </a>
      );
    }
    return links;
  };

  const primaryColor = settings.primaryColor || '#3b82f6'; // Default blue

  return (
    <div className="min-h-screen bg-gray-50" style={settings.fontFamily ? { fontFamily: settings.fontFamily } : undefined}>
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header Section - Card */}
        <header className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{profile.fullName}</h1>
          {profile.headline && (
            <p className="text-xl text-gray-700 mb-4">{profile.headline}</p>
          )}
          {formatContactInfo() && (
            <p className="text-sm text-gray-600 mb-4">{formatContactInfo()}</p>
          )}
          {renderLinks().length > 0 && (
            <div className="flex flex-wrap gap-4 text-sm">
              {renderLinks().map((link, index) => (
                <span key={index}>{link}</span>
              ))}
            </div>
          )}
        </header>

        {/* Summary Section - Card */}
        {profile.summary && (
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed">{profile.summary}</p>
          </section>
        )}

        {/* Skills Section - Card */}
        {settings.showSkills && profile.skills.length > 0 && (
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 text-sm font-medium rounded-full"
                  style={{
                    backgroundColor: `${primaryColor}15`,
                    color: primaryColor,
                    border: `1px solid ${primaryColor}40`,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education Section - Card */}
        {(settings.showEducation !== false) && education && education.length > 0 && (
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Education</h2>
            <div className="space-y-5">
              {education.map((edu, index) => (
                <div key={index} className="pb-5 border-b border-gray-100 last:border-0 last:pb-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{edu.institution}</h3>
                  <div className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">{edu.degree}</span>
                    {edu.fieldOfStudy && <span> in {edu.fieldOfStudy}</span>}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{formatDateRange(edu.startDate, edu.endDate)}</p>
                  {edu.grade && (
                    <p className="text-sm text-gray-600 mb-2">Grade: {edu.grade}</p>
                  )}
                  {edu.description && (
                    <p className="text-gray-700 text-sm leading-relaxed mt-2">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements Section - Card */}
        {(settings.showAchievements !== false) && achievements && achievements.length > 0 && (
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow"
                >
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{achievement.title}</h3>
                  {achievement.issuer && (
                    <p className="text-sm text-gray-600 mb-1">Issued by: {achievement.issuer}</p>
                  )}
                  {achievement.issueDate && (
                    <p className="text-sm text-gray-600 mb-2">{formatDate(achievement.issueDate)}</p>
                  )}
                  {achievement.description && (
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">{achievement.description}</p>
                  )}
                  {achievement.link && (
                    <a
                      href={achievement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:opacity-80 underline font-medium"
                      style={{ color: primaryColor }}
                    >
                      View Certificate →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section - Cards */}
        {settings.showProjects && projects.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <article
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{project.title}</h3>
                  {project.role && (
                    <p className="text-sm text-gray-600 italic mb-3">{project.role}</p>
                  )}
                  <p className="text-gray-700 mb-4 leading-relaxed text-sm">{project.description}</p>
                  {project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.techStack.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3 text-sm pt-3 border-t border-gray-100">
                    {project.githubRepoUrl && (
                      <a
                        href={project.githubRepoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 underline font-medium"
                        style={{ color: primaryColor }}
                      >
                        GitHub
                      </a>
                    )}
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 underline font-medium"
                        style={{ color: primaryColor }}
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {settings.showProjects && projects.length === 0 && (
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Projects</h2>
            <p className="text-gray-600">No public projects available</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;
