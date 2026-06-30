import express from 'express';
import { config } from './config';
import { logger } from './logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import healthRoutes from './routes/health';
import { CustomerController } from './controllers/CustomerController';
import { CustomerService } from './services/CustomerService';
import { CustomerRepositoryImpl } from './repositories/impl/CustomerRepositoryImpl';
import { createCustomerRoutes } from './routes/customerRoutes';

const app = express();

// Middleware
app.use(express.json());
app.use(requestLogger);

// Dependency injection
const customerRepository = new CustomerRepositoryImpl();
const customerService = new CustomerService(customerRepository);
const customerController = new CustomerController(customerService);

// Routes
app.use('/health', healthRoutes);
app.use('/api', createCustomerRoutes(customerController));

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default app;
