<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
	width?: number
	height?: number
	x?: number
	y?: number
	strokeDasharray?: number
	numSquares?: number
	class?: string
	maxOpacity?: number
	duration?: number
}

const props = withDefaults(defineProps<Props>(), {
	width: 40,
	height: 40,
	x: -1,
	y: -1,
	strokeDasharray: 0,
	numSquares: 50,
	maxOpacity: 0.5,
	duration: 4,
})

const containerRef = ref<SVGElement | null>(null)
const dimensions = ref({ width: 0, height: 0 })
const squares = ref<Array<{ id: number; x: number; y: number; delay: number }>>([])
const patternId = `pattern-${Math.random().toString(36).substr(2, 9)}`

const generateSquares = () => {
	if (!dimensions.value.width || !dimensions.value.height) return []

	const cols = Math.floor(dimensions.value.width / props.width)
	const rows = Math.floor(dimensions.value.height / props.height)

	const allSquares: Array<{ id: number; x: number; y: number; delay: number }> = []

	for (let i = 0; i < props.numSquares; i++) {
		allSquares.push({
			id: i,
			x: Math.floor(Math.random() * cols),
			y: Math.floor(Math.random() * rows),
			delay: i * 0.1,
		})
	}

	return allSquares
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
	if (containerRef.value) {
		resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				dimensions.value = {
					width: entry.contentRect.width,
					height: entry.contentRect.height,
				}
				squares.value = generateSquares()
			}
		})
		resizeObserver.observe(containerRef.value)
	}
})

onUnmounted(() => {
	if (resizeObserver && containerRef.value) {
		resizeObserver.unobserve(containerRef.value)
	}
})
</script>

<template>
	<svg
		ref="containerRef"
		aria-hidden="true"
		:class="[
			'pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30',
			props.class,
		]">
		<defs>
			<pattern
				:id="patternId"
				:width="width"
				:height="height"
				patternUnits="userSpaceOnUse"
				:x="x"
				:y="y">
				<path
					:d="`M.5 ${height}V.5H${width}`"
					fill="none"
					:stroke-dasharray="strokeDasharray" />
			</pattern>
		</defs>
		<rect width="100%" height="100%" :fill="`url(#${patternId})`" />
		<svg :x="x" :y="y" class="overflow-visible">
			<rect
				v-for="{ x: px, y: py, id, delay } in squares"
				:key="id"
				:width="width - 1"
				:height="height - 1"
				:x="px * width + 1"
				:y="py * height + 1"
				fill="currentColor"
				stroke-width="0"
				class="animate-pulse-fade"
				:style="{
					animationDelay: `${delay}s`,
					animationDuration: `${duration}s`,
				}" />
		</svg>
	</svg>
</template>

<style scoped>
@keyframes pulse-fade {
	0% {
		opacity: 0;
		transform: scale(0.8);
	}
	50% {
		opacity: v-bind(maxOpacity);
		transform: scale(1);
	}
	100% {
		opacity: 0;
		transform: scale(0.8);
	}
}

.animate-pulse-fade {
	opacity: 0;
	animation: pulse-fade var(--duration, 4s) ease-in-out infinite;
	--duration: v-bind(duration + 's');
	animation-fill-mode: both;
}
</style>
