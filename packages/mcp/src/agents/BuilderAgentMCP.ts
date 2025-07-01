import { MCPRequest, MCPResponse } from '../types';

export class BuilderAgentMCP {
  private agent: any;
  private name: string;

  constructor(config: { agent: any; name: string }) {
    this.agent = config.agent;
    this.name = config.name;
  }

  getHandlers(): Record<string, (req: MCPRequest) => Promise<MCPResponse>> {
    return {
      createProfile: this.createProfileHandler.bind(this),
      updateProfile: this.updateProfileHandler.bind(this),
      getProfile: this.getProfileHandler.bind(this),
    };
  }

  private async createProfileHandler(request: MCPRequest): Promise<MCPResponse> {
    try {
      const result = await this.agent.createProfile(request.data);
      return {
        id: request.id,
        success: true,
        data: result,
        explanation: 'Profile created successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        id: request.id,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async updateProfileHandler(request: MCPRequest): Promise<MCPResponse> {
    try {
      const result = await this.agent.updateProfile(request.data);
      return {
        id: request.id,
        success: true,
        data: result,
        explanation: 'Profile updated successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        id: request.id,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async getProfileHandler(request: MCPRequest): Promise<MCPResponse> {
    try {
      const result = await this.agent.getProfile(request.data);
      return {
        id: request.id,
        success: true,
        data: result,
        explanation: 'Profile retrieved successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        id: request.id,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
