// packages/db/index.ts
import { PrismaClient } from "@prisma/client";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";


const prisma = new PrismaClient();

import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                phone: { label: "Phone number", type: "text", placeholder: "1231231231" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any) {
                const hashedPassword = await bcrypt.hash(credentials.password, 10);
                const existingUser = await prisma.user.findFirst({
                    where: {
                        number: credentials.phone
                    }
                });
                if (existingUser) {
                    const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                    if (passwordValidation) {
                        return {
                            id: existingUser.id.toString(),
                            name: existingUser.name,
                            email: existingUser.number
                        }
                    }
                    return null;
                }
                try {
                    const user = await prisma.user.create({
                        data: {
                            number: credentials.phone,
                            password: hashedPassword
                        }
                    })
                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.number
                    }
                } catch (e) {
                    console.error(e);
                }
                return null;
            }
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks:{
        async session({ token, session }: {token: JWT, session: Session}) {
            if (session.user) {
            session.user.id = Number (token.sub);
            }

            return session
   
        }






}
}