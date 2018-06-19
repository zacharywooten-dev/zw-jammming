let accessToken;
let expTime;
const clientID = '7b4180d7c2ce4d06a758d3dcfd3ec083';
const redirectURI = 'http://localhost:3000/';
const spotifyAuthorizeURL = 'https://accounts.spotify.com/authorize?client_id='
const usersURL = 'https://api.spotify.com/v1/users/';
const searchURL = 'https://api.spotify.com/v1/search?type=track&q=';
//const spotifyTrackURL = 'spotify:track:';

const Spotify = {

  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    let retrAccess = window.location.href.match(/access_token=([^&]*)/);
    let retrExpir = window.location.href.match(/expires_in=([^&]*)/);
    if (retrAccess && retrExpir) {
      accessToken = retrAccess[1];
      expTime = parseInt(retrExpir[1], 10);
      window.setTimeout(() => accessToken = '', expTime * 1000);
      window.history.pushState('Access Token', null, '/');
    } else {
      window.location = `${spotifyAuthorizeURL}${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },

  search(searchTerm) {
    Spotify.getAccessToken();
    return fetch(`${searchURL}${searchTerm}`, {
        headers:{Authorization: `Bearer ${accessToken}`}
      }).then(response => {
        try {
          if (response.ok) {
            const jsonResponse = response.json();
            return jsonResponse;
          }
          throw new Error('Request failed using search term!');
        } catch (error) {
          console.log(error);
        }
      }).then(jsonResponse => {
        if (jsonResponse.tracks.items) {
          return jsonResponse.tracks.items.map(trackItem => ({
            id: trackItem.id,
            name: trackItem.name,
            artist: trackItem.artists[0].name,
            album: trackItem.album.name,
            uri: trackItem.uri
          }));
        } else {
          return [];
        }
      }).then(searchQueryResults => {
        return searchQueryResults;
      });
  },

  savePlaylist(playlistName, tracks) {
    Spotify.getAccessToken();
    if (!playlistName || !tracks) {
      return;
    }
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userID, playlistID;
    fetch('https://api.spotify.com/v1/me', {
      headers: headers
    }).then(response => {
      try {
        if (response.ok) {
          const jsonResponse = response.json();
          return jsonResponse;
        }
        throw new Error('Request failed getting userID!');
      } catch (error) {
        console.log(error);
      }
    }).then(jsonResponse => {
      userID = jsonResponse.id;
    }).then(() => {
      fetch(`${usersURL}${userID}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: playlistName})
      }).then(response => {
        try {
          if (response.ok) {
            const jsonResponse = response.json();
            return jsonResponse;
          }
          throw new Error('Request failed posting new playlistID!');
        } catch (error) {
          console.log(error);
        }}).then(jsonResponse => {
          playlistID = jsonResponse.id;
        }).then(() => {
          return tracks.map(track => {
            return track.id;
          }).map(trackID => {
            return `spotify:track:${trackID}`;
          });
        }).then(trackURIs => {
          fetch(`${usersURL}${userID}/playlists/${playlistID}/tracks`, {
            headers: headers,
            method: 'POST',
            body: {'uris': trackURIs}
          }).then(response => {
            try {
              if (response.ok) {
                const jsonResponse = response.json();
                return jsonResponse;
              }
              throw new Error('Request failed posting tracks to new playlist!');
            } catch (error) {
              console.log(error);
            }});
          });
        });
      }
    };

export default Spotify;
