import React, { useState, useEffect } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import {findBrandnameById, findTypenameById, usePerfumeStore} from "../data/PerfumeStore";
import {screenWidth} from "./CatalogScreen";
import {useNavigation} from "@react-navigation/native";

const FiltersScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [genderFilter, setGenderFilter] = useState([]);
    const [brandFilter, setBrandFilter] = useState([]);
    const [typeFilter, setTypeFilter] = useState([]);
    const [filteredPerfumes, setFilteredPerfumes] = useState([]);
    const { perfumes, perfumeTypes, perfumeBrands } = usePerfumeStore()
    const navigation = useNavigation()

    // Функция для фильтрации и сортировки парфюмов
    const filterAndSortPerfumes = (perfumes, searchText, genderFilters, brandFilters, typeFilters) => {
        return perfumes["rows"].filter(perfume => {
            // Проверяем соответствие поисковому запросу
            const isMatchingSearch = !searchText || perfume.name.toLowerCase().includes(searchText.toLowerCase())
            // Проверяем соответствие гендерным фильтрам
            const isMatchingGender = genderFilters.length === 0 || genderFilters.includes(perfume.gender)
            // Проверяем соответствие фильтрам по бренду
            const isMatchingBrand = brandFilters.length === 0 || brandFilters.includes(findBrandnameById(perfume.brandId, perfumeBrands))
            // Проверяем соответствие фильтрам по типу
            const isMatchingType = typeFilters.length === 0 || typeFilters.includes(findTypenameById(perfume.typeId, perfumeTypes))


            return isMatchingSearch && isMatchingGender && isMatchingBrand && isMatchingType;
        }).sort((a, b) => {
            // Сортировка по количеству совпадений характеристик парфюма с фильтром
            const countMatchA = (a.name.toLowerCase().match(new RegExp(searchText.toLowerCase(), 'g')) || []).length;
            const countMatchB = (b.name.toLowerCase().match(new RegExp(searchText.toLowerCase(), 'g')) || []).length;

            return countMatchB - countMatchA;
        })
    }

    useEffect(() => {
        // Фильтрация и сортировка парфюмов при изменении критериев поиска
        const filtered = filterAndSortPerfumes(perfumes, searchText, genderFilter, brandFilter, typeFilter);
        setFilteredPerfumes(filtered);
    }, [perfumes, searchText, genderFilter, brandFilter, typeFilter]);

    const handleSubmit = () => {
        console.log(brandFilter)
        if (filteredPerfumes.length === 0) {
            navigation.navigate('Каталог', {filteredPerfumes: ["no one"]})
        } else {
            navigation.navigate('Каталог', {filteredPerfumes: filteredPerfumes})
        }
    }
    const handleCancel = () => {
        setFilteredPerfumes([])
        setTypeFilter([])
        setBrandFilter([])
        setSearchText([])
        setGenderFilter([])
        navigation.navigate('Каталог', {filteredPerfumes: []})
    }

    return (
        <View initialScrollEnabled={false} style={styles.container}>
            <TextInput
                placeholder={"Название"}
                value={searchText}
                onChangeText={setSearchText}
                style={styles.nameSearch}
            />
            <View style={{margin: 15, width: "95%"}}>
                {/* Выпадающий список для выбора гендерной принадлежности */}
                <MultipleSelectList
                    data={['Для мужчин', 'Для женщин', 'Унисекс']}
                    setSelected={setGenderFilter}
                    placeholder={"Для кого"}
                    label={"Для кого"}
                    save="value"
                    search={false}
                />
                {/* Выпадающий список для выбора бренда */}
                <MultipleSelectList
                    data={!perfumeBrands ? ["Загрузка..."] : (perfumeBrands.map((brand) => brand.name)).sort()}
                    setSelected={(val) => setBrandFilter(val)}
                    placeholder={"Бренд"}
                    label={"Бренд"}
                    save="value"
                    search={false}
                />
                {/* Выпадающий список для выбора типа парфюма */}
                <MultipleSelectList
                    data={!perfumeTypes ? ["Загрузка..."] : (perfumeTypes.map((type) => type.name)).sort()}
                    setSelected={setTypeFilter}
                    placeholder={"Тип"}
                    label={"Тип"}
                    save="value"
                    search={false}
                />
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} >
                <Text style={styles.buttonText}>Применить</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleCancel} >
                <Text style={styles.buttonText}>Сбросить фильтры</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    nameSearch: {
        margin: 10,
        padding: 5,
        width: '95%',
        height: 40,
        borderWidth: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        borderColor: "#000"
    },
    submitButton: {
        borderColor: "#1B198F",
        borderWidth: 1,
        paddingVertical: 10,
        borderRadius: 10,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
    },
    buttonText: {
        color: '#1B198F',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ccc',
    },
});

export default FiltersScreen