<!-- SPDX-License-Identifier: MIT -->
<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import StatusIndicator from '@/components/StatusIndicator.vue'
import ChrootControls from '@/components/ChrootControls.vue'
import ConsoleOutput from '@/components/ConsoleOutput.vue'
import SettingsDialog from '@/components/SettingsDialog.vue'
import HotspotDialog from '@/components/HotspotDialog.vue'
import ForwardNatDialog from '@/components/ForwardNatDialog.vue'
import AnimatedGridPattern from '@/components/ui/AnimatedGridPattern.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Copy, Trash2 } from 'lucide-vue-next'

const { consoleLogs, clearConsole, debugMode, appendConsole } = useChrootState()
const settingsOpen = ref(false)
const hotspotOpen = ref(false)
const forwardNatOpen = ref(false)

const handleCopyConsole = () => {
	const text = consoleLogs.value.map((log: any) => log.text).join('\n')
	navigator.clipboard?.writeText(text)
	appendConsole('Console logs copied to clipboard', 'info')
}

const handleClearConsole = () => {
	clearConsole()
	appendConsole('Console cleared', 'info')
}

const handleRefresh = () => {
	appendConsole('Refreshing status...', 'info')
}

onMounted(() => {
	appendConsole('Ubuntu Chroot Manager initialized', 'success')
	appendConsole('Checking root access...', 'info')
})
</script>

<template>
	<div
		class="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
		<div class="fixed inset-0 h-full w-full overflow-hidden">
			<AnimatedGridPattern
				:num-squares="50"
				:max-opacity="0.15"
				:duration="3"
				class="absolute inset-[-20%] h-[140%] w-[140%] rotate-45 text-indigo-500/40 dark:text-indigo-400/20" />
		</div>

		<AppHeader
			v-model:settings-open="settingsOpen"
			v-model:hotspot-open="hotspotOpen"
			v-model:forward-nat-open="forwardNatOpen" />

		<main class="relative container max-w-6xl space-y-6 px-4 pb-6" style="padding-top: 128px">
			<Card
				class="border-slate-200/50 bg-white/80 shadow-xl backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-900/80">
				<CardHeader>
					<div class="flex items-center justify-between">
						<div class="space-y-1">
							<div class="flex items-center gap-3">
								<CardTitle
									class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent dark:from-indigo-400 dark:to-purple-400">
									Ubuntu Chroot
								</CardTitle>
								<Badge v-if="debugMode" variant="destructive" class="text-xs"
									>DEBUG</Badge
								>
							</div>
							<StatusIndicator />
						</div>
						<Button
							@click="handleRefresh"
							variant="ghost"
							size="icon"
							class="hover:bg-indigo-100 dark:hover:bg-indigo-900/30">
							<RefreshCw class="h-4 w-4" />
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<ChrootControls />
				</CardContent>
			</Card>

			<Card
				class="border-slate-200/50 bg-white/80 shadow-xl backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-900/80">
				<CardHeader>
					<div class="flex items-center justify-between">
						<CardTitle class="text-lg font-semibold">Console</CardTitle>
						<div class="flex gap-2">
							<Button
								@click="handleCopyConsole"
								variant="ghost"
								size="icon"
								class="hover:bg-indigo-100 dark:hover:bg-indigo-900/30">
								<Copy class="h-4 w-4" />
							</Button>
							<Button
								@click="handleClearConsole"
								variant="ghost"
								size="icon"
								class="hover:bg-red-100 dark:hover:bg-red-900/30">
								<Trash2 class="h-4 w-4" />
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<ConsoleOutput />
				</CardContent>
			</Card>
		</main>

		<SettingsDialog v-model:open="settingsOpen" />
		<HotspotDialog v-model:open="hotspotOpen" />
		<ForwardNatDialog v-model:open="forwardNatOpen" />
	</div>
</template>
