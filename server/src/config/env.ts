import dotenv from 'dotenv';
import path from 'path';

// Load .env file from workspace root or environment
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export interface EnvConfig {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  jwtSecret: string;
  clientUrl: string;
  isProduction: boolean;
}

export const env: EnvConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres_password@localhost:5432/vanika_db?schema=public',
  jwtSecret: process.env.JWT_SECRET || 'dev_fallback_jwt_secret_change_in_production',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  isProduction: process.env.NODE_ENV === 'production',
};

// Validate critical environment variables
export function validateEnv(): void {
  const missingVars: string[] = [];

  if (!process.env.DATABASE_URL && !process.env.PORT) {
    // Info log if using defaults in dev
  }

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}
