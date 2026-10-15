// Alternative approaches: sniff the User-Agent for "curl", or link the .txt URLs directly.
function prefersPlainText(accept: string): boolean {
  return !accept.split(",").some((range) => {
    const [mediaType, ...parameters] = range
      .split(";")
      .map((part) => part.trim());
    const quality = Number(
      parameters.find((p) => p.startsWith("q="))?.slice(2) ?? 1,
    );
    return mediaType === "text/html" && quality > 0;
  });
}

type Env = { ASSETS: { fetch(request: Request): Promise<Response> } };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const plainText =
      !url.pathname.endsWith(".txt") &&
      prefersPlainText(request.headers.get("Accept") ?? "");
    const path = `${url.pathname === "/" ? "/index" : url.pathname.replace(/\/$/, "")}.txt`;
    const asset = await env.ASSETS.fetch(
      plainText
        ? new Request(url.origin + path + url.search, request)
        : request,
    );
    return new Response(asset.body, {
      status: asset.status,
      headers: { ...Object.fromEntries(asset.headers), Vary: "Accept" },
    });
  },
};
