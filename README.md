# Mimo — Meu Bichinho Virtual

Aplicativo mobile casual feito com React Native + Expo. O usuário adota um Mimo, acompanha seus indicadores, alimenta, brinca, dá banho, compra itens e consulta seu diário.

## Rodar localmente

```bash
npm install
npx expo start
```

Abra o QR Code no Expo Go. O projeto usa `App.js` como entrada e não usa Expo Router.

## MockAPI

1. Crie um projeto em [mockapi.io](https://mockapi.io).
2. Crie os recursos `users` e `products`.
3. Use os campos indicados abaixo.
4. Cole a URL base gerada em `src/config/api.js`, na constante `API_BASE_URL`.

Enquanto a URL estiver vazia, o app exibe claramente o modo demonstração e usa o catálogo local de `src/data/initialProducts.js`. O cadastro tenta o POST real quando a URL está configurada; se a API falhar, os dados são mantidos localmente.

`users`: `name`, `email`, `nickname`, `petName`, `createdAt`.

`products`: `name`, `description`, `category`, `price`, `icon`.

## Estrutura técnica

| Recurso | Arquivo |
| --- | --- |
| Drawer Navigator personalizado | `src/navigation/AppNavigator.js` |
| `createContext` / Provider | `src/context/MimoContext.js` |
| `useContext` / hook `useMimo` | `src/context/MimoContext.js` |
| Props e desestruturação | `ProductCard`, `Header`, `StatusBar`, `ActionButton` |
| Callback filho → pai | `ProductCard` chama `onPurchase(product)` |
| Picker + filtro | `src/screens/ShopScreen.js` |
| FlatList | Loja e Diário |
| Fetch GET | `src/services/apiService.js` / `loadProducts` |
| Fetch POST | `src/services/apiService.js` / `registerUser` |
| Validação | `src/utils/validations.js` |
| Persistência AsyncStorage | `src/utils/storage.js` e `MimoContext` |
| Animações nativas | `src/components/MimoCharacter` |

## Transferir para Expo Snack

Crie um Snack em branco, replique `App.js` e a pasta `src/`, e adicione as dependências do `package.json` pelo painel de dependências. Para o Drawer, adicione também as dependências peer listadas no arquivo. Cole a URL da MockAPI somente se quiser validar o GET/POST real. O Snack ainda precisa ser validado manualmente em um dispositivo ou emulador; esta cópia local não declara validação no Snack.

## Checklist de validação

- [x] Quatro telas principais e navegação por Drawer.
- [x] Cadastro, edição, validação e fallback local.
- [x] Estado global compartilhado entre loja, casa e diário.
- [x] Inventário, moedas, ações e histórico persistidos.
- [x] Picker e FlatList com filtro funcional.
- [x] Compartilhamento usando `Share`.
- [ ] POST/GET contra uma MockAPI específica: depende de configurar `API_BASE_URL`.
- [ ] Execução no Expo Go/Snack: depende do ambiente/dispositivo disponível.
