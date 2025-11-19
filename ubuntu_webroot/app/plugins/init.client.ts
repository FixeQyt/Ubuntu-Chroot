// SPDX-License-Identifier: MIT
export default defineNuxtPlugin(() => {
	const { executeAsync, execMethod } = useCommandExecutor()
	const {
		status,
		rootAccessConfirmed,
		chrootExists,
		sparseMigrated,
		appendConsole,
		consoleLogs,
		users,
		selectedUser,
		runAtBoot,
		hotspotActive,
		forwardingActive,
	} = useChrootState()
	const { CHROOT_DIR, PATH_CHROOT_SH, BOOT_FILE, POST_EXEC_SCRIPT } = useChrootConfig()

	if (execMethod.value === 'none') {
		appendConsole(
			'[System] WARNING: No root execution method available (KernelSU/libsuperuser not detected)',
			'error'
		)
		status.value = 'unknown'
		return
	}

	// Check if root access is available
	const checkRootAccess = () => {
		appendConsole('[System] Checking root access...', 'info')

		executeAsync('id', true, {
			onOutput: (output) => {
				const lines = output.split('\n')
				lines.forEach((line) => {
					if (line.trim()) {
						appendConsole(line)
					}
				})

				if (output.includes('uid=0')) {
					rootAccessConfirmed.value = true
					appendConsole('[System] Root access confirmed', 'success')
					checkChrootStatus()
				}
			},
			onError: (error) => {
				rootAccessConfirmed.value = false
				status.value = 'unknown'
				appendConsole(`[System] Root access failed: ${error}`, 'error')
			},
		})
	}

	// Check if chroot exists and get status
	const checkChrootStatus = () => {
		executeAsync(`test -d ${CHROOT_DIR} && echo "exists" || echo "not_found"`, true, {
			onOutput: (output) => {
				if (output.trim() === 'exists') {
					chrootExists.value = true
					appendConsole('[System] Chroot directory found', 'success')
					getCurrentStatus()
				} else {
					chrootExists.value = false
					status.value = 'not_found'
					appendConsole('[System] Chroot directory not found', 'warn')
				}
			},
			onError: () => {
				chrootExists.value = false
				status.value = 'not_found'
			},
		})
	}

	// Get current chroot status
	const getCurrentStatus = () => {
		executeAsync(`${PATH_CHROOT_SH} status`, true, {
			onOutput: (output) => {
				const lines = output.split('\n')
				lines.forEach((line) => {
					if (line.trim()) {
						appendConsole(line)
					}
				})

				const trimmed = output.trim().toLowerCase()
				if (trimmed.includes('running') || trimmed.includes('active')) {
					status.value = 'running'
					appendConsole('[System] Chroot is running', 'success')
				} else if (trimmed.includes('stopped') || trimmed.includes('inactive')) {
					status.value = 'stopped'
					appendConsole('[System] Chroot is stopped', 'info')
				} else {
					status.value = 'stopped'
					appendConsole(`[System] Status: ${trimmed}`, 'info')
				}

				loadAllSettings()
			},
			onError: (error) => {
				status.value = 'stopped'
				appendConsole(`[System] Status check failed: ${error}`, 'warn')
				loadAllSettings()
			},
		})
	}

	const loadAllSettings = () => {
		appendConsole('[System] Loading settings...', 'info')

		// Load boot toggle
		executeAsync(`test -f ${BOOT_FILE} && echo "true" || echo "false"`, true, {
			onOutput: (output) => {
				runAtBoot.value = output.trim() === 'true'
				appendConsole(`[System] Run at boot: ${runAtBoot.value}`, 'info')
			},
			onError: () => {
				runAtBoot.value = false
			},
		})

		// Load sparse migration status
		executeAsync(
			`test -f ${CHROOT_DIR}/.sparse_migrated && echo "true" || echo "false"`,
			true,
			{
				onOutput: (output) => {
					sparseMigrated.value = output.trim() === 'true'
					appendConsole(`[System] Sparse migrated: ${sparseMigrated.value}`, 'info')
				},
				onError: () => {
					sparseMigrated.value = false
				},
			}
		)

		// Load available users
		executeAsync(`ls -1 ${CHROOT_DIR}/home 2>/dev/null || echo "root"`, true, {
			onOutput: (output) => {
				const userList = output
					.trim()
					.split('\n')
					.filter((u) => u.length > 0)
				if (userList.length > 0 && userList[0] !== 'root') {
					users.value = ['root', ...userList]
				} else {
					users.value = ['root']
				}
				appendConsole(`[System] Available users: ${users.value.join(', ')}`, 'info')
			},
			onError: () => {
				users.value = ['root']
			},
		})

		// Check hotspot status
		executeAsync('pidof hostapd >/dev/null && echo "active" || echo "inactive"', true, {
			onOutput: (output) => {
				hotspotActive.value = output.trim() === 'active'
				if (hotspotActive.value) {
					appendConsole('[System] Hotspot is active', 'success')
				}
			},
			onError: () => {
				hotspotActive.value = false
			},
		})

		// Check NAT forwarding status
		executeAsync(
			'iptables -t nat -L POSTROUTING 2>/dev/null | grep -q MASQUERADE && echo "active" || echo "inactive"',
			true,
			{
				onOutput: (output) => {
					forwardingActive.value = output.trim() === 'active'
					if (forwardingActive.value) {
						appendConsole('[System] NAT forwarding is active', 'success')
					}
				},
				onError: () => {
					forwardingActive.value = false
				},
			}
		)

		appendConsole('[System] Settings loaded', 'success')
	}

	// Start initialization
	setTimeout(() => {
		checkRootAccess()
	}, 100)
})
