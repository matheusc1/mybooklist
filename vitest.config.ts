import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [viteReact()],
	test: {
		environment: 'jsdom',
		setupFiles: ['./src/test/setup.ts'],
		coverage: {
			provider: 'v8',
			exclude: [
				'src/test/**',
				'**/*.types.ts',
				'src/routeTree.gen.ts',
				'**/index.ts', // barrel re-exports
				'src/styles.css',
				'src/integrations/tanstack-query/devtools.tsx',
			],
		},
	},
})
