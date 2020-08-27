<template>
    <section class="page page__dashboard">
        <div class="wrapper">
            <!-- Top Albums -->
                <div class="top-albums" v-if="top_albums.length > 0">
                    <h2 class="block-title" v-text="'Top Albums'"></h2>

                    <div class="card-list">
                        <Card
                            v-for="(album, index) in top_albums"
                            :key="index"
                            :id="album.id"
                            :title="album.title"
                            :subtitle="album.subtitle"
                            :image="album.image"
                            :type="album.type"
                            card_style="big"
                        />  
                    </div>
                </div>

                <Loader text="Loading albums..." :visible="top_albums.length == 0" />
            <!-- .Top Albums -->

            <div class="divider" v-if="top_albums.length > 0"></div>

            <!-- New Releases -->
                <div class="new-releases" v-if="new_releases.length > 0">
                    <h2 class="block-title" v-text="'New Releases'"></h2>

                    <div class="card-list card-list--4-columns">
                        <Card
                            v-for="(album, index) in new_releases"
							:key="index"
							:id="album.id"
							:title="album.title"
							:subtitle="album.subtitle"
							:image="album.image"
							:type="album.type"
							card_style="content-out"
                        />  
                    </div>
                </div>

                <Loader text="Loading albums..." :visible="new_releases.length == 0" />
            <!-- .New Releases -->

            <div class="divider" v-if="new_releases.length > 0"></div>

            <!-- Top Tracks -->
                <div class="top-tracks" v-if="top_tracks.length > 0">
                    <h2 class="block-title" v-text="'Top Tracks'"></h2>
                    
                    <div class="track-list">
                        <Track
                            v-for="(track, index) in top_tracks"
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
                            :is_liked="tracks_liked.includes(track.album_id + '@' + track.id)"
                        />
                    </div>
                </div>
            <!-- .Top Tracks -->

            <div class="divider" v-if="top_tracks.length > 0"></div>

            <!-- Genres -->
                <div class="genres last-section-block" v-if="genres.length > 0">
                    <h2 class="block-title" v-text="'Genres'"></h2>

                    <div class="card-list card-list--5-columns">
                        <Card
                            v-for="(genre, index) in genres"
                            :key="index"
                            :id="genre.id"
                            :title="genre.title"
                            :image="genre.image"
                            :type="genre.type"
                            card_style="small"
                        />  
                    </div>
                </div>

                <Loader text="Loading genres..." :visible="genres.length == 0" />
            <!-- .Genres -->
        </div>
    </section>
</template>

<script>
    import ApiService from "@/services/api"
    import { mapGetters, mapActions } from "vuex"

    import Card from "@/components/Card"
    import Track from "@/components/Track"
    import Loader from "@/components/Loader"

    export default {
        components: {
            Card,
            Track,
            Loader
        },

        data() {
            return {
                top_albums: [],
                new_releases: [],
                top_tracks: [],
                genres: [],
                
                track_playing: '',
				tracks_liked: [],
				is_playing: false,
				is_paused: false,
            }
        },

        created() {
            this.SET_CURRENT_PAGE("Dashboard")

            this.getTopAlbums()
			this.getNewReleases()
			this.getTopTracks()
			this.getGenres()
            
            this.getStorageTracks()
        },

        methods: {
            ...mapActions(["SET_CURRENT_PAGE", "SET_TRACK_LIST"]),

            async getTopAlbums() {
                const response = await ApiService.getTopAlbums(6)
				response.data.albums.forEach( album => {
					this.top_albums = [...this.top_albums, {
						id: album.id,
						title: album.name,
						subtitle: album.artistName,
						image: `http://direct.napster.com/imageserver/v2/albums/${album.id}/images/500x500.jpg`,
						type: 'album'
					}]
				})
            },
            
            async getNewReleases(){
				const response = await ApiService.getNewReleases(8)
				response.data.albums.forEach( album => {
					this.new_releases = [...this.new_releases, {
						id: album.id,
						title: album.name,
						subtitle: album.artistName,
						image: `http://direct.napster.com/imageserver/v2/albums/${album.id}/images/500x500.jpg`,
						type: 'album'
					}]
				})
			},

            async getTopTracks(){
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
                    // console.log(track)

                    this.top_tracks = [...this.top_tracks, track_obj]
                })
                
                this.GET_TRACK_LIST.length === 0 && this.SET_TRACK_LIST(this.top_tracks)
			},
            
            async getGenres(){
				const response = await ApiService.getGenres(5)
				response.data.genres.forEach( genre => {
					this.genres = [...this.genres, {
						id: genre.id,
						title: genre.name,
						image: `http://direct.napster.com/imageserver/images/${genre.id}/240x160.jpg`,
						type: 'genre'
					}]
				})
            },
            
            getStorageTracks(){
				if (localStorage.getItem('napsterTracks') !== null) {
					this.tracks_liked = []
					this.tracks_liked = JSON.parse(localStorage.getItem('napsterTracks'))
                }
			},
        },

        computed: {
			...mapGetters(["GET_TRACK_LIST"]),
        },
    }
</script>