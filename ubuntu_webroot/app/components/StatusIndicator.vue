<!-- SPDX-License-Identifier: MIT -->
<script setup lang="ts">
const { status } = useChrootState()

const statusConfig = computed(() => {
	switch (status.value) {
		case 'running':
			return { color: 'bg-green-500', text: 'Running', pulse: true }
		case 'stopped':
			return { color: 'bg-red-500', text: 'Stopped', pulse: false }
		case 'starting':
			return { color: 'bg-green-500', text: 'Starting', pulse: true }
		case 'stopping':
			return { color: 'bg-red-500', text: 'Stopping', pulse: true }
		case 'restarting':
			return { color: 'bg-yellow-500', text: 'Restarting', pulse: true }
		case 'backing up':
			return { color: 'bg-yellow-500', text: 'Backing Up', pulse: true }
		case 'restoring':
			return { color: 'bg-yellow-500', text: 'Restoring', pulse: true }
		case 'migrating':
			return { color: 'bg-yellow-500', text: 'Migrating', pulse: true }
		case 'uninstalling':
			return { color: 'bg-red-500', text: 'Uninstalling', pulse: true }
		case 'updating':
			return { color: 'bg-blue-500', text: 'Updating', pulse: true }
		case 'trimming':
			return { color: 'bg-blue-500', text: 'Trimming', pulse: true }
		case 'resizing':
			return { color: 'bg-blue-500', text: 'Resizing', pulse: true }
		case 'not_found':
			return { color: 'bg-gray-500', text: 'Not Found', pulse: false }
		default:
			return { color: 'bg-gray-400', text: 'Unknown', pulse: false }
	}
})
</script>

<template>
	<div class="flex items-center gap-3">
		<div class="relative">
			<div :class="['h-3 w-3 rounded-full transition-colors', statusConfig.color]" />
			<div
				v-if="statusConfig.pulse"
				:class="[
					'absolute inset-0 h-3 w-3 animate-ping rounded-full opacity-75',
					statusConfig.color,
				]" />
		</div>
		<span class="font-medium">{{ statusConfig.text }}</span>
	</div>
</template>
