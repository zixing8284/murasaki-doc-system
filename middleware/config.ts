// create multiple middleware
// see:
// https://stackoverflow.com/questions/76743643/multiple-middleware-in-nextjs-13-app-directory-not-working

// or see:
// connect-next package

// import {NextRequest, NextResponse} from "next/server";
// import {default as Authentication, matcher as AuthenticationMatcher} from "@/middleware/authentication";
// // import {default as Logging, matcher as LoggingMatcher} from "@/middleware/localization";

// interface middlewareType {
//     middleware: (req: NextRequest) => Promise<NextResponse>
//     matcher?: string | null | undefined
// }

// export const middleware: middlewareType[] = [
//     {
//         middleware: Authentication,
//         matcher: AuthenticationMatcher
//     },
//     // {
//     //     middleware: Logging,
//     //     matcher: AuthenticationMatcher
//     // },
// ]

/**
 * in the main middleware.ts (root)
 */
// import type {NextRequest} from 'next/server'
// import {middleware as activatedMiddleware} from '@/middleware/config'
// import {NextResponse} from "next/server";

// export async function middleware(req: NextRequest) {
//     // Load middleware functions
//     const middlewareFunctions = activatedMiddleware
//         .filter(m=> (!m.matcher || (!!m.matcher && new RegExp(m.matcher).test(req.nextUrl.toString()))))
//         .map(m => m.middleware(req));

//     // Option 1: Run middleware synchronously
//     // This allows you to handle each result before moving to the next
//     for (const fn of middlewareFunctions) {
//         const result = await fn;

//         if (!result.ok) {
//             return result;
//         }
//     }
//     // const nextUrl = req.nextUrl.pathname
//     return NextResponse.next();

//     // Option 2: Run middleware asynchronously
//     // Using Promise.allSettled allows concurrent execution
//    /*
//     const results = await Promise.allSettled(middlewareFunctions);

//     // Check each result
//     for (const result of results) {
//         // If rejected or not OK, return first response
//         if (result.status === "fulfilled" && !result.value?.ok) {
//             return result.value;
//         } else if (result.status === "rejected") {
//             throw result.reason
//         }
//     }

//     return NextResponse.next();
//     */
// }

// export const config = {
//     matcher: "/((?!api|static|.*\\..*|_next).*)",
// }
