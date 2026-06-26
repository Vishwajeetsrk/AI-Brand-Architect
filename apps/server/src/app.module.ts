import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BrandsModule } from './modules/brands/brands.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { AssetsModule } from './modules/assets/assets.module';
import { AiModule } from './modules/ai/ai.module';
import { AgentsModule } from './modules/agents/agents.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { ApiKeysModule } from './modules/api-keys/api-keys.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { CommerceModule } from './modules/commerce/commerce.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    BrandsModule,
    ProjectsModule,
    AssetsModule,
    AiModule,
    AgentsModule,
    OrganizationsModule,
    ApiKeysModule,
    AnalyticsModule,
    KnowledgeModule,
    CommerceModule,
  ],
})
export class AppModule {}
