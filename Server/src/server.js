import express from 'express';
import userRouters from './routes/user.router';
import messageRouters from './routes/message.router';
import authenticationRouter from './routes/authenticationRouter';

const app = express();

app.use(express.json());

app.use('/api/v1/users', userRouters);
app.use('/api/v1/auth/', authenticationRouter);
app.use('/api/v1/messages', messageRouters);

const port = process.env.PORT || 6000;

const appServer = app.listen(port, console.log(`App running on port ${port}`));

export default appServer;
