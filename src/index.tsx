import {
	ButtonItem,
	definePlugin,
	PanelSection,
	PanelSectionRow,
	ServerAPI,
	staticClasses,
	ToggleField,
} from "decky-frontend-lib"
import React, { useState } from "react"
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi"

import {
	EXCLUDE_COLLECTION_IDS,
	loadAutoLaunch,
	navigateToRandomGame,
	saveAutoLaunch,
} from "./utils"

const DeckRoulette = ({ serverApi }: { serverApi: ServerAPI }) => {
	const { collectionStore }: { collectionStore: CollectionStore } =
		window as any

	const collections = collectionStore.userCollections

	const localGames: SteamCollection = collectionStore.localGamesCollection

	const allInstalled = [
		...localGames.visibleApps,
		...collectionStore.deckDesktopApps.visibleApps,
	]

	const myGamesCollection = collectionStore.myGamesCollection

	const installedIds = new Set(allInstalled.map((app) => app.appid))

	const [autoLaunch, setAutoLaunch] = useState<boolean>(loadAutoLaunch())

	/* Uncomment to enable in-plugin custom lists
	const [customLists, setCustomLists] = useState<{
		[key: string]: number[]
	}>()
	const [editingList, setEditingList] = useState<{
		listName?: string
		appIds: number[]
	}>()

	useEffect(() => {
		serverApi
			.callPluginMethod<{}, { [key: string]: number[] }>(
				"get_game_lists",
				{}
			)
			.then((res) => {
				console.log(res)
				if (!res.success) return
				setCustomLists(res.result)
			})
	}, [])

	if (editingList)
		return (
			<ListEditor
				currentName={editingList.listName}
				currentList={editingList.appIds}
				setEditingList={setEditingList}
				serverApi={serverApi}
				setCustomLists={setCustomLists}
			/>
		)
  */

	return (
		<div>
			<PanelSection title="Random Game">
				<PanelSectionRow>
					<ToggleField
						label="Auto-launch game"
						description="Launch the random game right away (installed games only)"
						checked={autoLaunch}
						onChange={(value) => {
							setAutoLaunch(value)
							saveAutoLaunch(value)
						}}
					/>
				</PanelSectionRow>
				{localGames ? (
					<PanelSectionRow>
						<ButtonItem
							layout="below"
							onClick={() =>
								navigateToRandomGame(
									allInstalled.map((app) => app.appid),
									autoLaunch,
									installedIds
								)
							}
						>
							{localGames.displayName} ({allInstalled.length})
						</ButtonItem>
					</PanelSectionRow>
				) : null}
				<PanelSectionRow>
					<ButtonItem
						layout="below"
						onClick={() =>
							navigateToRandomGame(
								myGamesCollection.visibleApps.map(
									(app) => app.appid
								),
								autoLaunch,
								installedIds
							)
						}
					>
						{myGamesCollection.displayName} (
						{myGamesCollection.visibleApps.length})
					</ButtonItem>
				</PanelSectionRow>
			</PanelSection>
			{/* <PanelSection title="Custom Game Lists">
				{customLists
					? Object.entries(customLists).map(([listName, appIds]) => (
							<PanelSectionRow key={listName}>
								<CustomListItem
									onSelect={() =>
										navigateToRandomGame(appIds)
									}
									onEdit={() =>
										setEditingList({ listName, appIds })
									}
									onDelete={() =>
										serverApi
											.callPluginMethod(
												"delete_game_list",
												{ name: listName }
											)
											.then((res) => {
												if (res.success)
													setCustomLists(res.result)
											})
									}
								>
									<span>
										{listName} ({appIds.length})
									</span>
								</CustomListItem>
							</PanelSectionRow>
					  ))
					: null}
				<PanelSectionRow>
					<ButtonItem
						layout="below"
						onClick={() => {
							showModal(
								<ListNameModal
									initialText=""
									onOK={(listName) =>
										setEditingList({ listName, appIds: [] })
									}
								/>
							)
						}}
					>
						Add New List
					</ButtonItem>
				</PanelSectionRow>
			</PanelSection> */}
			<PanelSection title="Steam Collections">
				{collections.map((collection) => (
					<React.Fragment key={collection.id}>
						{EXCLUDE_COLLECTION_IDS.includes(
							collection.id
						) ? null : (
							<PanelSectionRow>
								<ButtonItem
									layout="below"
									onClick={() =>
										navigateToRandomGame(
											collection.visibleApps.map(
												(app) => app.appid
											),
											autoLaunch,
											installedIds
										)
									}
								>
									{collection.displayName} (
									{collection.visibleApps.length})
								</ButtonItem>
							</PanelSectionRow>
						)}
					</React.Fragment>
				))}
			</PanelSection>
		</div>
	)
}

export default definePlugin((serverApi: ServerAPI) => {
	return {
		title: <div className={staticClasses.Title}>DeckRoulette</div>,
		content: <DeckRoulette serverApi={serverApi} />,
		icon: <GiPerspectiveDiceSixFacesRandom />,
		alwaysRender: false,
		onDismount() {},
	}
})
