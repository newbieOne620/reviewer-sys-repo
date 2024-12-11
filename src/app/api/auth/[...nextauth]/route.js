import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { pool } from "@/app/lib/db";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        const { username, password } = credentials;

        // Query to get the user with the provided username
        const result = await pool.query(
          `SELECT * FROM usr_tbl WHERE usr_email = $1 AND usr_status = '1'`,
          [username]
        );

        if (result.rowCount === 0) {
          // User not found
          throw new Error("Invalid username or password");
        }

        const user = result.rows[0];

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.usr_password);

        if (!isMatch) {
          // Incorrect password
          throw new Error("Invalid username or password");
        }

        // If successful, return user object
        return {
          id: user.usr_id,
          email: user.usr_email,
          name: `${user.usr_fname} ${user.usr_mname} ${user.usr_lname}`,
          userlevel: user.usr_lvl,
          useruuid: user.usr_uuid,
          userimg: user.usr_img,
          fname: user.usr_fname,
          mname: user.usr_mname,
          lname: user.usr_lname,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.userlevel = user.userlevel;
        token.useruuid = user.useruuid;
        token.userimg = user.userimg;
        token.fname = user.fname;
        token.mname = user.mname;
        token.lname = user.lname;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.userlevel = token.userlevel;
      session.user.useruuid = token.useruuid;
      session.user.userimg = token.userimg;
      session.user.fname = token.fname;
      session.user.mname = token.mname;
      session.user.lname = token.lname;

      return session;
    },
  },
  cookies: {
    secure: true,
    maxAge: 24 * 60 * 60,
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    name: "_nextauth.session-token",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
