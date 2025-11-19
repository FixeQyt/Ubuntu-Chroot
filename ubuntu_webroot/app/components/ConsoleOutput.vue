<!-- SPDX-License-Identifier: MIT -->
<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area'

const { consoleLogs } = useChrootState()

const consoleRef = ref<HTMLElement | null>(null)

const scrollToBottom = () => {
	nextTick(() => {
		if (consoleRef.value) {
			consoleRef.value.scrollTop = consoleRef.value.scrollHeight
		}
	})
}

watch(
	() => consoleLogs.value.length,
	() => {
		scrollToBottom()
	}
)

const getLineClass = (type?: string) => {
	switch (type) {
		case 'err':
			return 'text-red-400'
		case 'warn':
			return 'text-yellow-400'
		case 'success':
			return 'text-green-400'
		case 'info':
			return 'text-blue-400'
		default:
			return 'text-foreground'
	}
}
</script>

<template>
	<ScrollArea class="bg-muted/30 h-[300px] w-full rounded-lg border p-4">
		<div ref="consoleRef" class="space-y-1 font-mono text-sm">
			<div v-for="(log, index) in consoleLogs" :key="index" :class="getLineClass(log.type)">
				{{ log.text }}
			</div>
			<div v-if="consoleLogs.length === 0" class="text-muted-foreground">
				Console output will appear here...
			</div>
		</div>
	</ScrollArea>
</template>
