export function useApi() {
  const config = useRuntimeConfig();
  const base = config.public.apiBase;

  async function request<T>(path: string, opts: RequestInit = {}) {
    const token = import.meta.client
      ? localStorage.getItem("auth:token")
      : null;
    const mergedHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (opts.headers instanceof Headers) {
      opts.headers.forEach((v, k) => (mergedHeaders[k] = v));
    } else if (Array.isArray(opts.headers)) {
      for (const [k, v] of opts.headers) mergedHeaders[k] = v as string;
    } else if (opts.headers && typeof opts.headers === "object") {
      Object.assign(mergedHeaders, opts.headers as Record<string, string>);
    }
    const headers = mergedHeaders;
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${base}${path}`, {
      ...opts,
      headers,
    });

    const isJson = res.headers
      .get("content-type")
      ?.includes("application/json");
    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const message = (data && (data.message || data.error)) || res.statusText;
      throw new Error(message);
    }
    return data as T;
  }

  return { request };
}
