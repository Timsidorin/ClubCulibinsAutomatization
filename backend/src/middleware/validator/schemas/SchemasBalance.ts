import * as z from "zod/v4";

export const SchemasUpdateBalance = z.object({
    tgUsername: z.string().regex(/^@/),
    tgTeacher: z.string().regex(/^@/),
    operation: z.boolean('FALSE - вычитание TRUE - сложение'),
    summ: z.number().positive(),
});

export const SchemasLogsBalance = z.object({
    tgTeacher: z.optional(z.string().regex(/^@/)),
    tgChild: z.optional(z.string().regex(/^@/)),
    operation: z.optional(z.boolean('FALSE - вычитание TRUE - сложение')),
    equalSign: z.optional(z.union([z.number(), z.nan()])),
    summ: z.optional(z.union([z.number(), z.nan()])),
})