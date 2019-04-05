<template>
<div class="ebook-reader">
    <div id="read"></div>
    <div 
        class="ebook-reader-mask"
        @click="onMaskClick"
        @touchmove="move"
        @touchend="moveEnd"
        @mousedown.left="onMouseEnter"
        @mousemove.left="onMouseMove"
        @mouseup.left="onMouseEnd"></div>
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
    saveTheme,
    getLocation
} from '../../utils/localStorage.js';
import { addCss, flatten } from '../../utils/book.js';

global.ePub = Epub;
export default {
    mixins: [ebookMixin],
    methods: {
        // 以下是pc端鼠标方法
        // 1 - 鼠标进入
        // 2 - 鼠标进入后的移动
        // 3 - 鼠标从移动状态松手
        // 4 - 鼠标还原

        onMouseEnter(e) {
            this.mouseState = 1;
            this.mouseStartTime = e.timeStamp;
            e.preventDefault();
            e.stopPropagation();
        },
        onMouseMove(e) {
            if (this.mouseState === 1) {
                this.mouseState = 2;
            } else if (this.mouseState === 2) {
                let offsetY = 0;
                if (this.firstOffsetY) {
                    offsetY = e.clientY - this.firstOffsetY;
                    this.setOffsetY(offsetY);
                } else {
                    this.firstOffsetY = e.clientY;
                }
            }
            e.preventDefault();
            e.stopPropagation();
        },
        onMouseEnd(e) {
            if (this.mouseState === 2) {
                this.setOffsetY(0);
                this.firstOffsetY = null;
                this.mouseState = 3;
            } else {
                this.mouseState === 4;
            }
            this.time = e.timeStamp - this.mouseStartTime;
            if (this.time < 200) {
                this.mouseState = 4;
            }
            e.preventDefault();
            e.stopPropagation();
        },

        //以下是mask蒙版方法
        onMaskClick (e) {
            console.log(this.mouseState);
            if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)) {
                return
            }
            const offsetX = e.offsetX;
            const width = window.innerWidth;
            if (offsetX > 0 && offsetX < width * 0.3) {
                this.prevPage();
            } else if (offsetX > 0 && offsetX > width * 0.7) {
                this.nextPage();
            } else {
                this.toggleTitleAndMenu();
            }
        },
        move(e) {
            let offsetY = 0;
            if (this.firstOffsetY) {
                offsetY = e.changedTouches[0].clientY - this.firstOffsetY;
                this.setOffsetY(offsetY);
            } else {
                this.firstOffsetY = e.changedTouches[0].clientY;
            }
            e.preventDefault();
            e.stopPropagation();
        },
        moveEnd(e) {
            this.setOffsetY(0);
            this.firstOffsetY = null;
        },

        prevPage() {
            if (this.rendition) {
                this.rendition.prev().then(() => {
                    this.refreshLocation();
                })
                this.hideTitleAndMenu();
            }
        },
        nextPage() {
            if (this.rendition) {
                this.rendition.next().then(() => {
                    this.refreshLocation();
                })
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
                saveTheme(this.fileName, defaultTheme);
            }
            this.setDefaultTheme(defaultTheme);
            this.themeList.forEach((theme) => {
                this.rendition.themes.register(theme.name, theme.style);
            });
            this.rendition.themes.select(defaultTheme);
        },
        initRendition() {
            this.rendition = this.book.renderTo('read', {
                width: window.innerWidth,
                height: window.innerHeight,
                method: 'default'
            });
            const location = getLocation(this.fileName);
            this.display(location, () => {
                this.initTheme();
                this.initFontFamily();
                this.initFontSize();
                this.initGlobalStyle();
            })
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
        },
        initGesture() {
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
        },
        parseBook() {
            // 获取封面图片
            this.book.loaded.cover.then((cover) => {
                this.book.archive.createUrl(cover).then((url) => {
                    this.setCover(url);
                })
            });
            // 获取标题和作者信息
            this.book.loaded.metadata.then((metadata) => {
                this.setMetadata(metadata);
            });
            // 获取目录信息
            this.book.loaded.navigation.then((nav) => {
                let navItem = flatten(nav.toc);
                function find(item, level = 0) {
                    if (!item.parent) {
                        return level;
                    } else {
                        return find(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
                    }
                }
                navItem.forEach(item => {
                    item.level = find(item)
                });
                this.setNavigation(navItem);
            })
        },
        initEpub() {
            const url = process.env.VUE_APP_RES_URL + '/epub/' + this.fileName + '.epub';
            this.book = new Epub(url);
            this.setCurrentBook(this.book);
            this.initRendition();
            // this.initGesture(); 
            this.parseBook();
            // 分页, 在book完全解析后调用
            this.book.ready.then(() => {
                //默认一页是750字
                return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
            }).then((locations) => {
                this.setBookAvailable(true);
                this.refreshLocation();
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
@import '../../assets/styles/global.scss';

.ebook-reader { 
    width: 100%;
    height: 100%;
    overflow: hidden;

    .ebook-reader-mask {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 150;
        width: 100%;
        height: 100%;
        background: transparent;
    }
}
</style>
