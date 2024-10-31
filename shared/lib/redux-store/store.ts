import { configureStore } from "@reduxjs/toolkit"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { userReducer } from "./slices/user-slice/userSlice"

const persistConfig = {
	key: "root",
	storage: storage,
	whitelist: ["user"],
}

const persistedUserReducer = persistReducer(persistConfig, userReducer)

export const store = configureStore({
	reducer: {
		user: persistedUserReducer,
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
