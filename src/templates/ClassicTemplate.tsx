import { PublicPortfolioResponse } from '../types/publicPortfolio.types';

interface ClassicTemplateProps {
  portfolio: PublicPortfolioResponse;
}

const ClassicTemplate = ({ portfolio }: ClassicTemplateProps) => {
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

  return (
    <div className="min-h-screen bg-white" style={settings.fontFamily ? { fontFamily: settings.fontFamily } : undefined}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Section */}
        <header className="mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{profile.fullName}</h1>
          {profile.headline && (
            <p className="text-xl text-gray-700 mb-3">{profile.headline}</p>
          )}
          {formatContactInfo() && (
            <p className="text-sm text-gray-600 mb-3">{formatContactInfo()}</p>
          )}
          {renderLinks().length > 0 && (
            <div className="flex flex-wrap gap-3 text-sm">
              {renderLinks().map((link, index) => (
                <span key={index}>{link}</span>
              ))}
            </div>
          )}
        </header>

        {/* Summary Section */}
        {profile.summary && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">About</h2>
            <p className="text-gray-700 leading-relaxed">{profile.summary}</p>
          </section>
        )}

        {/* Skills Section */}
        {settings.showSkills && profile.skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-md border border-gray-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {(settings.showEducation !== false) && education && education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Education</h2>
            <div className="space-y-5">
              {education.map((edu, index) => (
                <article key={index} className="pb-5 border-b border-gray-100 last:border-0">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{edu.institution}</h3>
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
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Achievements Section */}
        {(settings.showAchievements !== false) && achievements && achievements.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Achievements</h2>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <article key={index} className="pb-4 border-b border-gray-100 last:border-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{achievement.title}</h3>
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
                      className="text-sm hover:opacity-80 underline"
                      style={settings.primaryColor ? { color: settings.primaryColor } : undefined}
                    >
                      View Certificate →
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {settings.showProjects && projects.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Projects</h2>
            <div className="space-y-6">
              {projects.map((project, index) => (
                <article key={index} className="pb-6 border-b border-gray-100 last:border-0">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{project.title}</h3>
                  {project.role && (
                    <p className="text-sm text-gray-600 italic mb-2">{project.role}</p>
                  )}
                  <p className="text-gray-700 mb-3 leading-relaxed">{project.description}</p>
                  {project.techStack.length > 0 && (
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Technologies:</span> {project.techStack.join(', ')}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 text-sm">
                    {project.githubRepoUrl && (
                      <a
                        href={project.githubRepoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 underline"
                        style={settings.primaryColor ? { color: settings.primaryColor } : undefined}
                      >
                        GitHub
                      </a>
                    )}
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 underline"
                        style={settings.primaryColor ? { color: settings.primaryColor } : undefined}
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
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Projects</h2>
            <p className="text-gray-600">No public projects available</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default ClassicTemplate;

