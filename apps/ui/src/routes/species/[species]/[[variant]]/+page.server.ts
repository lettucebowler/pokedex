import { POKEDEX_API_HOST } from '$env/static/private';
import { fetcher, type FetcherType } from 'itty-fetcher';
import type { Variant } from 'schemas/db/schemas';
import type { VariantInfo } from 'schemas/pokeApi';

async function getVariant(
	fetcher: FetcherType,
	{ species, variant }: { species: string; variant: string }
) {
	// const data = await fetcher.get<VariantInfo>(
	// 	`/v1/species/${species}/variants/${variant ?? 'default'}`
	// );
	// const putBody = {
	// 	id: data.variantId,
	// 	height: data.height * 10,
	// 	weight: data.weight * 10,
	// 	image: data.image,
	// 	types: data.types,
	// 	species_id: data.species_id,
	// 	is_default: data.is_default,
	// };
	// await fetcher.put('/v2/species/' + species + '/variants/' + (variant ?? 'default'), putBody).catch((e) => console.log(e));
	// const returnData: Variant = {
	// 	name: data.name,
	// 	id: data.variantId,
	// 	height: data.height,
	// 	weight: data.weight,
	// 	types: data.types,
	// 	is_default: data.is_default,
	// 	image: data.image ?? '',
	// 	species_id: data.species_id,
	// }
	// return returnData;
	return fetcher.get<Variant>(`/v2/species/${species}/variants/${variant}`);
}

export const load = async (event) => {
	const api = fetcher({
		fetch: event.fetch,
		base: POKEDEX_API_HOST
	});
	let { species, variant = 'default' } = event.params;
	const variantData = getVariant(api, { species, variant });
	return {
		variant: variantData
	};
};
// export const prerender = true;
