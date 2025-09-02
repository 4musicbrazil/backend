import * as dotenv from 'dotenv';
dotenv.config({ path: './vars/.development.env' });
export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};
