<template>
    <section class="page playlist-album">
        <div class="wrapper">
            <div class="playlist-album__top">
                <div class="playlist-album__photo" :style="{'background-image': 'url(' + album_image + ')'}"></div>
                <div class="playlist-album__info">
                    <h2 class="playlist-album__title" v-text="album_title"></h2>
                    <p class="playlist-album__subtitle" v-text="album_artist"></p>

                    <div class="playlist-album__bottom">
                        <button class="playlist-album__play-all" v-text="'Play all'"></button>
                        <input class="playlist-album__filter" type="search" placeholder="Filter...">

                        <LikeButton :is_dark="true" :active="is_liked" @click.native.prevent="likeAlbum()"/>
                    </div>
                </div>
            </div>

            <div class="divider"></div>

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
                    :track_subtitle_link="'/artists/' + track.artist_id"
                    :album_id="track.album_id"
                    :album_name="track.album_name"
                    :album_photo="track.album_photo"
                    :artist_id="track.artist_id"
                    :artist_name="track.artist_name"
                />
            </div>
        </div>
    </section>
</template>

<script>
    import ApiService from "@/services/api"
    import { mapActions } from "vuex"

    import Track from "@/components/Track"
    import LikeButton from "@/components/LikeButton"

    export default {
        metaInfo: {
            titleTemplate: "%s | Album",
        },

        components: {
            Track,
            LikeButton
        },

        data() {
            return {
                album_id: this.$route.params.id,
                album_title: "",
                album_artist: "",
                album_image: "",
                album_tracks: [],

                is_liked: false,

                filter: ""
            }
        },

        created() {
            this.SET_CURRENT_PAGE('Album')
            this.isLiked()
            this.getAlbumDetail()
        },

        methods: {
            ...mapActions(['SET_CURRENT_PAGE']),

            async getAlbumDetail() {
				const album_detail = await ApiService.getAlbumDetail(this.album_id)
				
				this.album_title = album_detail.data.albums[0].name
				this.album_artist = album_detail.data.albums[0].artistName
				this.album_image = `http://direct.napster.com/imageserver/v2/albums/${this.album_id}/images/500x500.jpg`

				this.getAlbumTracks()
            },
            
            async getAlbumTracks() {
				const album_tracks = await ApiService.getAlbumTracks(this.album_id)

				album_tracks.data.tracks.map( track => {
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

					this.album_tracks = [...this.album_tracks, track_obj]
				})
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/scss/_album-playlist.scss";
</style>