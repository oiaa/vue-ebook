<template>
<div class="ebook-slide-contents">
    <div class="slide-contents-search-wrapper">
        <div class="slide-contents-search-input-wrapper">
            <div class="slide-contents-search-icon">
                <span class="icon-search"></span>
            </div>
            <input 
                type="text" 
                class="slide-contents-search-input" 
                :placeholder="$t('book.searchHint')" 
                v-model="searchText"
                @keyup.enter.exact="search()"
                @click="showSearchPage">
        </div>
        <div class="slide-contents-search-cancel" v-if="searchVisible"         @click="hideSearchPage">
            {{ $t('book.cancel') }}
        </div>
    </div>
    <article class="slide-contents-book-wrapper" v-show="!searchVisible">
        <section class="slide-contents-book-img-wrapper">
            <img :src="cover" class="slide-contents-book-img">
        </section>
        <section class="slide-contents-book-info-wrapper">
            <div class="slide-contents-book-title">
                {{ metadata.title }}
            </div>
            <div class="slide-contents-book-author">
                {{ metadata.creator }}
            </div>
        </section>
        <section class="slide-contents-book-progress-wrapper">
            <div class="slide-contents-book-progress">
                <span class="progress">
                    {{ progress + '%' }}
                </span>
                <span class="progress-text">
                    {{ $t('book.haveRead2') }}
                </span>
            </div>
            <div class="slide-contents-book-time">
                {{ getReadTimeText() }}
            </div>
        </section>
    </article>
    <scroll 
        class="slide-contents-list" 
        ref="scroll" 
        :top="156" 
        :bottom="48" 
        v-show="!searchVisible">
        <div class="slide-contents-item" v-for="(item, index) in navigation" :key="index">
            <span class="slide-contents-item-label" 
                :style="contentItemStyle(item)" 
                :class="{'selected': section === index}"
                @click="displayContent(item.href)"
            >
                {{ item.label }}
            </span>
            <span class="slide-contents-item-page"></span>
        </div>
    </scroll>
    <scroll class="slide-search-list" v-show="searchVisible" :top="66" :bottom="48">
        <div 
            class="slide-search-item"
            @click="displayContent(item.cfi, true)" 
            v-for="(item, index) in searchList" 
            :key="index" 
            v-html="item.excerpt"></div>
    </scroll>
</div>
</template>

<script>
import {
    ebookMixin
} from '../../utils/mixin.js';
import Scroll from '../common/Scroll.vue';
import {px2rem} from '../../utils/utils';

export default {
    mixins: [ebookMixin],
    components: {
        Scroll
    },
    data() {
        return {
            searchVisible: false,
            searchList: null,
            searchText: ''
        }
    },
    methods: {
        doSearch(q) { // 搜索算法-官方
            return Promise.all(
                this.currentBook.spine.spineItems.map(
                    item => item.load(this.currentBook.load.bind(this.currentBook))
                    .then(item.find.bind(item, q))
                    .finally(item.unload.bind(item)))
            ).then(results => Promise.resolve([].concat.apply([], results)));
        },
        search() { // 关键字传入与关键字高亮显示
            if (this.searchText && this.searchText.length > 0) {
                this.doSearch(this.searchText).then((list) => {
                    this.searchList = list;
                    this.searchList.map(item => {
                        return item.excerpt = item.excerpt.replace(this.searchText, `<span class="content-search-text">${ this.searchText }</span>`)
                    });
                });
            }
            
        },
        displayContent(target, highlight = false) {
            this.display(target, () => {
                this.hideTitleAndMenu();
                if (highlight) {
                    this.currentBook.rendition.annotations.highlight(target)
                }
            })
        },
        contentItemStyle(item) {
            return {
                marginLeft: `${px2rem(item.level * 15)}rem`
            }
        },
        showSearchPage() {
            this.searchVisible = true;
        },
        hideSearchPage() {
            this.searchVisible = false;
            this.searchText = '';
            this.searchList = null;
        }
    },
    mounted() {
        
    },
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";

.ebook-slide-contents {
    width: 100%;
    font-size: 0;

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

    .slide-contents-book-wrapper {
        display: flex;
        width: 100%;
        height: px2rem(90);
        padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
        box-sizing: border-box;

        .slide-contents-book-img-wrapper {
            flex: 0 0 px2rem(45);
            box-sizing: border-box;
            padding: 0 px2rem(10);

            .slide-contents-book-img {
                width: px2rem(45);
                height: px2rem(60);
            }
        }

        .slide-contents-book-info-wrapper {
            flex: 1;

            .slide-contents-book-title {
                font-size: px2rem(14);
                width: px2rem(153.75);
                line-height: px2rem(16);
                @include ellipsis2(2);
            }

            .slide-contents-book-author {
                font-size: px2rem(12);
                width: px2rem(153.75);
                margin-top: px2rem(5);
                @include ellipsis2(2);
            }
        }

        .slide-contents-book-progress-wrapper {
            flex: 0 0 px2rem(70);

            .slide-contents-book-progress {

                .progress {
                    font-size: px2rem(14);
                }

                .progress-text {
                    font-size: px2rem(12);
                }
            }

            .slide-contents-book-time {
                font-size: px2rem(12);
                margin-top: px2rem(5);
            }
        }
    }

    .slide-contents-list {
        padding: 0 px2rem(15);
        box-sizing: border-box;

        .slide-contents-item {
            display: flex;
            padding: px2rem(20) 0;
            box-sizing: border-box;

            .slide-contents-item-label {
                flex: 1;
                font-size: px2rem(14);
                line-height: px2rem(16);
                @include ellipsis;
            }

            .slide-contents-item-page {

            }
        }
    }

    .slide-search-list {
        width: 100%;
        padding: 0 px2rem(15);
        box-sizing: border-box;

        .slide-search-item {
            font-size: px2rem(14);
            line-height: px2rem(16);
            padding: px2rem(20) 0;
            box-sizing: border-box;
        }
    }
}
</style>
