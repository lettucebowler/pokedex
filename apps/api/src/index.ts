import { Context, Hono } from 'hono';
import { cache } from 'hono/cache';
import { fetcher } from 'itty-fetcher';
import { safeParse } from 'valibot';
import { evolutionChainInfoSchema, speciesInfoSchema, variantInfoSchema } from 'schemas/species';
import { pokedexById, pokedexByName } from './pokedex';
import { defaultVariants } from './default-variants';
import { getSpecies, getVariant, getVariants, insertSpecies, insertVariant } from './db';

const pokeAPi = fetcher({
	base: 'https://pokeapi.co/api/v2'
});

export class StatusError extends Error {
	status: number;

	constructor(status = 500, message = 'Internal Error.') {
		super(message);
		this.status = status;
	}
}

function getErrorMessage(c: Context<{ Bindings: ApiBindings }>, { error }: { error: unknown }) {
	if (error instanceof StatusError) {
		c.status(error.status);
		return c.json({
			message: error.message
		});
	}
	if (error instanceof Error) {
		c.status(500);
		return c.json({
			message: error.message
		});
	}
	c.status(500);
	return c.json({
		message: String(error)
	});
}

export type ApiBindings = {
	DB: D1Database;
};
const app = new Hono<{ Bindings: ApiBindings }>();

// app.get(
// 	'*',
// 	cache({
// 		cacheName: 'pokedex',
// 		cacheControl: 'max-age=3600'
// 	})
// );

app.get('/v1/species', async (c) => {
	const { limit = pokedexByName.size, offset = 0 } = c.req.query();
	return c.json({
		results: [...pokedexByName.keys()]
			.slice(Number(offset), Number(offset) + Number(limit))
			.map((species) => {
				return {
					name: species,
					id: pokedexByName.get(species)
				};
			})
	});
});

app.get('/v1/species/:species', async (c) => {
	const { species } = c.req.param();
	const id = pokedexByName.get(species);
	if (!id) {
		c.status(404);
		return c.json({
			message: 'not found'
		});
	}
	const data = await pokeAPi.get('/pokemon-species/' + species);
	const speciesData = safeParse(speciesInfoSchema, data);
	if (!speciesData.success) {
		c.status(500);
		return c.json({
			message: 'invalid data from pokeapi',
			errors: speciesData.issues
		});
	}
	const previousId = id === 1 ? pokedexByName.size : id - 1;
	const nextId = id === pokedexByName.size ? 1 : id + 1;
	return c.json({
		species: speciesData.output,
		links: {
			previous: {
				id: previousId,
				name: pokedexById.get(previousId)
			},
			current: {
				id,
				name: pokedexById.get(id)
			},
			next: {
				id: nextId,
				name: pokedexById.get(nextId)
			}
		}
	});
});

app.get('/v2/species', async (c) => {
	const { limit, offset } = c.req.query();
});

app.get('/v2/species/:species', async (c) => {
	const { species } = c.req.param();
	try {
		const speciesData = await getSpecies(c, { species });
		return c.json(speciesData);
	} catch (error) {
		return getErrorMessage(c, { error });
	}
});

app.put('/v2/species/:species', async (c) => {
	const { species } = c.req.param();
	const body = await c.req.json();
	const result = await insertSpecies(c, { name: species, ...body });
	return c.json(result);
});

app.get('/v2/species/:species/variants', async (c) => {
	const { species } = c.req.param();
	return c.json(await getVariants(c, { species }));
});

app.get('/v2/species/:species/variants/:variant', async (c) => {
	const { species, variant } = c.req.param();
	return c.json(await getVariant(c, { species, variant }));
});

app.put('/v2/species/:species/variants/:variant', async (c) => {
	const { species, variant } = c.req.param();
	const body = await c.req.json();
	return c.json(
		await insertVariant(c, {
			name: variant === 'default' ? species : `${species}-${variant}`,
			...body
		})
	);
});

app.get('/v1/species/:species/variants/:variant', async (c) => {
	const { species, variant } = c.req.param();
	if (!pokedexByName.get(species)) {
		c.status(404);
		return c.json({
			message: 'not found'
		});
	}
	let variantSuffix = '';
	if (variant === 'default') {
		const suffix = defaultVariants.get(species);
		if (suffix) {
			variantSuffix = suffix;
		}
	} else {
		variantSuffix = variant;
	}
	const data = await pokeAPi.get(`/pokemon/${[species, variantSuffix].filter(Boolean).join('-')}`);
	const variantInfo = safeParse(variantInfoSchema, data);
	if (!variantInfo.success) {
		c.status(500);
		return c.json({
			message: 'invalid data from pokeapi'
		});
	}
	return c.json(variantInfo.output);
});

app.get('/v1/evolution-chains/:id', async (c) => {
	const { id } = c.req.param();
	const data = await pokeAPi.get('/evolution-chain/' + id);
	const parseResult = safeParse(evolutionChainInfoSchema, data);
	if (!parseResult.success) {
		c.status(500);
		return c.json({
			message: 'invalid data from pokeapi',
			errors: parseResult.issues
		});
	}
	return c.json(parseResult.output);
});

export default app;
