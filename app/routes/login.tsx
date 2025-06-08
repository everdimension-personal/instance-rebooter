import { type ActionFunctionArgs, data, redirect } from "react-router";
import { Link } from "react-router";
import { Form, useActionData, useNavigation } from "react-router";
import { loginApi } from "~/api/login";

export async function action(params: ActionFunctionArgs) {
  const response = await loginApi.action(params);
  console.log("status", response.status);
  if (response.status === 200) {
    const next = new URL(params.request.url).searchParams.get("next") || "/";
    return redirect(next, { headers: response.headers });
  } else {
    return data({ error: response.statusText }, response);
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isLoading =
    navigation.state === "submitting" || navigation.state === "loading";
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
          autoComplete="current-password"
          placeholder="password"
        />
        {actionData?.error ? (
          <div style={{ textAlign: "center" }}>
            <small>
              <em className="[color:crimson]">{actionData.error}</em>
            </small>
          </div>
        ) : null}
        <button style={{ color: "var(--link-1)" }} disabled={isLoading}>
          {isLoading ? "Loading..." : "Login"}
        </button>
      </Form>
    </div>
  );
}
