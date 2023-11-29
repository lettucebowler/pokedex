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
	Output
} from 'valibot';
import { StatusError } from 'itty-fetcher';

const speciesSchema = object({
	id: number([integer()]),
	name: string(),
	genus: string(),
	habitat: nullable(string()),
	color: string(),
	shape: string()
});
type Species = Output<typeof speciesSchema>;
export async function getSpecies(
	c: Context<{ Bindings: ApiBindings }>,
	{ species }: { species: string }
) {
	console.log('get species');
	const query = c.env.DB.prepare(
		'select id, name, genus, habitat, color, shape from species where name = ?1'
	).bind(species);
	const data = await query.all();
	if (!data.results.length) {
		throw new StatusError(404, 'NOT_FOUND');
	}
	const parseResult = safeParse(speciesSchema, data.results.at(0));
	if (!parseResult.success) {
		throw new StatusError(500, 'invalid data from db');
	}
	return parseResult.output;
}

export async function insertSpecies(
	c: Context<{ Bindings: ApiBindings }>,
	{ species }: { species: Species }
) {
	const query = c.env.DB.prepare(
		'insert into species (id, name, genus, habitat, color, shape) values (?1, ?2, ?3, ?4, ?5, ?6)'
	).bind(species.id, species.name, species.genus, species.habitat, species.color, species.shape);
	const result = await query.run();
	return result;
}

const flavorTextEntriesSchema = transform(
	array(
		object({
			flavor_text: string()
		})
	),
	(input) => {
		return {
			flavor_text_entries: input.map((f) => f.flavor_text)
		};
	}
);
export async function getFlavorText(
	c: Context<{ Bindings: ApiBindings }>,
	{ species }: { species: string }
) {
	console.log('get flavor text entries');
	const query = c.env.DB.prepare(
		'select flavor_text from species_flavor_text where species_id in (select id from species where name = ?1)'
	).bind(species);
	const data = await query.all();
	const parseResult = safeParse(flavorTextEntriesSchema, data.results);
	if (!parseResult.success) {
		throw new Error('invalid data from db');
	}
	return parseResult.output;
}

const eggGroupsSchema = transform(
	array(
		object({
			egg_group: string()
		})
	),
	(input) => {
		return {
			egg_groups: input.map((f) => f.egg_group)
		};
	}
);
export async function getEggGroups(
	c: Context<{ Bindings: ApiBindings }>,
	{ species }: { species: string }
) {
	console.log('get egg groups');
	const query = c.env.DB.prepare(
		'select egg_group from species_egg_groups where species_id in (select id from species where name = ?1)'
	).bind(species);
	const data = await query.all();
	const parseResult = safeParse(eggGroupsSchema, data.results);
	if (!parseResult.success) {
		throw new Error('invalid data from db');
	}
	return parseResult.output;
}

const variantsSchema = transform(
	array(
		object({
			id: number([integer()]),
			name: string(),
			default: union([literal('N'), literal('Y')])
		})
	),
	(input) => {
		return {
			variants: input.map((v) => {
				return {
					id: v.id,
					name: v.name,
					default: v.default === 'Y'
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
		'select id, name, `default` from variants where species_id in (select id from species where name = ?1)'
	).bind(species);
	const data = await query.all();
	const parseResult = safeParse(variantsSchema, data.results);
	if (!parseResult.success) {
		throw new Error('invalid data from db');
	}
	return parseResult.output;
}
