// Add "playlistsaver-" prefix to playlist uri to avoid any collison LocalStorage
function URIToString(playlistID: string) {
	return "playlistsaver-" + playlistID;
}

// Fetch a songs list of a playlist
async function fetchPlaylistTracks(uri: any) {
	const res = await Spicetify.CosmosAsync.get(`sp://core-playlist/v1/playlist/${uri}/rows`, {
		policy: { link: true, playable: true },
	});
	return res.rows.filter((track: any) => track.playable).map((track: any) => track.link);
}

// If song is added to queue from the same playlist or from an other one,
// the state of the saved playlist should not change
function isManuallyAddedToQueue() {
	try {
    console.log(Spicetify.Queue.track["provider"]);
		return Spicetify.Queue.track["provider"] == "queue";
	} catch (TypeError) {
		return false;
	}
}

function saveCurrentSong() {
	if (isManuallyAddedToQueue()) {
		return;
	}
	let playlistURI = Spicetify.URI.fromString(Spicetify.Player.data.context["uri"]);
	let trackURI = Spicetify.URI.fromString(Spicetify.Player.data.item.uri);
	if (playlistURI.toString()) {
		Spicetify.LocalStorage.set(URIToString(playlistURI.toString()), trackURI.toString());
	}
}

// TODO: Change the logic of playing the specific track in the playlist
// TODO: handle the case where a song has many occurences in a playlist
async function playSavedSong(uri: any) {
	let playlistURI = Spicetify.URI.fromString(uri[0]);
	let trackURI = Spicetify.LocalStorage.get(URIToString(playlistURI.toString()));
	// Check if playlist is not saved (aka never played)
	if (!trackURI) {
		Spicetify.showNotification("Playlist not saved!", false, 2000);
		return;
	}
	let trackList = await fetchPlaylistTracks(playlistURI);
	let indexOfLastPlayedSong = trackList.indexOf(trackURI);
	// The last played song has been removed from the playlist
	await Spicetify.Player.playUri(playlistURI.toString());
	if (indexOfLastPlayedSong == -1) {
		Spicetify.showNotification("The saved song has been removed from the playlist!", false, 2000);
		return;
	}
	Spicetify.Player.removeEventListener("songchange", saveCurrentSong);
	Spicetify.Player.pause();
	for (let skipNumber = 0; skipNumber < indexOfLastPlayedSong; skipNumber++) {
		Spicetify.Player.next();
	}
	Spicetify.Player.addEventListener("songchange", saveCurrentSong);
	Spicetify.Player.play();
	return;
}

// Determine if the selected item is a playlist page
function isItemPlaylist(uri: any) {
	let playlistURI = Spicetify.URI.fromString(uri[0]);
	return playlistURI.type == Spicetify.URI.Type.PLAYLIST || playlistURI.type == Spicetify.URI.Type.PLAYLIST_V2;
}

async function main() {
	if (!(Spicetify.CosmosAsync && Spicetify.Platform)) {
		setTimeout(main, 300);
		return;
	}
	Spicetify.Player.addEventListener("songchange", saveCurrentSong);
	const menuItem = new Spicetify.ContextMenu.Item("Resume playlist from last played song", playSavedSong, isItemPlaylist, "play", false);
	menuItem.register();
}

export default main;
