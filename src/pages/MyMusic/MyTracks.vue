<template>
    <section class="page page__my-tracks">
        <div class="wrapper">
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
                />
            </div>
            
            <Loader text="Loading my tracks..." :visible="tracks.length == 0 && !message" />

            <p class="message" v-text="'You have no favorite tracks:('" v-if="message"></p>
        </div>
    </section>
</template>

<script>
    import { Keys } from "@/services/keys"
    import axios from "axios"
    import { mapActions } from "vuex"

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
                keys: Keys,
                tracks: [],
                message: false
            }
        },

        created() {
            this.SET_CURRENT_PAGE("My Tracks")
            this.getStorageTracks()
        },

        methods: {
            ...mapActions(['SET_CURRENT_PAGE']),

            getStorageTracks() {
                let JSONStorageTracks = JSON.parse(localStorage.getItem("napsterTracks"))
                    
                if (JSONStorageTracks.length > 0) {
                    JSONStorageTracks.map( track_storage => {
                        let track_id = track_storage.substring(track_storage.lastIndexOf("@") + 1)

                        axios
                        .get(`https://api.napster.com/v2.2/tracks/${track_id}?apikey=${this.keys.api_key}`)
                        .then( track => {
                            let trackData = track.data.tracks[0]
                            const track_obj = {
                                track_id:       trackData.id,
                                track_name:     trackData.name,
                                track_url:      trackData.previewURL,
                                track_duration: trackData.playbackSeconds,
                                artist_id:      trackData.artistId,
                                artist_name:    trackData.artistName,
                                album_id:       trackData.albumId,
                                album_name:     trackData.albumName,
                                album_photo:    `https://direct.napster.com/imageserver/v2/albums/${trackData.albumId}/images/500x500.jpg`

                            }
                            this.tracks = [...this.tracks, track_obj]
                        })
                        .catch( error => console.log(error) )
                    })
                } else {
                    this.showMessage()
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
        }
    }
</script>