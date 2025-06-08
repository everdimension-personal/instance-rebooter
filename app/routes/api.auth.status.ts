import { type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import * as authStatus from "~/api/authStatus";

export async function loader(params: LoaderFunctionArgs) {
  return authStatus.loader(params);
}

export async function action(params: ActionFunctionArgs) {
  return authStatus.action(params);
}
