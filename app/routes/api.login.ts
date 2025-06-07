import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";
import { loginApi } from "~/api/login";

export async function loader(params: LoaderFunctionArgs) {
  return loginApi.loader(params);
}

export async function action(params: ActionFunctionArgs) {
  return loginApi.action(params);
}
