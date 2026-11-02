import { Router } from "decky-frontend-lib"

export const EXCLUDE_COLLECTION_IDS = ["local-install", "uncategorized"]

const AUTO_LAUNCH_KEY = "deck-roulette-auto-launch"

export const randomIndex = (max: number) => Math.floor(Math.random() * max)

export const loadAutoLaunch = (): boolean => {
	try {
		return window.localStorage.getItem(AUTO_LAUNCH_KEY) === "true"
	} catch (e) {
		return false
	}
}

export const saveAutoLaunch = (value: boolean) => {
	try {
		window.localStorage.setItem(AUTO_LAUNCH_KEY, value ? "true" : "false")
	} catch (e) {
		console.error("DeckRoulette: could not save setting", e)
	}
}

const launchGame = (appId: number) => {
	try {
		const { appStore }: { appStore?: AppStore } = window as any
		const overview = appStore?.GetAppOverviewByAppID(appId)
		// m_gameid also covers non-Steam shortcuts; plain appid is the fallback
		const gameId = overview?.m_gameid ? String(overview.m_gameid) : String(appId)
		SteamClient.Apps.RunGame(gameId, "", -1, 100)
	} catch (e) {
		console.error("DeckRoulette: failed to launch game", e)
	}
}

export const navigateToRandomGame = (
	appIds: number[],
	autoLaunch: boolean = false,
	installedIds: Set<number> = new Set()
) => {
	if (!appIds.length) return
	const randomAppId = appIds[randomIndex(appIds.length)]
	Router.Navigate(`/library/app/${randomAppId}`)
	Router.CloseSideMenus()
	// Only auto-launch installed games; uninstalled ones just open their page
	if (autoLaunch && installedIds.has(randomAppId)) {
		launchGame(randomAppId)
	}
}
