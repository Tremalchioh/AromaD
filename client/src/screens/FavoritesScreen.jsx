import React, {useEffect} from 'react'
import {Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList, RefreshControl, ScrollView} from 'react-native'
import {findBrandnameById, usePerfumeStore} from "../data/PerfumeStore";
import {Icon} from "react-native-elements";
import {apiUrl} from "../consts";
import useAuthStore from "../data/UserStore";
import {screenHeight, screenWidth} from "./CatalogScreen";
import {useNavigation} from "@react-navigation/native";
import {Image} from "expo-image"
import {ImageHeaderScrollView, TriggeringView} from "react-native-image-header-scroll-view";

const FavoritesScreen = () => {
    const {perfumeBrands} = usePerfumeStore()
    const {userId, favoritePerfumes, recentlyViewedPerfumes} = useAuthStore()
    const fetchFavorites = useAuthStore((store) => (store.fetchFavorites))
    const fetchRecentlyViewed = useAuthStore((store) => (store.fetchRecentlyViewed))
    const addToFavorites = usePerfumeStore((store) => (store.addToFavorites))
    const addToRecentlyViewed = usePerfumeStore((store) => (store.addToRecentlyViewed))
    const navigation = useNavigation()

    useEffect(() => {
        // Получение списка парфюмов при загрузке компонента
        fetchFavorites(userId).then()
        fetchRecentlyViewed(userId).then()
    }, [])

    if (!favoritePerfumes) {
        // Отобразить индикатор загрузки или другое сообщение о загрузке
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#A9DEF9" />
            </View>
        )
    }

    const handlePress = async (perfumeId) => {
        await addToRecentlyViewed(userId, perfumeId)
        navigation.navigate('Perfume', {perfumeId: perfumeId})
    }

    const handleRefresh = async () => {
        await fetchFavorites(userId).then()
        await fetchRecentlyViewed(userId).then()
    }

    const renderPerfumeItem = ({ item }) => (
        <TouchableOpacity style={styles.perfumeItem} onPress={() => handlePress(item.id)}>
            <TouchableOpacity onPress={async () => {
                await addToFavorites(userId, item.id)
                fetchFavorites(userId).then()
            }} style={styles.favoritesButton}>
                <Icon name={favoritePerfumes.find((perfume) => perfume.id === item.id) ? "heart" : "heart-outline"} color="#000" borderRadius={2} type="material-community" size={20} />
            </TouchableOpacity>
            <Image source={{ uri: apiUrl + item.picture }} style={styles.perfumeImage} />
            <View style={styles.perfumeInfo}>
                <Text style={styles.perfumeBrand}>
                    {
                        perfumeBrands.length > 0 ? findBrandnameById(item.brandId, perfumeBrands).toString() : "Загрузка..."
                    }
                </Text>
                <Text style={styles.perfumeName}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <View style={{ flex: 1 }}>
            <ImageHeaderScrollView
                maxHeight={250}
                minHeight={0}
                headerImage={{uri: "https://i.pinimg.com/originals/89/24/d2/8924d202e4f44c1dd19107b42c59466c.jpg"}}>
                <ScrollView
                    style={styles.container}
                    nestedScrollEnabled={true}
                    contentContainerStyle={styles.contentContainer}
                    refreshControl={<RefreshControl refreshing={false} onRefresh={handleRefresh} />}
                >
                    <Text style={styles.title}>Избранное</Text>
                    {favoritePerfumes.length === 0
                        ?   <View style={{flex:1, margin: 10}}>
                                <Text style={styles.message}>Вы еще не добавили товары в избранное</Text>
                            </View>
                        :   <FlatList
                                style={styles.perfumeList}
                                renderItem={renderPerfumeItem}
                                contentContainerStyle={styles.perfumeList}
                                data={favoritePerfumes}
                                numColumns={2}
                                key={Math.random().toString()}
                                keyExtractor={(item) => item.id.toString()}
                            />}
                </ScrollView>
                <View style={styles.container}>
                    <Text style={[styles.title, {marginRight: 10, marginBottom: 40}]}>Недавно просмотренные</Text>
                    {recentlyViewedPerfumes.length === 0
                        ?   <Text style={styles.message}>Вы еще просмотрели ни один парфюм</Text>
                        :   <FlatList
                                style={[styles.perfumeList, {flexDirection: 'row'}]}
                                renderItem={renderPerfumeItem}
                                contentContainerStyle={styles.perfumeList}
                                data={recentlyViewedPerfumes}
                                keyExtractor={(item) => item.id.toString()}
                                numColumns={2}
                                key={Math.random().toString()}
                        />}
                </View>
            </ImageHeaderScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        padding: 20,
    },
    contentContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    loadingContainer: {
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 20,
        marginLeft: 10,
        marginTop: 20,
        color: '#000'
    },
    perfumeList: {
        backgroundColor: '#ffffff',
        width: '100%',
        flex: 1,
    },
    perfumeItem: {
        height: screenHeight/3,
        width: screenWidth/2.8,
        marginBottom: 0,
        marginRight: 20,
        marginLeft: 20,
    },
    perfumeInfo: {
        flex: 1,
    },
    perfumeImage: {
        flex: 1,
        width: screenWidth/4,
        height: screenHeight/6,
        justifyContent: "center",
        alignItems: 'center',
        marginRight: 10,
        marginTop: 20,
    },
    perfumeName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000'
    },
    perfumeBrand: {
        fontSize: 16,
        fontWeight: '300',
        color: '#666',
    },
    favoritesButton: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    message: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 18,
        fontWeight: '300',
        color: '#CCC',
    }
})

export default FavoritesScreen