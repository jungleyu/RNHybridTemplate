import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';

import Home from './screen/Home';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
    return (
        <SafeAreaProvider>
            <GestureHandlerRootView>
                <NavigationContainer>
                    <Home />
                </NavigationContainer>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}