import { POKEDEX_API_HOST } from '$env/static/private';
import { StatusError, fetcher, type FetcherType } from 'itty-fetcher';
import type { EvolutionChain, SpeciesInfo } from 'schemas/species.js';
import { error as svelteError } from '@sveltejs/kit';
import type { Neighbors, Species, VariantListItem } from 'schemas/db/schemas.js';

function getSvelteError({ error }: { error: unknown }) {
	if (error instanceof StatusError) {
		return svelteError(error.status ?? 500, error.message);
	}
	if (error instanceof Error) {
		return svelteError(500, error.message);
	}
	return svelteError(500, String(error));
}

// type NavItem = {
// 	name: string;
// 	id: number;
// }
async function getSpecies(fetcher: FetcherType, { species }: { species: string }) {
	try {
		// const data = await fetcher.get<{
		// 	species: SpeciesInfo;
		// 	links: { previous: NavItem; current: NavItem; next: NavItem };
		// }>(`/v1/species/${species}`);
		// await fetcher.put('/v2/species/' + species, {
		// 	id: data.species.speciesId,
		// 	habitat: data.species.habitat,
		// 	genus: data.species.genus,
		// 	color: data.species.color,
		// 	shape: data.species.shape,
		// 	flavor_text: data.species.flavorText.at(0),
		// 	egg_groups: data.species.eggGroups,
		// });
		// const returnData: Species = {
		// 	name: data.species.name,
		// 	id: data.species.speciesId,
		// 	genus: data.species.genus,
		// 	habitat: data.species.habitat,
		// 	flavor_text: data.species.flavorText.at(0) ?? '',
		// 	shape: data.species.shape,
		// 	egg_groups: data.species.eggGroups,
		// 	color: data.species.color,
		// }
		// return returnData;
		return fetcher.get<Species>(`/v2/species/${species}`);
	} catch (error) {
		throw getSvelteError({ error });
	}
}

async function getEvolutionChain(fetcher: FetcherType, { id }: { id: number }) {
	try {
		return fetcher.get<EvolutionChain>('/v1/evolution-chains/' + id);
	} catch (error) {
		throw getSvelteError({ error });
	}
}

async function getNeighbors(fetcher: FetcherType, { species }: { species: string }) {
	try {
		// const data = await fetcher.get<{
		// 	species: SpeciesInfo;
		// 	links: { previous: NavItem; current: NavItem; next: NavItem };
		// }>(`/v1/species/${species}`);
		// const returnData: Neighbors = {
		// 	previous: {
		// 		name: data.links.previous.name,
		// 		id: data.links.previous.id,
		// 	},
		// 	current: {
		// 		name: data.links.previous.name,
		// 		id: data.links.previous.id,
		// 	},
		// 	next: {
		// 		name: data.links.previous.name,
		// 		id: data.links.previous.id,
		// 	}
		// }
		// return returnData;
		return fetcher.get<Neighbors>(`/v2/species/${species}/neighbors`);
	} catch (error) {
		throw getSvelteError({ error });
	}
}

async function getVariants(fetcher: FetcherType, { species }: { species: string }) {
	try {
		// const data = await fetcher.get<{
		// 	species: SpeciesInfo;
		// 	links: { previous: NavItem; current: NavItem; next: NavItem };
		// }>(`/v1/species/${species}`);
		// const returnData: VariantListItem[] = data.species.variants.map((variant) => {
		// 	return {
		// 		id: variant.pokemonId,
		// 		name: variant.name,
		// 		is_default: variant.default,
		// 	}
		// })
		// return returnData;
		const { variants } = await fetcher.get<{ variants: VariantListItem[] }>(
			`/v2/species/${species}/variants`
		);
		return variants;
	} catch (error) {
		throw getSvelteError({ error });
	}
}

export const load = async (event) => {
	const { species } = event.params;
	const api = fetcher({
		fetch: event.fetch,
		base: POKEDEX_API_HOST
	});
	const variants = getVariants(api, { species });
	const speciesInfo = getSpecies(api, { species });
	const neighbors = getNeighbors(api, { species });

	return {
		species: speciesInfo,
		variants,
		neighbors
	};
};
