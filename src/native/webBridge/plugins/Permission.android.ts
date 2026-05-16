import { Plugin, } from "../types"
import { PermissionsAndroid, Rationale, type Permission } from "react-native"

const PermissionPlugin: Plugin = {
    name: 'permission',
    methods: {
        check: async (permission: Permission) => {
            return PermissionsAndroid.check(permission as Permission)
        },
        request: async (params: { permission: Permission, rationale?: Rationale }) => {
            return await PermissionsAndroid.request(params.permission as Permission, params.rationale);
        }
    },
}

export default PermissionPlugin

export { PermissionPlugin }