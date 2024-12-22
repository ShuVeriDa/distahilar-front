import { configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useSelector } from "react-redux"
import { persistReducer, persistStore, WebStorage } from "redux-persist"

import { modalReducer } from "./slices/model-slice/modalSlice"
import { userReducer } from "./slices/user-slice/userSlice"

import createWebStorage from "redux-persist/lib/storage/createWebStorage"
import { folderReducer } from "./slices/folderSlice/folderSlice"

function createPersistStorage(): WebStorage {
	const isServer = typeof window === "undefined"

	// Returns noop (dummy) storage.
	if (isServer) {
		return {
			getItem() {
				return Promise.resolve(null)
			},
			setItem() {
				return Promise.resolve()
			},
			removeItem() {
				return Promise.resolve()
			},
		}
	}

	return createWebStorage("local")
}

const persistConfig = {
	key: "root",
	storage: createPersistStorage(),
	whitelist: ["user", "folder"],
}

const persistedUserReducer = persistReducer(persistConfig, userReducer)
const persistedFolderReducer = persistReducer(persistConfig, folderReducer)

export const store = configureStore({
	reducer: {
		user: persistedUserReducer,
		modal: modalReducer,
		folder: persistedFolderReducer,
	},
	/**
	 * You cant set up more middlewares
	 * Check instruction: @see https://redux-toolkit.js.org/api/serializabilityMiddleware
	 */
	middleware: gDM => gDM({ serializableCheck: false }),
})

export const persistor = persistStore(store)

// Infer the type of makeStore
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
