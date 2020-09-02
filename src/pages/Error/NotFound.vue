<template>
    <div class="page-404">
        <div class="wrapper">
            <div class="page-404__info">
                <img class="page-404__image" :src="image">
                <p class="page-404__description" v-text="description"></p>
                <router-link class="page-404__button" to="/" v-text="'Go to Dashboard'" tag="button"></router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions } from "vuex"

    import error_image from "@/assets/img/404.svg"
    
    export default {
        metaInfo: {
            titleTemplate: "%s | Page Not Found",
        },

        data() {
            return {
                image: error_image,
                description: "The page cound't be found"
            }
        },

        created() {
            this.SET_CURRENT_PAGE("Page not found")
        },

        methods: {
            ...mapActions(["SET_CURRENT_PAGE"])
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/_colors.scss";
    
    .page-404 {
        min-height: calc(100% - 200px);
        display: flex;
        align-items: center;

        &__info {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        &__image {
            max-width: 450px;
            height: auto;
            margin-bottom: 20px;
        }

        &__description{
            font-style: italic;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 40px;
            text-align: center;
        }

        &__button {
            color: $white;
            background-color: $blue;
            // background-image: linear-gradient(100deg, $purple, $blue);
            border: 2px solid $dark;
            border-radius: 4px;
            padding: 12px 20px;
            font-weight: 600;
            transition: all 1s ease-in-out;

            &:hover {
                background-color: $purple;
            }
        }
    }
</style>