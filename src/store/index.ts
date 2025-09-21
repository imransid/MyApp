import {configureStore, combineReducers} from '@reduxjs/toolkit';
import type {Middleware} from 'redux';
import placesReducer from './places/placesSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  persistStore,
  persistReducer,
  PersistConfig,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import {placesMinimalTransform} from './persistTransform';
import {createLogger} from 'redux-logger';

/** Root reducer */
const rootReducer = combineReducers({
  places: placesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

/** Persist config (typed) */
const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage: AsyncStorage,
  version: 1,
  whitelist: ['places'],
  transforms: [placesMinimalTransform],
};

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

/**
 * Explicitly type the logger middleware as `Middleware`.
 * This helps TypeScript treat it uniformly when we build an array
 * (so concat always receives an array, not `Middleware | never[]`).
 */
const loggerMiddleware: Middleware = createLogger({collapsed: true});

/**
 * Configure store.
 *
 * Key points:
 * - getDefaultMiddleware(...) returns a typed tuple of middleware.
 * - We always pass an array to .concat(...) — either [loggerMiddleware] or [].
 *   That keeps the concat argument's type stable (Middleware[]), which TS accepts.
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(__DEV__ ? [loggerMiddleware] : []),
  devTools: __DEV__,
});

export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

export default store;
