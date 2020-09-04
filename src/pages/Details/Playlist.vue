<template>
    <section class="page playlist-album">
        <div class="wrapper">
            <div class="playlist-album__top">
                <div class="playlist-album__photo" :style="{'background-image': 'url(' + playlist_image + ')'}"></div>
                <div class="playlist-album__info">
                    <h2 class="playlist-album__title" v-text="playlist_title"></h2>
                    <p class="playlist-album__subtitle" v-text="playlist_amount + ' tracks'"></p>

                    <div class="playlist-album__bottom">
                        <button
                            class="playlist-album__play-all"
                            :class="{'playlist-album__play-all--pause': is_playing}"
                            v-text="is_playing ? 'Pause all' : 'Play all'" @click="playAll">
                        </button>
                        <input class="input" type="search" placeholder="Filter..." @keyup="filter" v-model="filter_string">

                        <LikeButton :is_dark="true" :active="is_liked" @click.native.prevent="likePlaylist()"/>
                    </div>
                </div>
            </div>

            <div class="divider" v-if="playlist_tracks.length > 0"></div>

            <div class="track-list">
                <Track
                    v-for="(track, index) in playlist_tracks"
                    :key="index"
                    :track_index=index
                    :track_id="track.track_id"
                    :track_title="track.track_name"
                    :track_duration="track.track_duration"
                    :track_url="track.track_url"
                    :track_subtitle="track.artist_name"
                    :track_subtitle_link="'/artist/' + track.artist_id"
                    :album_id="track.album_id"
                    :album_name="track.album_name"
                    :album_photo="track.album_photo"
                    :artist_id="track.artist_id"
                    :artist_name="track.artist_name"

                    tracklist_type="playlist"
                    :tracklist_id="playlist_id"
                />
            </div>

            <!-- Messages -->
                <Loader text="Loading tracks..." :visible="playlist_tracks.length == 0 && filter_string.length === 0" />

                <p class="message message--error" v-text="'There are some problems with Napster API'" v-if="error_message"></p>

                <p class="message" v-if="filter_string.length > 0 && playlist_tracks.length === 0">
                    There is no track with <i class="message__italic">{{filter_string}}</i> name
                </p>
            <!-- .Messages -->
        </div>
    </section>
</template>

