import bus from '@/utils/bus.js'

const permission = {
    methods: {
        /**
         * 判断当前权限是否满足需要的权限
         * @param {Array} reqPermission 需要的权限
         * @param {Array} curPermission 当前拥有的权限
         */
        hasPermission (reqPermission = [], curPermission = [], permissionMap = []) {
            return reqPermission.every(item => {
                if (curPermission.includes(item)) {
                    return true
                } else if (permissionMap.length > 0) {
                    const perm = permissionMap.find(op => op.operate_id === item)
                    if (!perm) {
                        return false
                    }
                    return perm.actions_id.every(p => curPermission.includes(p))
                } else {
                    return false
                }
            })
        },
        /**
         * 申请权限
         * @param {Array} required 需要的申请的权限
         * @param {*} resourceData 资源数据
         * @param {*} authOperations 权限字典
         * @param {*} authResource 资源信息
         */
        applyForPermission (required, resourceData, authOperations, authResource) {
            console.log(authOperations)
            let actions = []
            authOperations.filter(item => {
                return required.includes(item.operate_id)
            }).forEach(perm => {
                actions = actions.concat(perm.actions)
            })
            
            const { scope_id, scope_name, scope_type, system_id, system_name, resource } = authResource
            const permissions = []
            console.log(actions)
            actions.forEach(item => {
                const res = []
                res.push([{
                    resource_id: resourceData.id,
                    resource_name: resourceData.name,
                    resource_type: resource.resource_type,
                    resource_type_name: resource.resource_type_name
                }])
                permissions.push({
                    scope_id,
                    scope_name,
                    scope_type,
                    system_id,
                    system_name,
                    resources: res,
                    action_id: item.id,
                    action_name: item.name
                })
            })

            this.triggerPermisionModal(permissions)
        },
        triggerPermisionModal (permissions) {
            bus.$emit('showPermissionModal', permissions)
        }
    }
}

export default permission
