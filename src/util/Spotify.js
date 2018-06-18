let accessToken;
let expTime;
const clientID = '7b4180d7c2ce4d06a758d3dcfd3ec083';
const redirectURI = 'http://localhost:3000';
const spotifyAuthorizeURL = 'https://accounts.spotify.com/authorize?client_id='
const usersURL = 'https://api.spotify.com/v1/users/';

const Spotify = {

  getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else {
      const retrAccess = window.location.href.match('/access_token=([^&]*)/');
      const retrExpir = window.location.href.match('/expires_in=([^&]*)/');
      accessToken = retrAccess[1];
      expTime = parseInt(retrExpir[1], 10);
      window.setTimeout(() => accessToken = '', expTime * 1000);
      window.history.pushState('Access Token', null, '/');
      window.location(`${spotifyAuthorizeURL}${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`);
    }
  },

  search(searchTerm) {
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
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
        if (jsonResponse.tracks) {
          return jsonResponse.tracks.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }));
        }
      });
  },

  savePlaylist(playlistName, trackURIs) {
    if (!playlistName || !trackURIs) {
      return;
    }
    const accTok = accessToken;
    const headers = { Authorization: `Bearer ${accTok}` };

    let userID = fetch('https://api.spotify.com/v1/me', {
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
    }).then(jsonResponse => jsonResponse[0].id);

    console.log(userID);

    let playlistID = fetch(`${usersURL}${userID}/playlists`, {
      headers: headers
    }).then(response => {
      try {
        if (response.ok) {
          const jsonResponse = response.json();
          return jsonResponse;
        }
        throw new Error('Request failed posting new playlistID!');
      } catch (error) {
        console.log(error);
    }}).then(jsonResponse => jsonResponse[0].id);

    fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
        headers: headers
    }).then(response => {
      try {
        if (response.ok) {
          const jsonResponse = response.json();
          return jsonResponse;
        }
        throw new Error('Request failed posting tracks to new playlist!');
      } catch (error) {
        console.log(error);
    }}).then(jsonResponse => {
      jsonResponse.uris = trackURIs;
    });
  }
};

export default Spotify;
