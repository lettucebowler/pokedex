import { Context } from 'hono';
import type { ApiBindings } from '.';
import { safeParse } from 'valibot';
import { StatusError } from 'itty-fetcher';

import { speciesSchema } from 'schemas/db/schemas';
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

import type { Species } from 'schemas/db/schemas';
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

import { variantsSchema } from 'schemas/db/schemas';
export async function getVariants(
	c: Context<{ Bindings: ApiBindings }>,
	{ species }: { species: string }
) {
	const query = c.env.DB.prepare(
		'select id, name, is_default from variants where species_id in (select id from species where name = ?1) order by id'
	).bind(species);
	const data = await query.all();
	const parseResult = safeParse(variantsSchema, data.results);
	if (!parseResult.success) {
		throw new Error('invalid data from db');
	}
	return parseResult.output;
}

import { variantSchema } from 'schemas/db/schemas';
export async function getVariant(
	c: Context<{ Bindings: ApiBindings }>,
	{ species, variant }: { species: string; variant: string }
) {
	let query;
	if (variant === 'default') {
		query = c.env.DB.prepare(
			'select v.id id, v.name name, v.height height, v.weight weight, v.image image, v.type_1 type_1, v.type_2 type_2, v.is_default is_default, v.species_id species_id from variants v inner join species s on s.id = v.species_id where s.name = ?1 and is_default = "Y"'
		).bind(species);
	} else {
		query = c.env.DB.prepare(
			'select id, name, height, weight, image, type_1, type_2, is_default, species_id from variants where name = ?1'
		).bind(`${species}-${variant}`);
	}
	const queryResult = await query.all();
	// console.log(JSON.stringify(queryResult.meta, null, 2));
	const [data] = queryResult.results;
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

import type { Variant } from 'schemas/db/schemas';
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
