// eslint.config.js
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh'; // У вас уже есть
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		// Глобальные настройки для всех файлов .ts, .tsx
		files: ['**/*.{ts,tsx}'],
		ignores: ['vite.config.ts'],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: ['./tsconfig.json', './tsconfig.app.json'],
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
			globals: {
				...globals.browser,
				...globals.es2021,
			},
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
			react: reactPlugin,
			'react-hooks': hooksPlugin,
			'jsx-a11y': jsxA11yPlugin,
			'react-refresh': reactRefresh,
		},
		extends: [
			tseslint.configs.recommendedTypeChecked,
			tseslint.configs.stylisticTypeChecked,
			reactPlugin.configs.flat.recommended,
		],
		rules: {
			// TypeScript правила
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{ argsIgnorePattern: '^_' },
			],
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',

			// React правила
			'react/react-in-jsx-scope': 'off',
			'react/prop-types': 'off',
			'react/jsx-uses-react': 'off',

			// React Hooks
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',

			// React Refresh
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true },
			],

			// Accessibility
			'jsx-a11y/alt-text': 'warn',
			'jsx-a11y/anchor-is-valid': 'warn',
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
	{
		// Настройки для конфигурационных файлов JS
		files: ['eslint.config.js', 'vite.config.ts', '*.config.js'],
		languageOptions: {
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module', // Для vite.config.ts
			},
			globals: {
				...globals.node,
			},
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},
		rules: {
			'@typescript-eslint/no-var-requires': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
		},
	}
);
