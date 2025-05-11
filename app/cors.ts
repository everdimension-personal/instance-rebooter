export function cors(_request: Request, response: Response) {
  response.headers.append("Access-Control-Allow-Origin", "*");
  return response;
}
