export default defineNuxtRouteMiddleware((to) => {
  // Public routes
  const publicPaths = ["/login", "/register"];
  const isPublic = publicPaths.includes(to.path);
  const token = import.meta.client ? localStorage.getItem("auth:token") : null;

  if (!isPublic && !token) {
    return navigateTo("/login");
  }
  if (isPublic && token) {
    return navigateTo("/banking");
  }
});
