<template>
    <section class="page page__album">
        Album
    </section>
</template>

<script>
    import { mapActions } from "vuex"

    export default {
        metaInfo: {
            titleTemplate: "%s | Album",
        },

        created() {
            this.SET_CURRENT_PAGE('Album')
        },

        methods: {
            ...mapActions(['SET_CURRENT_PAGE'])
        }
    }
</script>