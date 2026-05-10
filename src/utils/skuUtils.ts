// 单规格项
export interface Spec {
    pic: string;
    value: string;
}

// 规格分组
export interface SpecItem {
    code: string;
    name: string;
    items: Spec[];
}

// SKU 项
export interface SkuItem {
    id: number;
    price: number;
    originPrice: number;
    skuPic: string;
    spec: Record<string, string>;
    stockFlag: boolean;
    mcdsId: string;
    name: string;
    [key: string]: any;
}

// 整体接口
export interface GoodsSkuResp {
    specList: SpecItem[];
    skuList: SkuItem[];
}

/**
 * @param selected 已选规格 key:specCode  value:规格值
 * @param skuList 后端sku数组
 */
export function getAvailableSpecMap(
    selected: Record<string, string>,
    skuList: SkuItem[]
) {
    const available = new Map<string, Set<string>>();
    const selectedEntries = Object.entries(selected);
    const selectedCodes = new Set(Object.keys(selected));

    // 初始化所有规格组
    const allSpecCodes = Array.from(new Set(skuList.flatMap(s => Object.keys(s.spec))));
    allSpecCodes.forEach(code => available.set(code, new Set()));

    // ========================
    // 核心优化：只遍历 1 次 SKU
    // 同时计算：基础可选值 + 本组可切换值
    // ========================
    skuList.forEach(sku => {
        if (!sku.stockFlag) return;
        const skuSpec = sku.spec;

        // 1. 完全匹配已选规格（给其他规格组用）
        const fullMatch = selectedEntries.every(([code, val]) => skuSpec[code] === val);

        // 2. 仅排除当前组，其他已选匹配（给本组切换用）
        const otherMatchCache: Record<string, boolean> = {};
        for (const code of selectedCodes) {
            otherMatchCache[code] = selectedEntries
                .filter(([c]) => c !== code)
                .every(([c, val]) => skuSpec[c] === val);
        }

        // 统一添加可选值
        Object.entries(skuSpec).forEach(([code, val]) => {
            // 满足 fullMatch 或者 是本组且满足otherMatch → 就可选
            if (fullMatch || (selectedCodes.has(code) && otherMatchCache[code])) {
                available.get(code)!.add(val);
            }
        });
    });

    return available;
}

// 3、判断当前规格是否置灰 —— 无需修改
export function isSpecItemDisabled(
    specCode: string,
    val: string,
    availableMap: Map<string, Set<string>>
) {
    return !availableMap.get(specCode)?.has(val);
}

// 4、获取完整选中后的唯一SKU —— 无需修改
export function getCurrentFullSku(
    selected: Record<string, string>,
    specList: SpecItem[],
    skuList: SkuItem[]
) {
    const allCode = specList.map(g => g.code);
    const selectedKeys = Object.keys(selected);
    // 是否选完所有规格
    const isAllSelected = allCode.every(code => selectedKeys.includes(code));
    if (!isAllSelected) return null;

    return skuList.find(sku =>
        allCode.every(code => sku.spec[code] === selected[code])
    ) ?? null;
}