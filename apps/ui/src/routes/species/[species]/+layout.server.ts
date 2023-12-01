import { POKEDEX_API_HOST } from '$env/static/private';
import { StatusError, fetcher, type FetcherType } from 'itty-fetcher';
import type { Evolution, PokeApiEvolutionChain, SpeciesInfo } from 'schemas/pokeApi';
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

type NavItem = {
	name: string;
	id: number;
};
async function getSpecies(fetcher: FetcherType, { species }: { species: string }) {
	try {
		// console.log('load species data:', species);
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
		// await fetcher.post('/v2/evolutions', {
		// 	chain_id: data.species.evolutionChain,
		// 	species_id: data.species.speciesId,
		// 	evolves_from: data.species.evolves_from,
		// })
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

import type { EvolutionChainOutput } from 'schemas/db/schemas.js';
async function getEvolutionChain(
	fetcher: FetcherType,
	{ species }: { species: string }
): Promise<EvolutionChainOutput> {
	try {
		// const pokeApiSpeciesData = await fetcher.get<{
		// 	species: SpeciesInfo;
		// 	links: { previous: NavItem; current: NavItem; next: NavItem };
		// }>(`/v1/species/${species}`);
		// const pokeApiEvolutionChainData = await fetcher.get<PokeApiEvolutionChain>('/v1/evolution-chains/' + pokeApiSpeciesData.species.evolutionChain);
		// const returnData: EvolutionChainOutput = {
		// 	species: pokeApiEvolutionChainData.chain.species,
		// 	evolutions: pokeApiEvolutionChainData.chain.evolutions.map((e) => {
		// 		return {
		// 			species: e.species,
		// 			evolutions: e.evolutions.map((e2) => {
		// 				return {
		// 					species: e2.species,
		// 					evolutions: [],
		// 				}
		// 			})
		// 		}
		// 	})
		// }
		// return returnData;
		return fetcher.get<EvolutionChainOutput>(`/v2/species/${species}/evolution-chain`);
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
	const evolution_chain = getEvolutionChain(api, { species });
	return {
		species: speciesInfo,
		variants,
		neighbors,
		evolution_chain
	};
};
