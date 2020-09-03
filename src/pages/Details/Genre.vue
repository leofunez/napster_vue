<template>
    <section class="page page__genre">
        <div class="wrapper">
            <h2 class="page__title" v-text="genre_title"></h2>
            <p class="message message--error" v-text="'There are some problems with Napster API'" v-if="error_message"></p>

            <!-- Playlists -->
                <div class="new-releases" v-if="top_playlists.length > 0">
                    <h2 class="block-title" v-text="'Playlists'"></h2>

                    <div class="card-list card-list--mid">
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
            <!-- .Playlists -->

            <div class="divider" v-if="top_artists.length > 0"></div>

            <!-- Top Artists -->
                <div class="new-releases last-section-block" v-if="top_artists.length > 0">
                    <h2 class="block-title" v-text="'Related artists'"></h2>

                    <div class="card-list card-list--small">
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
        metaInfo: {
            titleTemplate: "%s | Genre",
        },

        components: {
            Card,
            Loader
        },

        data() {
            return {
                genre_id: this.$route.params.id,
                genre_title: "",
                genre_detail: [],
                top_playlists: [],
                top_artists: [],

                error_message: false
            }
        },

        created() {
            this.SET_CURRENT_PAGE("Genre"),

            this.getGenreDetail()
            this.getTopPlaylists()
            this.getTopArtists()
        },

        methods: {
            ...mapActions(["SET_CURRENT_PAGE"]),

            async getGenreDetail() {
                try {
                    const genre_detail = await ApiService.getGenreDetail(this.genre_id)

                    this.genre_title = genre_detail.data.genres[0].name
                } catch(e) {
                    this.error_message = true
                }
			},

			async getTopPlaylists() {
                try {
                    const top_playlists = await ApiService.getGenreTopPlaylists(this.genre_id)

                    top_playlists.data.playlists.forEach( playlist => {
                        this.top_playlists = [...this.top_playlists, {
                            id: playlist.id,
                            title: playlist.name,
                            subtitle: playlist.trackCount + " tracks",
                            image: `http://direct.napster.com/imageserver/v2/playlists/${playlist.id}/artists/images/1200x400.jpg`,
                            type: "playlist"
                        }]
                    })
                } catch(e) {
                    this.error_message = true
                }
			},

			async getTopArtists() {
                try {
                    const top_artists = await ApiService.getGenreTopArtists(this.genre_id)

                    top_artists.data.artists.forEach( artist => {
                        this.top_artists = [...this.top_artists, {
                            id: artist.id,
                            title: artist.name,
                            image: `http://direct.napster.com/imageserver/v2/artists/${artist.id}/images/633x422.jpg`,
                            type: "artist"
                        }]
                    })

                    this.show_top_artists = true
                } catch(e) {
                    this.error_message = true
                }
			}
        }
    }
</script>