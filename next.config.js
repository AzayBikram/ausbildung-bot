/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    const pages = [
      'jobs', 'chat', 'eligibility', 'sectors', 'generator', 'embassy',
      'checklist', 'timeline', 'salary', 'sperrkonto', 'recognition',
      'phrases', 'templates', 'housing', 'myapplication', 'landing',
    ];
    return [
      { source: '/index.html', destination: '/', permanent: true },
      ...pages.map(p => ({ source: `/${p}.html`, destination: `/${p}`, permanent: true })),
    ];
  },
};

module.exports = nextConfig;
