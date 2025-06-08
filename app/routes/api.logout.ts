import { type LoaderFunctionArgs, type ActionFunctionArgs } from "react-router";
import { logoutApi } from "~/api/logout";

export async function loader(params: LoaderFunctionArgs) {
  return logoutApi.loader(params);
}

export async function action(params: ActionFunctionArgs) {
  return logoutApi.action(params);
}
