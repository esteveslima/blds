import http from 'http';
import loader from './loaders/loader';

const setupServer = async () : Promise<void> => {
  const app = await loader();

  const httpServer = http.createServer(app);
  httpServer.listen(process.env.PORT, () => console.log(`${process.env.NODE_ENV} HTTP server, running on port ${process.env.PORT}`));
};

setupServer();
