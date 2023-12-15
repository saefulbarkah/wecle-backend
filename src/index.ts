import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { DATABASE_URL, NODE_ENV } from './config/config.js';
import * as route from './routes/index.js';
import User from './models/user.js';
import protectedRequest from './middleware/protect-api.js';
import Article from './models/article.js';
import comments from './models/comments.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandling from './lib/error-handling.js';
import { Author } from './models/author.js';
import { createServer } from 'http';
import { createSocketIo } from './sockets/socket.js';

const app = express();
const port = 4000;
const httpServer = createServer(app);
// initialize socket io
createSocketIo(httpServer);

app.use(cors({ credentials: true, origin: process.env.ORIGIN_CORS }));
app.use(cookieParser());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
  res.cookie('testing', 'edanken');
  res.json('express + typescript');
});

// clear collection
app.get('/clear', async (req, res) => {
  let schemaData;
  const schema = req.query.schema as string;
  switch (schema) {
    case 'user':
      await User.deleteMany();
      schemaData = 'user';
      break;
    case 'author':
      await Author.deleteMany();
      schemaData = 'author';
      break;
    case 'article':
      await Article.deleteMany();
      schemaData = 'article';
      break;
    case 'comment':
      await comments.deleteMany();
      schemaData = 'comment';
      break;
    default:
      break;
  }
  res.send(`cleared ${schemaData}`);
});

// route lists
app.use('/auth', route.auth);
app.use('/authors', protectedRequest, route.author);
app.use('/article', route.article);
app.use('/comments', route.comment);
app.use('/notifications', route.notification);

// error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (NODE_ENV === 'development') {
    console.error(err);
  }
  errorHandling(err, res);
});

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    if (NODE_ENV === 'development') {
      return httpServer.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
      });
    }
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
