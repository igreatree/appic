import { Controller, Get, UseGuards, Request, Query, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUserById(@Query('id') id: string): Promise<Omit<User, "password"> | undefined> {
        const res = await this.usersService.user({ id: Number(id) });
        if (!res) throw new NotFoundException({ status: 404, message: 'User not found' });
        const { password, ...user } = res;
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Get('check')
    getUser(@Request() req) {
        return req.user;
    }
}
