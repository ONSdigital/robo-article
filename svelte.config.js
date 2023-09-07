/** @type {import('@sveltejs/kit').Config} */
import adapter from '@sveltejs/adapter-static';

export const base = '/robo-article';

const production = process.env.NODE_ENV === 'production';

const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		adapter: adapter({
			// Options below are defaults
			pages: 'build',
			assets: 'build'
		}),
		prerender: {
			entries: ['/', '/embed'],
			handleHttpError: 'warn'
		},
		paths: {
			base: production ? base : '',
			relative: false
		}
	}
};

export default config;