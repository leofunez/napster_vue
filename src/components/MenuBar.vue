<template>
    <div class="menu-bar">
        <div class="menu-bar__wrapper">
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
        transition: background-color 0.4s ease-in-out;

        &__wrapper {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

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
                width: 100%;
                height: 100px;
                margin: 0 auto;
                border-radius: 0;
                padding: 20px 10px;
                background-color: $white;
                position: fixed;
                background-image: none;
                box-shadow: none;
                flex-direction: row;
                justify-content: space-between;

                &__wrapper {
                    width: 100%;
                    max-width: 980px;
                    margin: 0 auto;
                    flex-direction: row;
                    justify-content: space-between;
                }

                &__logo {
                    width: 136px;
                    height: 36px;
                    background-position: 0 center;
                    left: 0;
                    top: 0;
                    position: relative;
                    margin: 11px 0;
                }

                &__block {
                    display: flex;
                    margin: 0;

                    &:not(:last-of-type) {
                        margin: 0;
                    }
                }

                &__title {
                    display: none;
                }

                &__items {
                    display: flex;
                    padding-top: 0;
                }

                &__item {
                    font-size: 13px;
                    line-height: 35px;
                    color: $dark;
                    height: 60px;
                    width: auto;
                    padding: 10px 15px;
                    background-image: none;

                    &:before {
                        left: 5px;
                        top: 26px;
                        width: 4px;
                        height: 4px;
                    }
                }
            }

            @media screen and (max-width: 680px) {
                justify-content: center;

                &__logo {
                    width: 136px;
                }
                
                &__items {
                    display: none;
                }
            }

            @media screen and (max-width: 480px) {
                padding: 10px;
                height: 60px;

                &__logo {
                    margin: 0;
                }
            }
        // .Media
    }
</style>