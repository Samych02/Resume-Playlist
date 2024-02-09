# Playlist Saver

Ever played a big playlist but couldn't remember the last song when you wanted to resume the playlist at a later time? That's what this extension do.

## Features

- Play from the last played song in a playlist.
  [![image.png](https://i.postimg.cc/WbTsw9M8/image.png)](https://postimg.cc/ThN8RJN5)

## Issues

- Does not work with "Liked songs" playlist (can't do anything about it).
- Should change the way of playing the last song (what currently happens is that the playlist is played from the first song and then skipping songs until the saved one).

## Installation

1- Download the extension from the release page or from this [link](https://github.com/Samych02/Playlist-Saver/releases/latest/download/playlist-saver.js).<br>
2- Copy the downloaded file (named playlist-saver.js) to:
| **Platform** | **Path** |
|-----------------|----------------------------------------|
| **MacOs/Linux** | `~/.config/spicetify/Extension` |
| **Windows** | `%appdata%\spicetify\Extension` |

3- run the following commands:

```sh
spicetify config extensions playlist-saver
spicetify apply
```

## Docs

Check out [Spicetify's docs](https://spicetify.app/docs/development/spicetify-creator/the-basics)!

## Made with Spicetify Creator

- https://github.com/spicetify/spicetify-creator
