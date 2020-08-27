<template>
    <section class="page page__explore">
        <div class="wrapper">
            <!-- Top Albums -->
                <div class="top-albums" v-if="staff_albums.length > 0">
                    <h2 class="block-title" v-text="'Top Albums'"></h2>

                    <div class="card-list">
                        <Card
                            v-for="(album, index) in staff_albums"
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

                <Loader text="Loading albums..." :visible="staff_albums.length == 0" />
            <!-- .Top Albums -->

            <div class="divider" v-if="staff_albums.length > 0"></div>

            <!-- Top Playlists -->
                <div class="new-releases" v-if="top_playlists.length > 0">
                    <h2 class="block-title" v-text="'Top Playlists'"></h2>

                    <div class="card-list card-list--4-columns">
                        <Card
                            v-for="(playlist, index) in top_playlists"
							:key="index"
							:id="playlist.id"
							:title="playlist.title"
							:subtitle="playlist.subtitle"
							:image="playlist.image"
							:type="playlist.type"
							card_style="content-out"
                        />  
                    </div>
                </div>

                <Loader text="Loading playlists..." :visible="top_playlists.length == 0" />
            <!-- .Top Playlists -->

            <div class="divider" v-if="top_artists.length > 0"></div>

            <!-- Top Artists -->
                <div class="new-releases last-section-block" v-if="top_artists.length > 0">
                    <h2 class="block-title" v-text="'Top Artists'"></h2>

                    <div class="card-list card-list--4-columns">
                        <Card
                            v-for="(artist, index) in top_artists"
							:key="index"
							:id="artist.id"
							:title="artist.title"
							:subtitle="artist.subtitle"
							:image="artist.image"
							:type="artist.type"
							card_style="circled"
                        />  
                    </div>
                </div>

                <Loader text="Loading artists..." :visible="top_artists.length == 0" />
            <!-- .Top Artists -->
        </div>
    </section>
</template>

<script>
    import ApiService from "@/services/api"
    import { mapActions } from "vuex"

    import Card from "@/components/Card"
    import Loader from "@/components/Loader"

    export default {
        components: {
            Card,
            Loader
        },

        data() {
            return {
                staff_albums: [],
                top_playlists: [],
                top_artists: []
            }
        },

        created() {
            this.SET_CURRENT_PAGE("Explore")

            this.getStaffAlbums()
			this.getTopPlaylists()
			this.getTopArtists()
        },

        methods: {
            ...mapActions(["SET_CURRENT_PAGE"]),

            async getStaffAlbums() {
                const staff_albums = await ApiService.getStaffAlbums(12)
				staff_albums.data.albums.forEach( album => {
					this.staff_albums = [...this.staff_albums, {
						id: album.id,
						title: album.name,
						subtitle: album.artistName,
						image: `http://direct.napster.com/imageserver/v2/albums/${album.id}/images/500x500.jpg`,
						type: 'album'
					}]
				})
            },

            async getTopPlaylists() {
                const top_playlists = await ApiService.getTopPlaylists(12)
				top_playlists.data.playlists.forEach( playlist => {
					this.top_playlists = [...this.top_playlists, {
						id: playlist.id,
						title: playlist.name,
						subtitle: `${playlist.trackCount} tracks`,
						image: playlist.images[0].url,
						type: 'playlist'
					}]
				})
            },

            async getTopArtists() {
                const top_artists = await ApiService.getTopArtists(12)
				top_artists.data.artists.forEach( artist => {
					this.top_artists = [...this.top_artists, {
						id: artist.id,
						title: artist.name,
						image: `http://direct.napster.com/imageserver/v2/artists/${artist.id}/images/633x422.jpg`,
						type: 'artist'
					}]
				})
            }
        }
    }
</script>