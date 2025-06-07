const allowedHostnames = new Set(["0.0.0.0", "127.0.0.1", "localhost"]);
export function cors<T extends Response>(request: Request, response: T) {
  const originHeader = request.headers.get("origin");
  if (!originHeader) {
    return response;
  }
  const url = new URL(originHeader);
  if (allowedHostnames.has(url.hostname)) {
    response.headers.append("Access-Control-Allow-Origin", url.origin);
    response.headers.append("Access-Control-Allow-Credentials", "true");
  }
  return response;
}
