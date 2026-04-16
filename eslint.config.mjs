import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['next-env.d.ts'],
    rules: {
      // Next may re-add `/// <reference path="./.next/types/routes.d.ts" />` on build; path refs
      // cannot be expressed as imports. Route types are already in tsconfig "include".
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
];

export default eslintConfig;
