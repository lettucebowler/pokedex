import { POKEDEX_API_HOST } from '$env/static/private';
import { fetcher } from 'itty-fetcher';
import type { EvolutionChain, SpeciesInfo } from 'schemas/species.js';
import type { LayoutServerLoadEvent } from './$types.js';
import { error } from '@sveltejs/kit';

type navItem = {
	id: number;
	name: string;
};

type hasMessage = {
	message: string;
};
function hasMessage(e: any): e is hasMessage {
	return 'message' in e;
}

async function getSpeciesData(event: LayoutServerLoadEvent) {
	const { species } = event.params;
	const api = fetcher({
		fetch: event.fetch,
		base: POKEDEX_API_HOST
	});

	try {
		return api.get<{
			species: SpeciesInfo;
			links: { previous: navItem; current: navItem; next: navItem };
		}>(`/v1/species/${species}`);
	} catch (e) {
		if (hasMessage(e)) {
			throw error(500, e.message);
		} else {
			throw error(500, 'error from pokeapi');
		}
	}
}

async function getEvolutionChainData(event: LayoutServerLoadEvent, { id }: { id: number }) {
	const api = fetcher({
		fetch: event.fetch,
		base: POKEDEX_API_HOST
	});
	try {
		return api.get<EvolutionChain>('/v1/evolution-chains/' + id);
	} catch (e) {
		if (hasMessage(e)) {
			throw error(500, e.message);
		} else {
			throw error(500, 'error from pokeapi');
		}
	}
}

export const load = async (event) => {
	const { species, links } = await getSpeciesData(event);

	return {
		species,
		links
	};
};
