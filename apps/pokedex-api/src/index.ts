import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { fetcher } from 'itty-fetcher';
import { object, array, number, nullable, string, safeParse, transform } from 'valibot';
import { getSpeciesResponseSchema, speciesSchema } from 'schemas/species';

const pokeAPi = fetcher({
    base: 'https://pokeapi.co/api/v2'
})

const app = new Hono()

app.get(
    '*',
    cache({
      cacheName: 'lettuce-pokedex',
      cacheControl: 'max-age=3600',
    })
  )

app.get('/', (c) => c.text('Hello test!'))


app.get('/v1/species', async (c) => {
    const data = await pokeAPi.get('/pokemon-species', { limit: 1017 });
    const parseResult = safeParse(getSpeciesResponseSchema, data);
    if (!parseResult.success) {
      c.status(500);
      return c.json({
        message: 'invalid data from pokeapi',
      })
    }
    return c.json(parseResult.output);
})

export default app
