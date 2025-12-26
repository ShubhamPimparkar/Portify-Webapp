import { PublicPortfolioResponse } from '../types/publicPortfolio.types';

interface HeroTemplateProps {
  portfolio: PublicPortfolioResponse;
}

const HeroTemplate = ({ portfolio }: HeroTemplateProps) => {
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const primaryColor = settings.primaryColor || '#3b82f6';

  return (
    <div className="min-h-screen bg-white" style={settings.fontFamily ? { fontFamily: settings.fontFamily } : undefined}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{profile.fullName}</h2>
            <div className="hidden md:flex items-center gap-6">
              {settings.showProjects && projects.length > 0 && (
                <button
                  onClick={() => scrollToSection('projects')}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Projects
                </button>
              )}
              {profile.summary && (
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  About
                </button>
              )}
              {(profile.githubUrl || profile.linkedinUrl || profile.portfolioUrl) && (
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Contact
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Hello, I'm <span style={{ color: primaryColor }}>{profile.fullName.split(' ')[0]}</span>
          </h1>
          {profile.headline && (
            <p className="text-2xl md:text-3xl text-gray-700 mb-6 font-light">
              {profile.headline}
            </p>
          )}
          {profile.summary && (
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl">
              {profile.summary}
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            {settings.showProjects && projects.length > 0 && (
              <button
                onClick={() => scrollToSection('projects')}
                className="px-6 py-3 text-base font-medium text-white rounded-md hover:opacity-90 transition-opacity"
                style={{ backgroundColor: primaryColor }}
              >
                View Projects
              </button>
            )}
            {(profile.githubUrl || profile.linkedinUrl || profile.portfolioUrl) && (
              <button
                onClick={() => scrollToSection('contact')}
                className="px-6 py-3 text-base font-medium border-2 rounded-md hover:bg-gray-50 transition-colors"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                Get in Touch
              </button>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      {profile.summary && (
        <section id="about" className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About</h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
            {profile.summary}
          </p>
          {profile.location && profile.yearsOfExperience > 0 && (
            <div className="mt-6 text-gray-600">
              <p>
                {profile.location} · {profile.yearsOfExperience} {profile.yearsOfExperience === 1 ? 'year' : 'years'} of experience
              </p>
            </div>
          )}
        </section>
      )}

      {/* Projects Section */}
      {settings.showProjects && projects.length > 0 && (
        <section id="projects" className="max-w-6xl mx-auto px-6 py-16 md:py-24 bg-gray-50">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                {project.role && (
                  <p className="text-sm text-gray-600 mb-3">{project.role}</p>
                )}
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">{project.description}</p>
                {project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.slice(0, 4).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-4 text-sm">
                  {project.githubRepoUrl && (
                    <a
                      href={project.githubRepoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 underline"
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
                      className="hover:opacity-80 underline"
                      style={{ color: primaryColor }}
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {settings.showSkills && profile.skills.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Skills</h2>
          <div className="flex flex-wrap gap-3">
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

      {/* Education Section */}
      {(settings.showEducation !== false) && education && education.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 bg-gray-50">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">Education</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {education.map((edu, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{edu.institution}</h3>
                <div className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">{edu.degree}</span>
                  {edu.fieldOfStudy && <span> in {edu.fieldOfStudy}</span>}
                </div>
                <p className="text-sm text-gray-600 mb-2">{formatDateRange(edu.startDate, edu.endDate)}</p>
                {edu.grade && (
                  <p className="text-sm text-gray-600 mb-3">Grade: {edu.grade}</p>
                )}
                {edu.description && (
                  <p className="text-gray-700 text-sm leading-relaxed mt-2">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements Section */}
      {(settings.showAchievements !== false) && achievements && achievements.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                {achievement.issuer && (
                  <p className="text-sm text-gray-600 mb-1">Issued by: {achievement.issuer}</p>
                )}
                {achievement.issueDate && (
                  <p className="text-sm text-gray-600 mb-3">{formatDate(achievement.issueDate)}</p>
                )}
                {achievement.description && (
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">{achievement.description}</p>
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

      {/* Footer / Contact */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">{profile.fullName}</h3>
              {profile.headline && (
                <p className="text-gray-400 text-sm">{profile.headline}</p>
              )}
            </div>
            <div className="flex gap-6">
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  GitHub
                </a>
              )}
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              )}
              {profile.portfolioUrl && (
                <a
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Portfolio
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HeroTemplate;
