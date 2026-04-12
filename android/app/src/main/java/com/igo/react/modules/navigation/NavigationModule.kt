package com.igo.react.modules.navigation

import com.facebook.react.bridge.ReactApplicationContext
import android.content.Intent
import com.igo.activity.RNActivity

class NavigationModule(reactContext: ReactApplicationContext) : NativeNavigationSpec(reactContext) {
    override fun getName() = NAME

    override fun navigate(componentKey: String) {
        val intent = Intent(reactApplicationContext, RNActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            putExtra("componentKey", componentKey)
        }
        reactApplicationContext.startActivity(intent)
    }

    companion object {
        const val NAME = "NativeNavigation"
    }
}