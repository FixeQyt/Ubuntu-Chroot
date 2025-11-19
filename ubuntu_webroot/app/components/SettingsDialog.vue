<!-- SPDX-License-Identifier: MIT -->
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

defineProps<{
	open: boolean
}>()

const emit = defineEmits<{
	'update:open': [value: boolean]
}>()

const postExecScript = ref('')
const debugMode = ref(false)

const handleSaveScript = () => {
	console.log('Saving post-exec script:', postExecScript.value)
}

const handleClearScript = () => {
	postExecScript.value = ''
}

const handleUpdate = () => {
	console.log('Updating chroot...')
}

const handleBackup = () => {
	console.log('Starting backup...')
}

const handleRestore = () => {
	console.log('Starting restore...')
}

const handleUninstall = () => {
	console.log('Uninstalling chroot...')
}
</script>

<template>
	<Dialog :open="open" @update:open="(val: boolean) => emit('update:open', val)">
		<DialogContent class="max-h-[90vh] max-w-2xl overflow-y-auto">
			<DialogHeader>
				<DialogTitle>Options</DialogTitle>
				<DialogDescription>
					Configure chroot settings and manage your environment
				</DialogDescription>
			</DialogHeader>

			<div class="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Post-exec Script</CardTitle>
						<CardDescription>Commands to run after chroot starts</CardDescription>
					</CardHeader>
					<CardContent class="space-y-3">
						<Textarea
							v-model="postExecScript"
							placeholder="echo 'Chroot started successfully'&#10;# Add your commands here"
							rows="6"
							class="font-mono text-sm" />
						<div class="flex gap-2">
							<Button @click="handleSaveScript" size="sm">Save</Button>
							<Button @click="handleClearScript" variant="outline" size="sm"
								>Clear</Button
							>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Update Chroot</CardTitle>
						<CardDescription
							>Apply incremental updates to the chroot environment</CardDescription
						>
					</CardHeader>
					<CardContent>
						<Button @click="handleUpdate">Update Chroot</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Backup & Restore</CardTitle>
						<CardDescription
							>Create backups or restore from previous backups</CardDescription
						>
					</CardHeader>
					<CardContent class="flex gap-2">
						<Button @click="handleBackup">Backup Chroot</Button>
						<Button @click="handleRestore" variant="destructive">Restore Chroot</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Debug Mode</CardTitle>
						<CardDescription
							>Enable detailed logging for troubleshooting</CardDescription
						>
					</CardHeader>
					<CardContent>
						<div class="flex items-center gap-2">
							<input
								v-model="debugMode"
								type="checkbox"
								class="border-input h-4 w-4 rounded" />
							<Label>Enable debug logging</Label>
						</div>
					</CardContent>
				</Card>

				<Card class="border-destructive">
					<CardHeader>
						<CardTitle class="text-destructive">Danger Zone</CardTitle>
						<CardDescription>Permanently remove the chroot environment</CardDescription>
					</CardHeader>
					<CardContent>
						<Button @click="handleUninstall" variant="destructive"
							>Uninstall Chroot</Button
						>
					</CardContent>
				</Card>
			</div>
		</DialogContent>
	</Dialog>
</template>
