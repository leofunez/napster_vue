<template>
    <div class="like-button" :class="{'like-button--active': active}"></div>
</template>

<script>
    export default {
        props: ["active"]   
    }
</script>

<style lang="scss" scoped>
    .like-button {
        background: url("../assets/img/like_white.svg") no-repeat center / 22px;
        cursor: pointer;
        height: 50px;
        width: 50px;

        &--big {
            background-size: 30px;
        }

        &--small {
            background-size: 15px;
            height: 30px;
            width: 30px;
        }

        &--dark {
            background-image: url("../assets/img/like_dark.svg");
        }

        &--active {
            background-image: url("../assets/img/liked.svg");

            &:hover {
                opacity: 1;
            }
        }

        &:hover {
            opacity: 0.9;
        }
        // watchsavannah
    }
</style>