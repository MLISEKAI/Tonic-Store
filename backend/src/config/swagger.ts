import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tonic Store API',
      version: '1.0.0',
      description: 'API documentation for Tonic Store e-commerce platform',
      contact: {
        name: 'Tonic Store Team',
        email: 'support@tonicstore.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:8085',
        description: 'Development server'
      },
      {
        url: 'https://api.tonicstore.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options); 