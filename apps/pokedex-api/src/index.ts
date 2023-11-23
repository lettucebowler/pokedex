import { Hono } from 'hono';
import { cache } from 'hono/cache';
import { fetcher } from 'itty-fetcher';
import { object, array, number, nullable, string, safeParse, transform, flatten } from 'valibot';
import { getSpeciesResponseSchema, speciesInfoSchema, variantInfoSchema } from 'schemas/species';

const pokeAPi = fetcher({
	base: 'https://pokeapi.co/api/v2'
});

const app = new Hono();

app.get(
	'*',
	cache({
		cacheName: 'lettuce-pokedex-cache-bleh',
		cacheControl: 'max-age=3600'
	})
);

app.get('/v1/species', async (c) => {
	const { limit } = c.req.query();
	const data = await pokeAPi.get('/pokemon-species', { limit });
	const parseResult = safeParse(getSpeciesResponseSchema, data);
	if (!parseResult.success) {
		c.status(500);
		return c.json({
			message: 'invalid data from pokeapi'
		});
	}
	return c.json(parseResult.output);
});

app.get('/v1/species/:species', async (c) => {
	const { species } = c.req.param();
	const data = await pokeAPi.get('/pokemon-species/' + species);
	const speciesData = safeParse(speciesInfoSchema, data);
	if (!speciesData.success) {
		console.log(flatten(speciesData.issues));
		c.status(500);
		return c.json({
			message: 'invalid data from pokeapi'
		});
	}
	return c.json(speciesData.output);
});

app.get('/v1/variants/:variant', async (c) => {
	const { variant } = c.req.param();
	const data = await pokeAPi.get(`/pokemon/${variant}`);
	const variantInfo = safeParse(variantInfoSchema, data);
	if (!variantInfo.success) {
		console.log(flatten(variantInfo.issues));
		c.status(500);
		return c.json({
			message: 'invalid data from pokeapi'
		});
	}
	return c.json(variantInfo.output);
});

export default app;
