import type { CreateUserInput, User } from '@techsplore/schemas';
export declare class UserRepo {
    static create(input: CreateUserInput): Promise<User>;
    static findByEmail(email: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        password: string;
    } | null>;
    static findById(id: string): Promise<User | null>;
    static verifyPassword(user: {
        password: string;
    }, password: string): Promise<boolean>;
}
