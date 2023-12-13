import { Session } from "../../models";

export const userHandler = async (data: any) => {};

// Create session (login user)
export const createSession = async ({ userId }: { userId: string }) => {
    return Session.create({ userId });
};