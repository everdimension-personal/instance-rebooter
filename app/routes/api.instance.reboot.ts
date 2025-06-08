import { ActionFunction } from "react-router";
import { lightsailInstanceApi } from "~/api/lightsail-instance";

export const action: ActionFunction = async (params) => {
  return lightsailInstanceApi.rebootInstance(params);
};
