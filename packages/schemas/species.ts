import { Output, array, boolean, integer, nullable, number, object, string, transform, url } from 'valibot';

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
  })),
  id: number([integer()]),
  flavor_text_entries: array(object({ flavor_text: string(), language: object({ name: string() })})),
  form_descriptions: array(object({
    description: string(),
    language: object({
      name: string(),
    })
  })),
  habitat: nullable(object({ name: string() })),
  pokedex_numbers: array(object({ entry_number: number([integer()]), pokedex: object({ name: string()})})),
  varieties: array(object({ is_default: boolean(), pokemon: object({ name: string(), url: string([url()])})})),
})

export const speciesInfoSchema = transform(pokeApiSpeciesInfoSchema, (input) => {
  return {
    name: input.name,
    speciesId: input.id,
    genus: input.genera.filter((genus) => genus.language.name === 'en').at(0)?.genus ?? 'Pokemon',
    flavorText: [input.flavor_text_entries.filter((flavor_text) => flavor_text.language.name === 'en').at(-1)?.flavor_text ?? '', ...input.form_descriptions.filter((description) => description.language.name === 'en').map((description) => description.description)].filter(Boolean),
    habitat: input?.habitat?.name ?? null,
    pokedexNumber: input.pokedex_numbers.filter((entry) => entry.pokedex.name === 'national').at(0)?.entry_number ?? 1,
    variants: input.varieties.filter((variant) => !variant.pokemon.name.includes('totem')).map((variant) => ({ default: variant.is_default, name: variant.pokemon.name, pokemonId: Number(variant.pokemon.url.split('/').at(-2))}))
  }
})
export type SpeciesInfo = Output<typeof speciesInfoSchema>;

const pokeApiVariantInfoSchema = object({
  forms: array(object({
    name: string(),
    url: string([url()]),
  })),
  height: number([integer()]),
  weight: number([integer()]),
  id: number(),
  name: string(),
  sprites: object({
    front_default: nullable(string([url()])),
    other: object({
      'official-artwork': object({
        front_default: nullable(string([url()])),
      })
    })
  }),
  types: array(object({
    type: object({
      name: string(),
    })
  }))
})

export const variantInfoSchema = transform(pokeApiVariantInfoSchema, (input) => {
  return {
    height: input.height / 10,
    weight: input.weight / 10,
    variantId: input.id,
    name: input.name,
    image: input.sprites.other['official-artwork'].front_default ? input.sprites.other['official-artwork'].front_default : input.sprites.front_default,
    forms: input.forms.map((form) => {
      return {
        name: form.name,
        formId: Number(form.url.split('/').at(-2)),
      }
    }),
    types: input.types.map((typeEntry) => typeEntry.type.name),
  }
})
export type VariantInfo = Output<typeof variantInfoSchema>;