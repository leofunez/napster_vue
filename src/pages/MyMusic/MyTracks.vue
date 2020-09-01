<template>
    <section class="page page__my-tracks">
        <div class="wrapper">
            <p class="message message--error" v-text="'There are some problems with Napster API'" v-if="error_message"></p>

            <div class="track-list" v-if="tracks.length > 0">
                <Track
                    v-for="(track, index) in tracks"
                    :key="index"
                    :track_index=index
                    :track_id="track.track_id"
                    :track_title="track.track_name"
                    :track_duration="track.track_duration"
                    :track_url="track.track_url"
                    :track_subtitle="track.artist_name"
                    :track_subtitle_link="'/artists/' + track.artist_id"
                    :album_id="track.album_id"
                    :album_name="track.album_name"
                    :album_photo="track.album_photo"
                    :artist_id="track.artist_id"
                    :artist_name="track.artist_name"
                    :is_liked="true"
                    @toggleLike="onToggleLike"

                    tracklist_type="fav_tracks"
                />
            </div>
            
            <Loader text="Loading my tracks..." :visible="tracks.length == 0 && !message" />

            <p class="message" v-text="'You have no favorite tracks:('" v-if="message"></p>
        </div>
    </section>
</template>

<script>
    import ApiService from "@/services/api"
    import { mapActions, mapGetters } from "vuex"

    import Track from "@/components/Track"
    import Loader from "@/components/Loader"

    export default {
        metaInfo: {
            titleTemplate: "%s | My Tracks",
        },

        components: {
            Loader,
            Track
        },

        data() {
            return {
                // keys: Keys,
                tracks: [],
                message: false,
                error_message: false
            }
        },

        created() {
            this.SET_CURRENT_PAGE("My Tracks")
            this.getStorageTracks()
        },

        methods: {
            ...mapActions(["SET_CURRENT_PAGE", "SET_TRACK_LIST", "SET_CURRENT_TRACKLIST"]),

            async getStorageTracks() {
                let JSONStorageTracks = JSON.parse(localStorage.getItem("napsterTracks"))
                    
                if (JSONStorageTracks.length > 0) {
                    JSONStorageTracks.map( async (track_storage, index) => {
                        let track_id = track_storage.substring(track_storage.lastIndexOf("@") + 1)

                        try {
                            const api_track = await ApiService.getTrack(track_id)
                            const track = api_track.data.tracks[0]
                            
                            const track_obj = {
                                track_index:    index,
                                track_id:       track.id,
                                track_name:     track.name,
                                track_url:      track.previewURL,
                                track_duration: track.playbackSeconds,
                                artist_id:      track.artistId,
                                artist_name:    track.artistName,
                                album_id:       track.albumId,
                                album_name:     track.albumName,
                                album_photo:    `https://direct.napster.com/imageserver/v2/albums/${track.albumId}/images/500x500.jpg`

                            }
                            
                            this.tracks = [...this.tracks, track_obj]

                            this.fillTrackList()
                        } catch (e) {
                            console.log("GetTrack API Errors")
                        }
                    })
                } else {
                    this.showMessage()
                }
            },

            fillTrackList() {
                // If there is no a current track, then fill tracklist state with playlist detail
                if (this.GET_CURRENT_TRACK.album_id !== undefined && this.GET_CURRENT_TRACK.album_id.length === 0)  {
                    this.SET_TRACK_LIST(this.tracks)
                    this.SET_CURRENT_TRACKLIST({id: "", type: "fav_tracks"})
                }
            },
            
            onToggleLike(album_track_id) {
                let trackIndex = this.tracks.findIndex( track => {
                    let str = track.album_id + '@' + track.track_id
                    return str === album_track_id
                })
                
                this.tracks.splice(trackIndex, 1)

                this.tracks.length === 0 && this.showMessage()
            },

            showMessage() {
                this.message = true
            }
        },

        computed: {
            ...mapGetters(["GET_CURRENT_TRACK"])
        }
    }
</script>