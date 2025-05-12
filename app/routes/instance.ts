import { GetInstanceCommand, LightsailClient } from "@aws-sdk/client-lightsail";
import { ActionFunction, json, LoaderFunctionArgs } from "@remix-run/node";
import { cors } from "~/cors";
import { requireUserSession } from "~/sessions.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserSession(request);
  const lightsail = new LightsailClient({ region: "eu-west-3" });
  // const stateOutput = await lightsail.send(
  //   new GetInstanceStateCommand({ instanceName: "Ubuntu-1" })
  // );
  // console.log("some stateOutput!", stateOutput.state?.name, stateOutput);
  const instanceOutput = await lightsail.send(
    new GetInstanceCommand({ instanceName: "Ubuntu-1" })
  );
  const response = json({
    name: instanceOutput.instance?.name ?? null,
    publicIpAddress: instanceOutput.instance?.publicIpAddress ?? null,
    state: instanceOutput.instance?.state?.name ?? null,
    regionName: instanceOutput.instance?.location?.regionName ?? null,
  });
  return cors(request, response);
}

export const action: ActionFunction = async ({ request }) => {
  const response = new Response("TODO: restart intance", {
    status: 501,
    statusText: "Not Implemented",
  });
  return cors(request, response);
};
