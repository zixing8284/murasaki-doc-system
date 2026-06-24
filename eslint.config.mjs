import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'public/**',
      'dist/**',
      'prisma/migrations/**',
      'components/ui/**',
    ],
  },
  ...nextCoreWebVitals,
  {
    rules: {
      'react-hooks/incompatible-library': 'off',
    },
  },
];

export default eslintConfig;
