import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        currentPage: "",

        currentTrack: {
            track_id: "",
			track_name: "",
			track_url: "",
			album_id: "",
			album_name: "",
			album_photo: ""
        },

		playing: false,
		is_paused: false,
		repeat: false,
		shuffle: false,

		track_list: []
    },

    getters: {
        // Current Page
            GET_CURRENT_PAGE: (state) => state.currentPage,

        // Current Track
            GET_CURRENT_TRACK: (state) => state.currentTrack,
                
        // Track List
            GET_TRACK_LIST: (state) => state.track_list,

        //Playing
			GET_PLAYING: (state) => state.playing,
			
		// Is Paused
			GET_IS_PAUSED: (state) => state.is_paused,

        // Repeat
            GET_REPEAT: (state) => state.repeat,

        // Shuffle
            GET_SHUFFLE: (state) => state.shuffle,
    },

    mutations: {
        // Current Page
            set_current_page: (state, data) => state.currentPage = data,
            
        // Current Track
			set_current_track: (state, data) => {
				state.currentTrack = [],
				state.currentTrack = [...state.currentTrack, data]
			},
			empty_current_track: (state) => {
				state.currentTrack = [{
					track_id: "",
					track_name: "",
					track_url: "",
					album_id: "",
					album_name: "",
					album_photo: ""
				}]
			},
		
		// Track List
			set_track_list: (state, data) => {
				state.track_list = [],
				state.track_list = [...state.track_list, data]
			},
			// empty_track_list: (state, data) => {
			// 	state.track_list = []
			// },

		// Playing
			set_playing: (state, data) => state.playing = data,
		
		// Is Paused
			set_is_paused: (state, data) => state.is_paused = data,
		
		// Repeat
			set_repeat: (state, data) => state.repeat = data,
		
		// Shuffle
			set_shuffle: (state, data) => state.shuffle = data
    },

    actions: {
        // Current Page
            SET_CURRENT_PAGE: (context, data) => context.commit("set_current_page", data),
            
        // Current Track
			SET_CURRENT_TRACK: (context, data) => context.commit("set_current_track", data),
			SET_EMPTY_CURRENT_TRACK: (context) => context.commit("empty_current_track"),
		
		// Track List
			SET_TRACK_LIST: (context, data) => context.commit("set_track_list", data),
			EMPTY_TRACK_LIST: (context) => context.commit("empty_track_list"),

		// Playing
			SET_PLAYING: (context, data) => context.commit("set_playing", data),

		// Is Paused
			SET_IS_PAUSED: (context, data) => context.commit("set_is_paused", data),

		// Repeat
			SET_REPEAT: (context, data) => context.commit("set_repeat", data),
		
		// Shuffle
			SET_SHUFFLE: (context, data) => context.commit("set_shuffle", data)
    }
})