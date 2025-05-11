import { type ActionFunctionArgs } from "@remix-run/node";
import { getSession, commitSession } from "~/sessions.server";
import bcrypt from "bcrypt";
import invariant from "tiny-invariant";
import { cors } from "~/cors";

invariant(process.env.PASSWORD_HASH_BASE64);
const PASSWORD_HASH = atob(process.env.PASSWORD_HASH_BASE64);

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const password = form.get("password");
  if (typeof password !== "string") {
    const response = new Response(null, {
      status: 400,
      statusText: "Bad Request",
    });
    return cors(request, response);
  }
  console.log({ password, PASSWORD_HASH });
  const valid = await bcrypt.compare(password, PASSWORD_HASH);
  console.log({ valid });
  if (!valid) {
    const response = new Response(null, {
      status: 401,
      statusText: "Unauthorized",
    });
    return cors(request, response);
  }
  const session = await getSession();
  session.set("userId", "DEFAULT_USER");
  return cors(
    request,
    new Response(null, {
      status: 200,
      headers: { "Set-Cookie": await commitSession(session) },
    })
  );
  return null;
}
