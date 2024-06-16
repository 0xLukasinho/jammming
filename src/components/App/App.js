import React, { useState, useCallback, useEffect } from "react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './../../css/ToastifyCustom.css';

import SearchBar from './../SearchBar/SearchBar';
import SearchResults from './../SearchResults/SearchResults';
import Playlist from './../Playlist/Playlist';
import UserPlaylists from "../UserPlaylists/UserPlaylists"; 
import { Spotify } from "../../util/spotify";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);

  useEffect(() => {
    fetchUserPlaylists();
  }, []);

  const fetchUserPlaylists = useCallback(async () => {
    try {
      const playlists = await Spotify.getUserPlaylists();
      setUserPlaylists(playlists);
    } catch (error) {
      console.error("Error fetching user playlists:", error);
    }
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

  const savePlaylist = useCallback(async () => {
    if (!playlistName || !playlistTracks.length) {
      return; 
    }

    const trackURIs = playlistTracks.map((track) => track.uri);
    const existingPlaylist = userPlaylists.find((playlist) => playlist.name === playlistName);

    if (existingPlaylist) {
      const playlistId = existingPlaylist.id;
      try {
        await Spotify.updatePlaylist(playlistId, trackURIs);
        toast.success("Playlist successfully updated.", {
          className: 'custom-toast',
          progressClassName: 'custom-progress-bar',
        });
      } catch (error) {
        console.error("Error updating playlist:", error);
      }
    } else {
      try {
        const newPlaylist = await Spotify.savePlaylist(playlistName, trackURIs);
        toast.success("New playlist successfully saved.", {
          className: 'custom-toast',
          progressClassName: 'custom-progress-bar',
        });
        setUserPlaylists((prevPlaylists) => [...prevPlaylists, newPlaylist]);
        fetchUserPlaylists();
      } catch (error) {
        console.error("Error saving new playlist:", error);
      }
    }
  }, [playlistName, playlistTracks, userPlaylists]);

  const search = useCallback((term) => {
    Spotify.search(term).then(setSearchResults);
  }, []);

  const selectPlaylist = (selectedPlaylist) => {
    setPlaylistName(selectedPlaylist.name);
    setPlaylistTracks(selectedPlaylist.tracks);
  };

  const createNewPlaylist = () => {
    setPlaylistName("New Playlist");
    setPlaylistTracks([]);
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
          <UserPlaylists 
            playlists={userPlaylists} 
            onSelect={selectPlaylist}
            onCreateNewPlaylist={createNewPlaylist}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
