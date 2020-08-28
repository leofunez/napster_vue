<template>
    <section class="page playlist-album">
        <div class="wrapper">
            <div class="playlist-album__top">
                <div class="playlist-album__photo" :style="{'background-image': 'url(' + playlist_image + ')'}"></div>
                <div class="playlist-album__info">
                    <h2 class="playlist-album__title" v-text="playlist_title"></h2>
                    <p class="playlist-album__subtitle" v-text="playlist_amount + ' tracks'"></p>

                    <div class="playlist-album__bottom">
                        <button class="playlist-album__play-all" v-text="'Play all'"></button>
                        <input class="playlist-album__filter" type="search" placeholder="Filter...">

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
                    :track_subtitle_link="'/artists/' + track.artist_id"
                    :album_id="track.album_id"
                    :album_name="track.album_name"
                    :album_photo="track.album_photo"
                    :artist_id="track.artist_id"
                    :artist_name="track.artist_name"
                />
            </div>

            <Loader text="Loading tracks..." :visible="playlist_tracks.length == 0" />
        </div>
    </section>
</template>

<script>
    import ApiService from "@/services/api"
    import { mapActions } from "vuex"

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

                filter: ""
            }
        },

        created() {
            this.SET_CURRENT_PAGE('Playlist')
            this.isLiked()
            this.getPlaylistDetail()
        },

        methods: {
            ...mapActions(['SET_CURRENT_PAGE']),

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
                    console.log("PlaylistDetail API Errors")
                }
			},

			async getPlaylistTracks() {
                try {
                    const playlist_tracks = await ApiService.getPlaylistTrack(this.playlist_id)

                    playlist_tracks.data.tracks.forEach( track => {                    
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

                        this.playlist_tracks = [...this.playlist_tracks, track_obj]
                    })
                } catch (e) {
                    console.log("PlaylistDetail API Errors")
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/scss/_album-playlist.scss";
</style>