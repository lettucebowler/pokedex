import { Input, Output, array, integer, literal, nullable, number, object, pick, string, transform, union, url } from "valibot";

export const variantSchema = transform(
	object({
		id: number([integer()]),
		name: string(),
		height: number([integer()]),
		weight: number([integer()]),
		image: string([url()]),
		type_1: string(),
		type_2: nullable(string()),
		is_default: union([literal('N'), literal('Y')]),
		species_id: number([integer()])
	}),
	(input) => {
		const { type_1, type_2, is_default, ...rest } = input;
		return {
			...rest,
			types: [type_1, type_2].filter((type): type is string => !!type),
			is_default: is_default === 'Y'
		};
	}
);
export type Variant = Output<typeof variantSchema>;

export const variantListItemSchema = transform(pick(variantSchema, ['id', 'name', 'is_default']), (input) => {
	return {
		id: input.id,
		name: input.name,
		is_default: input.is_default === 'Y',
	}
});
export type VariantListItem = Output<typeof variantListItemSchema>;
export const variantsSchema = array(variantListItemSchema);

export const speciesSchema = transform(
	object({
		id: number([integer()]),
		name: string(),
		genus: string(),
		habitat: nullable(string()),
		color: nullable(string()),
		shape: nullable(string()),
		flavor_text: nullable(string()),
		egg_groups: string(),
	}),
	(input) => {
		const { egg_groups, ...rest } = input;
		const egg_group_list = egg_groups.split(';').filter(Boolean)
		return {
			...rest,
			egg_groups: egg_group_list.length ? egg_group_list : ['no-eggs'],
		};
	}
);
export type Species = Output<typeof speciesSchema>;

export const neighborsSchema = transform(object({
		name: string(),
		id: number([integer()]),
		previousName: string(),
		previousId: number([integer()]),
		nextName: string(),
		nextId: number([integer()]),
	}), (input) => {
		return {
			previous: {
				name: input.previousName,
				id: input.previousId,
			},
			current: {
				name: input.name,
				id: input.id,
			},
			next: {
				name: input.nextName,
				id: input.nextId,
			}
		}
});
export type Neighbors = Output<typeof neighborsSchema>;

export const evolutionSchema = object({
	chain_id: number([integer()]),
	species_id: number([integer()]),
	evolves_from: nullable(number([integer()])),
	name: string(),
});
export type Evolution = Output<typeof evolutionSchema>;

export const evolutionChainSchema = transform(
	array(evolutionSchema),
	(input) => {
		const [basic] = input.filter((evolution) => !evolution.evolves_from);
		const chain = {
			species: {
				id: basic.species_id,
				name: basic.name,
			},
			evolves_from: basic.evolves_from,
			evolutions: input.filter((stage_1) => stage_1.evolves_from === basic.species_id).map((stage_1) => {
				return {
					species: {
						id: stage_1.species_id,
						name: stage_1.name,
					},
					evolves_from: stage_1.evolves_from,
					evolutions: input.filter((stage_2) => stage_2.evolves_from === stage_1.species_id).map((stage_2) => {
						return {
							species: {
								id: stage_2.species_id,
								name: stage_2.name,
							},
							evolves_from: stage_2.evolves_from,
							evolutions: [],
						}
					})
				}
			})
		};
		return chain;
	},
);
export type EvolutionChainOutput = Output<typeof evolutionChainSchema>;