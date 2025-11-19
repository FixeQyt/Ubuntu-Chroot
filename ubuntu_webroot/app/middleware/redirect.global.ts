// SPDX-License-Identifier: MIT
export default defineNuxtRouteMiddleware((to) => {
	if (to.path === '/index.html') {
		return navigateTo('/', { redirectCode: 301 })
	}
})
