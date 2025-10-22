import passport from "passport";
import { PrismaClient } from "@prisma/client";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

const prisma = new PrismaClient();
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/authGoogle/google/callback",
    },

    // verify callback
    async (accessToken, refreshToken, profile, done) => {
      console.log("PROFILE:", profile);
      try {
        const email = profile.emails && profile.emails[0] && profile.emails[0].value;
        const googleId = profile.id;
        const name = profile.displayName || null;

        // cari user berdasarkan googleId atau email
        let user = await prisma.user.findUnique({
          where: { googleId },
        });

        // cari berdasrkan email jika tidak ada googleId
        if (!user && email) {
          user = await prisma.user.findUnique({ where: { email } });
        }

        // buat user baru
        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId,
              name,
              email,
            },
          });
        } else if (!user.googleId) {
          await prisma.user.update({
            where: { id: user.id },
            data: { googleId },
          });
        }

        // done(null, user) -> passport akan oper user ke req.user di callback route

        return done(null, user);
      } catch (error) {
        console.error("Passport Google error:", error);
        return done(error, null);
      }
      // Ambil email (beberapa akun google tidak share email, pastikan scope email diminta)
    }
  )
);

export default passport;
