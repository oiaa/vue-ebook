<template>
    <transition name="fade">
        <div class="slide-content-wrapper" v-show="menuVisible && settingVisible === 3">
            <transition name="slide-right">
                <article class="content" v-if="settingVisible === 3">
                    <section class="content-page-wrapper" v-if="bookAvailable">
                        <div class="content-page">
                            <component :is="currentTab === 1 ? content : bookmark"></component>
                        </div>
                        <div class="content-page-tab">
                            <div class="content-page-tab-item" :class="{'selected': currentTab === 1}" @click="selectTab(1)">
                                {{ $t('book.navigation') }}
                            </div>
                            <div class="content-page-tab-item" :class="{'selected': currentTab === 2}" @click="selectTab(2)">
                                {{ $t('book.bookmark') }}
                            </div>
                        </div>
                    </section>
                    <section class="content-empty" v-else>
                        <ebook-loading></ebook-loading>
                    </section>
                </article>
            </transition>
            <div class="content-bg" @click="hideTitleAndMenu()"></div>
        </div>
    </transition>
</template>

<script>
import { ebookMixin } from '../../utils/mixin.js';
import EbookSlideContents from './EbookSlideContents.vue'
import EbookLoading from './EbookLoading.vue'

export default {
    mixins: [ebookMixin],
    components: {
        EbookSlideContents,
        EbookLoading
    },
    methods: {
        selectTab(tab) {
            this.currentTab = tab;
        }
    },
    data() {
        return {
            currentTab: 1,
            content: EbookSlideContents,
            bookmark: null
        }
    },
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";

.slide-content-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 300;
    display: flex;

    .content {
        flex: 0 0 85%;
        width: 85%;
        height: 100%;

        .content-page-wrapper {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;

            .content-page {
                flex: 1;
                width: 100%;
                overflow: hidden;
            }

            .content-page-tab {
                display: flex;
                flex: 0 0 px2rem(48);
                width: 100%;
                height: px2rem(48);

                .content-page-tab-item {
                    flex: 1;
                    font-size: px2rem(12);
                    @include center;
                }
            }
        }

        .content-empty {
            width: 100%;
            height: 100%;
            @include center;
        }
    }

    .content-bg {
        flex: 0 0 15%;
        width: 15%;
        height: 100%;
    }
}
</style>
