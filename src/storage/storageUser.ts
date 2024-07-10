import AsyncStorage from "@react-native-async-storage/async-storage";

import { UserDTO } from "@dtos/UserDTO";
import { USER_STORAGE } from "./storageConfig";

//Armazena usuário no Storage
export async function storageUserSave(user: UserDTO) {
    await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
}

//Recupera usuário do Storage
export async function storageUserGet() {
    const storage = await AsyncStorage.getItem(USER_STORAGE);

    const user: UserDTO = storage ? JSON.parse(storage) : {};

    return user;
}

//Remove o usuário logado do storage
export async function storageUserRemove() {
    await AsyncStorage.removeItem(USER_STORAGE);
}