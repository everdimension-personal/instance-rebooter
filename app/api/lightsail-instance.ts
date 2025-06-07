import {
  GetInstanceCommand,
  LightsailClient,
  RebootInstanceCommand,
} from "@aws-sdk/client-lightsail";
import { ActionFunction, json, LoaderFunctionArgs } from "@remix-run/node";
import memoizeOne from "memoize-one";
import { cors } from "~/cors";
import { requireUserSession } from "~/sessions.server";

const getClient = memoizeOne(
  () => new LightsailClient({ region: "eu-west-3" })
);
export async function getInstanceStats({ request }: LoaderFunctionArgs) {
  await requireUserSession(request);
  const lightsail = getClient();
  const instanceOutput = await lightsail.send(
    new GetInstanceCommand({ instanceName: "Ubuntu-1" })
  );

  const response = json({
    name: instanceOutput.instance?.name ?? null,
    publicIpAddress: instanceOutput.instance?.publicIpAddress ?? null,
    state: instanceOutput.instance?.state?.name ?? null,
    regionName: instanceOutput.instance?.location?.regionName ?? null,
    createdAt: new Date(instanceOutput.instance?.createdAt || 0),
  });
  return cors(request, response);
}

export const rebootInstance: ActionFunction = async ({ request }) => {
  await requireUserSession(request);
  const lightsail = getClient();
  const res = await lightsail.send(
    new RebootInstanceCommand({ instanceName: "Ubuntu-1" })
  );
  const response = json(res);
  return cors(request, response);
};

export const lightsailInstanceApi = { getInstanceStats, rebootInstance };
