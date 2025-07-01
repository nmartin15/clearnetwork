import { IBuilderAgent } from './builder.types';

export class ExampleBuilderAgent implements IBuilderAgent {
  async createProfile(input: any) {
    // Implementation here
    return { id: '123', ...input };
  }

  async updateProfile(input: any) {
    // Implementation here
    return { id: input.userId, ...input.updates };
  }

  async getProfile(input: any) {
    // Implementation here
    return { id: input.userId, name: 'Test User' };
  }
}
