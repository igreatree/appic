import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<Omit<User, "password"> | undefined> {
        const user = await this.usersService.user({ email });
        if (user) {
            const isMatch = await argon2.verify(user.password, pass);
            if (isMatch) {
                const { password, ...result } = user;
                return result;
            }
        }
        throw new BadRequestException('User or password are incorrect!');
    }

    async register(user: Omit<User, "role" | "id">) {
        const findUser = await this.usersService.user({ email: user.email });
        if (!findUser) {
            const hash = await argon2.hash(user.password);
            const { password, ...newUser } = await this.usersService.createUser({
                email: user.email,
                password: hash
            });
            return newUser;
        } else {
            throw new BadRequestException('This email already exist!');
        }
    }

    async login(user: Omit<User, "password">) {
        const { id, email, role } = user;
        const payload = { email, sub: id, role };
        return {
            id,
            email,
            role,
            access_token: this.jwtService.sign(payload),
        };
    }
}