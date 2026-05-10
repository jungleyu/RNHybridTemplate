import { FlatList, StyleSheet, } from 'react-native'
import React, { useCallback } from 'react'
import CartItem from '../component/CartItem'
import useShoppingCartList from '../hooks/useShoppingCartList'
import EmptyCart from '../component/EmptyCart'
import LoadingPanel from '../component/LoadingPanel'

const ShoppingCart = () => {

    const { data, loading } = useShoppingCartList();
    console.log('ShoppingCart: ', data)

    const renderItem = useCallback(({ item }: { item: Record<string, unknown> }) => {
        return <CartItem item={item} />
    }, []);

    const renderListFooter = useCallback(() => {
        if (loading) {
            return <LoadingPanel />
        }
    }, [loading]);

    return (
        <FlatList
            contentContainerStyle={
                styles.listContent
            }
            data={data}
            renderItem={renderItem}
            ListEmptyComponent={!loading ? <EmptyCart /> : null}
            ListFooterComponent={renderListFooter()} />

    )
}

export default ShoppingCart

const styles = StyleSheet.create({
    listContent: {
        padding: 12,
        rowGap: 12
    }
})