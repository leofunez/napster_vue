<template>
    <header class="header">
        <div class="wrapper">
            <h1 class="header__title">{{ current_page }}</h1>

            <div class="header__profile">
                <div class="header__dark-mode" @click="darkMode"></div>

                <p class="header__profile-name" v-text="user_name"></p>
                <div class="header__profile-avatar" :style="{'background-image': 'url(' + user_avatar + ')'}"></div>
                <div class="header__profile-more">
                    <div class="header__profile-menu">
                        <div class="header__profile-menu-item">Account settings</div>
                        <div class="header__profile-menu-item">Keyboard shortcuts</div>
                        <div class="header__profile-menu-item">Video tutorial</div>
                        <div class="header__profile-menu-item">Logout</div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
    import { mapGetters } from "vuex"

    export default {
        data() {
            return {
                current_page: "",
                user_name: "Leonardo Funez",
                user_avatar: require("../assets/img/profile/profile.png"),

                dark_mode: false
            }
        },

        created() {
            this.setPageTitle()
        },

        computed: {
            ...mapGetters(["GET_CURRENT_PAGE"])
        },

        methods: {
            setPageTitle() {
                this.current_page = this.GET_CURRENT_PAGE
            },

            darkMode() {
                if (this.dark_mode) {
                    document.querySelector("#app").classList.remove("is-dark")
                } else {
                    document.querySelector("#app").classList.add("is-dark")
                }

                this.dark_mode = !this.dark_mode
            }
        },

        watch: {
            GET_CURRENT_PAGE() {
                this.setPageTitle()
            }
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/_colors.scss";

    .header {
        margin-bottom: 40px;
        z-index: 3;
        position: relative;

        .wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        &__title {
            color: $blue;
            font-size: 20px;
            font-weight: 500;
            margin: 0;
        }

        &__notifications,
        &__search,
        &__dark-mode {
            height: 40px;
            width: 40px;
            margin-right: 10px;
            cursor: pointer;
            border-radius: 4px;

            &:hover {
                background-color: $gray;
            }
        }

        &__notifications {
            background: url("../assets/img/alert_gray.svg") no-repeat center / 20px;
        }

        &__search {
            background: url("../assets/img/search_gray.svg") no-repeat center / 20px;
        }

        &__dark-mode {
            background: url("../assets/img/dark_mode_dark.svg") no-repeat center / 18px;
            margin-right: 20px;

            &--active {
                background-image: url("../assets/img/dark_mode_on.svg");
            }
        }

        &__profile {
            display: flex;
            align-items: center;

            &-name {
                font-size: 14px;
                font-weight: 500;
                margin-right: 12px;
            }

            &-avatar {
                height: 40px;
                width: 40px;
                border-radius: 50%;
            }

            &-more {
                cursor: pointer;
                background: url("../assets/img/more.svg") no-repeat center / 4px;
                height: 40px;
                width: 40px;
                position: relative;

                &:hover {
                    .header__profile-menu {
                        opacity: 1;
                        visibility: visible;
                    }
                }
            }

            &-menu {
                position: absolute;
                border-radius: 4px;
                background: $white;
                text-align: right;
                width: 200px;
                right: 10px;
                top: 50px;
                border: 1px solid $gray;
                padding: 10px 0;
                box-shadow: 0 0 40px $gray;
                opacity: 0;
                visibility: hidden;
                transition: all .2s ease-in-out;

                &-item {
                    color: $dark;
                    padding: 8px 20px;
                    font-size: 14px;
                    font-weight: 400;
                    cursor: pointer;

                    &:hover {
                        color: $blue;
                    }
                }
            }
        }

        // Media
            @media screen and (max-width: 680px){
                margin-bottom: 20px;

                &__title {
                    font-size: 18px;
                }

                &__profile {
                    &-name {
                        display: none;
                    }
                }
            }
        // .Media
    }
</style>