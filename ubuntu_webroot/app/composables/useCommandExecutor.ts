// SPDX-License-Identifier: MIT
export interface CommandResult {
	success: boolean
	exitCode?: number
	output?: string
	error?: string
}

export interface CommandCallbacks {
	onOutput?: (output: string) => void
	onError?: (error: string) => void
	onComplete?: (result: CommandResult) => void
}

export const useCommandExecutor = () => {
	const detectExecutionMethod = () => {
		if (typeof window === 'undefined') return 'none'
		if (typeof (window as any).ksu !== 'undefined' && (window as any).ksu.exec) {
			return 'ksu'
		} else if ((window as any).SULib) {
			return 'sulib'
		}
		return 'none'
	}

	const execMethod = ref<'ksu' | 'sulib' | 'none'>(detectExecutionMethod())
	const runningCommands = ref<Map<string, any>>(new Map())

	const executeAsync = (
		command: string,
		asRoot = true,
		callbacks: CommandCallbacks = {}
	): string => {
		const commandId = `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
		const fullCommand = asRoot ? `su -c "${command}"` : command

		const { onOutput, onError, onComplete } = callbacks

		runningCommands.value.set(commandId, { command: fullCommand, startTime: Date.now() })

		if (execMethod.value === 'ksu') {
			const callback = `ksu_callback_${commandId}`
			;(window as any)[callback] = (exitCode: number, stdout: string, stderr: string) => {
				delete (window as any)[callback]
				runningCommands.value.delete(commandId)

				if (exitCode === 0) {
					if (stdout && onOutput) onOutput(stdout)
					if (onComplete) onComplete({ success: true, exitCode, output: stdout })
				} else {
					const combinedOutput = [stdout, stderr].filter(Boolean).join('\n')
					const errorMessage = combinedOutput.trim() || `exit:${exitCode}`

					if (errorMessage && onError) onError(errorMessage)
					if (onComplete) onComplete({ success: false, exitCode, error: errorMessage })
				}
			}

			try {
				;(window as any).ksu.exec(fullCommand, '{}', callback)
				if (onOutput) onOutput(`[Executing: ${command}]\n`)
			} catch (e) {
				if ((window as any)[callback]) delete (window as any)[callback]
				runningCommands.value.delete(commandId)
				if (onError) onError(String(e))
				if (onComplete) onComplete({ success: false, error: String(e) })
			}
		} else if (execMethod.value === 'sulib') {
			try {
				if (onOutput) onOutput(`[Executing: ${command}]\n`)

				;(window as any).SULib.exec(fullCommand, (result: any) => {
					runningCommands.value.delete(commandId)

					if (result.success) {
						if (result.output && onOutput) onOutput(result.output)
						if (onComplete) onComplete({ success: true, output: result.output })
					} else {
						const combinedOutput = [result.output, result.error]
							.filter(Boolean)
							.join('\n')
						const errorMessage =
							combinedOutput.trim() ||
							`Command failed with exit code ${result.exitCode || 'unknown'}`

						if (errorMessage && onError) onError(errorMessage)
						if (onComplete) onComplete({ success: false, error: errorMessage })
					}
				})
			} catch (e) {
				runningCommands.value.delete(commandId)
				if (onError) onError(String(e))
				if (onComplete) onComplete({ success: false, error: String(e) })
			}
		} else {
			runningCommands.value.delete(commandId)
			const errorMsg =
				'No root execution method available (KernelSU or libsuperuser not detected).'
			if (onError) onError(errorMsg)
			if (onComplete) onComplete({ success: false, error: errorMsg })
		}

		return commandId
	}

	const execute = async (command: string, asRoot = true): Promise<string> => {
		return new Promise((resolve, reject) => {
			executeAsync(command, asRoot, {
				onComplete: (result) => {
					if (result.success) {
						resolve(result.output || '')
					} else {
						reject(new Error(result.error || 'Command failed'))
					}
				},
			})
		})
	}

	const isCommandRunning = (commandId: string) => {
		return runningCommands.value.has(commandId)
	}

	const getRunningCommands = () => {
		return Array.from(runningCommands.value.entries()).map(([id, info]) => ({
			id,
			...info,
			duration: Date.now() - info.startTime,
		}))
	}

	return {
		execMethod: readonly(execMethod),
		executeAsync,
		execute,
		isCommandRunning,
		getRunningCommands,
	}
}
