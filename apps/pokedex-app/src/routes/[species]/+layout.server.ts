import { POKEDEX_API_HOST } from '$env/static/private';
import { fetcher } from 'itty-fetcher';
import type { SpeciesInfo } from 'schemas/species.js';

export const load = async (event) => {
	const { species } = event.params;
	const api = fetcher({
		fetch: event.fetch,
		base: POKEDEX_API_HOST
	});

	const data = await api.get<SpeciesInfo>(`/v1/species/${species}`);
	return {
		species: data
	};
};
