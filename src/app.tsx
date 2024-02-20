// Add "resumeplaylist-" prefix to playlist uri to avoid any collison in LocalStorage
function URIToString(playlistID: string) {
	return "resumeplaylist-" + playlistID;
}

// If song is added to queue from the same playlist or from an other one, the state of the saved playlist should not change
function isManuallyAddedToQueue() {
	try {
		return Spicetify.Queue.track["provider"] == "queue" || !Spicetify.Player.data.index.itemIndex;
	} catch (TypeError) {
		return false;
	}
}

function saveCurrentSong() {
	if (isManuallyAddedToQueue()) {
		return;
	}
	let playlistURI = Spicetify.URI.fromString(Spicetify.Player.data.context["uri"]);
	let currentSongIndex = Spicetify.Player.data.index.itemIndex;
	if (playlistURI.toString()) {
		// This is a shower thought where i realized that it's better to save the index of the currently playing song,
		// this will prevent us later from fetching the playlist track list
		Spicetify.LocalStorage.set(URIToString(playlistURI.toString()), String(currentSongIndex));
	}
}

async function playSavedSong(uri: any) {
	let playlistURI = Spicetify.URI.fromString(uri[0]);
	let songIndex = Spicetify.LocalStorage.get(URIToString(playlistURI.toString()));
	// Check if playlist is not saved (aka never played)
	if (!songIndex) {
		Spicetify.showNotification("Playlist not saved!", false, 2000);
		return;
	}
	await Spicetify.Player.playUri(playlistURI.toString(), {}, { skipTo: { index: parseInt(songIndex) } });
	return;
}

// Determine if the selected item is a playlist page
function shouldButtonBeDisplayed(uri: any) {
	let playlistURI = Spicetify.URI.fromString(uri[0]);
	return (
		playlistURI.type == Spicetify.URI.Type.PLAYLIST ||
		playlistURI.type == Spicetify.URI.Type.PLAYLIST_V2 ||
		playlistURI.type == Spicetify.URI.Type.ALBUM
	);
}

async function main() {
	if (!(Spicetify.CosmosAsync && Spicetify.Platform)) {
		setTimeout(main, 300);
		return;
	}
	Spicetify.Player.addEventListener("songchange", saveCurrentSong);
	const menuItem = new Spicetify.ContextMenu.Item(
		"Resume playlist from last played song",
		playSavedSong,
		shouldButtonBeDisplayed,
		"play",
		false
	);
	menuItem.register();
}

export default main;
