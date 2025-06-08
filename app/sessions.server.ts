import { createCookieSessionStorage } from "react-router"; // or cloudflare/deno
import invariant from "tiny-invariant";
import { cors } from "./cors";

type SessionData = {
  userId: string;
};

invariant(process.env.SESSION_SECRET);

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__session",

      // all of these are optional
      // domain: "remix.run",
      // Expires can also be set (although maxAge overrides it when used in combination).
      // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
      //
      // expires: new Date(Date.now() + 60_000 * 5),
      httpOnly: true,
      // maxAge: 60,
      path: "/",

      // we want 'none' for the api to be available from other origins (deliberately experimenting)
      // but for local development it's easier to work with the default "lax"
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",

      secrets: [process.env.SESSION_SECRET],
      secure: process.env.NODE_ENV === "production",
    },
  });

export { getSession, commitSession, destroySession };

export async function requireUserSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) {
    const response = new Response(null, {
      status: 401,
      statusText: "Unauthorized",
    });
    throw cors(request, response);
  }
  return session;
}
