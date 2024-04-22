import { StatusBar } from 'expo-status-bar'
import 'react-native-gesture-handler'
import {StyleSheet, Text, View, Button, AppRegistry} from 'react-native'
import {useEffect} from "react"
import {NavigationContainer} from "@react-navigation/native"
import CatalogScreen from "../src/screens/CatalogScreen"
import LoginScreen from "../src/screens/LoginScreen"
import HeaderNavigator from "../src/navigator/HeaderNavigator"
import useAuthStore from "../src/data/UserStore"
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import RegistrationScreen from "../src/screens/RegistrationScreen"
import FavoritesScreen from "../src/screens/FavoritesScreen"
import FiltersScreen from "../src/screens/FiltersScreen"
import PerfumeScreen from "../src/screens/PerfumeScreen";

const Stack = createNativeStackNavigator()

export default function App() {
    const checkAuthentication = useAuthStore((state) => state.checkAuthentication)

    useEffect(() => {
        // Проверяем аутентификацию при загрузке приложения
        checkAuthentication().then()
    }, [])

    const { user } = useAuthStore()

    if (!user) {
        return (
            <NavigationContainer independent={true}>
                <Stack.Navigator>
                    <Stack.Screen name="Вход" component={LoginScreen}/>
                    <Stack.Screen name="Регистрация" component={RegistrationScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }

    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator>
                <Stack.Screen
                    name="Каталог"
                    component={CatalogScreen}
                    options={{header: () => <HeaderNavigator/>}}
                />
                <Stack.Screen
                    name="Фильтры"
                    component={FiltersScreen}
                    options={{
                        cardOverlayEnabled: true,
                        // presentation: 'modal',
                        animation: 'slide_from_right'
                    }}
                />
                <Stack.Screen
                    name="Избранное"
                    component={FavoritesScreen}
                    options={{
                        header: () => <HeaderNavigator/>,
                        animation: 'fade_from_bottom'
                }}
                />
                <Stack.Screen
                    name="Perfume"
                    component={PerfumeScreen}
                    options={{
                        //header: () => <HeaderNavigator/>,
                        headerShown: false,
                        animation: 'fade_from_bottom',
                        presentation: 'modal',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

