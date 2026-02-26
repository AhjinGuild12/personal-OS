import React, { useState, useCallback } from 'react';
import useTypewriter from '../hooks/useTypewriter';
import portfolioData, { ProjectDetail } from '../data/portfolioData';

interface PortfolioPageProps {
  onEnter: () => void;
}

const SocialIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'github':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      );
    case 'email':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      );
    case 'website':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
        </svg>
      );
    default:
      return null;
  }
};

const LightSwitch: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const [isOn, setIsOn] = useState(false);

  const handleClick = useCallback(() => {
    if (isOn) return;
    setIsOn(true);
    setTimeout(() => {
      onEnter();
      setIsOn(false);
    }, 200);
  }, [isOn, onEnter]);

  return (
    <button
      className="light-switch-button"
      onClick={handleClick}
      aria-label="Enter OS"
    >
      <div className="light-switch-plate">
        <div className="light-switch-screw" />
        <div className="light-switch-toggle-slot">
          <div className={`light-switch-toggle${isOn ? ' is-on' : ''}`} />
        </div>
        <div className="light-switch-screw" />
      </div>
    </button>
  );
};

const PROJECT_LABELS: Record<string, string> = {
  'neobrutalist-os': 'neobrutalist-os     — This retro desktop you\u2019re looking at',
  move45: 'move45              — iOS app for daily movement habits',
  iwt: 'iwt                 — Interval walking trainer (iOS)',
  'lifespan-tracker': 'lifespan-tracker    — Life perspective visualizer (React + Node.js)',
  covercraft: 'covercraft          — Cover letter generator website',
};

const ProjectCard: React.FC<{ project: ProjectDetail; index: number }> = ({
  project,
  index,
}) => {
  const [expanded, setExpanded] = useState(false);
  const num = String(index + 1).padStart(2, '0');

  return (
    <div className="project-card">
      <button
        className="project-card-header"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        <span className="project-card-label">
          [{num}] {PROJECT_LABELS[project.id] || project.name}
        </span>
        <span className={`project-card-chevron${expanded ? ' expanded' : ''}`}>
          &#9656;
        </span>
      </button>
      <div
        className={`project-dropdown${expanded ? ' open' : ''}`}
      >
        <div className="project-dropdown-inner">
          <p className="project-summary">{project.summary}</p>
          {project.status === 'in-progress' && (
            <span className="project-badge">In Progress</span>
          )}
          {project.links?.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              {link.label} &rarr;
            </a>
          ))}
          {project.cta && <p className="project-cta">{project.cta}</p>}
        </div>
      </div>
    </div>
  );
};

const ProjectCards: React.FC = () => (
  <div className="project-cards-enter">
    {portfolioData.projects.map((project, i) => (
      <ProjectCard key={project.id} project={project} index={i} />
    ))}
  </div>
);

const PortfolioPage: React.FC<PortfolioPageProps> = ({ onEnter }) => {
  const { displayedText, isComplete, skipToEnd } =
    useTypewriter(portfolioData.sections);

  return (
    <div
      className="w-full h-full overflow-y-auto font-mono"
      style={{ backgroundColor: '#0a0a0a', color: '#e0e0e0' }}
    >
      {/* Scanline overlay */}
      <div className="scanlines" />

      {/* Top-right fixed area: skip button OR light switch */}
      {!isComplete ? (
        <button
          onClick={skipToEnd}
          className="fixed top-4 right-4 z-20 px-3 py-1.5 text-xs font-mono rounded border transition-colors"
          style={{
            borderColor: '#333',
            color: '#666',
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#4ade80';
            e.currentTarget.style.borderColor = '#4ade80';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#666';
            e.currentTarget.style.borderColor = '#333';
          }}
        >
          skip &gt;&gt;
        </button>
      ) : (
        <div className="fixed top-4 right-4 z-20 flex flex-col items-center light-switch-appear">
          <LightSwitch onEnter={onEnter} />
          <p className="mt-2 text-xs enter-hint" style={{ color: '#555' }}>
            <span className="hidden md:inline">Flip to enter</span>
            <span className="md:hidden">Tap to enter</span>
          </p>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-6 py-16 md:px-8 md:py-24">
        {/* Terminal header */}
        <div className="mb-12 flex items-start justify-between gap-6">
          <div>
            <div
              className="text-xs mb-3 tracking-widest uppercase"
              style={{ color: '#555' }}
            >
              jan@portfolio ~ %
            </div>
            <h1
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ color: '#4ade80' }}
            >
              Jan Medina
            </h1>
            <p className="text-sm" style={{ color: '#888' }}>
              IT Professional &middot; App Builder &middot;{' '}
              <a
                href="https://www.google.com/maps/place/Auckland,+New+Zealand"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#888', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#4ade80')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
              >
                Auckland, NZ
              </a>
            </p>
          </div>
        </div>

        {/* Typed sections */}
        <div className="space-y-10">
          {portfolioData.sections.map((section) => {
            const text = displayedText[section.id] || '';
            const stillTyping = text.length < section.text.length;
            const isProjectsSection = section.id === 'projects';
            const showCards = isProjectsSection && isComplete;

            return (
              <div key={section.id} className="section-fade-in">
                {/* Command line */}
                <div
                  className="text-sm mb-2 font-bold"
                  style={{ color: '#4ade80' }}
                >
                  {section.command}
                </div>

                {/* Output: interactive cards for projects after typing, else normal text */}
                {showCards ? (
                  <ProjectCards />
                ) : (
                  <pre
                    className="text-sm leading-relaxed whitespace-pre-wrap break-words"
                    style={{ color: '#d4d4d4' }}
                  >
                    {text}
                    {stillTyping && !isComplete && (
                      <span className="terminal-cursor" />
                    )}
                  </pre>
                )}
              </div>
            );
          })}
        </div>

        {/* Social links — appear after typing completes */}
        {isComplete && (
          <div className="mt-16 social-links-enter">
            <div
              className="text-sm font-bold mb-4"
              style={{ color: '#4ade80' }}
            >
              &gt; ls links/
            </div>
            <div className="flex gap-6">
              {portfolioData.socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm transition-colors"
                  style={{ color: '#888' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#4ade80';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#888';
                  }}
                >
                  <SocialIcon type={link.icon} />
                  {link.label}
                </a>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;
