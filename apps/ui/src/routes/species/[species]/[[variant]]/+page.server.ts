import { POKEDEX_API_HOST } from '$env/static/private';
import { fetcher } from 'itty-fetcher';
import type { Variant } from 'schemas/db/schemas';
export const load = async (event) => {
	const api = fetcher({
		fetch: event.fetch,
		base: POKEDEX_API_HOST
	});
	let { species, variant = 'default' } = event.params;
	const data = await api.get<Variant>(`/v2/species/${species}/variants/${variant}`);
	event.setHeaders({
		'cache-control': 'public, max-age=3600'
	});
	return {
		variant: data
	};
};
// export const prerender = true;
