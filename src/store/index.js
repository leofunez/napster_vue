import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        current_page: "",

        current_track: {
            track_id: "",
			track_name: "",
			track_url: "",
			album_id: "",
			album_name: "",
			album_photo: ""
		},
		
		current_tracklist: {},

		playing: false,
		is_paused: false,
		repeat: false,
		shuffle: false,

		track_list: []
    },

    getters: {
        // Current Page
            GET_CURRENT_PAGE: (state) => state.current_page,

        // Current Track
			GET_CURRENT_TRACK: (state) => state.current_track,
		
		// Current Tracklist
			GET_CURRENT_TRACKLIST: (state) => state.current_tracklist,
                
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
            set_current_page: (state, data) => state.current_page = data,
            
        // Current Track
			set_current_track: (state, data) => {
				state.current_track = [],
				state.current_track = [...state.current_track, data]
			},
			empty_current_track: (state) => {
				state.current_track = [{
					track_id: "",
					track_name: "",
					track_url: "",
					album_id: "",
					album_name: "",
					album_photo: ""
				}]
			},
		
		// Current Tracklist
			set_current_tracklist: (state, data) => state.current_tracklist = data,
		
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
		
		// Current Tracklist
			SET_CURRENT_TRACKLIST: (context, data) => context.commit("set_current_tracklist", data),
		
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