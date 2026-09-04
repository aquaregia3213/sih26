import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { env } from './config/env';
import apiRouter from './routes';
import { requestLoggerMiddleware } from './middleware/requestLoggerMiddleware';
import { notFoundMiddleware } from './middleware/notFoundMiddleware';
import { errorMiddleware } from './middleware/errorMiddleware';

const app: Application = express();

// 1. Security Headers Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// 2. CORS Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, postman) or matching CLIENT_URL
      if (!origin || origin === env.clientUrl || origin.startsWith('http://localhost')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in development
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// 3. Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Request Logging Middleware
app.use(requestLoggerMiddleware);

// 5. API Routes Registration
app.use('/api', apiRouter);

// 6. Root Route
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Vanika Cognitive Care API',
    status: 'running',
    health: '/api/health',
  });
});

// 7. 404 Handler for unrecognized routes
app.use(notFoundMiddleware);

// 8. Centralized Error Handler
app.use(errorMiddleware);

export default app;
