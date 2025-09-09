import { prisma } from '../client'
import type { CreateUserInput, User } from '@techsplore/schemas'
import bcrypt from 'bcryptjs'

export class UserRepo {
  static async create(input: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(input.password, 12)
    
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
    })
    
    return {
      ...user,
      name: user.name ?? undefined,
    }
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    })
  }

  static async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    
    return user ? {
      ...user,
      name: user.name ?? undefined,
    } : null
  }

  static async verifyPassword(user: { password: string }, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password)
  }
}