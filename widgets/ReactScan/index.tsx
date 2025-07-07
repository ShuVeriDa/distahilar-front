"use client"

import { JSX, useEffect } from "react"
import { scan } from "react-scan/all-environments"

export function ReactScan(): JSX.Element {
	useEffect(() => {
		scan({
			enabled: true,
		})
	}, [])

	return <></>
}
