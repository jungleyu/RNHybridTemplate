// import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import AsyncStorage from '@react-native-async-storage/async-storage'

// const authStorage = createAsyncStorage("auth");
const authStorage = AsyncStorage;

export {
    authStorage
}