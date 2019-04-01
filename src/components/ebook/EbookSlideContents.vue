<template>
<div class="ebook-slide-contents">
    <div class="slide-contents-search-wrapper">
        <div class="slide-contents-search-input-wrapper">
            <div class="slide-contents-search-icon">
                <span class="icon-search"></span>
            </div>
            <input type="text" class="slide-contents-search-input" :placeholder="$t('book.searchHint')" @click="showSearchPage">
        </div>
        <div class="slide-contents-search-cancel" v-if="searchVisible"         @click="hideSearchPage">
            {{ $t('book.cancel') }}
        </div>
    </div>
    <article class="slide-contents-book-wrapper">
        <section class="slide-contents-book-img-wrapper">
            <img :src="cover" class="slide-contents-book-img">
        </section>
        <section class="slide-contents-book-info-wrapper">
            <div class="slide-contents-book-title"></div>
            <div class="slide-contents-book-author"></div>
        </section>
        <section class="slide-contents-book-progress-wrapper">
            <div class="slide-contents-book-progress">
                <span class="progress">
                    {{ progress + '%' }}
                </span>
                <div class="progress-text">
                    {{ $t('book.haveRead2') }}
                </div>
            </div>
            <div class="slide-contents-book-time">
                {{ getReadTimeText() }}
            </div>
        </section>
    </article>
</div>
</template>

<script>
import {
    ebookMixin
} from '../../utils/mixin.js';
export default {
    mixins: [ebookMixin],
    data() {
        return {
            searchVisible: false
        }
    },
    methods: {
        showSearchPage() {
            this.searchVisible = true;
        },
        hideSearchPage() {
            this.searchVisible = false;
        }
    },
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";

.ebook-slide-contents {
    width: 100%;

    .slide-contents-search-wrapper {
        display: flex;
        width: 100%;
        height: px2rem(36);
        margin: px2rem(20) 0 px2rem(10) 0;
        padding: 0 px2rem(15);
        box-sizing: border-box;

        .slide-contents-search-input-wrapper {
            flex: 1;
            @include center;

            .slide-contents-search-icon {
                flex: 0 0 px2rem(28);
                font-size: px2rem(12);
                @include center;
            }

            .slide-contents-search-input {
                flex: 1;
                height: px2rem(32);
                width: 100%;
                font-size: px2rem(14);
                background: transparent;
                border: none;

                &:focus {
                    outline: none;
                }
            }
        }

        .slide-contents-search-cancel {
            flex: 0 0 px2rem(50);
            font-size: px2rem(14);
            @include right;
        }
    }
}
</style>