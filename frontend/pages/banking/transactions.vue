<template>
    <div class="space-y-4">
        <div class="bg-white border rounded-lg p-4">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-gray-500">จำนวนเงินคงเหลือ</p>
                    <p class="text-2xl font-semibold">{{ new Intl.NumberFormat('th-TH').format(balance) }} บาท</p>
                </div>
                <span
                    class="uppercase text-xs bg-red-50 text-red-700 border border-red-200 rounded px-2 py-1">Wallet</span>
            </div>
        </div>

        <div class="bg-white border rounded-lg">
            <div class="border-b px-4 py-3">
                <div class="flex items-center justify-between">
                    <h2 class="font-semibold">ประวัติรายการฝากถอน</h2>
                </div>
            </div>

            <div class="overflow-x-auto p-4">
                <table class="min-w-full text-sm">
                    <thead>
                        <tr class="text-left border-b bg-gray-50">
                            <th class="py-2 pr-4">Datetime</th>
                            <th class="py-2 pr-4">Amount</th>
                            <th class="py-2 pr-4">Status</th>
                            <th class="py-2 pr-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="t in transactions" :key="t.id" class="border-b hover:bg-gray-50">
                            <td class="py-2 pr-4 whitespace-nowrap">{{ new Date(t.created_at).toLocaleString('th-TH') }}
                            </td>
                            <td class="py-2 pr-4">{{ new Intl.NumberFormat('th-TH').format(t.amount) }}</td>
                            <td class="py-2 pr-4">
                                <span :class="t.type === 'deposit'
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : 'bg-red-100 text-red-700 border border-red-200'"
                                    class="text-xs rounded px-2 py-1">
                                    {{ t.type === 'deposit' ? 'ฝาก' : 'ถอน' }}
                                </span>
                            </td>
                            <td class="py-2 pr-4">
                                <div class="flex gap-2">
                                    <button
                                        class="inline-flex items-center rounded bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium hover:bg-gray-200"
                                        @click="openEdit(t.id, t.amount)">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM3 21V16.75L16.2 3.575C16.4 3.39167 16.621 3.25 16.863 3.15C17.105 3.05 17.359 3 17.625 3C17.891 3 18.1493 3.05 18.4 3.15C18.6507 3.25 18.8673 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.771 5.4 20.863 5.65C20.955 5.9 21.0007 6.15 21 6.4C21 6.66667 20.9543 6.921 20.863 7.163C20.7717 7.405 20.6257 7.62567 20.425 7.825L7.25 21H3ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z"
                                                fill="black" />
                                        </svg>
                                        Edit
                                    </button>
                                    <button
                                        class="inline-flex items-center rounded bg-red-100 text-red-700 px-2 py-1 text-xs font-medium hover:bg-red-200"
                                        @click="openDelete(t.id)">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M7 21C6.45 21 5.97933 20.8043 5.588 20.413C5.19667 20.0217 5.00067 19.5507 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8043 20.021 18.413 20.413C18.0217 20.805 17.5507 21.0007 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z"
                                                fill="black" />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="transactions.length === 0">
                            <td colspan="4" class="text-center text-gray-500 py-6">ไม่มีรายการ</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Edit Modal -->
        <div v-if="editOpen" class="fixed inset-0 z-40 flex items-center justify-center">
            <div class="absolute inset-0 bg-black/40" @click="editOpen = false"></div>
            <div class="relative bg-white w-full max-w-md rounded-lg border shadow-sm p-4">
                <h3 class="font-semibold mb-3">แก้ไขจำนวนเงินฝากถอน</h3>
                <div class="space-y-2">
                    <label class="block text-sm font-medium">จำนวนเงิน *</label>
                    <input v-model="editAmount" inputmode="numeric"
                        class="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600" />
                </div>
                <div class="mt-4 flex justify-end gap-2">
                    <button
                        class="inline-flex items-center rounded bg-gray-100 text-gray-800 px-3 py-1.5 text-sm hover:bg-gray-200"
                        @click="editOpen = false">ยกเลิก</button>
                    <button
                        class="inline-flex items-center rounded bg-red-600 text-white px-3 py-1.5 text-sm hover:bg-red-700"
                        @click="saveEdit">บันทึก</button>
                </div>
            </div>
        </div>

        <!-- Delete Confirm -->
        <div v-if="delOpen" class="fixed inset-0 z-40 flex items-center justify-center">
            <div class="absolute inset-0 bg-black/40" @click="delOpen = false"></div>
            <div class="relative bg-white w-full max-w-md rounded-lg border shadow-sm p-4">
                <h3 class="font-semibold mb-3">ยืนยันการลบ</h3>
                <div class="flex items-start gap-3">
                    <Icon name="heroicons:exclamation-triangle" class="text-yellow-500 mt-1" />
                    <p>ต้องการลบรายการนี้หรือไม่?</p>
                </div>
                <div class="mt-4 flex justify-end gap-2">
                    <button
                        class="inline-flex items-center rounded bg-gray-100 text-gray-800 px-3 py-1.5 text-sm hover:bg-gray-200"
                        @click="delOpen = false">ยกเลิก</button>
                    <button
                        class="inline-flex items-center rounded bg-red-600 text-white px-3 py-1.5 text-sm hover:bg-red-700"
                        @click="confirmDelete">ยืนยัน</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useBanking } from '~/composables/useBanking'
const { transactions, balance, fetchTransactions, updateTransaction, deleteTransaction } = useBanking()
const toast = useToast()

const editOpen = ref(false)
const editId = ref<number | null>(null)
const editAmount = ref('')

onMounted(() => { fetchTransactions().catch(() => { }) })

function openEdit(id: number, amount: number) {
    editId.value = id
    editAmount.value = String(amount)
    editOpen.value = true
}

async function saveEdit() {
    const amt = Number(editAmount.value)
    if (!Number.isFinite(amt) || amt < 0 || amt > 100000) {
        toast.add({ title: 'ต้องอยู่ระหว่าง 0-100,000', color: 'warning' })
        return
    }
    if (editId.value == null) return
    try {
        await updateTransaction(editId.value, amt)
        editOpen.value = false
        toast.add({ title: 'อัพเดตสำเร็จ', color: 'success' })
    } catch (e: any) {
        toast.add({ title: e?.message || 'แก้ไขไม่สำเร็จ', color: 'error' })
    }
}

const delOpen = ref(false)
const delId = ref<number | null>(null)

function openDelete(id: number) {
    delId.value = id
    delOpen.value = true
}

async function confirmDelete() {
    if (delId.value == null) return
    try {
        await deleteTransaction(delId.value)
        delOpen.value = false
        toast.add({ title: 'ลบสำเร็จ', color: 'success' })
    } catch (e: any) {
        toast.add({ title: e?.message || 'ลบไม่สำเร็จ', color: 'error' })
    }
}
</script>
