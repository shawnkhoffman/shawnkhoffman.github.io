import js from '@eslint/js';
import globals from 'globals';
import vuePlugin from 'eslint-plugin-vue';
import vueTsConfig from '@vue/eslint-config-typescript';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...vueTsConfig(), // This already includes TypeScript ESLint configs
      ...vuePlugin.configs['flat/essential'],
    ],
    files: ['**/*.{ts,tsx,vue}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      vue: vuePlugin,
    },
    rules: {
      '@typescript-eslint/no-namespace': [
        'error',
        {
          allowDeclarations: true,
          allowDefinitionFiles: true,
        },
      ],
      'vue/multi-word-component-names': 'off',
    },
  },
);
