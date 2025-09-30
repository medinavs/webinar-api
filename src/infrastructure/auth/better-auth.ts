import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins"
import { prisma } from "../database/client";
import { env } from "../config/env";
import { FIVE_MINUTES_IN_SEC, ONE_WEEK_IN_SEC } from "@/shared/constants/time";

export const auth = betterAuth({
    trustedOrigins: ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000'],
    plugins: [admin()],
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
        usePlural: false,
    }),
    advanced: {
        cookiePrefix: "better-auth",
        crossSubDomainCookies: {
            enabled: true,
        },
        cookies: {
            sessionToken: {
                name: "better-auth.session_token",
                options: {
                    httpOnly: true,
                    sameSite: "lax",
                    secure: false,
                    path: "/",
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                },
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    session: {
        expiresIn: ONE_WEEK_IN_SEC,
        cookieCache: {
            enabled: true,
            maxAge: FIVE_MINUTES_IN_SEC,
        },
    },
    user: {
        deleteUser: {
            enabled: true,
        }
    },
    logger: {
        level: "debug",
        disabled: env.IS_DEVELOP_MODE ? false : true,
    }
})