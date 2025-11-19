<!-- SPDX-License-Identifier: MIT -->
<script setup lang="ts">
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

defineProps<{
	open: boolean
}>()

const emit = defineEmits<{
	'update:open': [value: boolean]
}>()

const iface = ref('wlan0')
const interfaces = ref(['wlan0', 'eth0'])

const handleStart = () => {
	console.log('Starting forwarding...')
}

const handleStop = () => {
	console.log('Stopping forwarding...')
}
</script>

<template>
	<Dialog :open="open" @update:open="(val: boolean) => emit('update:open', val)">
		<DialogContent class="max-w-md">
			<DialogHeader>
				<DialogTitle>Forward NAT Configuration</DialogTitle>
				<DialogDescription>
					Forward chroot traffic to any network interface
				</DialogDescription>
			</DialogHeader>

			<div class="space-y-4">
				<div class="space-y-2">
					<Label>Network Interface</Label>
					<Select v-model="iface">
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem v-for="int in interfaces" :key="int" :value="int">
									{{ int }}
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</div>

			<DialogFooter class="flex gap-2">
				<Button @click="handleStop" variant="destructive" class="flex-1">
					Stop Forwarding
				</Button>
				<Button @click="handleStart" class="flex-1"> Start Forwarding </Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>
