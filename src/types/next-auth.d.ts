import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    access_token?: string;
    full_name?: string;
    uid?: string;
    email: string;
  }
  interface Session {
    user: {
      accessToken?: string;
      uid?: string;
      fullName?: string;
      email?: string;
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    uid?: string;
    fullName?: string;
    email?: string;
  }
}