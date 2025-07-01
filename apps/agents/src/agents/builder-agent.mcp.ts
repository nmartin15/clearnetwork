import { BaseAgentMCP } from '@clearnet/mcp';
import { ExampleBuilderAgent } from './example-builder.agent';

export class BuilderAgentMCP extends BaseAgentMCP {
  private agent: ExampleBuilderAgent;

  constructor(options: { agent: ExampleBuilderAgent; logger: any }) {
    super({ logger: options.logger });
    this.agent = options.agent;
    this.initializeActions();
  }

  protected initializeActions() {
    this.registerAction('createProfile', this.handleCreateProfile.bind(this));
    this.registerAction('updateProfile', this.handleUpdateProfile.bind(this));
    this.registerAction('getProfile', this.handleGetProfile.bind(this));
  }

  private async handleCreateProfile(ctx: any) {
    const { user_id, data } = ctx.request.body;
    const result = await this.agent.createProfile({ userId: user_id, ...data });
    ctx.body = { success: true, data: result };
  }

  private async handleUpdateProfile(ctx: any) {
    const { user_id, data } = ctx.request.body;
    const result = await this.agent.updateProfile({ userId: user_id, updates: data });
    ctx.body = { success: true, data: result };
  }

  private async handleGetProfile(ctx: any) {
    const { user_id } = ctx.request.body;
    const result = await this.agent.getProfile({ userId: user_id });
    ctx.body = { success: true, data: result };
  }
}
