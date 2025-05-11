import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { cors } from "~/cors";
import { getSession } from "~/sessions.server";

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
  const authenticated = Boolean(session.get("userId"));
  return cors(request, json({ authenticated }));
}
