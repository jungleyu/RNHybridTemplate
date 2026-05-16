import { Plugin, PluginContext } from "../types"
import { ToastAndroid } from "react-native"

const ToastPlugin: Plugin = {
    name: 'toast',
    methods: {
        show: async (params: { message: string, duration: number }, _?: PluginContext) => {
            ToastAndroid.show(params.message, params.duration);
            return true
        },
    },
}

export default ToastPlugin