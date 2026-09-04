import http from 'http';
import app from './app';
import { env, validateEnv } from './config/env';
import { disconnectDatabase, checkDatabaseConnection } from './config/database';
import { logger } from './utils/logger';

async function startServer(): Promise<void> {
  try {
    // Validate environment variables
    validateEnv();

    const server = http.createServer(app);

    // Start HTTP listener
    server.listen(env.port, () => {
      logger.info(`===================================================`);
      logger.info(` Vanika Cognitive Care Server Started Successfully`);
      logger.info(` Environment : ${env.nodeEnv}`);
      logger.info(` Server Port : ${env.port}`);
      logger.info(` Health Check: http://localhost:${env.port}/api/health`);
      logger.info(`===================================================`);
    });

    // Verify initial database connection asynchronously
    checkDatabaseConnection().then((dbStatus) => {
      if (dbStatus.connected) {
        logger.info(` PostgreSQL Database Connected (${dbStatus.latencyMs}ms)`);
      } else {
        logger.warn(` PostgreSQL Database unreachable: ${dbStatus.error}`);
      }
    });

    // Graceful Shutdown Handler
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Initiating graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed.');
        try {
          await disconnectDatabase();
          logger.info('Database connection closed.');
          process.exit(0);
        } catch (err) {
          logger.error('Error during database disconnection:', err);
          process.exit(1);
        }
      });

      // Force exit if shutdown takes longer than 10 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection', { promise, reason });
    });

  } catch (error) {
    logger.error('Fatal error starting server:', error);
    process.exit(1);
  }
}

startServer();
