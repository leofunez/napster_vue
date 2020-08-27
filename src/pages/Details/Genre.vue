<template>
    <section class="page page__genre">
        Genre
    </section>
</template>

<script>
    import { mapActions } from "vuex"

    export default {
        created() {
            this.SET_CURRENT_PAGE('Genre')
        },

        methods: {
            ...mapActions(['SET_CURRENT_PAGE'])
        }
    }
</script>