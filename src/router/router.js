import Vue from "vue"
import Router from "vue-router"

// Library
import Dashboard from "@/pages/Library/Dashboard"
import Explore from "@/pages/Library/Explore"
import Playlists from "@/pages/Library/Playlists"

// Details
import Album from "@/pages/Details/Album"
import Artist from "@/pages/Details/Artist"
import Genre from "@/pages/Details/Genre"
import Playlist from "@/pages/Details/Playlist"

// Favorites
import MyAlbums from "@/pages/MyMusic/MyAlbums"
import MyPlaylists from "@/pages/MyMusic/MyPlaylists"
import MyTracks from "@/pages/MyMusic/MyTracks"

Vue.use(Router)

export default new Router({
    mode: 'history',
    
    base: process.env.BASE_URL,
    
    scrollBehavior() {
        return {
            x: 0,
            y: 0
        }
    },

    routes: [
        { path: "/", name: "dashboard", component: Dashboard },
        { path: "/explore", name: "explore", component: Explore },
        { path: "/playlists", name: "playlists", component: Playlists },

        { path: "/album/:id", name: "album", component: Album },
        { path: "/artist/:id", name: "artist", component: Artist },
        { path: "/genre/:id", name: "genre", component: Genre },
        { path: "/playlist/:id", name: "playlist", component: Playlist },

        { path: "/my-albums", name: "my-albums", component: MyAlbums },
        { path: "/my-playlists", name: "my-playlists", component: MyPlaylists },
        { path: "/my-tracks", name: "my-tracks", component: MyTracks },
    ]
})