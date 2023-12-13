import { object, TypeOf } from "zod";

export const createUserSchema = object({
    body: object({})
});

export type UserInput = TypeOf<typeof createUserSchema>["body"];

 