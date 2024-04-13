import MongoStore from 'connect-mongo';
import session from 'express-session';

export const sessionMiddleware = session({
    secret: process.env.SESSION_KEY,
    resave: false, 
    saveUninitialized: false, 
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_ADDRESS }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 
    }
  })