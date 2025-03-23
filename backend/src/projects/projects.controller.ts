import { Controller, Get, UseGuards, Request, Post, Body, Query, NotFoundException, Put, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import { Project } from '@prisma/client';
import { HttpService } from '@nestjs/axios';
import { FileInterceptor } from '@nestjs/platform-express';
import * as FormData from 'form-data';
import { lastValueFrom, map } from 'rxjs';

type ProjectFullType = Omit<Project, 'content'> & { content: unknown };
type ResProjectType = Pick<Partial<ProjectFullType>, 'lastUpdate'> & Omit<ProjectFullType, 'lastUpdate'>;

@Controller('projects')
export class ProjectsController {
    constructor(
        private projectsService: ProjectsService,
        private readonly httpService: HttpService,
    ) { }

    deserializeProject(project: Project): ProjectFullType {
        return { ...project, content: JSON.parse(project.content) }
    }
    serializeProject(project: ProjectFullType): Project {
        return { ...project, content: JSON.stringify(project.content) }
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getProjectById(@Query('id') id: string): Promise<ProjectFullType | undefined> {
        const project = await this.projectsService.project({ id: Number(id) });
        if (project) return this.deserializeProject(project);
        throw new NotFoundException({ status: 404, message: 'Project not found' });
    }

    @UseGuards(JwtAuthGuard)
    @Get('all')
    async getProjects(@Request() req) {
        return (await this.projectsService.projects({ where: { authorId: req.user.id } })).map((p) => this.deserializeProject(p));
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createProject(@Body() data: ResProjectType, @Request() req): Promise<ProjectFullType | null> {
        return this.deserializeProject(await this.projectsService.createProject(this.serializeProject({ ...data, authorId: req.user.id, lastUpdate: new Date() })));
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    async updateProject(@Body() data: ResProjectType): Promise<ProjectFullType | undefined> {
        const project = await this.projectsService.project({ id: Number(data.id) });
        if (project) return this.deserializeProject(await this.projectsService.updateProject({ where: { id: Number(data.id) }, data: this.serializeProject({ ...data, lastUpdate: new Date() }) }));
        throw new NotFoundException({ status: 404, message: 'Project not found' });
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async deleteProject(@Query('id') id: string): Promise<ProjectFullType | undefined> {
        const project = await this.projectsService.project({ id: Number(id) });
        if (project) return this.deserializeProject(await this.projectsService.deleteProject({ id: Number(id) }));
        throw new NotFoundException({ status: 404, message: 'Project not found' });
    }

    @UseGuards(JwtAuthGuard)
    @Post('uploadImage')
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(@UploadedFile() image: Express.Multer.File) {
        const formData = new FormData();
        formData.append('image', image.buffer, image.originalname);
        return await lastValueFrom(
            this.httpService.post(
                process.env.IMAGE_UPLOAD_URL as string,
                formData,
                {
                    params: {
                        key: process.env.IMAGE_UPLOAD_KEY
                    },
                    headers: formData.getHeaders(),
                }
            ).pipe(map((res) => res.data))
        );
    }
}
