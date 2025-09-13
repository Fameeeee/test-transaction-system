export function useToast() {
  return {
    add({ title }: { title: string; color?: string }) {
      if (import.meta.client) {
        window.alert(title);
      }
    },
  };
}
