package com.igo.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.igo.databinding.FragmentHomeBinding
import kotlin.jvm.java
import android.content.Intent
import com.igo.activity.MainActivity
import com.igo.activity.RNActivity
import com.igo.R

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        // 在这里初始化视图、设置点击事件等
        binding.toRNActivity.setOnClickListener {
            val intent = Intent(requireActivity(), RNActivity::class.java).apply{
                putExtra("componentKey", "Detail")
            }
            startActivity(intent)
        }
        binding.toRNFragment.setOnClickListener {
            (requireActivity() as MainActivity).selectBottomNavItem(R.id.iGoFragment)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null // 避免内存泄漏
    }
}