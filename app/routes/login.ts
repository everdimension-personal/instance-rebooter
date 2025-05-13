import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";
import { getSession, commitSession } from "~/sessions.server";
import bcrypt from "bcrypt";
import invariant from "tiny-invariant";
import { cors } from "~/cors";

invariant(process.env.PASSWORD_HASH_BASE64);
const PASSWORD_HASH = atob(process.env.PASSWORD_HASH_BASE64);

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const endpoint = `${url.origin}${url.pathname}`;
  return new Response(
    `Only POST to this route.

  Request URL: ${endpoint}
  Request method: POST

  FormData:

    password=your-password
  `,
    { status: 405 }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    const response = new Response("No FormData found", {
      status: 400,
      statusText: "Bad Request",
    });
    return cors(request, response);
  }
  const password = form.get("password");
  if (typeof password !== "string") {
    const response = new Response("No password provided", {
      status: 400,
      statusText: "Bad Request",
    });
    return cors(request, response);
  }
  const valid = await bcrypt.compare(password, PASSWORD_HASH);
  console.log({ password, valid });
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
}
