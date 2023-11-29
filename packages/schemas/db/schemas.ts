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

export const variantListItemSchema = pick(variantSchema, ['id', 'name', 'is_default']);
export type VariantListItem = Output<typeof variantListItemSchema>;

export const variantsSchema = array(variantListItemSchema);

export const speciesSchema = transform(
	object({
		id: number([integer()]),
		name: string(),
		genus: string(),
		habitat: nullable(string()),
		color: string(),
		shape: string(),
		flavor_text: string(),
		egg_groups: string()
	}),
	(input) => {
		const { egg_groups, ...rest } = input;
		return {
			...rest,
			egg_groups: egg_groups.split(';')
		};
	}
);
export type Species = Output<typeof speciesSchema>;