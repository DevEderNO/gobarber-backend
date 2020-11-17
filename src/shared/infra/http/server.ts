import 'reflect-metadata';
import 'express-async-errors';
import '@shared/infra/typeorm';
import '@shared/container';
import express, { Request, Response, NextFunction } from 'express';
import { errors } from 'celebrate';

import cors from 'cors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';
import 'dotenv/config';
import rateLimiter from './middlewares/rateLimiter';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(rateLimiter);
app.use(routes);

app.use(errors());
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: `Internal server error ${err.message}`,
  });
});

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333 ');
});
