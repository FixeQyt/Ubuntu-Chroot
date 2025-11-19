<!-- SPDX-License-Identifier: MIT -->
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Settings, Wifi, Network, Moon, Sun } from 'lucide-vue-next'

const colorMode = useColorMode()
const isDark = computed(() => colorMode.preference === 'dark')

const settingsOpen = defineModel<boolean>('settingsOpen', { default: false })
const hotspotOpen = defineModel<boolean>('hotspotOpen', { default: false })
const forwardNatOpen = defineModel<boolean>('forwardNatOpen', { default: false })

const toggleTheme = () => {
	colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
	<header
		class="fixed top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:border-slate-800/50 dark:bg-slate-950/80 dark:supports-[backdrop-filter]:bg-slate-950/60"
		style="padding-top: 40px">
		<div class="container flex h-16 items-center justify-between px-4">
			<div class="flex items-center gap-3">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
					<span class="text-xl font-bold text-white">U</span>
				</div>
				<h1
					class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent dark:from-indigo-400 dark:to-purple-400">
					Ubuntu Chroot Manager
				</h1>
			</div>

			<div class="flex items-center gap-2">
				<Button
					@click="forwardNatOpen = true"
					variant="ghost"
					size="icon"
					title="Forward NAT"
					class="hover:bg-indigo-100 dark:hover:bg-indigo-900/30">
					<Network class="h-5 w-5" />
				</Button>
				<Button
					@click="hotspotOpen = true"
					variant="ghost"
					size="icon"
					title="Hotspot"
					class="hover:bg-indigo-100 dark:hover:bg-indigo-900/30">
					<Wifi class="h-5 w-5" />
				</Button>
				<Button
					@click="settingsOpen = true"
					variant="ghost"
					size="icon"
					title="Settings"
					class="hover:bg-indigo-100 dark:hover:bg-indigo-900/30">
					<Settings class="h-5 w-5" />
				</Button>
				<Button
					@click="toggleTheme"
					variant="ghost"
					size="icon"
					title="Toggle theme"
					class="hover:bg-indigo-100 dark:hover:bg-indigo-900/30">
					<Sun v-if="!isDark" class="h-5 w-5 text-amber-500" />
					<Moon v-else class="h-5 w-5 text-indigo-400" />
				</Button>
			</div>
		</div>
	</header>
</template>
