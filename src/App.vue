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
		}
	};
</script>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
	@import "./assets/css/normalize.css";
	@import "./assets/scss/_globals.scss";
</style>
