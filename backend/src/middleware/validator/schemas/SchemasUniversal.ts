import * as z from "zod/v4";

export const SchemasTgUsername = z.optional(z.string().regex(/^@/));

export const SchemasUuid = z.optional(z.uuid());

export const SchemasUuidAndTgName = z.object({
    tgUsername: z.optional(z.string().regex(/^@/)),
    uuid: z.optional(z.uuid())
});