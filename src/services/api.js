import axios from 'axios'
const api_key = 'YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4'

const apiNapster = axios.create({
	baseURL: `https://api.napster.com/v2.2`,
	withCredentials: false,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
})

export default{
	// Pages
		// Dashboard
			getTopAlbums(limit){
				return apiNapster(`/albums/top?limit=${limit}&apikey=${api_key}`)
			},

			getNewReleases(limit){
				return apiNapster(`/albums/new?limit=${limit}&apikey=${api_key}`)
			},

			getGenres(limit){
				return apiNapster(`/genres?limit=${limit}&apikey=${api_key}`)
			},

			getTopTracks(limit){
				return apiNapster(`/tracks/top?limit=${limit}&apikey=${api_key}`)
			},

		// Explore
			getStaffAlbums(limit){
				return apiNapster(`/albums/picks?limit=${limit}&apikey=${api_key}`)
			},

			getTopPlaylists(limit){
				return apiNapster(`/playlists/featured?limit=${limit}&apikey=${api_key}`)
			},

			getTopArtists(limit){
				return apiNapster(`/artists/top?limit=${limit}&apikey=${api_key}`)
			},

		// Playlists
			getFeaturedPlaylists(limit){
				return apiNapster(`/playlists/featured?limit=${limit}&apikey=${api_key}`)
			},

			getMorePlaylists(limit, offset){
				return apiNapster(`/playlists?limit=${limit}&offset=${offset}&apikey=${api_key}`)
			},
	// .Pages

	// Details
		// Album
			getAlbumDetail(album_id){
				return apiNapster(`/albums/${album_id}?apikey=${api_key}`)
			},

			getFeaturedAlbums(){
				return apiNapster(`/albums/top?limit=5&apikey=${api_key}`)
			},

		// Artist
			getArtistDetail(artist_id){
				return apiNapster(`/artists/${artist_id}?apikey=${api_key}`)
			},

			getArtistAlbums(artist_id){
				return apiNapster(`/artists/${artist_id}/albums?apikey=${api_key}`)
			},

		// Playlist
			getPlaylistDetail(playlist_id){
				return apiNapster(`/playlists/${playlist_id}?apikey=${api_key}`)
			},

			getFeaturedPlayists(){
				return apiNapster(`/playlists/featured?limit=5&apikey=${api_key}`)
			},

		// Genre
			getGenreDetail(genre_id){
				return apiNapster(`/genres/${genre_id}?apikey=${api_key}`)
			},

			getGenreTopPlaylists(genre_id){
				return apiNapster(`/genres/${genre_id}/playlists/top?apikey=${api_key}`)
			},

			getGenreTopArtists(genre_id){
				return apiNapster(`/genres/${genre_id}/artists/top?apikey=${api_key}`)
			},
	// .Details
	
	// Tracks
		// Album
			getAlbumTracks(album_id){
				return apiNapster(`/albums/${album_id}/tracks?apikey=${api_key}`)
			},

		// Playlist
			getPlaylistTrack(playlist_id){
				return apiNapster(`/playlists/${playlist_id}/tracks?apikey=${api_key}&limit=100`)
			},
	// .Tracks
			
	// Singles
		// Track
			getTrack(track_id){
				return apiNapster(`/tracks/${track_id}?apikey=${api_key}`)
			},
		
		// Album
			getAlbum(album_id){
				return apiNapster(`/albums/${album_id}?apikey=${api_key}`)
			},
		
		// Playlist
			getPlaylist(playlist_id){
				return apiNapster(`/playlists/${playlist_id}?apikey=${api_key}`)
			},
	// .Singles
}