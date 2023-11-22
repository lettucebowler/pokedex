import { array, object, string, transform, url } from 'valibot';

export const speciesSchema = object({
    name: string(),
    url: string([url()]),
})

export const getSpeciesResponseSchema = transform(object({
    results: array(speciesSchema)
  }), (input) => {
    const results =  input.results.map((result) => ({ name: result.name, id: Number(result.url.split('/').at(-2))}))
    return {
      results,
    }
  })