import { Context } from 'hono';
import type { ApiBindings } from '.';
import {
	safeParse,
	object,
	string,
	number,
	integer,
	transform,
	nullable,
	array,
	union,
	literal,
	Output,
	url
} from 'valibot';
import { StatusError } from 'itty-fetcher';

const speciesSchema = transform(
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
export async function getSpecies(
	c: Context<{ Bindings: ApiBindings }>,
	{ species }: { species: string }
) {
	const query = c.env.DB.prepare(
		`select
			s.id,
			s.name,
			s.genus,
			s.habitat,
			s.color,
			s.shape,
			s.flavor_text,
			s.egg_groups
		from species s where s.name = ?1`
	).bind(species);
	const data = await query.first();
	if (!data) {
		throw new StatusError(404, 'NOT_FOUND');
	}
	const parseResult = safeParse(speciesSchema, data);
	if (!parseResult.success) {
		throw new StatusError(500, 'invalid data from db');
	}
	return parseResult.output;
}

export async function insertSpecies(c: Context<{ Bindings: ApiBindings }>, species: Species) {
	const query = c.env.DB.prepare(
		'insert into species (id, name, genus, habitat, color, shape, flavor_text, egg_groups) values (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8) on conflict (name) do update set id = ?1, genus = ?3, habitat = ?4, color = ?5, shape = ?6, flavor_text = ?7, egg_groups = ?8 on conflict (id) do update set name = ?2, genus = ?3, habitat = ?4, color = ?5, shape = ?6, flavor_text = ?7, egg_groups = ?8 returning id, name, genus, habitat, color, shape, flavor_text, egg_groups'
	).bind(
		species.id,
		species.name,
		species.genus,
		species.habitat ?? null,
		species.color ?? null,
		species.shape ?? null,
		species.flavor_text ?? null,
		species.egg_groups.join(';')
	);
	const insertResult = await query.run();
	if (!insertResult.success) {
		throw new StatusError(500, insertResult.error ?? 'Insert failed');
	}
	const [returned] = insertResult.results;
	const parseResult = safeParse(speciesSchema, returned);
	if (!parseResult.success) {
		throw new StatusError(500, 'invalid data from db');
	}
	return parseResult.output;
}

const variantsSchema = transform(
	array(
		object({
			id: number([integer()]),
			name: string(),
			is_default: union([literal('N'), literal('Y')])
		})
	),
	(input) => {
		return {
			variants: input.map((v) => {
				return {
					id: v.id,
					name: v.name,
					is_default: v.is_default === 'Y'
				};
			})
		};
	}
);
export async function getVariants(
	c: Context<{ Bindings: ApiBindings }>,
	{ species }: { species: string }
) {
	const query = c.env.DB.prepare(
		'select id, name, is_default from variants where species_id in (select id from species where name = ?1)'
	).bind(species);
	const data = await query.all();
	const parseResult = safeParse(variantsSchema, data.results);
	if (!parseResult.success) {
		throw new Error('invalid data from db');
	}
	return parseResult.output;
}

const variantSchema = transform(
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
			types: [type_1, type_2],
			is_default: is_default === 'Y'
		};
	}
);
export type Variant = Output<typeof variantSchema>;
export async function getVariant(
	c: Context<{ Bindings: ApiBindings }>,
	{ species, variant }: { species: string; variant: string }
) {
	let query = c.env.DB.prepare(
		'select id, name, height, weight, image, type_1, type_2, is_default, species_id from variants where name = ?1'
	);
	if (variant === 'default') {
		query = query.bind(species);
	} else {
		query = query.bind(`${species}-${variant}`);
	}
	const data = await query.first();
	if (!data) {
		throw new StatusError(404, 'NOT_FOUND');
	}
	const parseResult = safeParse(variantSchema, data);
	if (!parseResult.success) {
		console.log(JSON.stringify(parseResult.issues));
		throw new StatusError(500, 'invalid data from db');
	}
	return parseResult.output;
}

export async function insertVariant(c: Context<{ Bindings: ApiBindings }>, variant: Variant) {
	const [type_1, type_2 = null] = variant.types;
	const query = c.env.DB.prepare(
		'insert into variants (id, name, height, weight, image, type_1, type_2, species_id, is_default) values (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9) on conflict(id) do update set name = ?2, height = ?3, weight = ?4, image=?5, type_1=?6, type_2=?7, species_id=?8, is_default = ?9, species_id=?8 on conflict(name) do update set id=?1, height=?3, weight=?4, image=?5, type_1=?6, type_2=?7, species_id=?8, is_default = ?9 returning id, name, height, weight, type_1, type_2, is_default, image, species_id'
	).bind(
		variant.id,
		variant.name,
		variant.height,
		variant.weight,
		variant.image,
		type_1,
		type_2,
		variant.species_id,
		variant.is_default ? 'Y' : 'N'
	);
	const insertResult = await query.run();
	const [returned] = insertResult.results;
	const parseResult = safeParse(variantSchema, returned);
	if (!parseResult.success) {
		throw new StatusError(500, 'invalid data from db');
	}
	return parseResult.output;
}
