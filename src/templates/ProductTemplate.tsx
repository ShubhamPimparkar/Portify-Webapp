import { PublicPortfolioResponse } from '../types/publicPortfolio.types';

interface ProductTemplateProps {
  portfolio: PublicPortfolioResponse;
}

const ProductTemplate = ({ portfolio }: ProductTemplateProps) => {
  const { profile, projects, education, achievements, settings } = portfolio;

  const primaryColor = settings.primaryColor || '#3b82f6';

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
    <div
      className="min-h-screen bg-white text-gray-900"
      style={{
        ...(settings.fontFamily ? { fontFamily: settings.fontFamily } : {}),
        ['--accent-color' as any]: primaryColor
      }}
    >
      {/* Navigation */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold tracking-tight">
            {profile.fullName}
          </h2>
          <div className="flex gap-6 text-sm">
            {profile.githubUrl && (
              <a href={profile.githubUrl} target="_blank" className="hover:text-[var(--accent-color)]">
                GitHub
              </a>
            )}
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" className="hover:text-[var(--accent-color)]">
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-4xl">
          {/* ⭐ Accent underline */}
          <span className="inline-block mb-4 text-sm font-medium text-[var(--accent-color)]">
            Product-driven Developer
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            {profile.headline || 'Building scalable and secure applications'}
          </h1>

          {profile.summary && (
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed mb-8">
              {profile.summary}
            </p>
          )}

          {profile.location && (
            <p className="text-sm text-gray-500">
              {profile.location}
              {profile.yearsOfExperience ? ` • ${profile.yearsOfExperience}+ yrs experience` : ''}
            </p>
          )}
        </div>
      </section>

      {/* What I Do */}
      {profile.summary && (
        <section className="bg-gray-50 border-y border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              What I Do
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl leading-relaxed">
              {profile.summary}
            </p>
          </div>
        </section>
      )}

      {/* Tech Stack */}
      {settings.showSkills && profile.skills.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-2xl md:text-3xl font-semibold mb-10">
            Tech Stack
          </h2>

          {/* ⭐ Softer cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profile.skills.map((skill, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 hover:border-[var(--accent-color)] transition-colors"
              >
                {skill}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {(settings.showEducation !== false) && education && education.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-2xl md:text-3xl font-semibold mb-10">
            Education
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {education.map((edu, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">{edu.institution}</h3>
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

      {/* Achievements */}
      {(settings.showAchievements !== false) && achievements && achievements.length > 0 && (
        <section className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-24">
            <h2 className="text-2xl md:text-3xl font-semibold mb-14">
              Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold mb-2">{achievement.title}</h3>
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
          </div>
        </section>
      )}

      {/* Projects */}
      {settings.showProjects && projects.length > 0 && (
        <section className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-24">
            <h2 className="text-2xl md:text-3xl font-semibold mb-14">
              Projects
            </h2>

            <div className="space-y-10">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 bg-white p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:justify-between gap-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">
                        {project.title}
                      </h3>
                      {project.role && (
                        <p className="text-sm text-gray-500 mb-4">
                          {project.role}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {project.githubRepoUrl && (
                        <a
                          href={project.githubRepoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
        inline-flex items-center justify-center
        px-4 py-2 text-sm font-medium
        rounded-md border
        border-gray-300 text-gray-700
        hover:border-[var(--accent-color)]
        hover:text-[var(--accent-color)]
        transition-colors
      "
                        >
                          GitHub
                        </a>
                      )}

                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
        inline-flex items-center justify-center
        px-4 py-2 text-sm font-medium
        rounded-md text-white
        bg-[var(--accent-color)]
        hover:opacity-90
        transition-opacity
      "
                        >
                          Live Demo
                        </a>
                      )}
                    </div>

                  </div>

                  <p className="text-gray-700 leading-relaxed mt-4 mb-6">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} {profile.fullName}</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {profile.githubUrl && <a href={profile.githubUrl}>GitHub</a>}
            {profile.linkedinUrl && <a href={profile.linkedinUrl}>LinkedIn</a>}
            {profile.portfolioUrl && <a href={profile.portfolioUrl}>Portfolio</a>}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductTemplate;
