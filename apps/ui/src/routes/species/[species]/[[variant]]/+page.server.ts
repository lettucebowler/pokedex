import { POKEDEX_API_HOST } from '$env/static/private';
import { fetcher } from 'itty-fetcher';
import type { VariantInfo } from 'schemas/species.js';
export const load = async (event) => {
	const { species } = await event.parent();
	const api = fetcher({
		fetch: event.fetch,
		base: POKEDEX_API_HOST
	});
	let { variant } = event.params;
	const data = await api.get<VariantInfo>(
		`/v1/species/${species.name}/variants/${variant ?? 'default'}`
	);
	event.setHeaders({
		'cache-control': 'public, max-age=3153600'
	});
	return {
		variant: data
	};
};
