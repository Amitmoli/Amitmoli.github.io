// Everything shown on the site lives here. Edit this file to update the portfolio.

export const profile = {
  name: 'Amit Moli',
  roles: ['Full-Stack Developer', 'React Engineer', 'Node.js Builder', 'CI/CD Tinkerer'],
  tagline:
    'I build fast, polished web apps end to end: from pixel-perfect React interfaces to the APIs, databases and deploy pipelines behind them.',
  bio: [
    'I am a Full-Stack Developer who enjoys turning messy business workflows into clean, reliable software.',
    'Day to day I work across the whole stack: React frontends, Node.js and Express services, SQL and NoSQL databases, and automated deployments with GitHub Actions.',
  ],
  email: 'amitmoli7@gmail.com',
  phone: '+91 95356 56560',
  phoneRaw: '919535656560',
  github: 'https://github.com/Amitmoli',
  linkedin: '', // add your LinkedIn URL here to show the button
  resume: '', // e.g. '/resume.pdf' after adding the file to /public
  company: 'Desalt Encore SheetMetal Pvt Ltd',
  title: 'Software Engineer · Full-Stack Developer',
}

export const skillGroups = [
  { title: 'Frontend', items: ['React', 'JavaScript', 'HTML & CSS', 'Responsive UI', 'Framer Motion'] },
  { title: 'Backend', items: ['Node.js', 'Express', 'REST APIs', 'Role-based permissions'] },
  { title: 'Data', items: ['MongoDB', 'SQL', 'Data modelling', 'Excel & report exports'] },
  { title: 'DevOps', items: ['GitHub Actions', 'CI/CD', 'PM2', 'Linux deploys', 'Git'] },
]

export const marquee = [
  'React', 'Node.js', 'Express', 'MongoDB', 'SQL', 'JavaScript', 'GitHub Actions',
  'CI/CD', 'PM2', 'Linux', 'REST APIs', 'Git', 'Framer Motion', 'Vite',
]

export const projects = [
  {
    title: 'Encore CRM',
    kicker: 'Full-stack · In production',
    description:
      'A full-stack CRM and operations platform for a sheet-metal manufacturer: orders, production tracking, delivery planning and dockets, split-order handling, reporting and a granular role-based permission catalogue.',
    highlights: [
      'Permission catalogue with per-module, per-action access control',
      'Configurable delivery planning, runs and docket generation',
      'Excel previews and exports in reports',
    ],
    tech: ['React', 'Node.js', 'Express', 'Database', 'PM2'],
    link: '',
    accent: '#00e5ff',
  },
  {
    title: 'CI/CD Deploy Pipeline',
    kicker: 'DevOps · Automation',
    description:
      'GitHub Actions pipelines that build, validate and deploy a React and Node app to a UAT server, shipping only the files that changed and failing fast on bad config.',
    highlights: [
      'Detects frontend or backend changes and syncs only those files',
      'Health-check endpoint gates every deployment',
      'Secret validation and duplicate-process protection',
    ],
    tech: ['GitHub Actions', 'rsync', 'PM2', 'Linux'],
    link: '',
    accent: '#b967ff',
  },
  {
    title: 'Mobile-Ready Interface',
    kicker: 'Frontend · UX',
    description:
      'Responsive layouts and polished interactions so a dense business app stays usable on phones: side panels, search and data grids that adapt instead of overflowing.',
    highlights: [
      'Fixed overflow in side panels and search on small screens',
      'Consistent toasts and alerts for success, warning and error',
      'Last-visited highlights and editable data grids',
    ],
    tech: ['React', 'CSS', 'Responsive design'],
    link: '',
    accent: '#ff4fd8',
  },
]

export const experience = [
  {
    role: 'Software Engineer · Full-Stack Developer',
    org: 'Desalt Encore SheetMetal Pvt Ltd',
    period: 'Present',
    points: [
      'Building and maintaining the Encore CRM across frontend, backend and deployment.',
      'Designed the permission catalogue and role-based access across modules.',
      'Set up GitHub Actions CI and UAT deploy pipelines with change detection and health checks.',
    ],
  },
]
