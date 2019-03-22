import '@babel/polyfill';
import express from 'express';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import messageRouters from './routes/message.router';
import groupRouters from './routes/group.route';
import authenticationRouter from './routes/authenticationRouter';

const swaggerDocument = YAML.load(`${__dirname}/../../swagger.yaml`);
const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send("Welcome to my EPIC Mail Endpoints' Page");
});
app.use('/api/v1/auth', authenticationRouter);
app.use('/api/v1/messages', messageRouters);
app.use('/api/v1/groups', groupRouters);

const port = process.env.PORT || 3000;

const appServer = app.listen(port, console.log(`App running on port ${port}`));

export default appServer;
