import { useMutation } from "@tanstack/react-query";
import { HTMLAttributes, useLayoutEffect, useRef } from "react";
import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router";
import invariant from "tiny-invariant";
import { lightsailInstanceApi } from "~/api/lightsail-instance";
import type { Route } from "./+types/_index";

export async function loader(params: LoaderFunctionArgs) {
  try {
    return await lightsailInstanceApi.getInstances(params);
  } catch (e) {
    if (e instanceof Response && e.status === 401) {
      return redirect(`/login?next=${encodeURIComponent("/")}`);
    }
  }
}

function Toast({
  children,
  className,
}: React.PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    ref.current?.showPopover();
  }, []);
  return (
    <div
      ref={ref}
      popover="auto"
      className={`bg-white p-2 ${className ?? ""}`}
      style={{ border: "1px solid CanvasText", marginTop: 20 }}
    >
      {children}
    </div>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index({ loaderData }: Route.ComponentProps) {
  const rebootMutation = useMutation({
    mutationFn: async ({
      regionName,
      instanceName,
    }: {
      regionName: string;
      instanceName: string;
    }) => {
      const fd = new FormData();
      fd.append("regionName", regionName);
      fd.append("instanceName", instanceName);
      const res = await fetch("/api/instance/reboot", {
        method: "POST",
        body: fd,
      });
      if (res.status >= 400) {
        console.log(res);
        throw new Error(await res.text());
      }
      return res;
    },
  });
  if (!loaderData) {
    return <p>loading...</p>;
  }
  return (
    <main style={{ maxWidth: 800, marginInline: "auto", paddingInline: 16 }}>
      <div className="flex flex-col gap-8 [padding-top:40px]">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Lightsail Instances
        </h1>
        {rebootMutation.isError ? (
          <Toast className="text-red-600">{rebootMutation.error.message}</Toast>
        ) : null}
        {rebootMutation.isSuccess ? <Toast>Done</Toast> : null}
        {loaderData.map((instance) => (
          <div
            key={instance.publicIpAddress}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div>
              <b>{instance.name}</b>
              <div className="text-gray-400 text-sm">
                {instance.regionName} · {instance.publicIpAddress}
              </div>
            </div>
            <button
              style={{ color: "var(--link-1)" }}
              disabled={
                rebootMutation.isPending &&
                rebootMutation.variables?.instanceName === instance.name
              }
              onClick={() => {
                invariant(instance.name, "instance must have a name");
                invariant(
                  instance.regionName,
                  "instance must have a regionName",
                );
                rebootMutation.mutate({
                  regionName: instance.regionName,
                  instanceName: instance.name,
                });
              }}
            >
              <small>
                {rebootMutation.isPending &&
                rebootMutation.variables?.instanceName === instance.name
                  ? "Rebooting"
                  : "Reboot"}
              </small>
            </button>
          </div>
        ))}
        {rebootMutation.isError ? (
          <div style={{ textAlign: "center" }}>
            <small>
              is error
              <em className="[color:crimson]">
                {rebootMutation.error.message}
              </em>
            </small>
          </div>
        ) : null}
      </div>
    </main>
  );
}
