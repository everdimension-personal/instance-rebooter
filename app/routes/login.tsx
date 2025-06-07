import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { loginApi } from "~/api/login";

export async function action(params: ActionFunctionArgs) {
  const response = await loginApi.action(params);
  console.log("status", response.status);
  if (response.status === 200) {
    const next = new URL(params.request.url).searchParams.get("next") || "/";
    return redirect(next, { headers: response.headers });
  } else {
    return json({ error: response.statusText }, response);
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  return (
    <div className="flex flex-col items-center gap-8 [padding-top:40px]">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Login
      </h1>
      <Form method="post" className="[display:grid] [gap:8px]">
        <input
          type="password"
          name="password"
          required={true}
          placeholder="password"
        />
        {actionData?.error ? (
          <div style={{ textAlign: "center" }}>
            <small>
              <em className="[color:crimson]">{actionData.error}</em>
            </small>
          </div>
        ) : null}
        <button style={{ color: "var(--link-1)" }}>Login</button>
      </Form>
    </div>
  );
}
