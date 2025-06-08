import { type LoaderFunctionArgs, type ActionFunctionArgs } from "react-router";
import { cors } from "~/cors";
import { destroySession, getSession } from "~/sessions.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const endpoint = `${url.origin}${url.pathname}`;
  return new Response(
    `Only POST to this route.

  Request URL: ${endpoint}
  Request method: POST
  `,
    { status: 405 }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const response = new Response(null, {
    headers: { "Set-Cookie": await destroySession(session) },
  });
  return cors(request, response);
}

export const logoutApi = { loader, action };
