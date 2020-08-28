<template>
    <section class="page page__artist">
        <div class="wrapper">
            <h2 class="page__title" v-text="artist_name"></h2>

            <div class="card-list card-list--4-columns">
                <Card
                    v-for="(album, index) in artist_albums"
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
    </section>
</template>

<script>
    import ApiService from "@/services/api"
    import { mapActions } from "vuex"

    import Card from "@/components/Card"

    export default {
        metaInfo: {
            titleTemplate: "%s | Artist",
        },

        components: {
            Card
        },

        data() {
            return {
                artist_id: this.$route.params.id,
				artist_name: "",
				artist_albums: []
            }
        },

        created() {
            this.SET_CURRENT_PAGE('Artist')
            this.getArtistDetail()
        },

        methods: {
            ...mapActions(['SET_CURRENT_PAGE']),

            async getArtistDetail(){
                try {
                    const artist = await ApiService.getArtistDetail(this.artist_id)
                    
                    this.artist_name = artist.data.artists[0].name
                    
                    this.getArtistAlbums()
                } catch (e) {
                    console.log("ArtistDetail API Errors")
                }
			},

			async getArtistAlbums(){
                try {
                    const artist_albums = await ApiService.getArtistAlbums(this.artist_id)

                    artist_albums.data.albums.forEach( album => {
                        this.artist_albums = [...this.artist_albums, {
                            id: album.id,
                            title: album.name,
                            subtitle: album.artistName,
                            image: `http://direct.napster.com/imageserver/v2/albums/${album.id}/images/500x500.jpg`,
                            type: "album"
                        }]
                    })
                } catch (e) {
                    console.log("ArtistDetail API Errors")
                }
			},
        }
    }
</script>