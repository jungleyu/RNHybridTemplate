package com.igo.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.facebook.react.ReactRootView
import com.facebook.react.ReactDelegate
import com.facebook.react.ReactApplication
import com.igo.application.MainApplication
import com.facebook.react.modules.core.PermissionAwareActivity
import com.facebook.react.modules.core.PermissionListener
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler

class IGoFragment : Fragment(), PermissionAwareActivity, DefaultHardwareBackBtnHandler {
    private lateinit var reactDelegate: ReactDelegate
    private var disableHostLifecycleEvents = false
    private var permissionListener: PermissionListener? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val reactHost = (activity?.application as ReactApplication?)?.reactHost
        reactDelegate = ReactDelegate(
            requireActivity(),
            reactHost,
            "App", // 与JS端注册的组件名一致
            null
        )
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        reactDelegate.loadApp()
        return reactDelegate.reactRootView
    }

    override fun onResume() {
        super.onResume()
        if (!disableHostLifecycleEvents) {
            reactDelegate.onHostResume()
        }
    }

    override fun onPause() {
        super.onPause()
        if (!disableHostLifecycleEvents) {
            reactDelegate.onHostPause()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        if (!disableHostLifecycleEvents) {
            reactDelegate.onHostDestroy()
        } else {
            reactDelegate.unloadApp()
        }
    }

//    override fun invokeDefaultOnBackPressed() {
//        requireActivity().onBackPressedDispatcher.onBackPressed()
//    }

    @Deprecated("Deprecated in Java")
    public override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray,
    ) {
        @Suppress("DEPRECATION")
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        permissionListener?.let {
            if (it.onRequestPermissionsResult(requestCode, permissions, grantResults)) {
                permissionListener = null
            }
        }
    }

    override fun checkPermission(permission: String, pid: Int, uid: Int): Int =
        activity?.checkPermission(permission, pid, uid) ?: 0

    override fun checkSelfPermission(permission: String): Int =
        activity?.checkSelfPermission(permission) ?: 0

    @Suppress("DEPRECATION")
    override fun requestPermissions(
        permissions: Array<String>,
        requestCode: Int,
        listener: PermissionListener?,
    ) {
        permissionListener = listener
        requestPermissions(permissions, requestCode)
    }

    override fun invokeDefaultOnBackPressed() {
        reactDelegate.onBackPressed()
    }

}