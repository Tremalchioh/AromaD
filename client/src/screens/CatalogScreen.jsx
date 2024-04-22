import React, {useEffect, useState, useCallback} from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Button,
    ScrollView,
    RefreshControl, LogBox, TextInput
} from 'react-native'
import {
    usePerfumeStore,
    findBrandnameById,
    findTypenameById
} from '../data/PerfumeStore'
import { Dimensions } from 'react-native'
import {Icon} from "react-native-elements"
import {apiUrl} from "../consts"
import useAuthStore from "../data/UserStore";
import {Image} from "expo-image"
import HeaderImageScrollView, {ImageHeaderScrollView, TriggeringView} from 'react-native-image-header-scroll-view';

export const screenHeight = Dimensions.get('screen').height
export const screenWidth = Dimensions.get('screen').width

const CatalogScreen = ({route, navigation}) => {
    const { perfumes, perfumeBrands } = usePerfumeStore()
    const fetchPerfumes = usePerfumeStore((store) => (store.fetchPerfumes))
    const fetchBrands = usePerfumeStore((store) => (store.fetchBrands))
    const fetchTypes = usePerfumeStore((store) => (store.fetchTypes))
    const addToFavorites = usePerfumeStore((store) => (store.addToFavorites))
    const addToRecentlyViewed = usePerfumeStore((store) => (store.addToRecentlyViewed))
    const {userId, favoritePerfumes} = useAuthStore()
    const fetchFavorites = useAuthStore((store) => (store.fetchFavorites))
    const fetchRecentlyViewed = useAuthStore((store) => (store.fetchRecentlyViewed))
    const [filteredPerfumes, setFilteredPerfumes] = useState([])
    const {params} = route

    useEffect(() => {
        fetchFavorites(userId).then()
        fetchRecentlyViewed(userId).then()
    }, [])

    useEffect(() => {
        LogBox.ignoreAllLogs()
        // Получение списка парфюмов при загрузке компонента
        fetchPerfumes().then()
        fetchBrands().then()
        fetchTypes().then()
        if (params && params.filteredPerfumes) {
            setFilteredPerfumes(params.filteredPerfumes);
        } else {
            setFilteredPerfumes([]);
        }
    }, [route]);

    if (!perfumes || perfumes.length === 0) {
        // Отобразить индикатор загрузки или другое сообщение о загрузке
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#666" />
            </View>
        )
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

    const handlePress = async (perfumeId) => {
        await addToRecentlyViewed(userId, perfumeId)
        navigation.navigate('Perfume', {perfumeId: perfumeId})
    }

    const openFilters = () => {
        navigation.navigate('Фильтры')
    };

    return (
        <View style={{ flex: 1 }}>
            <ImageHeaderScrollView
                maxHeight={250}
                minHeight={0}
                headerImage={{uri: "https://i.pinimg.com/originals/33/ce/2c/33ce2c7e53599b65cc5d7251dd0b835e.png"}}>
                <ScrollView
                style={styles.container}
                nestedScrollEnabled={true}
                contentContainerStyle={styles.contentContainer}>
                    <View horizontal={true} style={{flexDirection:'row', marginTop:20}}>
                        <Text style={styles.title}>Каталог</Text>
                        <TouchableOpacity style={{marginLeft: 180}} onPress={openFilters}>
                            <Icon name={"tune-variant"} color="#000" borderRadius={2} type="material-community" size={30} />
                        </TouchableOpacity>
                    </View>
                    {filteredPerfumes[0] === "no one"
                        ?
                            <View style={{flex:1, margin: 10}}>
                                <Text style={styles.message}>По вашему запросу ничего не найдено</Text>
                            </View>
                        : <FlatList
                            style={styles.perfumeList}
                            renderItem={renderPerfumeItem}
                            contentContainerStyle={styles.perfumeList}
                            data={(!filteredPerfumes || filteredPerfumes.length === 0) ? perfumes["rows"] : filteredPerfumes}
                            numColumns={2}
                            key={Math.random().toString()}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    }
                    {(filteredPerfumes.length > 0)
                        ?
                            <View style={{flex:1, alignItems: 'flex-start', marginTop:20, marginBottom: 20}}>
                                <Text style={[styles.title, {fontSize: 22}]}>Вам также может понравиться</Text>
                                <FlatList
                                    style={styles.perfumeList}
                                    renderItem={renderPerfumeItem}
                                    contentContainerStyle={styles.perfumeList}
                                    data={perfumes["rows"]}
                                    numColumns={2}
                                    key={Math.random().toString()}
                                    keyExtractor={(item) => item.id.toString()}
                                />
                            </View>
                        : null
                    }
                </ScrollView>
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

export default CatalogScreen