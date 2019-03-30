<template>
<div class="ebook-reader">
    <div id="read"></div>
</div>
</template>

<script>
//http://localhost:8080/#/ebook/Laws|2015_Book_ProtectingTheRightsOfPeopleWit
import Epub from 'epubjs';
import {
    mapActions
} from 'vuex';
import {
    ebookMixin
} from '../../utils/mixin.js';
import {
    getFontFamily,
    saveFontFamily,
    getFontSize,
    saveFontSize,
    getTheme,
    saveTheme
} from '../../utils/localStorage.js';

global.ePub = Epub;
export default {
    mixins: [ebookMixin],
    methods: {
        prevPage() {
            if (this.rendition) {
                this.rendition.prev();
                this.hideTitleAndMenu();
            }
        },
        nextPage() {
            if (this.rendition) {
                this.rendition.next();
                this.hideTitleAndMenu();
            }
        },
        toggleTitleAndMenu() {
            if (this.menuVisible) {
                this.setSettingVisible(-1);
                this.setFontFamilyVisible(false);
            }
            this.setMenuVisible(!this.menuVisible);
        },
        hideTitleAndMenu() {
            this.setMenuVisible(false);
            this.setSettingVisible(-1);
            this.setFontFamilyVisible(false);
        },
        initFontFamily() {
            let font = getFontFamily(this.fileName);
            if (!font) {
                saveFontFamily(this.fileName, this.defaultFontFamily);
            } else {
                this.rendition.themes.font(font);
                this.setDefaultFontFamily(font);
            }
        },
        initFontSize() {
            let fontSize = getFontSize(this.fileName);
            if (!fontSize) {
                saveFontSize(this.fileName, this.defaultFontSize);
            } else {
                this.rendition.themes.fontSize(fontSize);
                this.setDefaultFontSize(fontSize);
            }
        },
        initTheme () {
            let defaultTheme = getTheme(this.fileName);
            if (!defaultTheme) {
                defaultTheme = this.themeList[0].name;
                this.setDefaultTheme(defaultTheme);
                saveTheme(this.fileName, defaultTheme);
            }
            this.themeList.forEach((theme) => {
                this.rendition.themes.register(theme.name, theme.style);
            });
            this.rendition.themes.select(defaultTheme);
        },
        initEpub() {
            const url = 'http://localhost:8081/epub/' + this.fileName + '.epub';
            this.book = new Epub(url);
            this.setCurrentBook(this.book);
            this.rendition = this.book.renderTo('read', {
                width: window.innerWidth,
                height: window.innerHeight
            });
            this.rendition.display().then(() => {
                //书籍渲染完成衙，在缓存中获取字体字号
                this.initTheme();
                this.initFontFamily();
                this.initFontSize();
            });
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
                // event.preventDefault();
                // 在新版本的浏览器中如果我们给document绑定touchmove或者touchstart事件的监听器，这个passive是会被默认设置为true以提高性能
                // event.stopPropagation();
            });
            this.rendition.hooks.content.register((contents) => {
                //向书籍文件添加字体
                Promise.all([
                    contents.addStylesheet(`${ process.env.VUE_APP_RES_URL }/fonts/daysOne.css`),
                    contents.addStylesheet(`${ process.env.VUE_APP_RES_URL }/fonts/cabin.css`),
                    contents.addStylesheet(`${ process.env.VUE_APP_RES_URL }/fonts/montserrat.css`),
                    contents.addStylesheet(`${ process.env.VUE_APP_RES_URL }/fonts/tangerine.css`)
                ]).then(() => {
                    console.log('字体全部加载完毕');
                })
            })
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
