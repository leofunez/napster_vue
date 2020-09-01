<template>
    <section class="page page__my-albums">
        <div class="wrapper">
            <p class="message message--error" v-text="'There are some problems with Napster API'" v-if="error_message"></p>

            <div class="card-list card-list--4-columns" v-if="albums.length > 0">
                <Card
                    v-for="(album, index) in albums"
                    :key="index"
                    :id="album.id"
                    :title="album.title"
                    :subtitle="album.subtitle"
                    :image="album.image"
                    :type="album.type"
                    card_style="content-out"
                    @toggleCardLike="onToggleCardLike"
                />  
            </div>

            <Loader text="Loading my albums..." :visible="albums.length == 0 && !message" />

            <p class="message" v-text="'You have no favorite albums :('" v-if="message"></p>
        </div>
    </section>
</template>

<script>
    import { Keys } from "@/services/keys"
    import axios from "axios"
    import { mapActions } from "vuex"

    import Card from "@/components/Card"
    import Loader from "@/components/Loader"

    export default {
        metaInfo: {
            titleTemplate: "%s | My Albums",
        },

        components: {
            Card,
            Loader
        },

        data() {
            return {
                keys: Keys,
                albums: [],
                message: false,
                error_message: false
            }
        },

        created() {
            this.SET_CURRENT_PAGE("My Albums")
            this.getStorageAlbums()
        },

        methods: {
            ...mapActions(["SET_CURRENT_PAGE"]),

            getStorageAlbums(){
                let localStorageAlbums = localStorage.getItem("napsterAlbums")
                let JSONStorageAlbums = JSON.parse(localStorageAlbums)

                if (JSONStorageAlbums.length > 0) {
                    JSONStorageAlbums.forEach( album => {
                        axios
                        .get(`https://api.napster.com/v2.2/albums/${album}?apikey=${this.keys.api_key}`)
                        .then( album => {
                            this.albums = [...this.albums, {
                                id: album.data.albums[0].id,
                                title: album.data.albums[0].name,
                                subtitle: album.data.albums[0].artistName,
                                image: `https://direct.napster.com/imageserver/v2/albums/${album.data.albums[0].id}/images/500x500.jpg`,
                                type: "album"
                            }]
                        })
                        .catch( () => this.error_message = true)
                    })
                } else {
                    this.showMessage()
                }
			},

            showMessage() {
                this.message = true
            },

            onToggleCardLike(album_id) {
                let albumIndex = this.albums.findIndex( album => album.id === album_id)
                
                this.albums.splice(albumIndex, 1)

                this.albums.length === 0 && this.showMessage()
            }
        }
    }
</script>