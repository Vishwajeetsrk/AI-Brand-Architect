import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProjectsService } from '../projects.service';
import { GetProjectsQuery } from './get-projects.query';

@QueryHandler(GetProjectsQuery)
export class GetProjectsHandler implements IQueryHandler<GetProjectsQuery> {
  constructor(private readonly projectsService: ProjectsService) {}

  async execute(query: GetProjectsQuery) {
    return this.projectsService.getProjects(query.userId, query.organizationId);
  }
}
