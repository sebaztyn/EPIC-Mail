import express from 'express';
import authenticationRouter from './routes/authenticationRouter';

const app = express();

app.use(express.json());
app.use('/api/v1/auth/', authenticationRouter);

const port = process.env.PORT || 6000;

const appServer = app.listen(port, console.log(`App running on port ${port}`));

export default appServer;
