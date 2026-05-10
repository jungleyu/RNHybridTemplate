import { SkuItem, SpecItem } from "../utils/skuUtils"

export default function useSkuAlgorithm(specList: SpecItem[],
    skuList: SkuItem[]) {
    // 1. 根据已选规格，筛选合法SKU
    const filterMatchSku = (selected: Record<string, string>) => {
        return skuList.filter(sku => {
            return Object.entries(selected).every(([k, v]) => sku.spec[k] === v)
        })
    }

    // 2. 获取当前可点击的规格集合（用来置灰）
    const getAvailableSpecValues = (selected: Record<string, string>) => {
        const match = filterMatchSku(selected).filter(s => s.stockFlag)
        const map = new Map<string, Set<string>>()

        specList.forEach(spec => {
            map.set(spec.code, new Set())
        })

        match.forEach(sku => {
            Object.entries(sku.spec).forEach(([key, val]) => {
                map.get(key)?.add(val)
            })
        })

        return map
    }

    // 3. 判断规格是否禁用
    const isSpecDisabled = (
        code: string,
        name: string,
        availableMap: Map<string, Set<string>>
    ) => {
        return !availableMap.get(code)?.has(name)
    }

    // 4. 完整匹配当前选中SKU
    const getCurrentSku = (selected: Record<string, string>) => {
        const keys = specList.map(i => i.code)
        return skuList.find(sku =>
            keys.every(k => sku.spec[k] === selected[k])
        )
    }

    return {
        filterMatchSku,
        getAvailableSpecValues,
        isSpecDisabled,
        getCurrentSku
    }
}