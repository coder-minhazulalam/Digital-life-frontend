import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const uri = process.env.AUTH_DB_URI || "";
const client = uri ? new MongoClient(uri) : null;
// Use your actual DB name
const db = client ? client.db("digital-life-lessons") : null;

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),

    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            mapProfileToUser: (profile) => ({
              name: profile.login,
            }),
          },
        }
      : {}),
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    },
  },

  // Expose extra user fields in the session
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        input: false, // not settable by user on sign-up
      },
      isPremium: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
      photoURL: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  plugins: [jwt()],

  ...(db && client
    ? {
        database: mongodbAdapter(db, {
          client,
        }),
      }
    : {}),
});