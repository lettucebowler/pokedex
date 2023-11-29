import { POKEDEX_API_HOST } from '$env/static/private';
import { fetcher } from 'itty-fetcher';
import type { VariantInfo } from 'schemas/species.js';
export const load = async (event) => {
	// const { species: speciesData } = await event.parent();
	const api = fetcher({
		fetch: event.fetch,
		base: POKEDEX_API_HOST
	});
	let { species, variant } = event.params;
	const data = await api.get<VariantInfo>(
		`/v1/species/${species}/variants/${variant ?? 'default'}`
	);
	// console.log(variant ?? 'default');
	// const putBody = {
	// 	id: data.variantId,
	// 	height: data.height * 10,
	// 	weight: data.weight * 10,
	// 	image: data.image,
	// 	types: data.types,
	// 	species_id: speciesData.speciesId,
	// };
	// console.log('put body', putBody)
	// await api.put('/v2/species/' + species + '/variants/' + (variant ?? 'default'), putBody).catch((e) => console.log(e));
	event.setHeaders({
		'cache-control': 'public, max-age=3153600'
	});
	return {
		variant: data
	};
};
export const prerender = true;
