<template>
	<main id="app">
		<MenuBar />

		<section class="napster-container">
			<Header />
			<router-view :key="$route.fullPath"/>
		</section>

		<Player />
	</main>
</template>

<script>
	import MenuBar from "./components/MenuBar.vue"
	import Header from "./components/Header.vue"
	import Player from "./components/Player.vue"

	export default {
		name: "App",
		
		components: {
			MenuBar,
			Header,
			Player
		},

		created() {
			localStorage.getItem("napsterTracks") === null && localStorage.setItem("napsterTracks", JSON.stringify([]))
			localStorage.getItem("napsterAlbums") === null && localStorage.setItem("napsterAlbums", JSON.stringify([]))
			localStorage.getItem("napsterPlaylists") === null && localStorage.setItem("napsterPlaylists", JSON.stringify([]))
		},

		metaInfo: {
            title: "Napster Concept Redesign",
            meta: [
                { charset: "utf-8" },
                { name: "description", content: "This is a concept redesing using VueJS and Napster API. By Leonardo Funez" },
                { name: "viewport", content: "width=device-width, initial-scale=1" }
            ]
        },

		// watch: {
		// 	'$route':{
		// 		handler: (to) => {
		// 			document.title = to.meta.title || "Napster Concept Redesing",
		// 			document.description = "This is a concept redesign using VueJS and Napster API. By Leonardo Funez"
		// 		},
		// 		immediate: true
		// 	}
		// },

	};
</script>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
	@import "./assets/css/normalize.css";
	@import "./assets/scss/_globals.scss";
</style>
