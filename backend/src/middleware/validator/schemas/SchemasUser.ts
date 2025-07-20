import * as z from "zod/v4";

export const SchemasCreate = z.object({
    tgUsername: z.string('Tg name начинается с @').regex(/^@/),
    name: z.string('Это строка'),
    lastName: z.string('Это строка'),
});

export const SchemasRegister = z.object({
    tgUsername: z.string('Tg name начинается с @').regex(/^@/),
    tgId: z.number('Tg Id - это число')
});

export const SchemasUpdateUser = z.object({
    tgUsername: z.string('Tg name начинается с @').regex(/^@/),
    name: z.optional(z.string()),
    lastName: z.optional(z.string()),
    secondName: z.optional(z.string()),
    phoneNumber: z.optional(z.string()),
    note: z.optional(z.string()),
})