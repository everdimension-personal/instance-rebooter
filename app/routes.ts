import { type RouteConfig, route, index } from "@react-router/dev/routes";
// import { flatRoutes } from "@react-router/fs-routes";
// import { remixRoutesOptionAdapter } from "@react-router/remix-routes-option-adapter";

export default [
  index("./routes/_index.tsx"),
  route("login", "./routes/login.tsx"),
  route("api/login", "./routes/api.login.ts"),
  route("api/logout", "./routes/api.logout.ts"),
  route("api/instance", "./routes/api.instance.ts"),
  route("api/instance/reboot", "./routes/api.instance.reboot.ts"),
  route("api/auth/status", "./routes/api.auth.status.ts"),
] satisfies RouteConfig;
