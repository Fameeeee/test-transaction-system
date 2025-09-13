type LoginBody = { email: string; password: string };
type RegisterBody = { email: string; password: string };

export function useAuth() {
  const { request } = useApi();
  const user = useState<{ id: number; email: string } | null>(
    "auth:user",
    () => null
  );
  const token = useState<string | null>("auth:token", () => null);

  function loadFromStorage() {
    if (import.meta.client) {
      const t = localStorage.getItem("auth:token");
      const u = localStorage.getItem("auth:user");
      token.value = t;
      user.value = u ? JSON.parse(u) : null;
    }
  }

  async function login(body: LoginBody) {
    const res = await request<{
      token: string;
      user: { id: number; email: string };
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
    token.value = res.token;
    user.value = res.user;
    if (import.meta.client) {
      localStorage.setItem("auth:token", res.token);
      localStorage.setItem("auth:user", JSON.stringify(res.user));
    }
    return res;
  }

  async function register(body: RegisterBody) {
    return request<{ user: { id: number; email: string; created_at: string } }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );
  }

  function logout() {
    token.value = null;
    user.value = null;
    if (import.meta.client) {
      localStorage.removeItem("auth:token");
      localStorage.removeItem("auth:user");
    }
  }

  onBeforeMount(() => loadFromStorage());

  return { user, token, login, register, logout, loadFromStorage };
}
