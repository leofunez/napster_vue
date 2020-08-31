<template>
    <router-link
        :to="'/' + type + '/' + id"
        tag="article"
        class="card"
        :class="[
            {'card--big' : card_style === 'big'},
            {'card--content-out' : card_style === 'content-out'},
            {'card--small' : card_style === 'small'},
            {'card--circled' : card_style === 'circled'}]"
        >
        
        <div class="card__info" v-if="card_style !== 'content-out'">
            <h2 class="card__title" v-text="title"></h2>
            <p class="card__subtitle" v-text="subtitle"></p>
        </div>

        <LikeButton
            v-if="card_style !== 'small' && card_style !== 'circled'"
            :active="is_liked"
            @click.native.prevent="likeCard(type, id)"
        />
        
        <div class="card__image" v-if="image" :style="{'background' : 'url(' + image + ') no-repeat center top / cover #091629'}"></div>

        <div class="card__info" v-if="card_style === 'content-out'">
            <h2 class="card__title" v-text="title"></h2>
            <h3 class="card__subtitle" v-text="subtitle"></h3>
        </div>
    </router-link>
</template>

<script>
    import LikeButton from "@/components/LikeButton"

    export default {
        props: {
            id: {
                type: String,
                required: true
            },
            title : {
                type: String,
                required: true
            },
            subtitle: {
                type: String,
                required: false
            },
            image: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: false
            },
            card_style: {
                type: String,
                required: false
            },
            text_style: {
                type: String,
                required: false
            }
        },

        components: {
            LikeButton
        },

        data() {
            return {
                is_liked: false
            };
        },

        created() {
            this.getStorageAlbums()
            this.getStoragePlaylists()
        },

        methods: {
            likeCard(type, card_id) {
                // Albums
                    if (type === "album") {
                        let JSONStorageAlbums = JSON.parse(localStorage.getItem("napsterAlbums"))
                        localStorage.removeItem("napsterAlbums")

                        if (JSONStorageAlbums.includes(card_id)) {
                            let indexItem = JSONStorageAlbums.indexOf(card_id)
                            JSONStorageAlbums.splice(indexItem, 1)
                            this.is_liked = false
                        } else {
                            JSONStorageAlbums = [...JSONStorageAlbums, card_id]
                            this.is_liked = true
                        }

                        localStorage.setItem("napsterAlbums", JSON.stringify(JSONStorageAlbums))
                    }
                // .Albums
                
                // Playlists
                    if (type === "playlist") {
                        let JSONStoragePlaylists = JSON.parse(localStorage.getItem("napsterPlaylists"))
                        localStorage.removeItem("napsterPlaylists")

                        if (JSONStoragePlaylists.includes(card_id)) {
                            let indexItem = JSONStoragePlaylists.indexOf(card_id)
                            JSONStoragePlaylists.splice(indexItem, 1)
                            this.is_liked = false
                        } else {
                            JSONStoragePlaylists = [...JSONStoragePlaylists, card_id]
                            this.is_liked = true
                        }

                        localStorage.setItem("napsterPlaylists", JSON.stringify(JSONStoragePlaylists))
                    }
                // .Playlists

                this.$emit("toggleCardLike", card_id)
            },

            getStorageAlbums() {
                if (localStorage.getItem("napsterAlbums") !== null) {
                    let storageAlbums = JSON.parse(localStorage.getItem("napsterAlbums"))
                    storageAlbums.includes(this.id) && (this.is_liked = true)
                }
            },

            getStoragePlaylists() {
                if (localStorage.getItem("napsterPlaylists") !== null) {
                    let storagePlaylists = JSON.parse(localStorage.getItem("napsterPlaylists"))
                    storagePlaylists.includes(this.id) && (this.is_liked = true)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../assets/scss/_colors.scss";
    
    .card {
        height: 210px;
        width: 100%;
        border-radius: 10px;
        color: $white;
        padding: 20px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: all 0.2s ease-in-out;
        
        &:hover {
            box-shadow: 0 0 16px #0000008a;
            
            .card-image {
                opacity: 0.4;
            }
        }

        &__info {
            position: relative;
            z-index: 2;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 20px;
        }

        &__title {
            color: $white;
            font-size: 18px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.4;
            text-transform: capitalize;
        }

        &__subtitle {
            font-size: 12px;
        }

        &__image {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            overflow: hidden;
            background-color: $dark;
            transition: all 0.2s ease-in-out;

            &:before {
                content: '';
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                background-image: linear-gradient(to bottom, rgba(5, 16, 35, 0.7), rgba(5, 16, 35, 0.4));
                z-index: 1;
                position: absolute;
            }
        }

        .like-button {
            position: absolute;
            top: 5px;
            right: 5px;
            z-index: 2;
        }

        &--big {
            height: 270px;

            .like-button {
                background-size: 30px;
                top: 10px;
                right: 10px;
            }
        }

        &--small {
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;

            .card {
                &__info {
                    position: relative;
                    text-align: center;
                    padding: 0 10px;
                }

                &__title {
                    font-size: 14px;
                }
            }
        }

        &--content-out {
            height: auto;
            padding: 0;
            color: $dark;
            border-radius: 0;
            overflow: visible;

            .card {
                &__image {
                    position: relative;
                    height: 210px;
                    border-radius: 10px;
                    overflow: hidden;
                }

                &__info {
                    position: relative;
                    padding: 10px 0 0;
                }

                &__title {
                    color: $dark;
                    font-weight: 500;
                    font-size: 15px;
                    margin-bottom: 4px;
                }

                &__subtitle {
                    font-weight: 500;
                    font-size: 12px;
                    opacity: 0.6;
                }
            }

            &:hover {
                box-shadow: none;

                .card {
                    &__image {
                        box-shadow: 0 0 16px #0000008a;
                    }
                }
            }
        }

        &--circled {
            border-radius: 50%;
            height: 175px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 2px solid $dark;

            .card {
                &__info {
                    position: relative;
                    padding: 0;
                }

                &__title {
                    font-size: 16px;
                    text-align: center;
                }

                &__image {
                    &:before {
                        background-image: linear-gradient(to bottom, rgba(0, 94, 255, 0.7), rgba(255, 0, 167, 0.4));
                    }

                    &:after {
                        content: "";
                        position: absolute;
                        width: 60%;
                        height: 108%;
                        background: $blue;
                        background-image: linear-gradient(to bottom, rgba(0, 94, 255, 0.7), rgba(255, 0, 167, 0.4));
                        transform: rotate(46deg);
                        left: 0px;
                        top: -40px;
                        opacity: 0.5;
                    }
                }
            }

            &:hover {
                box-shadow: 0 0 16px $blue;
            }
        }

        // Media
            @media screen and (max-width: 480px) {

            }
        // .Media
    }
</style>
