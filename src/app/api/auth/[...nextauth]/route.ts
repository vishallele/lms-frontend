import NextAuth from "next-auth";
import { AuthOptions } from "@/constants";

const handler = NextAuth(AuthOptions);
export { handler as GET, handler as POST }