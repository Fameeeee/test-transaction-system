<template>
    <div class="min-h-screen flex items-center justify-center p-4">
        <div class="w-full max-w-md bg-white border rounded-lg shadow-sm p-6">
            <h1 class="text-xl font-semibold mb-4">Login</h1>
            <form @submit.prevent="onSubmit" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Email</label>
                    <input v-model="form.email" type="email" placeholder="you@example.com" autocomplete="email"
                        class="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600" />
                    <p v-if="errors.email" class="text-sm text-red-600 mt-1">{{ errors.email }}</p>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Password</label>
                    <input v-model="form.password" type="password" placeholder="••••••••"
                        autocomplete="current-password"
                        class="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600" />
                    <p v-if="errors.password" class="text-sm text-red-600 mt-1">{{ errors.password }}</p>
                </div>

                <div class="mt-6 flex items-center justify-between">
                    <button type="submit" :disabled="loading"
                        class="inline-flex items-center rounded bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-50">
                        <span v-if="loading"
                            class="mr-2 inline-block h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full"></span>
                        Login
                    </button>
                    <NuxtLink to="/register" class="text-sm text-red-600 hover:underline">Create account</NuxtLink>
                </div>
            </form>
        </div>
    </div>

</template>

<script setup lang="ts">
definePageMeta({ layout: false })
const toast = useToast()

const form = reactive({
    email: '',
    password: ''
})

const errors = reactive<{ email?: string; password?: string }>({})
const loading = ref(false)

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function onSubmit() {
    errors.email = ''
    errors.password = ''

    let hasError = false
    if (!form.email) {
        errors.email = 'Email is required'
        hasError = true
    } else if (!isValidEmail(form.email)) {
        errors.email = 'Invalid email format'
        hasError = true
    }
    if (!form.password) {
        errors.password = 'Password is required'
        hasError = true
    }
    if (hasError) return

    loading.value = true
    try {
        const { login } = useAuth()
        await login({ email: form.email, password: form.password })
        toast.add({ title: 'Login successful' })
        await navigateTo('/banking')
    } catch (err: any) {
        toast.add({ title: err?.message || 'Login failed', color: 'error' })
    } finally {
        loading.value = false
    }
}
</script>
