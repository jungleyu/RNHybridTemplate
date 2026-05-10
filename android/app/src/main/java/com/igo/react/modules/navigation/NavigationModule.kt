package com.igo.react.modules.navigation

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import android.content.Intent
import com.igo.activity.RNActivity
import android.util.Log

class NavigationModule(reactContext: ReactApplicationContext) : NativeNavigationSpec(reactContext) {
    override fun getName() = NAME

    override fun navigate(componentKey: String, params: ReadableMap?) {
        val intent = Intent(reactApplicationContext, RNActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            putExtra("componentKey", componentKey)
            params?.let { map ->
                val keyIterator = map.keySetIterator()
                while (keyIterator.hasNextKey()) {
                    val key = keyIterator.nextKey()
                    val value = when (map.getType(key)) {
                        ReadableType.Null -> null
                        ReadableType.Boolean -> map.getBoolean(key)
                        ReadableType.Number -> map.getDouble(key)
                        ReadableType.String -> map.getString(key)
                        else -> null
                    }
                    putExtra(key, value)
                }
            }
        }
        reactApplicationContext.startActivity(intent)
    }

    companion object {
        const val NAME = "NativeNavigation"
    }
}