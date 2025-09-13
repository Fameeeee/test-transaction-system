<script setup lang="ts">
const { user, logout } = useAuth()
const router = useRouter()

function onLogout() {
    logout()
    router.push('/login')
}

const sidebarOpen = ref(false)
watchEffect(() => {
    if (!import.meta.client) return
    document.body.classList.toggle('overflow-hidden', sidebarOpen.value)
})
</script>

<template>
    <div class="min-h-screen flex flex-col bg-white">
        <header class="border-b sticky top-0 bg-white/70 backdrop-blur z-10">
            <div class="container mx-auto px-4 h-14 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <button
                        class="md:hidden inline-flex items-center justify-center rounded p-2 text-gray-700 hover:bg-gray-100"
                        @click="sidebarOpen = true" aria-label="Open menu">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 4H13.5M2.5 8H13.5M2.5 12H13.5" stroke="black" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>

                    </button>
                    <NuxtLink to="/banking" class="font-semibold hover:opacity-80 app-header-title">Clicknext</NuxtLink>
                </div>
                <div class="flex items-center gap-3">
                    <span v-if="user" class="text-sm text-gray-600 hidden sm:inline">{{ user.email }}</span>
                    <button
                        class="inline-flex items-center rounded bg-red-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-red-700"
                        @click="onLogout">
                        Logout
                    </button>
                </div>
            </div>
        </header>

        <div class="flex flex-1">
            <!-- Sidebar -->
            <aside class="hidden md:block w-64 border-r p-4 space-y-2">
                <AppNav />
            </aside>

            <!-- Drawer for mobile -->
            <div v-if="sidebarOpen" class="fixed inset-0 z-40 md:hidden" aria-modal="true" role="dialog">
                <div class="absolute inset-0 bg-black/40" @click="sidebarOpen = false"></div>
                <div class="absolute inset-y-0 left-0 w-72 bg-white shadow-xl p-4 flex flex-col">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-semibold">เมนู</h2>
                        <button
                            class="inline-flex items-center justify-center rounded p-2 text-gray-700 hover:bg-gray-100"
                            @click="sidebarOpen = false" aria-label="Close menu">
                            <Icon name="heroicons:x-mark" class="w-5 h-5" />
                        </button>
                    </div>
                    <AppNav @navigate="sidebarOpen = false" />
                </div>
            </div>

            <main class="flex-1 p-4 container mx-auto">
                <NuxtPage />
            </main>
        </div>
    </div>
</template>
