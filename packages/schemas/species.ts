import { Output, array, integer, number, object, string, transform, url } from 'valibot';

export const pokeApiSpeciesListEntrySchema = object({
    name: string(),
    url: string([url()]),
})

export const pokeApiGetSpeciesCollectionSchema = object({
  results: array(pokeApiSpeciesListEntrySchema)
});

export const getSpeciesResponseSchema = transform(pokeApiGetSpeciesCollectionSchema, (input) => {
  const results =  input.results.map((result) => ({ name: result.name, id: Number(result.url.split('/').at(-2))}))
  return {
    results,
  }
})

export const pokedexSpecies = object({
  name: string(),
  id: number([ integer()]),
})

export const speciesListSchema = object({
  species: array(pokedexSpecies)
})

export const pokeApiSpeciesInfoSchema = object({
  name: string(),
  genera: array(object({
    genus: string(),
    language: object({
        name: string(),
      })
  }))
})

export const speciesInfoSchema = transform(pokeApiSpeciesInfoSchema, (input) => {
  return {
    name: input.name,
    genus: input.genera.filter((genus) => genus.language.name === 'en').at(0)?.genus ?? 'Pokemon'
  }
})
export type SpeciesInfo = Output<typeof speciesInfoSchema>;

// export const speciesInfoSchema = object({
//   name: string(),
//   genus: string()
// })