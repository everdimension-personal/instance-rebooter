import {
  GetInstancesCommand,
  Instance,
  LightsailClient,
  RebootInstanceCommand,
} from "@aws-sdk/client-lightsail";
import memoizeOne from "memoize-one";
import type { ActionFunction } from "react-router";
import { LoaderFunctionArgs } from "react-router";
import invariant from "tiny-invariant";
import { cors } from "~/cors";
import { requireUserSession } from "~/sessions.server";

const clients = {
  "eu-west-3": memoizeOne(() => new LightsailClient({ region: "eu-west-3" })),
  "us-east-1": memoizeOne(() => new LightsailClient({ region: "us-east-1" })),
};

export async function getInstances({ request }: LoaderFunctionArgs) {
  await requireUserSession(request);
  const instances: Instance[] = [];
  const euWest3 = clients["eu-west-3"]();
  const usEast1 = clients["us-east-1"]();
  const [res1, res2] = await Promise.all([
    euWest3.send(new GetInstancesCommand()),
    usEast1.send(new GetInstancesCommand()),
  ]);
  instances.push(...(res1.instances ?? []));
  instances.push(...(res2.instances ?? []));

  return instances.map((instance) => ({
    name: instance?.name ?? null,
    publicIpAddress: instance?.publicIpAddress ?? null,
    state: instance?.state?.name ?? null,
    regionName: instance?.location?.regionName ?? null,
    createdAt: new Date(instance?.createdAt || 0),
  }));
}

export const rebootInstance: ActionFunction = async ({ request }) => {
  await requireUserSession(request);
  const fd = await request.formData();
  const regionName = fd.get("regionName")?.toString();
  const instanceName = fd.get("instanceName")?.toString();
  if (!regionName || !instanceName) {
    throw new Error("Invalid params");
  }

  invariant(regionName in clients, "invalid regionName");
  console.log("rebooting", { regionName, instanceName });
  const client = clients[regionName as keyof typeof clients]();
  const res = await client.send(new RebootInstanceCommand({ instanceName }));
  const response = new Response(JSON.stringify(res));
  return cors(request, response);
};

export const lightsailInstanceApi = {
  rebootInstance,
  getInstances,
};
