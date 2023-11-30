import { Output, array, integer, literal, nullable, number, object, pick, string, transform, union, url } from "valibot";

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
		egg_groups: string()
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