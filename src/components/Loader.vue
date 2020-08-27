<template>
    <div class="loader" v-if="visible">
        <p class="loader__text" v-text="text"></p>
    </div>
</template>

<script>
    export default {
        props: [
            "visible",
            "text"
        ]
    }
</script>

<style lang="scss" scoped>
    .loader {
        margin: 60px 0;
        
        &__text {
            font-size: 16px;
            font-weight: 500;
            background: url("../assets/img/loader.svg") no-repeat 0 center / 40px;
            padding-left: 45px;
        }
    }
</style>