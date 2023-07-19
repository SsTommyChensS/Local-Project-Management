const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        failOnErrors: true,
        openapi: '3.0.0',
        info: {
            title: 'Local Project Management with Express and Mongoose(MongoDB)',
            version: '1.0.0',
            description: 'This is Local Project Management based on a project I have been working on',
            contact: {
                name: 'Tran Quoc Tung - Tommy',
                url: 'https://github.com/SsTommyChensS',
                email: 'tranquoctunglun@gmail.com'
            },
        },
        components: {
            securitySchemes: {
                Authorization: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    value: 'Bearer <JWT token here'
                }
            }
        },
        servers: [
            {
                url: 'http://localhost:8000',
            }
        ]
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app, port) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    console.log(
        `API Documentation avaiable on http://localhost:${port}/api-docs`
    );
}

module.exports = swaggerDocs;
