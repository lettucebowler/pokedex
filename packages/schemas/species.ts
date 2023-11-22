import { object, string, url } from 'valibot';

export const speciesSchema = object({
    name: string(),
    url: string([url()]),
})