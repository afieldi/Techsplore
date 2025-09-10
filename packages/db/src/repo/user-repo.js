import { prisma } from '../client';
import bcrypt from 'bcryptjs';
export class UserRepo {
    static async create(input) {
        const hashedPassword = await bcrypt.hash(input.password, 12);
        const user = await prisma.user.create({
            data: {
                email: input.email,
                password: hashedPassword,
                name: input.name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return user;
    }
    static async findByEmail(email) {
        return prisma.user.findUnique({
            where: { email },
        });
    }
    static async findById(id) {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return user;
    }
    static async verifyPassword(user, password) {
        return bcrypt.compare(password, user.password);
    }
}
//# sourceMappingURL=user-repo.js.map