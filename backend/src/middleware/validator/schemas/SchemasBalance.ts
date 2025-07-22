import * as z from "zod/v4";

export const SchemasUpdateBalance = z.object({
    uuidUser: z.uuid(),
    tgTeacher: z.string().regex(/^@/),
    operation: z.boolean('FALSE - вычитание TRUE - сложение'),
    summ: z.number().positive(),
});

export const SchemasLogsBalance = z.object({
    tgTeacher: z.optional(z.string().regex(/^@/)),
    uuidUser: z.optional(z.uuid()),
    operation: z.optional(z.boolean('FALSE - вычитание TRUE - сложение')),
    equalSign: z.optional(z.union([z.number(), z.nan()])),
    summ: z.optional(z.union([z.number(), z.nan()])),
})