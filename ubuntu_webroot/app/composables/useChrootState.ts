// SPDX-License-Identifier: MIT
export type ChrootStatus =
	| 'unknown'
	| 'running'
	| 'stopped'
	| 'starting'
	| 'stopping'
	| 'restarting'
	| 'backing up'
	| 'restoring'
	| 'migrating'
	| 'uninstalling'
	| 'updating'
	| 'trimming'
	| 'resizing'
	| 'not_found'

export const useChrootState = () => {
	const status = useState<ChrootStatus>('chrootStatus', () => 'unknown')
	const rootAccessConfirmed = useState('rootAccessConfirmed', () => false)
	const chrootExists = useState('chrootExists', () => false)
	const sparseMigrated = useState('sparseMigrated', () => false)
	const debugMode = useState('debugMode', () => false)
	const activeCommandId = useState<string | null>('activeCommandId', () => null)
	const users = useState<string[]>('chrootUsers', () => ['root'])
	const selectedUser = useState('selectedUser', () => 'root')
	const runAtBoot = useState('runAtBoot', () => false)

	const hotspotActive = useState('hotspotActive', () => false)
	const forwardingActive = useState('forwardingActive', () => false)

	const consoleLogs = useState<Array<{ text: string; type?: string }>>('consoleLogs', () => [])

	const appendConsole = (text: string, type?: string) => {
		const MAX_LINES = 250
		const newLog = { text, type }
		consoleLogs.value = [...consoleLogs.value, newLog]
		if (consoleLogs.value.length > MAX_LINES) {
			consoleLogs.value = consoleLogs.value.slice(-MAX_LINES)
		}
	}

	const clearConsole = () => {
		consoleLogs.value = []
	}

	return {
		status,
		rootAccessConfirmed,
		chrootExists,
		sparseMigrated,
		debugMode,
		activeCommandId,
		users,
		selectedUser,
		runAtBoot,
		hotspotActive,
		forwardingActive,
		consoleLogs,
		appendConsole,
		clearConsole,
	}
}
