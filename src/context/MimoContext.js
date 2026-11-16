import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { initialProducts } from '../data/initialProducts';
import { createUser, fetchProducts } from '../services/apiService';
import { readStoredGame, saveStoredGame } from '../utils/storage';

const MimoContext = createContext(null);
const clamp = (value) => Math.max(0, Math.min(100, value));
const starter = { food: 76, happiness: 82, energy: 68, hygiene: 74 };
const initialState = { user: null, pet: { name: '', stats: starter }, coins: 120, inventory: { apple: 2, soap: 1 }, history: [], interactions: 0, purchases: 0 };

export function MimoProvider({ children }) {
  const [state, setState] = useState(initialState); const [products, setProducts] = useState(initialProducts); const [loadingProducts, setLoadingProducts] = useState(false); const [apiMessage, setApiMessage] = useState(''); const [isHydrated, setIsHydrated] = useState(false);
  const saveGame = useCallback(async (next) => { try { await saveStoredGame(next); } catch (e) { setApiMessage('Não foi possível salvar os dados localmente.'); } }, []);
  useEffect(() => { readStoredGame().then((saved) => { if (saved) setState({ ...initialState, ...saved, pet: { ...initialState.pet, ...saved.pet, stats: { ...starter, ...saved.pet?.stats } } }); }).catch(() => setApiMessage('Não foi possível restaurar seu jogo.')).finally(() => setIsHydrated(true)); }, []);
  const commit = useCallback((updater) => setState((previous) => { const next = typeof updater === 'function' ? updater(previous) : updater; saveGame(next); return next; }), [saveGame]);
  const addHistoryEntry = useCallback((text, icon = '✨') => commit((s) => ({ ...s, history: [{ id: `${Date.now()}-${Math.random()}`, text, icon, date: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) }, ...s.history].slice(0, 40), interactions: s.interactions + 1 })), [commit]);
  const registerUser = useCallback(async (user, useApi = true) => { let savedUser = user; let source = 'Modo demonstração local'; if (useApi) { try { savedUser = await createUser(user); source = 'Cadastro enviado à MockAPI'; } catch (e) { setApiMessage('MockAPI indisponível: cadastro salvo localmente.'); } } commit((s) => ({ ...s, user: savedUser, pet: { ...s.pet, name: savedUser.petName }, history: [{ id: `${Date.now()}`, text: 'Você adotou seu Mimo!', icon: '🏡', date: 'agora' }] })); return source; }, [commit]);
  const updateUser = useCallback((user) => commit((s) => ({ ...s, user: { ...s.user, ...user }, pet: { ...s.pet, name: user.petName || s.pet.name } })), [commit]);
  const act = useCallback((key, delta, itemId, itemMessage, icon) => commit((s) => { if (itemId && !(s.inventory[itemId] > 0)) return s; const inventory = itemId ? { ...s.inventory, [itemId]: s.inventory[itemId] - 1 } : s.inventory; return { ...s, inventory, pet: { ...s.pet, stats: { ...s.pet.stats, [key]: clamp(s.pet.stats[key] + delta) } }, history: [{ id: `${Date.now()}`, text: itemMessage, icon, date: 'agora' }, ...s.history].slice(0, 40), interactions: s.interactions + 1 }; }), [commit]);
  const feedPet = useCallback((itemId = 'apple', itemName = 'uma comida') => act('food', 18, itemId, `Você alimentou o Mimo com ${itemName}.`, '🍎'), [act]);
  const playWithPet = useCallback(() => act('happiness', 15, null, 'Você brincou com o Mimo.', '🎈'), [act]);
  const bathePet = useCallback((itemId = 'soap', itemName = 'sabonete') => act('hygiene', 20, itemId, `O Mimo tomou banho com ${itemName}.`, '🫧'), [act]);
  const sleepPet = useCallback(() => commit((s) => ({ ...s, pet: { ...s.pet, stats: { ...s.pet.stats, energy: clamp(s.pet.stats.energy + 28) } }, history: [{ id: `${Date.now()}`, text: 'O Mimo tirou uma soneca restauradora.', icon: '🌙', date: 'agora' }, ...s.history], interactions: s.interactions + 1 })), [commit]);
  const purchaseProduct = useCallback((product) => { let result = false; commit((s) => { if (s.coins < product.price) return s; result = true; return { ...s, coins: s.coins - product.price, inventory: { ...s.inventory, [product.id]: (s.inventory[product.id] || 0) + 1 }, purchases: s.purchases + 1, history: [{ id: `${Date.now()}`, text: `Você comprou ${product.name}.`, icon: product.icon || '🛍️', date: 'agora' }, ...s.history].slice(0, 40) }; }); return result; }, [commit]);
  const loadProducts = useCallback(async () => { setLoadingProducts(true); setApiMessage(''); try { const remote = await fetchProducts(); if (!Array.isArray(remote)) throw new Error('Catálogo inválido'); setProducts(remote); setApiMessage('Produtos carregados pela MockAPI.'); } catch (e) { setProducts(initialProducts); setApiMessage('Modo demonstração: usando catálogo local (MockAPI não configurada ou indisponível).'); } finally { setLoadingProducts(false); } }, []);
  const value = useMemo(() => ({ ...state, products, loadingProducts, apiMessage, isHydrated, registerUser, updateUser, feedPet, playWithPet, bathePet, sleepPet, purchaseProduct, loadProducts, addHistoryEntry, saveGame: () => saveGame(state), loadGame: async () => setState(await readStoredGame()), clearMessage: () => setApiMessage('') }), [state, products, loadingProducts, apiMessage, isHydrated, registerUser, updateUser, feedPet, playWithPet, bathePet, sleepPet, purchaseProduct, loadProducts, addHistoryEntry, saveGame]);
  return <MimoContext.Provider value={value}>{children}</MimoContext.Provider>;
}
export const useMimo = () => useContext(MimoContext);
