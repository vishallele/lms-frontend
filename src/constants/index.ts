import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import axios from "axios";
import Facebook from "next-auth/providers/facebook";

//custom import
import { getCsrfToken } from "@/lib/helper";

export const AuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        "email": { label: "Email", type: "text" },
        "password": { label: "Password", type: "password" }
      },
      async authorize(credentials) {

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid Credentials");
        }

        //get csrf token cookie
        //const csrf_res = await axios.get(`${process.env.BACKEND_SERVER_URL}sanctum/csrf-cookie`);
        const csrfToken = await getCsrfToken();

        //post login request to server
        try {
          const user = await axios.post(
            `${process.env.BACKEND_SERVER_URL}api/login`,
            JSON.stringify(credentials),
            {
              headers: {
                'Content-Type': "application/json",
                'X-XSRF-TOKEN': csrfToken
              }
            }
          ).then((data) => data.data).catch((error) => error.response);

          if (!user?.uid) {
            throw new Error("Invalid Credentials");
          }

          return user;

        } catch (error: any) {
          throw new Error(error);
        }
      }
    }),
    Google({
      clientId: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`
    }),
    Facebook({
      clientId: `${process.env.FACEBOOK_CLIENT_ID}`,
      clientSecret: `${process.env.FACEBOOK_CLIENT_SECRET}`
    })
  ],
  pages: {
    signIn: '/signin'
  },
  session: {
    strategy: 'jwt'
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        token.accessToken = user.access_token;
        token.email = user.email;
        token.fullName = user.full_name;
        token.uid = user.uid
      }
      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.uid = token.uid;
      session.user.email = token.email;
      session.user.fullName = token.fullName;
      return session;
    },
    async signIn({ user, account, profile }) {

      if (account?.provider === 'google') {
        try {

          //get csrf token cookie
          const csrf_res = await axios.get(`${process.env.BACKEND_SERVER_URL}sanctum/csrf-cookie`);
          const csrf_token = getCsrfToken(csrf_res);

          const googleUser = await axios.post(`${process.env.BACKEND_SERVER_URL}api/social-login`,
            {
              "email": profile?.email,
              "auth_type": "google",
              "full_name": profile?.name,
              "access_token": account?.access_token,
              "refresh_token": account?.refresh_token,
              "id_token": account?.id_token
            },
            {
              headers: {
                'Content-Type': "application/json",
                'X-XSRF-TOKEN': csrf_token
              }
            }
          ).then((data) => data.data).catch((error) => error);

          if (!googleUser?.uid) {
            throw new Error('Google login failed');
          }

          user.access_token = googleUser.access_token;
          user.email = googleUser.email;
          user.full_name = googleUser.full_name;
          user.uid = googleUser.uid;
          user.id = googleUser.uid;

        } catch (error) {
          console.log('Error during sign in:', error);
          return false;
        }
      }

      if (account?.provider === 'facebook') {
        /*console.log("facebook account:", account);
        console.log("facebook profile:", profile);*/
        try {

          //get csrf token cookie
          const csrf_res = await axios.get(`${process.env.BACKEND_SERVER_URL}sanctum/csrf-cookie`);
          const csrf_token = getCsrfToken(csrf_res);

          const fbUser = await axios.post(`${process.env.BACKEND_SERVER_URL}api/social-login`,
            {
              "email": profile?.email,
              "auth_type": "facebook",
              "full_name": profile?.name,
              "access_token": account?.access_token,
            },
            {
              headers: {
                'Content-Type': "application/json",
                'X-XSRF-TOKEN': csrf_token
              }
            }
          ).then((data) => data.data).catch((error) => error);

          if (!fbUser?.uid) {
            throw new Error('Google login failed');
          }

          user.access_token = fbUser.access_token;
          user.email = fbUser.email;
          user.full_name = fbUser.full_name;
          user.uid = fbUser.uid;
          user.id = fbUser.uid;

        } catch (error) {
          console.log('Error during sign in:', error);
          return false;
        }

      }

      return true;

    }
  }
}