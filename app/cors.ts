export function cors(request: Request, response: Response) {
  const url = new URL(request.url);
  response.headers.append("Access-Control-Allow-Origin", url.origin);
  return response;
}
