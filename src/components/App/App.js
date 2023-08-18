import React, { useState, useCallback, useEffect } from "react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import SearchBar from './../SearchBar/Searchbar';
import SearchResults from './../SearchResults/SearchResults';
import Playlist from './../Playlist/Playlist';
import UserPlaylists from "../UserPlaylists/UserPlaylists"; // Add this import
import { Spotify } from "../../util/spotify";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);

  useEffect(() => {
    fetchUserPlaylists();
  }, []);

  const fetchUserPlaylists = useCallback(() => {
    Spotify.getUserPlaylists()
      .then((playlists) => {
        setUserPlaylists(playlists);
      })
      .catch((error) => {
        console.error("Error fetching user playlists:", error);
      });
  }, []);

  const addTrack = useCallback((track) => {
    if (!playlistTracks.some((savedTrack) => savedTrack.id === track.id)) {
      setPlaylistTracks((prevTracks) => [...prevTracks, track]);
    }
  }, [playlistTracks]);

  const removeTrack = useCallback((track) => {
    setPlaylistTracks((prevTracks) =>
      prevTracks.filter((currentTrack) => currentTrack.id !== track.id)
    );
  }, []);

  const updatePlaylistName = useCallback((name) => {
    setPlaylistName(name);
  }, []);

  const savePlaylist = useCallback(() => {
    const trackURIs = playlistTracks.map((track) => track.uri);
  
    Spotify.savePlaylist(playlistName, trackURIs)
      .then((newPlaylist) => {
        toast.success("New playlist successfully saved.");
        setPlaylistName("");
        setPlaylistTracks([]);
        setUserPlaylists((prevPlaylists) => [...prevPlaylists, newPlaylist]);
      })
      .catch((error) => {
        console.error("Error saving new playlist:", error);
      });
  }, [playlistName, playlistTracks]);

  const search = useCallback((term) => {
    Spotify.search(term).then(setSearchResults);
  }, []);

  const selectPlaylist = (selectedPlaylist) => {
    setPlaylistName(selectedPlaylist.name);
    setPlaylistTracks(selectedPlaylist.tracks);
  };

  return (
    <div>
      <h1>
        Ja<span className="highlight">mmm</span>ing
      </h1>
      <div className="App">
        <SearchBar onSearch={search} />
        <ToastContainer />
        <div className="App-playlist">
          <SearchResults searchResults={searchResults} onAdd={addTrack} />
          <Playlist
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            onRemove={removeTrack}
            onNameChange={updatePlaylistName}
            onSave={savePlaylist}
          />
          <UserPlaylists playlists={userPlaylists} onSelect={selectPlaylist} />
        </div>
      </div>
    </div>
  );
}

export default App;