import { createAsyncStorage } from "@react-native-async-storage/async-storage";

const authStorage = createAsyncStorage("auth");

export {
    authStorage
}