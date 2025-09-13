<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const emit = defineEmits<{ (e: 'navigate'): void }>()

const items = [
    { label: 'Deposit / Withdraw', to: '/banking' },
    { label: 'Transaction', to: '/banking/transactions' }
]

function go(to: string) {
    router.push(to)
    emit('navigate')
}
</script>

<template>
    <nav class="space-y-2">
        <a v-for="it in items" :key="it.to" :href="it.to" @click.prevent="go(it.to)"
            class="block w-full rounded px-3 py-2 text-sm font-medium text-left" :class="route.path === it.to
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'">
            {{ it.label }}
        </a>
    </nav>
    <slot />
</template>
