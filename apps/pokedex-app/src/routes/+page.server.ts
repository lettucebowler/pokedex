import { fetcher } from 'itty-fetcher';
import { POKEDEX_API_HOST } from '$env/static/private';
import type { getSpeciesResponseSchema } from 'schemas/species';
import type { Output } from 'valibot';
type SpeciesCollection = Output<typeof getSpeciesResponseSchema>;
export const load = async (event) => {
	const api = fetcher({
		fetch: event.fetch,
		base: POKEDEX_API_HOST
	});
	const getSpeciesResponse = await api.get<SpeciesCollection>('/v1/species', { limit: 60 });
	return {
		species: getSpeciesResponse.results
	};
};
