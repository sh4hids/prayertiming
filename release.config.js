export default {
  branches: ['master'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/git',
    '@semantic-release/npm',
    {
      assets: ['lib', 'README.md', 'package.json'],
      message: ':bookmark: Release ${nextRelease.version} [skip ci]',
    },
  ],
};
