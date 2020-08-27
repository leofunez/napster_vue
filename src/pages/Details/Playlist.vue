<template>
    <section class="page page__playlist">
        Playlist
    </section>
</template>

<script>
    import { mapActions } from "vuex"

    export default {
        metaInfo: {
            titleTemplate: "%s | Playlist",
        },

        created() {
            this.SET_CURRENT_PAGE('Playlist')
        },

        methods: {
            ...mapActions(['SET_CURRENT_PAGE'])
        }
    }
</script>