import React, { useState, useCallback } from "react"
import './App.css';

import SearchBar from './../SearchBar/Searchbar';
import SearchResults from './../SearchResults/SearchResults';
import Playlist from './../Playlist/Playlist';

function App() {
  const [searchResults, setSearchResults] = useState([
    {
      name: "Numb",
      artist: "Linkin Park",
      album: "Meteora",
      id: 1,
      uri: 1,
    }, 
    {
      name: "Lose Yourself",
      artist: "Eminem",
      album: "8 Mile",
      id: 2,
      uri: 2,
    },
    {
      name: "El Poblado",
      artist: "J Balvin, Karol G, Nicky Jam",
      album: "Reggeaton Summer 2022",
      id: 3,
      uri: 3,
    }
  ]);

  const [playlistName, setPlaylistName] = useState('My Playlist');
  const [playlistTracks, setPlaylistTracks] = useState([
    {
      name: "Boulevard of Broken Dreams",
      artist: "Green Day",
      album: "American Idiot",
      id: 4,
      uri: 4,
    },
    {
      name: "Mein Block",
      artist: "Sido",
      album: "Maske",
      id: 5,
      uri: 5,
    }
  ])

  const addTrack = useCallback((track) => {
    if (playlistTracks.some((savedTrack) => savedTrack.id === track.id))
      return;
    setPlaylistTracks((prevTracks) => [...prevTracks, track]);  
  }, [playlistTracks]
  );

  const removeTrack = useCallback((track) => {
    setPlaylistTracks((prevTracks) => prevTracks.filter((currentTrack) => currentTrack.id !== track.id)); 
  }, []);

  const updatePlaylistName = useCallback((name) => {
    setPlaylistName(name);
  }, []);
  
  const savePlaylist = useCallback(() => {

  }, []);


  return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults searchResults={searchResults} onAdd={addTrack} />
            <Playlist 
            playlistName={playlistName} 
            playlistTracks={playlistTracks}
            onRemove={removeTrack}
            onNameChange={updatePlaylistName}
            onSave={savePlaylist}
            />
          </div>
        </div>
      </div>
    );
}

export default App;
