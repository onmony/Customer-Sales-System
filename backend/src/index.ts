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
import { ProductController } from './controllers/ProductController';
import { ProductService } from './services/ProductService';
import { ProductRepositoryImpl } from './repositories/impl/ProductRepositoryImpl';
import { createProductRoutes } from './routes/productRoutes';
import { PricingController } from './controllers/PricingController';
import { PricingService } from './services/PricingService';
import { PricingRepositoryImpl } from './repositories/impl/PricingRepositoryImpl';
import { createPricingRoutes } from './routes/pricingRoutes';
import { OrderController } from './controllers/OrderController';
import { OrderService } from './services/OrderService';
import { OrderRepositoryImpl } from './repositories/impl/OrderRepositoryImpl';
import { createOrderRoutes } from './routes/orderRoutes';
import { InvoiceController } from './controllers/InvoiceController';
import { InvoiceService } from './services/InvoiceService';
import { InvoiceRepositoryImpl } from './repositories/impl/InvoiceRepositoryImpl';
import { createInvoiceRoutes } from './routes/invoiceRoutes';

const app = express();

// Middleware
app.use(express.json());
app.use(requestLogger);

// Dependency injection
const customerRepository = new CustomerRepositoryImpl();
const customerService = new CustomerService(customerRepository);
const customerController = new CustomerController(customerService);

const productRepository = new ProductRepositoryImpl();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const pricingRepository = new PricingRepositoryImpl();
const pricingService = new PricingService(pricingRepository);
const pricingController = new PricingController(pricingService);

const orderRepository = new OrderRepositoryImpl();
const orderService = new OrderService(orderRepository, customerRepository, productRepository, pricingRepository);
const orderController = new OrderController(orderService);

const invoiceRepository = new InvoiceRepositoryImpl();
const invoiceService = new InvoiceService(invoiceRepository, orderRepository, customerRepository, productRepository, pricingRepository);
const invoiceController = new InvoiceController(invoiceService);

// Routes
app.use('/health', healthRoutes);
app.use('/api', createCustomerRoutes(customerController));
app.use('/api', createProductRoutes(productController));
app.use('/api', createPricingRoutes(pricingController));
app.use('/api', createOrderRoutes(orderController));
app.use('/api', createInvoiceRoutes(invoiceController));

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
