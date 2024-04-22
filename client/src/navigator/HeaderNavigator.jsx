import React, {useEffect} from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import useAuthStore from "../data/UserStore"

const HeaderNavigator = () => {
    const logout = useAuthStore((state) => state.logout)
    const navigation = useNavigation()

    const goToFavorites = () => {
        navigation.navigate('Избранное') // Переход на FavoritesScreen
    };

    const goToCatalog = () => {
        navigation.navigate('Каталог')
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={logout}>
                <Icon name="account-minus-outline" color="#000" type="material-community" size={30} />
            </TouchableOpacity>
            <TouchableOpacity onPress={goToCatalog}>
                <Icon name="home-outline" color="#000" type="material-community" size={30} />
            </TouchableOpacity>
            <TouchableOpacity onPress={goToFavorites}>
                <Icon name="account-heart-outline" color="#000" type="material-community" size={30 } />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 5,
        backgroundColor: '#fff', // Цвет фона шапки навигации
        borderBottomWidth: 1,
        borderBottomColor: '#ccc', // Цвет разделителя
    },
})

export default HeaderNavigator