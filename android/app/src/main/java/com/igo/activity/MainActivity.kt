package com.igo.activity

import android.os.Build
import android.os.Bundle
import android.view.View
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.NavigationUI
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler
import com.igo.R
import com.igo.databinding.ActivityMainBinding
import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory

class MainActivity : AppCompatActivity(), DefaultHardwareBackBtnHandler {

    private lateinit var binding: ActivityMainBinding
    private lateinit var navController: NavController

    @RequiresApi(Build.VERSION_CODES.R)
    override fun onCreate(savedInstanceState: Bundle?) {
        supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()
        super.onCreate(savedInstanceState)
        initViews()
        setupStatusBar()
        setupNavigation()
    }

    private fun initViews() {
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // 设置toolbar与window insets的关系
        ViewCompat.setOnApplyWindowInsetsListener(binding.toolbar) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(0, systemBars.top, 0, 0)
            insets
        }
    }

    @RequiresApi(Build.VERSION_CODES.R)
    private fun setupStatusBar() {
        // 确保状态栏不被覆盖
        window.addFlags(android.view.WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
        // 清除状态栏透明标志
        window.clearFlags(android.view.WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS)
        // 设置状态栏文本为白色
        window.decorView.windowInsetsController?.apply {
            setSystemBarsAppearance(
                0,
                android.view.WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
            )
            // 显示状态栏
            show(android.view.WindowInsets.Type.statusBars())
        }
    }

    private fun setupNavigation() {
        val navHostFragment =
            supportFragmentManager.findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        navController = navHostFragment.navController

        // 设置app bar配置，包含所有底部导航项
        val tabs = setOf(
            R.id.homeFragment,
            R.id.exploreFragment,
            R.id.aiFragment,
            R.id.iGoFragment,
            R.id.meFragment
        )
        val appBarConfiguration = AppBarConfiguration(tabs)

        // 设置toolbar与navController的关联
        setSupportActionBar(binding.toolbar)
        setupActionBarWithNavController(navController, appBarConfiguration)

        // 添加导航监听器，在tab切换时改变toolbar背景色和底部导航栏颜色
        navController.addOnDestinationChangedListener { _, destination, _ ->
            updateUIForDestination(destination.id)
            if (destination.id in tabs) {
                navController.popBackStack(destination.id, inclusive = false)
            }
        }

        binding.bottomNavView.setupWithNavController(navController)
    }

    /**
     * 根据导航目的地更新UI
     * @param destinationId 目的地ID
     */
    private fun updateUIForDestination(destinationId: Int) {
        when (destinationId) {
            R.id.homeFragment -> {
                updateTabUI(View.VISIBLE, R.color.home_color)
            }

            R.id.exploreFragment -> {
                updateTabUI(View.VISIBLE, R.color.explore_color)
            }

            R.id.aiFragment -> {
                updateTabUI(View.VISIBLE, R.color.ai_color)
            }

            R.id.iGoFragment -> {
                // 爱购tab隐藏toolbar
                updateTabUI(View.GONE, R.color.igo_color)
            }

            R.id.meFragment -> {
                updateTabUI(View.VISIBLE, R.color.me_color)
            }
        }
    }

    /**
     * 更新tab的UI
     * @param toolbarVisibility toolbar的可见性
     * @param colorResId 颜色资源ID
     */
    private fun updateTabUI(toolbarVisibility: Int, colorResId: Int) {
        binding.toolbar.visibility = toolbarVisibility
        binding.toolbar.setBackgroundColor(getColor(colorResId))
        binding.bottomNavView.setBackgroundColor(getColor(colorResId))
        window.statusBarColor = getColor(colorResId)
    }

    fun selectBottomNavItem(itemId: Int) {
        binding.bottomNavView.selectedItemId = itemId
    }

    // 处理导航返回
    override fun onSupportNavigateUp(): Boolean {
        return navController.navigateUp() || super.onSupportNavigateUp()
    }

    override fun invokeDefaultOnBackPressed() {

    }
}