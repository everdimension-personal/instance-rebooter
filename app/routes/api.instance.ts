import type { LoaderFunctionArgs } from "react-router";
import { lightsailInstanceApi } from "~/api/lightsail-instance";

export async function loader(params: LoaderFunctionArgs) {
  return lightsailInstanceApi.getInstanceStats(params);
}
