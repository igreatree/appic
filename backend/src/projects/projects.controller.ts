import { Controller, Get, UseGuards, Request, Post, Body, Query, NotFoundException, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import { Project } from '@prisma/client';

type ProjectFullType = Omit<Project, 'content'> & { content: unknown };

@Controller('projects')
export class ProjectsController {
    constructor(private projectsService: ProjectsService) { }

    deserializeProject(project: Project): ProjectFullType {
        return { ...project, content: JSON.parse(project.content) }
    }
    serializeProject(project: ProjectFullType, additional: Partial<Project> = {}): Project {
        return { ...project, content: JSON.stringify(project.content), ...additional }
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
    async createProject(@Body() data, @Request() req): Promise<ProjectFullType | null> {
        return this.deserializeProject(await this.projectsService.createProject(this.serializeProject(data, { authorId: req.user.id })));
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    async updateProject(@Body() data): Promise<ProjectFullType | undefined> {
        const project = await this.projectsService.project({ id: Number(data.id) });
        if (project) return this.deserializeProject(await this.projectsService.updateProject({ where: { id: Number(data.id) }, data: this.serializeProject(data) }));
        throw new NotFoundException({ status: 404, message: 'Project not found' });
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async deleteProject(@Query('id') id: string): Promise<ProjectFullType | undefined> {
        const project = await this.projectsService.project({ id: Number(id) });
        if (project) return this.deserializeProject(await this.projectsService.deleteProject({ id: Number(id) }));
        throw new NotFoundException({ status: 404, message: 'Project not found' });
    }
}
