import React, { Component } from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

/**
 * Main Application component,
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'searchResults': [{name: 'Tiny Dancer', artist: 'Elton John',
        album: 'Madman Across The Water', id: 0}, {name: 'Tiny Dancer',
        artist: 'Tim McGraw', album: 'Love Story', id: 1}, {name: 'Tiny Dancer',
        artist: 'Rockabye Baby!', album: 'Lullaby Renditions of Elton John',
        id: 2}, {name: 'Tiny Dancer', artist: 'The White Raven',
        album: 'Tiny Dancer', id: 3}, {name: 'Tiny Dancer - Live Album Version',
        artist: 'Ben Folds', album: 'Ben Folds Live', id: 4}],
      'playlistName': 'New Playlist',
      'playlistTracks': [{name: 'Stronger',
        artist: 'Britney Spears', album: 'Oops!... I Did It Again', id: 5},
        {name: 'So Emotional', artist: 'Whitney Houston', album: 'Whitney',
        id: 6}, {name: 'It\'s Not Right But It\'s Okay', artist: 'Whitney Houston',
        album: 'My Love Is Your Love', id: 7}]
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let inListAlready = false;
    for (let i = 0; i < this.state.playlistTracks.length; i++) {
      if (this.state.playlistTracks[i].id === track.id) {
        inListAlready = true;
      }
    }
    if (!inListAlready) {
      const updatedPlaylist = [];
      for (let i = 0; i < this.state.playlistTracks.length; i++) {
        updatedPlaylist.push(this.state.playlistTracks[i]);
      }
      updatedPlaylist.push(track);
      console.log(updatedPlaylist);
      this.setState({'playlistTracks': updatedPlaylist});
    }
  }

  removeTrack(track) {
    console.log("Call to remove in App component");
    for (let i = this.state.playlistTracks.length - 1; i >= 0; i--) {
      if (this.state.playlistTracks[i].id === track.id) {
        console.log(`Removing track at position ${i}`);
        const updatedPlaylist = [];
        for (let j = 0; j < this.state.playlistTracks.length; j++) {
            if (i !== j) {
              updatedPlaylist.push(this.state.playlistTracks[j]);
            }
        }
        this.setState({'playlistTracks': updatedPlaylist});
      }
    }
  }

  updatePlaylistName(name) {
    this.setState({'playlistName': name});
  }

  savePlaylist() {
    Spotify.savePlaylist(this.state.playlistName, this.state.playlistTracks);
    this.setState({
      'playlistName': 'New Playlist',
      'playlistTracks': []
    })
  }

  search(searchTerm) {
    this.setState({
      'searchResults': Spotify.search(searchTerm)
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar
            onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              onAdd={this.addTrack}
              searchResults={this.state.searchResults} />
            <Playlist
              onNameChange={this.updatePlaylistName}
              onRemove={this.removeTrack}
              onSave={this.savePlaylist}
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
