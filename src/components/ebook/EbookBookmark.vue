<template>
    <article class="ebook-bookmark">
        <section class="ebook-bookmark-text-wrapper">
            <section class="ebook-bookmark-down-wrapper">
                <span class="icon-down"></span>
            </section>
            <div class="ebook-bookmark-text">
                {{ text }}
            </div>
        </section>
        <section class="ebook-bookmark-icon-wrapper">
            <bookmark :color=" 'red' " :width="15" :height="35"></bookmark>
        </section>
    </article>
</template>

<script>
import Bookmark from '../common/Bookmark'
const BLUE = '#346cbc'
const WHITE = '#fff'
export default {
    components: {
        Bookmark
    },
    watch: {
        offsetY(v) {
            
        }
    },
    data() {
        return {
            text: this.$t('book.pulldownAddMark')
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global.scss';
.ebook-bookmark {
    position: absolute;
    top: px2rem(-350);
    left: 0;
    z-index: 200;
    width: 100%;
    height: px2rem(350);
    background: pink;

    .ebook-bookmark-text-wrapper {
        position: absolute;
        right: px2rem(45);
        bottom: 0;
        display: flex;

        .ebook-bookmark-down-wrapper {
            font-size: px2rem(14);
            color: white;
            transition: all .2 linear;
            @include center;
        }

        .ebook-bookmark-text {
            font-size: px2rem(14);
            color: white;
        }
    }

    .ebook-bookmark-icon-wrapper {
        position: absolute;
        right: 0;
        bottom: 0;
        margin-right: px2rem(15);
    }
}
</style>

