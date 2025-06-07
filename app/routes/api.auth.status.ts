import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import * as authStatus from "~/api/authStatus";

export async function loader(params: LoaderFunctionArgs) {
  return authStatus.loader(params);
}

export async function action(params: ActionFunctionArgs) {
  return authStatus.action(params);
}
