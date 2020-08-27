<template>
    <section class="page page__artist">
        Artist
    </section>
</template>

<script>
    import { mapActions } from "vuex"

    export default {
        metaInfo: {
            titleTemplate: "%s | Artist",
        },

        created() {
            this.SET_CURRENT_PAGE('Artist')
        },

        methods: {
            ...mapActions(['SET_CURRENT_PAGE'])
        }
    }
</script>