import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, ScrollView, Text, Alert} from 'react-native'
import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view';
import {apiUrl} from "../consts";
import {Image} from "expo-image"
import {
    usePerfumeStore,
    findBrandnameById,
    findTypenameById
} from '../data/PerfumeStore'
import {screenHeight, screenWidth} from "./CatalogScreen";
import {Icon} from "react-native-elements";
import useAuthStore from "../data/UserStore";
import { Rating } from '@kolking/react-native-rating';

const PerfumeScreen = ({route, navigation}) => {
    const [perfumeId, setPerfumeId] = useState()
    const { perfumes, perfumeBrands, perfumeTypes, rating} = usePerfumeStore()
    const addToFavorites = usePerfumeStore((store) => (store.addToFavorites))
    const getRating = usePerfumeStore((store) => (store.getRating))
    const fetchFavorites = useAuthStore((store) => (store.fetchFavorites))
    const ratePerfume = useAuthStore((store) => (store.ratePerfume))
    const {userId, favoritePerfumes, recentlyViewedPerfumes} = useAuthStore()
    const addToRecentlyViewed = usePerfumeStore((store) => (store.addToRecentlyViewed))

    const fetchPerfumeById = usePerfumeStore((store) => (store.fetchPerfumeById))
    const {foundPerfume} = usePerfumeStore()

    useEffect(() => {
        setPerfumeId(route.params.perfumeId)
        if (perfumeId) {fetchPerfumeById(perfumeId).then()}
        getRating(perfumeId).then()
    }, [perfumeId])

    if (!foundPerfume || foundPerfume.length === 0) {
        // Отобразить индикатор загрузки или другое сообщение о загрузке
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#A9DEF9" />
            </View>
        )
    }

    const handlePress = async (perfumeId) => {
        await addToRecentlyViewed(userId, perfumeId)
        navigation.push('Perfume', {perfumeId: perfumeId})
    }

    const navigateToCatalog = async () => {
        navigation.navigate('Каталог')
    }

    const renderPerfumeItem = ({ item }) => (
        <TouchableOpacity style={styles.perfumeItem} onPress={() => handlePress(item.id)}>
            <TouchableOpacity onPress={async () => {
                await addToFavorites(userId, item.id)
                fetchFavorites(userId).then()
            }} style={styles._favoritesButton}>
                <Icon name={favoritePerfumes.find((perfume) => perfume.id === item.id) ? "heart" : "heart-outline"} color="#000" borderRadius={2} type="material-community" size={20} />
            </TouchableOpacity>
            <Image source={{ uri: apiUrl + item.picture }} style={styles._perfumeImage} />
            <View style={styles.perfumeInfo}>
                <Text style={styles._perfumeBrand}>
                    {
                        perfumeBrands.length > 0 ? findBrandnameById(item.brandId, perfumeBrands).toString() : "Загрузка..."
                    }
                </Text>
                <Text style={styles._perfumeName}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.perfumeDetails}>
                <TouchableOpacity onPress={async () => {
                    await addToFavorites(userId, foundPerfume.id)
                    fetchFavorites(userId).then()
                }} style={styles.favoritesButton}>
                    <Icon name={favoritePerfumes.find((perfume) => perfume.id === foundPerfume.id) ? "heart" : "heart-outline"} color='#1B198F' type="material-community" size={40} />
                </TouchableOpacity>
                <TouchableOpacity onPress={navigateToCatalog} style={styles.catalogButton}>
                    <Icon name={'magnify'} color='#1B198F' type="material-community" size={40} />
                </TouchableOpacity>
                <Text style={styles.perfumeType}>{findTypenameById(foundPerfume.typeId, perfumeTypes)}</Text>
                <Text style={styles.perfumeBrand}>{findBrandnameById(foundPerfume.brandId, perfumeBrands)}</Text>
                <View style={styles.rating}>
                    <Rating
                        size={20}
                        rating={rating}
                        onChange={(value) => {
                            ratePerfume(userId, value, perfumeId).then()
                            getRating(perfumeId).then()
                            Alert.alert(`Ваша оценка: ${value}`, 'Спасибо!')
                        }}
                        fillColor={"#1B198F"}
                        touchColor={"#1B198F"}
                    />
                    <Text style={[styles.message, {color: '#1B198F', marginLeft: 20, fontWeight: 600}]}>{rating}/5</Text>
                </View>
                <Image source={{ uri: apiUrl + foundPerfume.picture }} style={styles.perfumeImage} />
                <Text style={styles.perfumeName}>{foundPerfume.name}</Text>
            </View>
            <View style={styles.perfumeInfoContainer}>
                <Text style={styles.title}>Описание</Text>
                <Text style={styles.info}>{foundPerfume.info}</Text>
            </View>
            <View style={styles.perfumeInfoContainer}>
                <Text style={styles.title}>Основные аккорды</Text>
                <Image source={{ uri: apiUrl + foundPerfume.picture_pyramid }} style={styles.notesImage} />
            </View>
            <View style={styles.perfumeInfoContainer}>
                <Text style={styles.title}>Вам также может понравиться</Text>
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    contentContainer: {
        justifyContent: 'center',
    },
    perfumeDetails: {
        marginTop: 20,
        padding: 20,
        borderColor: '#1B198F',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    favoritesButton: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    catalogButton: {
        position: 'absolute',
        right: 60,
        top: 12,
    },
    perfumeType: {
        fontSize: 18,
        fontWeight: '200',
        color: '#000',
        //color: '#D4A3E2',
        position: 'absolute',
        left: 10,
        top: 12,
    },
    perfumeBrand: {
        fontSize: 20,
        fontWeight: '400',
        color: '#000',
        // color: '#D4A3E2',
        position: 'absolute',
        left: 10,
        top: 35,
    },
    rating: {
        flexDirection: 'row',
        position: 'absolute',
        left: 10,
        top: 50,
    },
    perfumeImage: {
        flex: 1,
        width: screenWidth/2,
        height: screenHeight/3,
        marginTop: 70,
        borderRadius: 5,
        justifyContent: 'space-around',
        //alignItems: 'space-between',
        resizeMode: 'contain',
    },
    perfumeName: {
        marginRight: 0,
        fontSize: 25,
        fontWeight: 'bold',
        color: '#000',
    },
    perfumeInfoContainer: {
        padding: 20,
        borderColor: '#1B198F',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 10,
        color: '#000'
    },
    info: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    notesImage: {
        flex: 1,
        width: 250,
        height: 250,
        justifyContent: 'space-around',
        resizeMode: 'contain',
    },
    perfumeList: {
        backgroundColor: '#ffffff',
        flexGrow: 1,
        width: '100%',
        flex: 1,
        marginRight: 20,
    },
    perfumeItem: {
        height: screenHeight/3,
        width: screenWidth/2.8,
        marginBottom: 5,
        marginRight: 20,
        marginLeft: 7,
        // borderBottomWidth: 1,
        // borderBottomColor: '#ccc',
    },
    perfumeInfo: {
        flex: 1,
    },
    loadingContainer: {
        justifyContent: 'center',
    },
    _title: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 20,
        marginLeft: 10,
        color: '#000'
    },
    _perfumeList: {
        backgroundColor: '#ffffff',
        width: '100%',
        flex: 1,
    },
    _perfumeItem: {
        height: screenHeight/3,
        width: screenWidth/2.8,
        marginBottom: 0,
        marginRight: 20,
        marginLeft: 20,
    },
    _perfumeInfo: {
        flex: 1,
    },
    _perfumeImage: {
        flex: 1,
        width: screenWidth/4,
        height: screenHeight/6,
        justifyContent: "center",
        alignItems: 'center',
        marginRight: 10,
        marginTop: 20,
    },
    _perfumeName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000'
    },
    _perfumeBrand: {
        fontSize: 16,
        fontWeight: '300',
        color: '#666',
    },
    _favoritesButton: {
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
    },
})

export default PerfumeScreen;