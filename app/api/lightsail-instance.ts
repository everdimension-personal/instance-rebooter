import {
  GetInstanceCommand,
  LightsailClient,
  RebootInstanceCommand,
} from "@aws-sdk/client-lightsail";
import type { ActionFunction, LoaderFunction } from "react-router";
import memoizeOne from "memoize-one";
import { cors } from "~/cors";
import { requireUserSession } from "~/sessions.server";

const getClient = memoizeOne(
  () => new LightsailClient({ region: "eu-west-3" })
);
export const getInstanceStats: LoaderFunction = async ({ request }) => {
  await requireUserSession(request);
  const lightsail = getClient();
  const instanceOutput = await lightsail.send(
    new GetInstanceCommand({ instanceName: "Ubuntu-1" })
  );

  const response = new Response(
    JSON.stringify({
      name: instanceOutput.instance?.name ?? null,
      publicIpAddress: instanceOutput.instance?.publicIpAddress ?? null,
      state: instanceOutput.instance?.state?.name ?? null,
      regionName: instanceOutput.instance?.location?.regionName ?? null,
      createdAt: new Date(instanceOutput.instance?.createdAt || 0),
    }),
    { headers: { "Content-Type": "application/json" } }
  );
  return cors(request, response);
};

export const rebootInstance: ActionFunction = async ({ request }) => {
  await requireUserSession(request);
  const lightsail = getClient();
  const res = await lightsail.send(
    new RebootInstanceCommand({ instanceName: "Ubuntu-1" })
  );
  const response = new Response(JSON.stringify(res));
  return cors(request, response);
};

export const lightsailInstanceApi = { getInstanceStats, rebootInstance };
