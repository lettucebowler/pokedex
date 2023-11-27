import { Output, array, boolean, integer, literal, null_, nullable, nullish, number, object, string, transform, url } from 'valibot';

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
  color: object({
    name: string(),
  }),
  egg_groups: array(object({
    name: string(),
  })),
  shape: nullable(object({
    name: string(),
  })),
  evolution_chain: object({
    url: string([url()]),
  }),
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
});

const variantsToFilter = [
  'miraidon-low-power-mode',
  'miraidon-drive-mode',
  'miraidon-aquatic-mode',
  'miraidon-glide-mode',
  'koraidon-limited-build',
  'koraidon-sprinting-build',
  'koraidon-swimming-build',
  'koraidon-gliding-build',
  'eevee-starter',
  'pikachu-starter',
  'pikachu-world-cap',
  'zarude-dada',
]

function filterVariants(variant: { pokemon: {name: string; }; }) {
  if (variant.pokemon.name.includes('totem')) {
    return false;
  }
  if (variantsToFilter.includes(variant.pokemon.name)) {
    return false;
  }
  return true;
}

export const speciesInfoSchema = transform(pokeApiSpeciesInfoSchema, (input) => {
  return {
    name: input.name,
    speciesId: input.id,
    genus: input.genera.filter((genus) => genus.language.name === 'en').at(0)?.genus ?? 'Pokemon',
    flavorText: [input.flavor_text_entries.filter((flavor_text) => flavor_text.language.name === 'en').at(-1)?.flavor_text ?? '', ...input.form_descriptions.filter((description) => description.language.name === 'en').map((description) => description.description)].filter(Boolean),
    habitat: input?.habitat?.name ?? null,
    pokedexNumber: input.pokedex_numbers.filter((entry) => entry.pokedex.name === 'national').at(0)?.entry_number ?? 1,
    variants: input.varieties.filter(filterVariants).map((variant) => ({ default: variant.is_default, name: variant.pokemon.name, pokemonId: Number(variant.pokemon.url.split('/').at(-2))})),
    shape: input.shape?.name ?? null,
    color: input.color.name,
    eggGroups: input.egg_groups.map((egg_group) => egg_group.name),
    evolutionChain: Number(input.evolution_chain.url.split('/').at(-2))
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
      }),
      home: object({
        front_default: nullable(string([url()])),
      }),
    })
  }),
  types: array(object({
    type: object({
      name: string(),
    })
  }))
})

export const variantInfoSchema = transform(pokeApiVariantInfoSchema, (input) => {
  console.log(input.sprites);
  return {
    height: input.height / 10,
    weight: input.weight / 10,
    variantId: input.id,
    name: input.name,
    image: input.sprites.other['official-artwork'].front_default ?? input.sprites.other.home.front_default ?? input.sprites.front_default,
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

const pokeApiEvolutionDetailsSchema = object({
  trigger: object({
    name: string(),
  })
});

const pokeApiFinalEvolution = object({
  evolution_details: array(pokeApiEvolutionDetailsSchema),
  species: object({
    name: string(),
    url: string([url()]),
  })
});
type PokeApiFinalEvolution = Output<typeof pokeApiFinalEvolution>;

const pokeApiMiddleEvolution = object({
  evolution_details: array(pokeApiEvolutionDetailsSchema),
  evolves_to: array(pokeApiFinalEvolution),
  species: object({
    name: string(),
    url: string([url()]),
  })
});
type PokeApiMiddleEvolution = Output<typeof pokeApiMiddleEvolution>;

const pokeApiBasicEvolution = object({
  evolution_details: array(pokeApiEvolutionDetailsSchema),
  evolves_to: array(pokeApiMiddleEvolution),
  species: object({
    name: string(),
    url: string([url()]),
  }),
})
type PokeApiBasicEvolution = Output<typeof pokeApiBasicEvolution>;

const pokeApiEvolutionChainInfoSchema = object({
  chain: pokeApiBasicEvolution,
  id: number([integer()]),
});


function isNotFinal(evolution: PokeApiBasicEvolution | PokeApiMiddleEvolution | PokeApiFinalEvolution): evolution is PokeApiBasicEvolution | PokeApiMiddleEvolution {
  if ("evolves_to" in evolution) {
    return true;
  }
  return false;
}

export type Evolution = {
  trigger: string;
  species: {
    name: string;
    id: number;
  }
  evolutions: Evolution[];
}

function transformEvolution(evolution: PokeApiBasicEvolution | PokeApiMiddleEvolution | PokeApiFinalEvolution): Evolution {
  return {
    trigger: evolution.evolution_details?.at(0)?.trigger.name ?? '',
    species: {
      name: evolution.species.name,
      id: Number(evolution.species.url.split('/').at(-2)),
    },
    evolutions: isNotFinal(evolution) ? evolution.evolves_to.map((e) => transformEvolution(e)) : [],
  }
}

export const evolutionChainInfoSchema = transform(pokeApiEvolutionChainInfoSchema, (input) => {
  return {
    id: input.id,
    chain: transformEvolution(input.chain),
  };
});

export type EvolutionChain = Output<typeof evolutionChainInfoSchema>;
