import { NativeModules } from 'react-native'
import type { RootExecResult, RootFileStat, RootModuleAPI } from './types'

const Native = (NativeModules as unknown as { RootModule?: unknown }).RootModule as
	| RootModuleAPI
	| undefined

function notAvailableError() {
	return new Error('Native RootModule is not available.')
}

export async function isRootAvailable(): Promise<boolean> {
	if (!Native || typeof Native.isRootAvailable !== 'function') throw notAvailableError()
	return Native.isRootAvailable()
}

export async function exec(command: string): Promise<RootExecResult> {
	if (!Native || typeof Native.exec !== 'function') throw notAvailableError()
	return Native.exec(command)
}

export async function readFile(path: string): Promise<string> {
	if (!Native || typeof Native.readFile !== 'function') throw notAvailableError()
	return Native.readFile(path)
}

export async function writeFile(path: string, content: string, mode?: number): Promise<void> {
	if (!Native || typeof Native.writeFile !== 'function') throw notAvailableError()
	return Native.writeFile(path, content, mode ?? 0o644)
}

export async function stat(path: string): Promise<RootFileStat> {
	if (!Native || typeof Native.stat !== 'function') throw notAvailableError()
	return Native.stat(path)
}

const RootBridge = {
	isRootAvailable,
	exec,
	readFile,
	writeFile,
	stat,
}

export default RootBridge
