import type { LoaderFunctionArgs } from "@remix-run/node";
import { lightsailInstanceApi } from "~/api/lightsail-instance";

export async function loader(params: LoaderFunctionArgs) {
  return lightsailInstanceApi.getInstanceStats(params);
}
