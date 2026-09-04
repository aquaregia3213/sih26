import { checkDatabaseConnection } from '../config/database';
import { env } from '../config/env';

export interface HealthStatusResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  backend: {
    available: boolean;
    version: string;
  };
  database: {
    connected: boolean;
    latencyMs: number;
    provider: string;
    error?: string;
  };
}

export class HealthService {
  public static async getHealthStatus(): Promise<HealthStatusResponse> {
    const dbStatus = await checkDatabaseConnection();

    const isHealthy = dbStatus.connected;
    const status: 'ok' | 'degraded' | 'error' = isHealthy ? 'ok' : 'degraded';

    return {
      status,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: env.nodeEnv,
      backend: {
        available: true,
        version: '1.0.0',
      },
      database: {
        connected: dbStatus.connected,
        latencyMs: dbStatus.latencyMs,
        provider: 'postgresql',
        error: dbStatus.error,
      },
    };
  }
}
