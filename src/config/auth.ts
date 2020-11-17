export default {
  jwt: {
    secret: process.env.APP_SECRET || '123456',
    expiresIn: '1d',
  },
};
