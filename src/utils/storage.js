import AsyncStorage from '@react-native-async-storage/async-storage';
export const STORAGE_KEY = '@mimo/game';
export const saveStoredGame = (game) => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(game));
export const readStoredGame = async () => { const raw = await AsyncStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; };
