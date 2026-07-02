import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProjectsService } from '../projects.service';
import { GetProjectQuery } from './get-project.query';

@QueryHandler(GetProjectQuery)
export class GetProjectHandler implements IQueryHandler<GetProjectQuery> {
  constructor(private readonly projectsService: ProjectsService) {}

  async execute(query: GetProjectQuery) {
    return this.projectsService.getProject(query.userId, query.id);
  }
}
