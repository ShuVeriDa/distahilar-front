"use client"

import { ReactNode } from "react"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { persistor, store } from "../lib/redux-store/store"

export default function StoreProvider({ children }: { children: ReactNode }) {
	// const storeRef = useRef<AppStore>();
	// if (!storeRef.current) {
	//   // Create the store instance the first time this renders
	//   storeRef.current = store();
	// }

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				{children}
			</PersistGate>
		</Provider>
	)
}
