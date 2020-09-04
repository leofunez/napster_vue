<template>
    <section class="page playlist-album">
        <div class="wrapper">
            <div class="playlist-album__top">
                <div class="playlist-album__photo" :style="{'background-image': 'url(' + album_image + ')'}"></div>
                <div class="playlist-album__info">
                    <h2 class="playlist-album__title" v-text="album_title"></h2>
                    <p class="playlist-album__subtitle" v-text="album_artist"></p>

                    <div class="playlist-album__bottom">
                        <button
                            class="playlist-album__play-all"
                            :class="{'playlist-album__play-all--pause': is_playing}"
                            v-text="is_playing ? 'Pause all' : 'Play all'"
                            @click="playAll">
                        </button>
                        <input class="input" type="search" placeholder="Filter..." @keyup="filter" v-model="filter_string">

                        <LikeButton :is_dark="true" :active="is_liked" @click.native.prevent="likeAlbum()"/>
                    </div>
                </div>
            </div>

            <div class="divider" v-if="album_tracks.length > 0"></div>

            <div class="track-list">
                <Track
                    v-for="(track, index) in album_tracks"
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
                    
                    tracklist_type="album"
                    :tracklist_id="album_id"
                />
            </div>
            
            <!-- Messages -->
                <Loader text="Loading tracks..." :visible="album_tracks.length == 0 && filter_string.length === 0" />
                
                <p class="message" v-text="'There are some problems with Napster API'" v-if="error_message"></p>
                
                <p class="message" v-if="filter_string.length > 0 && album_tracks.length === 0">
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
            titleTemplate: "%s | Album",
        },

        components: {
            Track,
            LikeButton,
            Loader
        },

        data() {
            return {
                album_id: this.$route.params.id,
                album_title: "",
                album_artist: "",
                album_image: "",
                album_tracks: [],

                is_liked: false,
                is_playing: false,
                error_message: false,

                filter_string: "",
                filter_tracks: []
            }
        },

        created() {
            this.SET_CURRENT_PAGE("Album")
            this.isLiked()
            this.getAlbumDetail()
            
            this.GET_PLAYING && this.GET_CURRENT_TRACKLIST === this.album_id && (this.is_playing = true)
        },

        methods: {
            ...mapActions(["SET_CURRENT_PAGE", "SET_TRACK_LIST", "SET_PLAYING", "SET_CURRENT_TRACK", "SET_CURRENT_TRACKLIST"]),

            async getAlbumDetail() {
                try {
                    const album_detail = await ApiService.getAlbumDetail(this.album_id)
                    
                    this.album_title = album_detail.data.albums[0].name
                    this.album_artist = album_detail.data.albums[0].artistName
                    this.album_image = `http://direct.napster.com/imageserver/v2/albums/${this.album_id}/images/500x500.jpg`

                    this.getAlbumTracks()
                } catch (e) {
                    this.error_message = true
                    console.log("AlbumDetail API Errors")
                }
            },
            
            async getAlbumTracks() {
                try {
                    const album_tracks = await ApiService.getAlbumTracks(this.album_id)

                    album_tracks.data.tracks.map( (track, index) => {
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

                            this.album_tracks = [...this.album_tracks, track_obj]
                            this.filter_tracks = [...this.filter_tracks, track_obj]
                        }
                    })

                    this.fillTrackList()
                } catch (e) {
                    this.error_message = true
                    console.log("AlbumDetail API Errors")
                }
            },

            fillTrackList() {
                // If there is no a current track, then fill tracklist state with album detail
                if (this.GET_CURRENT_TRACK.album_id !== undefined && this.GET_CURRENT_TRACK.album_id.length === 0)  {
                    this.SET_TRACK_LIST(this.album_tracks)
                    this.SET_CURRENT_TRACKLIST({id: this.album_id, type: "album"})
                }
            },
            
            isLiked() {
                let JSONStorageAlbums = JSON.parse(localStorage.getItem("napsterAlbums"))
                JSONStorageAlbums.includes(this.album_id) && (this.is_liked = true)
            },

            likeAlbum() {
                let JSONStorageAlbums = JSON.parse(localStorage.getItem("napsterAlbums"))
                localStorage.removeItem("napsterAlbums")

                if (JSONStorageAlbums.includes(this.album_id)) {
                    let indexItem = JSONStorageAlbums.indexOf(this.album_id)
                    JSONStorageAlbums.splice(indexItem, 1)
                    this.is_liked = false
                } else {
                    JSONStorageAlbums = [...JSONStorageAlbums, this.album_id]
                    this.is_liked = true
                }

                localStorage.setItem("napsterAlbums", JSON.stringify(JSONStorageAlbums))    
            },
            
            playAll() {
                this.SET_PLAYING(false)
                
                if (!this.is_playing) {
                    this.SET_TRACK_LIST([])
                    this.SET_TRACK_LIST(this.album_tracks)
                    this.SET_CURRENT_TRACK(this.album_tracks[0])
                    this.SET_CURRENT_TRACKLIST(this.album_id)
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

                this.album_tracks = []
                this.album_tracks = trackListFiltered
            }
        },

        computed: {
            ...mapGetters(["GET_CURRENT_TRACKLIST", "GET_PLAYING", "GET_CURRENT_TRACK"])
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