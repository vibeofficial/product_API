require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJsdoc = require("swagger-jsdoc");
const swagger_UI = require("swagger-ui-express");
const PORT = 1230;
const app = express();
const productRouter = require('./router/product');

app.use(express.json());
app.use(cors());


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "Product API Documentation",
      version: '1.0.0',
      description: "",
      license: {
        name: 'https://product-api-4vw8.onrender.com',
      },
      contact: {
        name: "Backend Repo",
        url: ""
      }
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{ BearerAuth: [] }]
  },
  apis: ["./routes/*.js"] // Ensure this points to the correct path
};

const openapiSpecification = swaggerJsdoc(options);
app.use("/documentation", swagger_UI.serve, swagger_UI.setup(openapiSpecification));


app.use(productRouter);

mongoose.connect(process.env.DB_URI).then(() => {
  console.log('Connected to Database');
  app.listen(PORT, () => {
    console.log('Server on Port:', PORT)
  })
}).catch((error) => {
  console.log('Error connecting Database', error.message)
});