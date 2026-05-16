import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../store/AuthContext";
import { lazy, Suspense, useEffect } from "react";
import { ActivityIndicator, BackHandler, Platform, View } from "react-native";
import { TrueSheetProvider } from "@lodev09/react-native-true-sheet";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { navigationRef } from "../utils/navigation";

// import Home from './Home';
// import Detail from "./Detail";
// import WebView from "./WebView";
// import Login from "./Login";
// import TangibleDetail from "./TangibleDetail";
// import ShoppingCart from "./ShoppingCart";
// import Chat from "./Chat";

const Fallback = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
    </View>
);

const ScreenLayout = ({ children }: any) => (
    <Suspense fallback={<Fallback />} >
        {children}
    </Suspense>
)

const Home = lazy(() => import('./Home'))
const Detail = lazy(() => import('./Detail'))
const Chat = lazy(() => import('./Chat'))
const WebView = lazy(() => import('./WebView'))
const Login = lazy(() => import('./Login'))
const TangibleDetail = lazy(() => import('./TangibleDetail'))
const ShoppingCart = lazy(() => import('./ShoppingCart'))

type RootStackParamList = {
    Home: undefined,
    Detail: undefined,
    WebView: undefined,
    Login: undefined,
    TangibleDetail: Record<string, any>,
    ShoppingCart: undefined,
    Chat: undefined,
}

const Stack = createStackNavigator<RootStackParamList>();

function MyStack({ componentKey, ...initialParams }: Record<string, any>) {
    const navigation = useNavigation();
    useEffect(() => {
        if (Platform.OS === 'android') {
            const onBackPress = () => {
                if (navigation.canGoBack()) {
                    navigation.goBack();
                    return true
                }
                return false;
            }
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => {
                subscription.remove()
            }
        }
    }, [navigation]);
    return (
        <Stack.Navigator
            initialRouteName={componentKey || 'Home'}
            screenOptions={
                {
                    headerStyle: {
                        backgroundColor: '#FF9800',
                    },
                    headerTitleAlign: 'center',
                    headerTintColor: '#FFF',
                    gestureEnabled: true,
                    cardStyle: {
                        flex: 1, // 设置flex: 1 或 height: '100%' web下的scroll才能正确应用到列表组件
                    },
                    ...TransitionPresets.SlideFromRightIOS
                }
            }
            screenLayout={ScreenLayout}
        >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Detail" component={Detail} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="WebView" component={WebView} />
            <Stack.Screen name="TangibleDetail"
                initialParams={initialParams}
                component={TangibleDetail}
                options={{
                    headerShown: false,
                }} />
            <Stack.Screen name="ShoppingCart" component={ShoppingCart} options={{
                headerTitle: '购物车'
            }} />
        </Stack.Navigator>
    );
}

const NavCenter = ({ componentKey, rootTag, ...rest }: { componentKey: string, rootTag: number, [key: string]: any }) => {
    return (
        <GestureHandlerRootView key={rootTag}>
            <AuthProvider>
                <KeyboardProvider>
                    <TrueSheetProvider>
                        {/** @ts-ignore **/}
                        <NavigationContainer ref={navigationRef} linking={{ enabled: 'auto' as any }}>
                            <MyStack componentKey={componentKey} {...rest} />
                        </NavigationContainer>
                    </TrueSheetProvider>
                </KeyboardProvider>
            </AuthProvider>
        </GestureHandlerRootView>
    )

}

export default NavCenter