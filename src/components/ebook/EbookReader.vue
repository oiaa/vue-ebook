<template>
    <div class="ebook-reader">
        <div id="read"></div>
    </div>
</template>

<script>
//http://localhost:8080/#/ebook/Laws|2015_Book_ProtectingTheRightsOfPeopleWit
import Epub from 'epubjs';
import { mapActions } from 'vuex';
import { ebookMixin } from '../../utils/mixin.js';

global.ePub = Epub;
export default {
    mixins: [ebookMixin],
    methods: {
        prevPage () {
            if (this.rendition) {
                this.rendition.prev();
                this.hideTitleAndMenu();
            }
        },
        nextPage () {
            if (this.rendition) {
                this.rendition.next();
                this.hideTitleAndMenu();
            }
        },
        toggleTitleAndMenu () {
            if (this.menuVisible) {
                this.setSettingVisible(-1);
            }
            this.setMenuVisible(!this.menuVisible);
        },
        hideTitleAndMenu () {
            this.setMenuVisible(false);
            this.setSettingVisible(-1);
        },
        initEpub() {
            const url = 'http://localhost:8081/epub/' + this.fileName + '.epub';
            this.book = new Epub(url);
            this.setCurrentBook(this.book);
            this.rendition = this.book.renderTo('read', {
                width: window.innerWidth,
                height: window.innerHeight
            });
            this.rendition.display();
            this.rendition.on('touchstart', (event) => {
                this.touchStartX = event.changedTouches[0].clientX;
                this.touchTime = event.timeStamp;
            });
            this.rendition.on('touchend', (event) => {
                const offsetX = event.changedTouches[0].clientX - this.touchStartX; //手指滑动偏移量
                const time = event.timeStamp - this.touchTime; //手指滑动时间

                if (time < 500 && offsetX > 40) {
                    this.prevPage();
                } else if (time < 500 && offsetX < -40) { //滑动时间小于500ms 滑动距离大于40,向下翻页
                    this.nextPage();
                } else {
                    this.toggleTitleAndMenu();
                }
            });
        }
    },
    mounted() {
        const fileName = this.$route.params.fileName.split('|').join('/');
        this.setFileName(fileName).then(() => {
            this.initEpub();
        });
    },
}
</script>

<style lang="scss" scoped>

</style>
