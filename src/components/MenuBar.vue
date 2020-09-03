<template>
    <div class="menu-bar">
        <router-link to="/" class="menu-bar__logo"></router-link>

        <div class="menu-bar__items">
            <div class="menu-bar__block">
                <h2 class="menu-bar__title">Library</h2>
                <router-link to="/" class="menu-bar__item menu-bar__item--dashboard" active-class="menu-bar__item--active" exact>Dashboard</router-link>
                <router-link to="/explore" class="menu-bar__item menu-bar__item--explore" active-class="menu-bar__item--active">Explore</router-link>
                <router-link to="/playlists" class="menu-bar__item menu-bar__item--playlists" active-class="menu-bar__item--active">Playlists</router-link>
            </div>

            <div class="menu-bar__block">
                <div class="menu-bar__title">My Music</div>
                <router-link to="/my-playlists" class="menu-bar__item menu-bar__item--my-playlists" active-class="menu-bar__item--active">Playlists</router-link>
                <router-link to="/my-albums" class="menu-bar__item menu-bar__item--my-albums" active-class="menu-bar__item--active">Albums</router-link>
                <router-link to="/my-tracks" class="menu-bar__item menu-bar__item--my-tracks" active-class="menu-bar__item--active">Tracks</router-link>
            </div>    
        </div>
    </div>
</template>

<style lang="scss">
    @import "../assets/scss/_colors.scss";
    
    .menu-bar {
        width: 256px;
        height: calc(100vh - 130px);
        border-radius: 0 0 0 50px;
        z-index: 1;
        background: url("../assets/img/menu/bg.svg") no-repeat center / cover $dark;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        box-shadow: 0 4px 40px #051023b3;

        &__logo {
            background: url("../assets/img/logos/logo.svg") no-repeat center;
            width: 100%;
            height: 35px;
            top: 60px;
            display: block;
            margin: auto;
            position: absolute;
        }

        &__block {
            &:not(:last-of-type) {
                margin-bottom: 80px;
            }
        }

        &__title {
            text-transform: uppercase;
            font-size: 14px;
            font-weight: 500;
            padding: 0 60px 20px;
            color: $blue;
        }
        
        &__items {
            padding-top: 35px;
        }
        
        &__item {
            color: $white;
            display: block;
            font-size: 16px;
            padding: 10px 0 10px 95px;
            position: relative;
            
            &--dashboard {
                background: url("../assets/img/menu/dashboard.svg") no-repeat 60px center / 18px;
            }
            
            &--explore {
                background: url("../assets/img/menu/explore.svg") no-repeat 58px center / 20px;
            }
            
            &--playlists {
                background: url("../assets/img/menu/playlists.svg") no-repeat 58px center / 20px;
            }
            
            &--my-playlists {
                background: url("../assets/img/menu/playlists_2.svg") no-repeat 60px center / 22px;
            }
            
            &--my-albums {
                background: url("../assets/img/menu/albums.svg") no-repeat 60px center / 18px;
            }
            
            &--my-tracks {
                background: url("../assets/img/menu/tracks.svg") no-repeat 60px center / 17px;
            }
            
            &--last {
                margin-bottom: 80px;
            }

            &:before {
                content: '';
                height: 5px;
                width: 5px;
                background: $green;
                box-shadow: 0 0 5px $green;
                position: absolute;
                left: 40px;
                top: 18px;
                border-radius: 50%;
                opacity: 0;
                visibility: hidden;
                transition: all 0.2s ease;
            }

            &--active {
                &:before {
                    opacity: 1;
                    visibility: visible;
                }
            }
        }

        // Media
            @media screen and (max-width: 1200px) {
                width: 100px;
                height: 100vh;
                border-radius: 0;
                display: none;

                &__logo {
                    width: 36px;
                    height: 36px;
                    background-position: 0 center;
                    left: 32px;
                }

                &__title {
                    display: none;
                }

                &__item {
                    font-size: 0;
                    height: 50px;
                    width: 100px;
                    padding-left: 30px;
                    background-position: 40px center;

                    &:before {
                        left: 20px;
                        top: 24px;
                    }
                }
            }

            @media screen and (max-width: 680px) {
                width: 60px;
                height: calc(100vh - 134px);

                &__logo {
                    left: 12px;
                    top: 40px;
                }

                &__items {
                    padding-top: 0;
                }

                &__block {
                    &:not(:last-of-type) {
                        margin: 0;
                    }
                }

                &__item {
                    width: 100%;
                    padding-left: 0;
                    background-position: center;

                    &:before {
                        left: 46px;
                        top: 25px;
                        height: 3px;
                        width: 3px;
                    }
                }
            }
        // .Media
    }
</style>