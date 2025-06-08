import { type LoaderFunctionArgs, redirect, type MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { lightsailInstanceApi } from "~/api/lightsail-instance";

export async function loader(params: LoaderFunctionArgs) {
  try {
    return await lightsailInstanceApi.getInstanceStats(params);
  } catch (e) {
    if (e instanceof Response && e.status === 401) {
      return redirect(`/login?next=${encodeURIComponent("/")}`);
    }
  }
}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const rebootMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/instance/reboot", { method: "POST" });
      if (res.status >= 400) {
        console.log(res);
        throw new Error(await res.text());
      }
      return res;
    },
  });
  return (
    <div className="flex flex-col items-center gap-8 [padding-top:40px]">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Lightsail Rebooter
      </h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {rebootMutation.isError ? (
        <div style={{ textAlign: "center" }}>
          <small>
            is error
            <em className="[color:crimson]">{rebootMutation.error.message}</em>
          </small>
        </div>
      ) : null}
      <button
        style={{ color: "var(--link-1)" }}
        disabled={rebootMutation.isPending}
        onClick={() => {
          rebootMutation.mutate();
        }}
      >
        {rebootMutation.isPending ? "Rebooting..." : "Reboot"}
      </button>
    </div>
  );
}
