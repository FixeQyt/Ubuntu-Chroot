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
import { Input } from '@/components/ui/input'
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

const { HOTSPOT_CONFIG } = useChrootConfig()

const ssid = ref('Ubuntu-Chroot')
const password = ref('')
const band = ref(HOTSPOT_CONFIG.DEFAULT_BAND)
const channel = ref(HOTSPOT_CONFIG.DEFAULT_CHANNEL_2_4GHZ)
const iface = ref('wlan0')

const channels = computed(() => {
	return band.value === '5' ? HOTSPOT_CONFIG.CHANNELS_5GHZ : HOTSPOT_CONFIG.CHANNELS_2_4GHZ
})

watch(band, (newBand) => {
	channel.value =
		newBand === '5'
			? HOTSPOT_CONFIG.DEFAULT_CHANNEL_5GHZ
			: HOTSPOT_CONFIG.DEFAULT_CHANNEL_2_4GHZ
})

const handleStart = () => {
	console.log('Starting hotspot...')
}

const handleStop = () => {
	console.log('Stopping hotspot...')
}
</script>

<template>
	<Dialog :open="open" @update:open="(val: boolean) => emit('update:open', val)">
		<DialogContent class="max-w-md">
			<DialogHeader>
				<DialogTitle>Hotspot Configuration</DialogTitle>
				<DialogDescription>
					Configure and start a WiFi hotspot from your chroot environment
				</DialogDescription>
			</DialogHeader>

			<div class="space-y-4">
				<div class="space-y-2">
					<Label>SSID</Label>
					<Input v-model="ssid" placeholder="Network name" />
				</div>

				<div class="space-y-2">
					<Label>Password</Label>
					<Input v-model="password" type="password" placeholder="Min 8 characters" />
				</div>

				<div class="space-y-2">
					<Label>Band</Label>
					<Select v-model="band">
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="2">2.4 GHz</SelectItem>
								<SelectItem value="5">5 GHz</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				<div class="space-y-2">
					<Label>Channel</Label>
					<Select v-model="channel">
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem v-for="ch in channels" :key="ch" :value="String(ch)">
									{{ ch }}
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				<div class="space-y-2">
					<Label>Interface</Label>
					<Input v-model="iface" placeholder="wlan0" />
				</div>
			</div>

			<DialogFooter class="flex gap-2">
				<Button @click="handleStop" variant="destructive" class="flex-1">
					Stop Hotspot
				</Button>
				<Button @click="handleStart" class="flex-1"> Start Hotspot </Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>
