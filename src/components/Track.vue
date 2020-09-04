<template>
    <div class="track">
        <button class="track__play" v-if="!is_playing" @click="playTrack(track_index)"></button>
        <button class="track__play track__play--is-playing" v-if="is_playing" @click="pauseTrack()"></button>
        
        <p class="track__title" :class="{'track__title--active': is_playing}" v-text="track_title"></p>
        
        <router-link class="track__subtitle" v-text="track_subtitle" :to="track_subtitle_link"></router-link>
        
        <button class="track__like" :class="{'track__like--active': is_liked}" @click="likeTrack(album_id + '@' + track_id)"></button>
        <p class="track__duration" v-text="time"></p>
    </div>
</template>

<script>
    import ApiService from "@/services/api"
    import { mapGetters, mapActions } from "vuex"
    
    export default {
        props: [
            "track_index",
            "track_id",
            "track_title",
            "track_subtitle",
            "track_subtitle_link",
            "track_duration",
            "track_url",
            "album_id",
            "album_name",
            "album_photo",
            "artist_id",
            "artist_name",

            "tracklist_type",
            "tracklist_id"
        ],

        data() {
            return {
                time: "",
                tracks_liked: [],
                is_playing: false,
                is_liked: false
            }
        },

        created() {
            this.time = this.getTrackTime(this.track_duration),
            this.getStorageTracks()
            this.isPlaying()
        },

        methods: {
            ...mapActions(["SET_CURRENT_TRACK", "SET_TRACK_LIST", "SET_CURRENT_TRACKLIST", "SET_PLAYING"]),

            async playTrack(index) {
                // Setting new tracklist
                (this.tracklist_id !== this.GET_CURRENT_TRACKLIST.id) && await this.newTrackList(this.tracklist_type, this.tracklist_id)

                // Play new track
                this.is_playing = true
                let track = this.GET_TRACK_LIST[0][index]
                
                let current_track = this.GET_CURRENT_TRACK
                if (current_track[0] !== undefined) {
                    if (current_track[0].track_id !== this.track_id) {
                        this.SET_PLAYING(false)
                        this.is_playing = false
                    }
                }

                let new_track = {
                    track_index:    index,
                    track_id:       track.track_id,
                    track_name:     track.track_name,
                    track_url:      track.track_url,
                    track_duration: track.track_duration,
                    artist_id:      track.artist_id,
                    artist_name:    track.artist_name,
                    album_id:       track.album_id,
                    album_name:     track.album_name,
                    album_photo:    track.album_photo,
                }
                
                this.SET_CURRENT_TRACK(new_track)
                this.SET_PLAYING(true)
            },

            pauseTrack() {
                this.SET_PLAYING(false)
                this.is_playing = false
            },
            
            getTrackTime(time) {
				var hr = ~~(time / 3600);
				var min = ~~((time % 3600) / 60);
				var sec = time % 60;
				var sec_min = "";
				if (hr > 0) {
					sec_min += "" + hr + ":" + (min < 10 ? "0" : "");
				}
				sec_min += "" + min + ":" + (sec < 10 ? "0" : "");
				sec_min += "" + sec;
				return sec_min;
            },
            
            likeTrack(album_track_id) {
                let JSONStorageTracks = JSON.parse(localStorage.getItem("napsterTracks"))
                localStorage.removeItem("napsterTracks")

                if (JSONStorageTracks.includes(album_track_id)) {
                    let indexItem = JSONStorageTracks.indexOf(album_track_id)
                    JSONStorageTracks.splice(indexItem, 1)
                    this.is_liked = false
                } else {
                    JSONStorageTracks = [...JSONStorageTracks, album_track_id]
                    this.is_liked = true
                }

                localStorage.setItem("napsterTracks", JSON.stringify(JSONStorageTracks))
                
                this.$emit("toggleLike", album_track_id)
            },
            
            getStorageTracks() {
				if (localStorage.getItem('napsterTracks') !== null) {
					let JSONStorageTracks = JSON.parse(localStorage.getItem('napsterTracks'))
                    
                    // Checking if this track is already liked
                    this.is_liked = (JSONStorageTracks.includes(this.album_id + '@' + this.track_id)) ? true : false
				}
            },
            
            isPlaying() {
                let current_track = this.GET_CURRENT_TRACK
                
                if (current_track[0] !== undefined) {
                    current_track[0].track_id === this.track_id && (this.is_playing = true)
                }
            },

            async newTrackList(type, id) {
                let new_tracks_list = []

                if (type === "playlist") {
                    try {
                        const playlist_tracks = await ApiService.getPlaylistTrack(id)
                        
                        playlist_tracks.data.tracks.forEach( (track, index) => {                    
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

                            new_tracks_list = [...new_tracks_list, track_obj]
                        })
                    } catch (e) {
                        this.error_message = true
                        console.log("Playlist tracks API Errors")
                    }
                } else if (type === "album") {
                    try {
                        const album_tracks = await ApiService.getAlbumTracks(this.album_id)

                        album_tracks.data.tracks.map( (track, index) => {
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

                            new_tracks_list = [...new_tracks_list, track_obj]
                        })
                    } catch (e) {
                        console.log("Album tracks API Errors", e)
                    }
                } else if (type === "fav_tracks") {
                    new_tracks_list = this.GET_TRACK_LIST[0]
                } else {
                    try {
                        const response = await ApiService.getTopTracks(10)
                        response.data.tracks.forEach( track => {
                            const track_obj = {
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

                            new_tracks_list = [...new_tracks_list, track_obj]
                        })
                    } catch (e) {
                        this.error_message = true
                        console.log("TopTrack API Error", e)
                    }
                }

                this.SET_TRACK_LIST(new_tracks_list)
                this.SET_CURRENT_TRACKLIST({id, type})
            },
        },

        computed: {
			...mapGetters(["GET_CURRENT_TRACK", "GET_TRACK_LIST", "GET_PLAYING", "GET_CURRENT_TRACKLIST"]),
        },
        
        watch: {
            GET_CURRENT_TRACK() {
                this.is_playing = false
                
                let current_track = this.GET_CURRENT_TRACK
                
                if (current_track[0].track_id === this.track_id) {
                    this.is_playing = this.GET_PLAYING
                }
            },

            GET_PLAYING() {
                // This watcher is to sync the playing state when it is changed from another component
                let current_track = this.GET_CURRENT_TRACK
                
                if (current_track[0].track_id === this.track_id) {
                    this.is_playing = this.GET_PLAYING
                }
            }
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/_colors.scss";

    .track {
        display: grid;
        grid-template-columns: 35px 2fr 1fr 60px 40px;
        grid-gap: 10px;
        align-items: center;
        font-size: 14px;
        font-weight: 400;
        padding: 12px 10px;
        background-color: $gray;
        border-radius: 4px;
        transition: all .4s ease-in-out;

        &__play {
            background: url("../assets/img/player/play_color.svg") no-repeat center / 18px;
            height: 30px;

            &--is-playing {
                background-image: url("../assets/img/player/pause_color.svg");
                background-position: 8px center;
            }
        }
        
        &__title {
            &--active {
                font-weight: 500;
            }
        }

        &__subtitle {
            color: $dark;
            
            &:hover {
                color: $blue;
            }
        }

        &__like {
            height: 30px;
            background: url("../assets/img/like_dark.svg") no-repeat center / 18px;
            padding: 0;
            transition: all .1s ease-in-out;

            &:hover {
                opacity: 0.6;
            }

            &--active {
                background-image: url("../assets/img/liked.svg");

                &:hover {
                    opacity: 1;
                }
            }
        }

        // Media
            @media screen and (max-width: 680px) {
                grid-template-columns: 30px 1fr 120px 40px;

                &__title {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                &__duration {
                    display: none;
                }
            }

            @media screen and (max-width: 480px) {
                grid-template-columns: 30px 1fr 40px;

                &__subtitle {
                    display: none;
                }
            }
        // .Media
    }
</style>