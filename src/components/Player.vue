<template>
    <div class="main-player">
        <div class="main-player__current-song">
            <div class="main-player__photo" :style="{'background-image': 'url(' + track_photo + ')'}" v-if="track_photo"></div>
            
            <div class="main-player__text">
                <div class="main-player__song-title" v-text="track_name"></div>
                <div class="main-player__artist" v-text="track_artist"></div>
            </div>
        </div>

        <div class="main-player__controls">
            <div class="main-player__progress-bar">
                <span class="main-player__time" v-text="track_duration"></span>
                
                <div class="main-player__progress-bar-line">
                    <div class="main-player__progress-bar-current" :style="{'width' : current_bar + '%'}"></div>
                </div>
                
                <span class="main-player__time" v-text="track_current_time"></span>
            </div>

            <div class="main-player__buttons">
                <button class="main-player__shuffle" :class="{'main-player__shuffle--active': shuffle}" @click="shuffleTrackList"></button>
                <button class="main-player__previous" @click="prevTrack"></button>
                <button class="main-player__play" v-if="!is_playing" @click="playTrack"></button>
                <button class="main-player__play main-player__play--is-playing" v-if="is_playing" @click="pauseTrack"></button>
                <button class="main-player__next" @click="nextTrack"></button>
                <button class="main-player__repeat" :class="{'main-player__repeat--active': repeat}" @click="repeatTrack"></button>
            </div>
        </div>

        <div class="main-player__volume">
            <div class="main-player__volume-button"
                :class="{'main-player__volume--mute': mute, 'main-player__volume--low' : (volume > 0 && volume < 5 && !mute), 'main-player__volume--mid' : volume > 5}"
                @click="muteVolume">
            </div>
            <input
                type="range" 
                id="volume_control"
                min="1"
                max="10"
                class="main-player__volume-slider slider"
                :value="mute ? 0 : volume"
                @change="changeVolume($event)"
            />
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from "vuex"

    export default {
        data() {
            return {
                id: 1,
                track_name: "",
                track_artist: "",
                track_photo: "",

                track: new Audio(),
                track_isnew: true,
                track_src: "",
                track_duration: "0:00",
                track_current_time: "0:00",

                current_time: 0,
                current_bar: "0",
                volume: 0.5,
                mute: false,
                is_playing: false,
                shuffle: false,
                repeat: false
            }
        },

        methods: {
            ...mapActions(["SET_PLAYING", "SET_CURRENT_TRACK", "SET_SHUFFLE", "SET_REPEAT"]),

            setCurrentTrack() {
                let track = this.GET_CURRENT_TRACK[0]
                this.track_name = track.track_name
                this.track_artist = track.artist_name
                this.track_photo = track.album_photo
                this.track_src = track.track_url

                this.is_playing = this.GET_PLAYING
            },

            playTrack() {
                if (this.GET_CURRENT_TRACK.album_id !== "") {
                    this.SET_PLAYING(true)
                    this.track.src = this.GET_CURRENT_TRACK[0].track_url
                    this.track.load()
                    this.track.play()
                    this.is_playing = true

                    this.track.ontimeupdate = () => {
                        this.track_duration = this.getTrackTime(this.track.duration)
                        this.track_current_time = this.getTrackTime(this.track.currentTime)
                        this.current_bar = parseInt(this.track.currentTime * 33 / 10) + 1
                        
                        if(this.current_bar === 100){
                            this.SET_PLAYING(false)
                            this.resetPlayer()
                            
                            if (this.GET_REPEAT) {
                                setTimeout( () => {
                                    this.track.load()
                                    this.track.play()
                                    this.is_playing = true
                                    this.SET_PLAYING(true)
                                }, 500)
                            } else {
                                this.nextTrack()
                            }
                        }
                    }
                }
            },

            pauseTrack() {
                this.SET_PLAYING(false)
                this.track.pause()
                this.is_playing = false
            },

            getTrackTime(duration) {
				let s = parseInt(duration % 60)
				if (s < 10) s = "0" + s
				let m = parseInt((duration / 60) % 60)

				return m + ":" + s
            },
            
            resetPlayer() {
				this.track_duration = "0:00"
				this.current_bar = "0"
				this.track_current_time = "0:00"
				this.is_playing = false
				this.SET_PLAYING(false)
            },

            prevTrack() {
                let current_track = this.GET_CURRENT_TRACK[0]
                
                if (current_track !== undefined) {
                    let index_next_track = ''
                    let prev_track = ''
                    let new_track = ''

                    current_track.track_index === 0 ? index_next_track = this.GET_TRACK_LIST[0].length -1 : index_next_track = current_track.track_index - 1

                    if (!this.GET_SHUFFLE) {
                        prev_track = this.GET_TRACK_LIST[0][index_next_track]
                    } else {
                        prev_track = this.GET_TRACK_LIST[0][Math.floor(Math.random() * this.GET_TRACK_LIST[0].length)]
                    }

                    new_track = {
                        track_index: index_next_track,
                        track_id:    prev_track.track_id,
                        track_name:  prev_track.track_name,
                        track_url:   prev_track.track_url,
                        artist_id:   prev_track.artist_id,
                        artist_name: prev_track.artist_name,
                        album_id:    prev_track.album_id    ? prev_track.album_id    : current_track.album_id,
                        album_name:  prev_track.album_name  ? prev_track.album_name  : current_track.album_name,
                        album_photo: prev_track.album_photo ? prev_track.album_photo : current_track.album_photo,
                    }

                    this.changeTrack(new_track)
                } 
			},

            nextTrack() {
                let current_track = this.GET_CURRENT_TRACK[0]
                
                if (current_track !== undefined) {
                    let index_next_track = ""
                    let next_track = ""
                    let new_track = ""
                    
                    current_track.track_index === this.GET_TRACK_LIST[0].length -1 ? index_next_track = 0 : index_next_track = current_track.track_index + 1

                    if (!this.GET_SHUFFLE) {
                        next_track = this.GET_TRACK_LIST[0][index_next_track]
                    }else {
                        next_track = this.GET_TRACK_LIST[0][Math.floor(Math.random() * this.GET_TRACK_LIST[0].length)]
                    }
                    
                    new_track = {
                        track_index: index_next_track,
                        track_id:    next_track.track_id,
                        track_name:  next_track.track_name,
                        track_url:   next_track.track_url,
                        artist_id:   next_track.artist_id,
                        artist_name: next_track.artist_name,
                        album_id:    next_track.album_id    ? next_track.album_id    : current_track.album_id,
                        album_name:  next_track.album_name  ? next_track.album_name  : current_track.album_name,
                        album_photo: next_track.album_photo ? next_track.album_photo : current_track.album_photo,
                    }

                    this.changeTrack(new_track)
                }
            },
            
            changeTrack(track) {
                this.resetPlayer()
                this.track.src = track.track_url
                this.track.load()
				this.track.play()
				this.SET_CURRENT_TRACK(track)
				this.SET_PLAYING(true)
            },
            
            shuffleTrackList() {
                this.shuffle = !this.shuffle
				this.SET_SHUFFLE(this.shuffle)
			},

			repeatTrack() {
				this.repeat = !this.repeat
				this.SET_REPEAT(this.repeat)
            },
            
            changeVolume(e) {
                this.volume = parseInt(e.target.value)
                
                this.track.volume = e.target.value / 10
			},

			muteVolume() {
                this.mute = !this.mute
                this.track.volume = (this.volume / 10) ? !this.mute : 0
			}

        },

        computed: {
            ...mapGetters(["GET_CURRENT_TRACK", "GET_TRACK_LIST", "GET_PLAYING", "GET_SHUFFLE", "GET_REPEAT"])
        },

        watch: {
            GET_CURRENT_TRACK() {
                this.setCurrentTrack()

                !this.track.paused && this.pauseTrack()
                
                this.playTrack()
            },

            GET_PLAYING() {
                this.is_playing = this.GET_PLAYING
                
                this.GET_PLAYING ? this.playTrack() : this.pauseTrack()
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../assets/scss/_colors.scss";
    @import "../assets/scss/_slider.scss";

    .main-player {
        height: 180px;
        width: 100%;
        padding: 75px 60px 20px 60px;
        background: url("../assets/img/player/bg.svg") no-repeat center / cover $blue;
        display: flex;
        justify-content: space-between;
        position: absolute;
        bottom: 0;
        left: 0;
        color: $white;
        
        // Current Song
            &__current-song {
                width: 300px;
                display: flex;
                align-items: center;
            }

            &__text {
                display: flex;
                flex-direction: column;
            }
            
            &__photo {
                height: 70px;
                width: 70px;
                min-width: 70px;
                margin-right: 15px;
                border-radius: 4px;
                background-color: $dark;
                background-repeat: no-repeat;
                background-size: cover;
            }
            
            &__song-title {
                margin-bottom: 5px;
                color: $green;
                font-size: 14;
                font-weight: 600;
            }

            &__artist {
                font-size: 12px;
            }
        // .Current Song
        
        // Controls
            &__controls {
                width: 450px;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            // Progress Bar
                &__progress-bar {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;

                    &-line {
                        height: 1px;
                        background: #05102330;
                        position: relative;
                        flex: 1;
                        margin: 0 10px;
                    }

                    &-current {
                        background: $green;
                        height: 100%;
                        position: absolute;
                        box-shadow: 0 0 3px 0.5px $green;
                        left: 0;
                        width: 0;
                    }
                }

                &__time {
                    font-size: 12px;
                    font-weight: 500;
                }
            // .Progress Bar
            
            // Buttons
                &__buttons {
                    display: flex;
                    justify-content: center;

                    button {
                        height: 40px;
                        width: 56px;
                        cursor: pointer;
                        border: 0;
                        background-color: transparent;
                    }
                }
                
                &__shuffle {
                    background: url("../assets/img/player/shuffle.svg") no-repeat center;
                    position: relative;
                    
                    &:before {
                        content: "";
                        height: 5px;
                        width: 5px;
                        border-radius: 50%;
                        background: $green;
                        position: absolute;
                        left: 34px;
                        top: 11px;
                        box-shadow: 0 0 5px $green;
                        opacity: 0;
                        visibility: visible;
                        transition: all 0.2s ease;
                    }
                    
                    &--active {
                        &::before {
                            opacity: 1;
                            visibility: visible;
                        }
                    }
                }
                
                &__previous {
                    background: url("../assets/img/player/previous.svg") no-repeat center;
                }
                
                &__play {
                    background: url("../assets/img/player/play.svg") no-repeat center;
                    
                    &--is-playing {
                        background: url("../assets/img/player/pause.svg") no-repeat 14px center;
                    }
                }
                
                &__next {
                    background: url("../assets/img/player/next.svg") no-repeat center;
                }
                
                &__repeat {
                    background: url("../assets/img/player/repeat.svg") no-repeat center / 20px;
                    position: relative;
                    
                    &:before {
                        content: "";
                        height: 5px;
                        width: 5px;
                        border-radius: 50%;
                        background: $green;
                        position: absolute;
                        left: 33px;
                        top: 12px;
                        box-shadow: 0 0 5px $green;
                        opacity: 0;
                        visibility: visible;
                        transition: all 0.2s ease;
                    }
                    
                    &--active {
                        &::before {
                            opacity: 1;
                            visibility: visible;
                        }
                    }
                }
            // .Buttons
        // .Controls

        // Volume
            &__volume {
                width: 280px;
                display: flex;
                align-items: center;
                justify-content: flex-end;

                &-button {
                    background: url("../assets/img/player/volume_mid.svg") no-repeat center / 20px;
                    height: 30px;
                    width: 30px;
                    cursor: pointer;
                    margin-right: 10px;
                }

                &--mute {
                    background-image: url("../assets/img/player/volume_mute.svg");
                }

                &--low {
                    background-image: url("../assets/img/player/volume_low.svg");
                }
                
                &--hight {
                    background-image: url("../assets/img/player/volume_hight.svg");
                }

                &-slider {
                    width: 150px;
                }
            }
        // .Volume

        @media screen and (max-width: 1200px) {
            padding-left: 140px;
            
            &__current-song {
                padding-right: 40px;
            }
            
            &__volume {
                padding-left: 40px;
            }
        }

        @media screen and (max-width: 748px) {
            padding: 60px 20px 20px 20px;
            flex-direction: column;
            height: auto;
            z-index: 1;
            background-image: linear-gradient(to top, $dark 40%, #05102300);
            
            &__current-song {
                padding: 0;
                width: 100%;
            }
            
            &__photo {
                display: none;
            }
            
            &__text {
                display: none
            }
            
            &__controls {
                width: 100%;
            }
            
            &__volume {
                display: none;
            }
        }
    }
</style>