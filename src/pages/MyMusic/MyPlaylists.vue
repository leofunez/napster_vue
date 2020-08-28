<template>
    <section class="page page__my-playlists">
        <div class="wrapper">
            <p class="message message--error" v-text="'There are some problems with Napster API'" v-if="error_message"></p>

            <div class="card-list card-list--4-columns" v-if="playlists.length > 0">
                <Card
                    v-for="(playlist, index) in playlists"
                    :key="index"
                    :id="playlist.id"
                    :title="playlist.title"
                    :subtitle="playlist.subtitle"
                    :image="playlist.image"
                    :type="playlist.type"
                    card_style="content-out"
                    @toggleCardLike="onToggleCardLike"
                />  
            </div>

            <Loader text="Loading my playlists..." :visible="playlists.length == 0 && !message" />

            <p class="message" v-text="'You have no favorite playlists :('" v-if="message"></p>
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
            titleTemplate: "%s | My Playlists",
        },

        components: {
            Card,
            Loader
        },

        data() {
            return {
                keys: Keys,
                playlists: [],
                message: false,
                error_message: false
            }
        },

        created() {
            this.SET_CURRENT_PAGE("My Playlists")
            this.getStoragePlaylists()
        },

        methods: {
            ...mapActions(["SET_CURRENT_PAGE"]),

            getStoragePlaylists(){
                let localStoragePlaylists = localStorage.getItem("napsterPlaylists")
                let JSONStoragePlaylists = JSON.parse(localStoragePlaylists)
                
                if (JSONStoragePlaylists.length > 0) {
                    JSONStoragePlaylists.forEach( pid => {
                        axios
                        .get(`https://api.napster.com/v2.2/playlists/${pid}?apikey=${this.keys.api_key}`)
                        .then( playlist => {
                            this.playlists = [...this.playlists, {
                                id: playlist.data.playlists[0].id,
                                title: playlist.data.playlists[0].name,
                                subtitle: `${playlist.data.playlists[0].favoriteCount} followers`,
                                image: `https://direct.napster.com/imageserver/v2/playlists/${playlist.data.playlists[0].id}/artists/images/1200x400.jpg`,
                                type: "playlist"
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

            onToggleCardLike(playlist_id) {
                let playlistIndex = this.playlists.findIndex( playlist => playlist.id === playlist_id)
                
                this.playlists.splice(playlistIndex, 1)

                this.playlists.length === 0 && this.showMessage()
            }
        }
    }
</script>