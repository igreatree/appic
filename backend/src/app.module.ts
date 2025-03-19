import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsService } from './projects/projects.service';
import { ProjectsModule } from './projects/projects.module';
import { PrismaService } from './prisma.service';

@Module({
    imports: [AuthModule, UsersModule, ProjectsModule],
    controllers: [AppController],
    providers: [AppService, ProjectsService, PrismaService],
})
export class AppModule { }
