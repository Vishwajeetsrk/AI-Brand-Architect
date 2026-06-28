import { Module } from '@nestjs/common';
import { CqrsModule } from './modules/cqrs/cqrs.module';
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
import { SecurityModule } from './modules/security/security.module';
import { CollaborationModule } from './modules/collaboration/collaboration.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { AutomationModule } from './modules/automation/automation.module';
import { CrmModule } from './modules/crm/crm.module';
import { CreatorModule } from './modules/creator/creator.module';
import { LmsModule } from './modules/lms/lms.module';
import { KnowledgeGraphModule } from './modules/knowledge-graph/knowledge-graph.module';
import { MemoryEngineModule } from './modules/memory-engine/memory-engine.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { SearchModule } from './modules/search/search.module';
import { ReflectionModule } from './modules/reflection/reflection.module';
import { PlannerModule } from './modules/planner/planner.module';
import { AiMonitoringModule } from './modules/ai-monitoring/ai-monitoring.module';

@Module({
  imports: [
    CqrsModule,
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
    CollaborationModule,
    MarketplaceModule,
    AutomationModule,
    CrmModule,
    SecurityModule,
    CreatorModule,
    LmsModule,
    KnowledgeGraphModule,
    MemoryEngineModule,
    RealtimeModule,
    JobsModule,
    NotificationsModule,
    ConversationsModule,
    SearchModule,
    ReflectionModule,
    PlannerModule,
    AiMonitoringModule,
  ],
})
export class AppModule {}
