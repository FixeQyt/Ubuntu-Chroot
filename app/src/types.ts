export interface RootExecResult {
	stdout: string
	stderr: string
	exitCode: number
}

export interface RootFileStat {
	path: string
	size: number
	mode: number
	modifiedAt: number // unix ms
}

export interface RootModuleAPI {
	isRootAvailable(): Promise<boolean>
	exec(command: string): Promise<RootExecResult>
	readFile(path: string): Promise<string>
	writeFile(path: string, content: string, mode?: number): Promise<void>
	stat(path: string): Promise<RootFileStat>
}