<script>
    import ApiService from "@/services/api"
    import { mapActions, mapGetters } from "vuex"

    import Track from "@/components/Track"
    import LikeButton from "@/components/LikeButton"
    import Loader from "@/components/Loader"

    export default {
        metaInfo: {
            titleTemplate: "%s | Playlist",
        },

        components: {
            Track,
            LikeButton,
            Loader
        },

        data() {
            return {
                playlist_id: this.$route.params.id,
                playlist_title: "",
                playlist_amount: "",
                playlist_image: "",
                playlist_tracks: [],

                is_liked: false,
                is_playing: false,
                error_message: false,

                filter_string: "",
                filter_tracks: []

            }
        },

        created() {
            this.SET_CURRENT_PAGE("Playlist")
            this.isLiked()
            this.getPlaylistDetail()
            
            this.SET_PLAYING && this.SET_CURRENT_TRACKLIST === this.playlist_id && (this.is_playing = true)
        },

        methods: {
            ...mapActions(["SET_CURRENT_PAGE", "SET_TRACK_LIST", "SET_PLAYING", "SET_CURRENT_TRACK", "SET_CURRENT_TRACKLIST"]),

            async getPlaylistDetail() {
                try {
                    const playlist_detail = await ApiService.getPlaylistDetail(this.playlist_id)

                    this.playlist_title = playlist_detail.data.playlists[0].name
                    this.playlist_artist = playlist_detail.data.playlists[0].artistName
                    this.playlist_amount = playlist_detail.data.playlists[0].trackCount
                    this.playlist_description = playlist_detail.data.playlists[0].description
                    this.playlist_image = `http://direct.napster.com/imageserver/v2/playlists/${this.playlist_id}/artists/images/1800x600.jpg`

                    this.getPlaylistTracks()
                } catch (e) {
                    this.error_message = true
                    console.log("PlaylistDetail API Errors", e)
                }
			},

			async getPlaylistTracks() {
                try {
                    const playlist_tracks = await ApiService.getPlaylistTrack(this.playlist_id)

                    playlist_tracks.data.tracks.forEach( (track, index) => { 
                        if (track.id && track.name && track.previewURL && track.artistName) {                 
                            const track_obj = {
                                track_index: index,
                                track_id: track.id,
                                track_name: track.name,
                                track_duration: track.playbackSeconds,
                                track_url: track.previewURL,
                                artist_id: track.artistId,
                                artist_name: track.artistName,
                                album_id: track.albumId,
                                album_name: track.albumName,
                                album_photo: `http://direct.napster.com/imageserver/v2/albums/${track.albumId}/images/500x500.jpg`
                            }

                            this.playlist_tracks = [...this.playlist_tracks, track_obj]
                            this.filter_tracks = [...this.filter_tracks, track_obj]
                        }
                    })

                    this.fillTrackList()
                } catch (e) {
                    this.error_message = true
                    console.log("PlaylistDetail API Errors", e)
                }
            },

            fillTrackList() {
                // If there is no a current track, then fill tracklist state with playlist detail
                if (this.GET_CURRENT_TRACK.album_id !== undefined && this.GET_CURRENT_TRACK.album_id.length === 0)  {
                    this.SET_TRACK_LIST(this.playlist_tracks)
                    this.SET_CURRENT_TRACKLIST({id: this.playlist_id, type: "playlist"})
                }
            },
            
            isLiked() {
                let JSONStoragePlaylists = JSON.parse(localStorage.getItem("napsterPlaylists"))
                JSONStoragePlaylists.includes(this.playlist_id) && (this.is_liked = true)
            },

            likePlaylist() {
                let JSONStoragePlaylists = JSON.parse(localStorage.getItem("napsterPlaylists"))
                localStorage.removeItem("napsterPlaylists")

                if (JSONStoragePlaylists.includes(this.playlist_id)) {
                    let indexItem = JSONStoragePlaylists.indexOf(this.playlist_id)
                    JSONStoragePlaylists.splice(indexItem, 1)
                    this.is_liked = false
                } else {
                    JSONStoragePlaylists = [...JSONStoragePlaylists, this.playlist_id]
                    this.is_liked = true
                }

                localStorage.setItem("napsterPlaylists", JSON.stringify(JSONStoragePlaylists))
            },

            playAll() {
                this.SET_PLAYING(false)
                
                if (!this.is_playing) {
                    this.SET_TRACK_LIST([])
                    this.SET_TRACK_LIST(this.playlist_tracks)
                    this.SET_CURRENT_TRACK(this.playlist_tracks[0])
                    this.SET_CURRENT_TRACKLIST(this.playlist_id)
                    this.SET_PLAYING(true)
                    this.is_playing = true
                } else {
                    this.is_playing = false
                }
            },

            filter() {
                let trackListFiltered = this.filter_tracks.filter( track => {
                    const trackName = track.track_name.toLowerCase()
                    const trackArtistName = track.artist_name.toLowerCase()
                    return trackName.includes(this.filter_string.toLowerCase()) || trackArtistName.includes(this.filter_string.toLowerCase())
                })

                this.playlist_tracks = []
                this.playlist_tracks = trackListFiltered
            }
        },

        computed: {
            ...mapGetters(["GET_TRACK_LIST", "GET_CURRENT_TRACKLIST", "GET_PLAYING", "GET_CURRENT_TRACK"])
        },

        watch: {
            GET_PLAYING() {
                this.is_playing = this.GET_PLAYING
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/scss/_album-playlist.scss";
</style>