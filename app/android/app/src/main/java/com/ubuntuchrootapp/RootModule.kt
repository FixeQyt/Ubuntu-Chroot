package com.ubuntuchrootapp

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap
import be.mygod.librootkotlinx.RootServer
import be.mygod.librootkotlinx.RootSession
import be.mygod.librootkotlinx.ParcelableString
import be.mygod.librootkotlinx.ParcelableInt
import be.mygod.librootkotlinx.ParcelableLong
import be.mygod.librootkotlinx.ParcelableArray
import be.mygod.librootkotlinx.RootCommand
import be.mygod.librootkotlinx.RootCommandNoResult
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.Dispatchers
import kotlinx.parcelize.Parcelize
import android.os.Parcelable
import android.util.Log
import java.io.File
import java.io.FileOutputStream

@Parcelize
data class ExecCommand(val command: String) : RootCommand<ParcelableArray> {
    override suspend fun execute(): ParcelableArray {
        val proc = ProcessBuilder("/system/bin/sh", "-c", command).start()
        val out = proc.inputStream.reader().readText()
        val err = proc.errorStream.reader().readText()
        val exit = proc.waitFor()
        return ParcelableArray(arrayOf(ParcelableString(out), ParcelableString(err), ParcelableInt(exit)))
    }
}

@Parcelize
data class ReadFileCommand(val path: String) : RootCommand<ParcelableString> {
    override suspend fun execute(): ParcelableString {
        return ParcelableString(File(path).readText())
    }
}

@Parcelize
data class WriteFileCommand(val path: String, val content: String) : RootCommandNoResult {
    override suspend fun execute(): Parcelable? {
        val f = File(path)
        FileOutputStream(f).use { it.write(content.toByteArray()) }
        return null
    }
}

@Parcelize
data class StatCommand(val path: String) : RootCommand<ParcelableArray> {
    override suspend fun execute(): ParcelableArray {
        val f = File(path)
        val size = f.length()
        val mtime = f.lastModified()
        val mode = try {
            val stat = android.system.Os.stat(path)
            stat.st_mode and 0xfff
        } catch (e: Exception) {
            0
        }
        return ParcelableArray(arrayOf(ParcelableLong(size), ParcelableInt(mode), ParcelableLong(mtime)))
    }
}

class RootModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String = "RootModule"

    private val rootManager: RootSession by lazy {
        object : RootSession() {
            override val timeout get() = 5 * 60 * 1000L // 5 minutes
            override suspend fun initServer(server: RootServer) {
                server.init(reactContext, be.mygod.librootkotlinx.AppProcess.shouldRelocateHeuristics)
            }
        }
    }

    private fun mapExecResult(arr: ParcelableArray): WritableNativeMap {
        val map = WritableNativeMap()
        val stdout = (arr.value.getOrNull(0) as? ParcelableString)?.value ?: ""
        val stderr = (arr.value.getOrNull(1) as? ParcelableString)?.value ?: ""
        val exit = (arr.value.getOrNull(2) as? ParcelableInt)?.value ?: 0
        map.putString("stdout", stdout)
        map.putString("stderr", stderr)
        map.putInt("exitCode", exit)
        return map
    }

    @ReactMethod
    fun isRootAvailable(promise: Promise) {
        GlobalScope.launch(Dispatchers.IO) {
            try {
                rootManager.use { server ->
                    // no-op; if init succeeds, root is available
                }
                promise.resolve(true)
            } catch (e: Exception) {
                Log.w("RootModule", "isRootAvailable failed", e)
                promise.resolve(false)
            }
        }
    }

    @ReactMethod
    fun exec(command: String, promise: Promise) {
        GlobalScope.launch(Dispatchers.IO) {
            try {
                val res = rootManager.use { it.execute(ExecCommand(command)) }
                promise.resolve(mapExecResult(res))
            } catch (e: Exception) {
                promise.reject("ERR_EXEC", e)
            }
        }
    }

    @ReactMethod
    fun readFile(path: String, promise: Promise) {
        GlobalScope.launch(Dispatchers.IO) {
            try {
                val res = rootManager.use { it.execute(ReadFileCommand(path)) }
                promise.resolve(res.value)
            } catch (e: Exception) {
                promise.reject("ERR_READ", e)
            }
        }
    }

    @ReactMethod
    fun writeFile(path: String, content: String, promise: Promise) {
        GlobalScope.launch(Dispatchers.IO) {
            try {
                rootManager.use { it.execute(WriteFileCommand(path, content)) }
                promise.resolve(null as Void?)
            } catch (e: Exception) {
                promise.reject("ERR_WRITE", e)
            }
        }
    }

    @ReactMethod
    fun stat(path: String, promise: Promise) {
        GlobalScope.launch(Dispatchers.IO) {
            try {
                val res = rootManager.use { it.execute(StatCommand(path)) }
                val map = WritableNativeMap()
                val size = (res.value.getOrNull(0) as? ParcelableLong)?.value ?: 0L
                val mode = (res.value.getOrNull(1) as? ParcelableInt)?.value ?: 0
                val modified = (res.value.getOrNull(2) as? ParcelableLong)?.value ?: 0L
                map.putString("path", path)
                map.putDouble("size", size.toDouble())
                map.putInt("mode", mode)
                map.putDouble("modifiedAt", modified.toDouble())
                promise.resolve(map)
            } catch (e: Exception) {
                promise.reject("ERR_STAT", e)
            }
        }
    }
}
