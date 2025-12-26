import { PublicPortfolioResponse } from '../types/publicPortfolio.types';

interface CreatorTemplateProps {
  portfolio: PublicPortfolioResponse;
}

const CreatorTemplate = ({ portfolio }: CreatorTemplateProps) => {
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

  return (
    <div className="min-h-screen bg-white" style={settings.fontFamily ? { fontFamily: settings.fontFamily } : undefined}>
      {/* Minimal Navigation */}
      <nav className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{profile.fullName}</h2>
          <div className="flex gap-6 text-sm">
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                GitHub
              </a>
            )}
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero / Intro */}
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          {profile.fullName}
        </h1>
        {profile.headline && (
          <p className="text-2xl md:text-3xl text-gray-700 mb-8 font-light">
            {profile.headline}
          </p>
        )}
        {profile.summary && (
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
            {profile.summary}
          </p>
        )}
        {(profile.location || profile.yearsOfExperience > 0) && (
          <div className="mt-8 text-gray-500">
            {profile.location && <span>{profile.location}</span>}
            {profile.location && profile.yearsOfExperience > 0 && <span> · </span>}
            {profile.yearsOfExperience > 0 && (
              <span>{profile.yearsOfExperience} {profile.yearsOfExperience === 1 ? 'year' : 'years'} of experience</span>
            )}
          </div>
        )}
      </section>

      {/* Skills Section */}
      {settings.showSkills && profile.skills.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-16 md:py-24 border-t border-gray-200">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Skills</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {profile.skills.join(' · ')}
          </p>
        </section>
      )}

      {/* Education Section */}
      {(settings.showEducation !== false) && education && education.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-16 md:py-24 border-t border-gray-200">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">Education</h2>
          <div className="space-y-12">
            {education.map((edu, index) => (
              <article key={index} className="pb-12 border-b border-gray-100 last:border-0">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{edu.institution}</h3>
                <div className="text-lg text-gray-700 mb-2">
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
        <section className="max-w-4xl mx-auto px-6 py-16 md:py-24 border-t border-gray-200">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">Achievements</h2>
          <div className="space-y-12">
            {achievements.map((achievement, index) => (
              <article key={index} className="pb-12 border-b border-gray-100 last:border-0">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{achievement.title}</h3>
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
        <section className="max-w-4xl mx-auto px-6 py-16 md:py-24 border-t border-gray-200">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">Projects</h2>
          <div className="space-y-16">
            {projects.map((project, index) => (
              <article key={index} className="pb-12 border-b border-gray-100 last:border-0">
                <div className="mb-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  {project.role && (
                    <p className="text-sm text-gray-600 uppercase tracking-wide mb-4">
                      {project.role}
                    </p>
                  )}
                </div>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  {project.description}
                </p>
                {project.techStack.length > 0 && (
                  <p className="text-gray-600 mb-6 text-sm">
                    {project.techStack.join(' · ')}
                  </p>
                )}
                <div className="flex gap-6 text-sm">
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

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600">{profile.fullName}</p>
            {profile.headline && (
              <p className="text-sm text-gray-500 mt-1">{profile.headline}</p>
            )}
          </div>
          <div className="flex gap-6 text-sm">
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                GitHub
              </a>
            )}
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                LinkedIn
              </a>
            )}
            {profile.portfolioUrl && (
              <a
                href={profile.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                Portfolio
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CreatorTemplate;
