import { fetcher } from 'itty-fetcher';
import { POKEDEX_API_HOST } from '$env/static/private';
export const load = async (event) => {
	const api = fetcher({
		fetch: event.fetch,
		base: POKEDEX_API_HOST
	});
	const getSpeciesResponse = await api.get<{ results: { name: string; id: number }[] }>(
		'/v1/species'
	);
	return {
		species: getSpeciesResponse.results
	};
};
