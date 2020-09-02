<template>
	<main id="app">
		<MenuBar />

		<section class="napster-container napster-container--dark">
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
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{ name: "og:title", content: "Napster Concept Redesign" },
				{ name: "og:description", content: "This is a concept redesing using VueJS and Napster API. By Leonardo Funez" },
				{ name: "og:image", content: "https://napster-vue.netlify.app/social.jpg" },
				{ name: "twitter:card", content: "summary" },
				{ name: "twitter:title", content: "Napster Concept Redesign" },
				{ name: "twitter:description", content: "This is a concept redesing using VueJS and Napster API. By Leonardo Funez" },
				{ name: "twitter:image", content: "https://napster-vue.netlify.app/social.jpg" },
				{ name: "twitter:creator", content: "@lfunezdelchiaro" },
            ]
        },
	};
</script>

<style lang="scss">
	@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");
	@import "./assets/css/normalize.css";
	@import "./assets/scss/_globals.scss";
	@import "./assets/scss/_dark.scss";
</style>
