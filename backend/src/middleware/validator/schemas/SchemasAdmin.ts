import * as z from "zod/v4";

export const SchemasAdminCreate = z.object({
    tgUsername: z.string('Tg name начинается с @').regex(/^@/),
    name: z.string(),
    lastName: z.string(),
});

export const SchemasAdminRegister = z.object({
    tgUsername: z.string('Tg name начинается с @').regex(/^@/),
    tgId: z.number('Tg Id - это число')
})