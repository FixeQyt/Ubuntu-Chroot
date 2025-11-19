<!-- SPDX-License-Identifier: MIT -->
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

const { status, rootAccessConfirmed, chrootExists, users, selectedUser, runAtBoot } =
	useChrootState()
const { PATH_CHROOT_SH } = useChrootConfig()
const cmdExec = useCommandExecutor()

const isRunning = computed(() => status.value === 'running')
const isStopped = computed(() => status.value === 'stopped')
const canControl = computed(() => rootAccessConfirmed.value && chrootExists.value)
const isOperating = computed(() =>
	[
		'starting',
		'stopping',
		'restarting',
		'backing up',
		'restoring',
		'migrating',
		'uninstalling',
	].includes(status.value)
)

const handleStart = async () => {
	status.value = 'starting'
	try {
		await cmdExec.execute(`sh ${PATH_CHROOT_SH} start --no-shell`)
		status.value = 'running'
	} catch (error) {
		console.error('Failed to start chroot:', error)
		status.value = 'stopped'
	}
}

const handleStop = async () => {
	status.value = 'stopping'
	try {
		await cmdExec.execute(`sh ${PATH_CHROOT_SH} stop --no-shell`)
		status.value = 'stopped'
	} catch (error) {
		console.error('Failed to stop chroot:', error)
	}
}

const handleRestart = async () => {
	status.value = 'restarting'
	try {
		await cmdExec.execute(`sh ${PATH_CHROOT_SH} restart --no-shell`)
		status.value = 'running'
	} catch (error) {
		console.error('Failed to restart chroot:', error)
	}
}

const copyLoginCommand = () => {
	const loginCommand = `su -c "ubuntu-chroot start ${selectedUser.value} -s"`
	navigator.clipboard?.writeText(loginCommand)
}
</script>

<template>
	<Card>
		<CardContent class="space-y-4 pt-6">
			<div class="flex gap-3">
				<Button
					:disabled="!canControl || !isStopped || isOperating"
					@click="handleStart"
					class="flex-1"
					variant="default">
					Start
				</Button>
				<Button
					:disabled="!canControl || !isRunning || isOperating"
					@click="handleStop"
					class="flex-1"
					variant="destructive">
					Stop
				</Button>
				<Button
					:disabled="!canControl || !isRunning || isOperating"
					@click="handleRestart"
					class="flex-1"
					variant="secondary">
					Restart
				</Button>
			</div>

			<div class="space-y-3 border-t pt-3">
				<div class="flex items-center gap-3">
					<Label class="min-w-[60px]">User:</Label>
					<Select v-model="selectedUser" :disabled="!isRunning">
						<SelectTrigger class="flex-1">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem v-for="user in users" :key="user" :value="user">
									{{ user }}
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<Button
						:disabled="!isRunning"
						@click="copyLoginCommand"
						variant="outline"
						size="sm">
						Copy Login
					</Button>
				</div>

				<div class="flex items-center gap-3">
					<Label class="min-w-[60px]">Boot:</Label>
					<div class="flex items-center gap-2">
						<input
							v-model="runAtBoot"
							type="checkbox"
							class="border-input h-4 w-4 rounded"
							:disabled="!canControl" />
						<span class="text-sm">Run at boot</span>
					</div>
				</div>
			</div>
		</CardContent>
	</Card>
</template>
