<!-- SPDX-License-Identifier: MIT -->
<script setup lang="ts">
const colorMode = useColorMode()
</script>

<template>
	<Html :class="colorMode.value">
		<Head>
			<Meta charset="utf-8" />
			<Meta
				name="viewport"
				content="width=device-width, initial-scale=1, viewport-fit=cover" />
			<Title>Ubuntu Chroot Manager</Title>
		</Head>
		<Body>
			<NuxtLayout>
				<NuxtPage />
			</NuxtLayout>
		</Body>
	</Html>
</template>
