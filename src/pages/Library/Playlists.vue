<template>
    <section class="page page__playlists">
        <div class="wrapper">
            <!-- Featured Playlists -->
                <div class="featured-playlists" v-if="featured_playlists.length > 0">
                    <h2 class="block-title" v-text="'Featured Playlists'"></h2>

                    <div class="card-list card-list--4-columns">
                        <Card
                            v-for="(playlist, index) in featured_playlists"
                            :key="index"
                            :id="playlist.id"
                            :title="playlist.title"
                            :subtitle="playlist.subtitle"
                            :image="playlist.image"
                            :type="playlist.type"
                        />  
                    </div>
                </div>

                <Loader text="Loading featured playlists..." :visible="featured_playlists.length == 0" />
            <!-- .Featured Playlists -->

            <div class="divider" v-if="more_playlists.length > 0"></div>

            <!-- More Playlists -->
                <div class="more-playlists last-section-block" v-if="more_playlists.length > 0">
                    <h2 class="block-title" v-text="'More Playlists'"></h2>

                    <div class="card-list card-list--4-columns">
                        <Card
                            v-for="(playlist, index) in more_playlists"
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

                <Loader text="Loading more playlists..." :visible="more_playlists.length == 0" />
            <!-- .More Playlists -->
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
            titleTemplate: "%s | Playlists",
        },

        components: {
            Card,
            Loader
        },

        data() {
            return {
                featured_playlists: [],
				more_playlists: []
            }
        },

        created() {
            this.SET_CURRENT_PAGE("Playlists")
            
            this.getFeaturedPlaylists()
			this.getMorePlaylists()
        },

        methods: {
            ...mapActions(["SET_CURRENT_PAGE"]),

            async getFeaturedPlaylists() {
                const featured_playlists = await ApiService.getFeaturedPlaylists(12)
				featured_playlists.data.playlists.forEach( playlist => {
					this.featured_playlists = [...this.featured_playlists, {
						id: playlist.id,
						title: playlist.name,
						subtitle: `${playlist.favoriteCount} followers`,
						image: `http://direct.napster.com/imageserver/v2/playlists/${playlist.id}/artists/images/1200x400.jpg`,
						type: "playlist"
					}]
				})
            },

            async getMorePlaylists() {
                const more_playlists = await ApiService.getMorePlaylists(8, 10)
				more_playlists.data.playlists.forEach( playlist => {
					this.more_playlists = [...this.more_playlists, {
						id: playlist.id,
						title: playlist.name,
						subtitle: `${playlist.favoriteCount} followers`,
						image: `http://direct.napster.com/imageserver/v2/playlists/${playlist.id}/artists/images/1200x400.jpg`,
						type: "playlist"
					}]
				})
            }
        }
    }
</script>