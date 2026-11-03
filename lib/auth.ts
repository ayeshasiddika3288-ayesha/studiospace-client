import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db("studiospace");

export const auth = betterAuth({

  baseURL: process.env.BETTER_AUTH_URL,

  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false,
  },
  socialProviders: {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectURI:
      "https://studiospace-client-navy.vercel.app/api/auth/callback/google",
  },
},

 account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
});