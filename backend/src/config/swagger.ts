import swaggerAutogen from 'swagger-autogen';

const outputFile = '../docs/swagger_output.json';
const endpointsFiles = ['../routes/index.ts'];
swaggerAutogen(outputFile, endpointsFiles);