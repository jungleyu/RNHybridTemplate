package com.igo.application

import android.app.Application
import android.util.Log
import com.facebook.react.common.build.ReactBuildConfig
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.igo.react.modules.navigation.NavigationPackage
import com.facebook.react.ReactInstanceEventListener

class MainApplication : Application(), ReactApplication {

    private val mBundleLoadStartTime = System.currentTimeMillis()

    override val reactHost: ReactHost by lazy {
        getDefaultReactHost(
            context = applicationContext,
            packageList =
                PackageList(this).packages.apply {
                    // Packages that cannot be autolinked yet can be added manually here, for example:
                    // add(MyReactNativePackage())
                    add(NavigationPackage())
                },
            jsMainModulePath = "index",
            jsBundleAssetPath = "index.android.bundle",
            useDevSupport = ReactBuildConfig.DEBUG
        ).apply {
            // 监听 JS Bundle 加载完成
            addReactInstanceEventListener(
                object : ReactInstanceEventListener {
                    override fun onReactContextInitialized(context: com.facebook.react.bridge.ReactContext) {
                        val cost = System.currentTimeMillis() - mBundleLoadStartTime
                        Log.i("RN_PERF", "✅ RN 0.84 Bundle 加载耗时：$cost ms")
                    }
                }
            )
        }
    }

    override fun onCreate() {
        super.onCreate()
        loadReactNative(this)
    }
}
