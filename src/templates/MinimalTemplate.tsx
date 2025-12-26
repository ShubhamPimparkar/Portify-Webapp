import { PublicPortfolioResponse } from '../types/publicPortfolio.types';

interface MinimalTemplateProps {
  portfolio: PublicPortfolioResponse;
}

const MinimalTemplate = ({ portfolio }: MinimalTemplateProps) => {
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
          className="text-gray-900 hover:text-gray-700 underline"
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
          className="text-gray-900 hover:text-gray-700 underline"
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
          className="text-gray-900 hover:text-gray-700 underline"
        >
          Portfolio
        </a>
      );
    }
    return links;
  };

  return (
    <div className="min-h-screen bg-white" style={settings.fontFamily ? { fontFamily: settings.fontFamily } : undefined}>
      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Header Section */}
        <header className="mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">{profile.fullName}</h1>
          {profile.headline && (
            <p className="text-2xl text-gray-700 mb-6 font-light">{profile.headline}</p>
          )}
          {formatContactInfo() && (
            <p className="text-sm text-gray-600 mb-6 tracking-wide">{formatContactInfo()}</p>
          )}
          {renderLinks().length > 0 && (
            <div className="flex flex-wrap gap-6 text-sm">
              {renderLinks().map((link, index) => (
                <span key={index}>{link}</span>
              ))}
            </div>
          )}
        </header>

        {/* Summary Section */}
        {profile.summary && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">About</h2>
            <p className="text-gray-900 leading-relaxed text-lg">{profile.summary}</p>
          </section>
        )}

        {/* Skills Section */}
        {settings.showSkills && profile.skills.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Skills</h2>
            <p className="text-gray-900 text-lg leading-relaxed">{profile.skills.join(' · ')}</p>
          </section>
        )}

        {/* Education Section */}
        {(settings.showEducation !== false) && education && education.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 tracking-tight">Education</h2>
            <div className="space-y-10">
              {education.map((edu, index) => (
                <article key={index}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{edu.institution}</h3>
                  <div className="text-gray-900 mb-2 text-lg">
                    <span className="font-medium">{edu.degree}</span>
                    {edu.fieldOfStudy && <span> in {edu.fieldOfStudy}</span>}
                  </div>
                  <p className="text-gray-600 mb-2 text-sm tracking-wide">{formatDateRange(edu.startDate, edu.endDate)}</p>
                  {edu.grade && (
                    <p className="text-gray-600 mb-3 text-sm">Grade: {edu.grade}</p>
                  )}
                  {edu.description && (
                    <p className="text-gray-900 leading-relaxed text-lg mt-3">{edu.description}</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Achievements Section */}
        {(settings.showAchievements !== false) && achievements && achievements.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 tracking-tight">Achievements</h2>
            <div className="space-y-8">
              {achievements.map((achievement, index) => (
                <article key={index}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{achievement.title}</h3>
                  {achievement.issuer && (
                    <p className="text-gray-600 mb-2 text-sm uppercase tracking-wide">Issued by: {achievement.issuer}</p>
                  )}
                  {achievement.issueDate && (
                    <p className="text-gray-600 mb-3 text-sm tracking-wide">{formatDate(achievement.issueDate)}</p>
                  )}
                  {achievement.description && (
                    <p className="text-gray-900 leading-relaxed text-lg mb-3">{achievement.description}</p>
                  )}
                  {achievement.link && (
                    <a
                      href={achievement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 hover:text-gray-700 underline text-sm"
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
            <h2 className="text-3xl font-bold text-gray-900 mb-10 tracking-tight">Projects</h2>
            <div className="space-y-12">
              {projects.map((project, index) => (
                <article key={index}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  {project.role && (
                    <p className="text-sm text-gray-600 mb-4 uppercase tracking-wide">{project.role}</p>
                  )}
                  <p className="text-gray-900 mb-4 leading-relaxed text-lg">{project.description}</p>
                  {project.techStack.length > 0 && (
                    <p className="text-gray-600 mb-4 text-sm">
                      {project.techStack.join(' · ')}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-6 text-sm">
                    {project.githubRepoUrl && (
                      <a
                        href={project.githubRepoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 hover:text-gray-700 underline"
                      >
                        GitHub
                      </a>
                    )}
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 hover:text-gray-700 underline"
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
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Projects</h2>
            <p className="text-gray-600 text-lg">No public projects available</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default MinimalTemplate;
