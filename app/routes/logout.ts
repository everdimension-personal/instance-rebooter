import { type ActionFunctionArgs } from "@remix-run/node";
import { cors } from "~/cors";
import { destroySession, getSession } from "~/sessions.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const response = new Response(null, {
    headers: { "Set-Cookie": await destroySession(session) },
  });
  return cors(request, response);
}
