import * as z from "zod/v4";

export const SchemasCreateEducationGroup = z.object({
    tgUsername: z.optional(z.string('Tg name начинается с @').regex(/^@/)),
    name: z.string('У группы должно быть название'),
    description: z.optional(z.string('Это строка')),
    urlName: z.optional(z.string('Это строка формата https://t.me/названиеГруппы или t.me/названиеГруппы')),
});

export const SchemasAddChildrens = z.object({
    uuidGroup: z.uuid(),
    childrens: z.array(z.uuid()),
})