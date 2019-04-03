<template>
    <article class="ebook-loading">
        <section class="ebook-loading-wrapper">
            <div class="ebook-loading-item" v-for="(item, index) in data" :key="index">
                <section class="ebook-loading-line-wrapper" v-for="(subItem, subIndex) in item" :key="subIndex">
                    <div class="ebook-loading-line" ref="line"></div>
                </section>
            </div>
            <div class="ebook-loading-center"></div>
        </section>
    </article>
</template>

<script>
import { px2rem } from '../../utils/utils';
export default {
    data() {
        return {
            data: [
                [{}, {}, {}],
                [{}, {}, {}],
            ],
            lineWidth: [
                { value: 80 },
                { value: 80 },
                { value: 80 },
                { value: 80 },
                { value: 80 },
                { value: 80 }
            ],
            sub: true,
        }
    },
    mounted() {
        this.task = setInterval(() => {
            this.$refs.line.forEach((item, index) => {
                const line = this.$refs.line[index];
                let lineWidth = this.lineWidth[index];
                if (this.sub) {
                    lineWidth.value--;                 
                } else {
                    lineWidth.value++
                }
                line.style.width = `${ px2rem(lineWidth.value) }rem`
                line.style.flex = `0 0 ${ px2rem(lineWidth.value) }rem`
                if (lineWidth.value === 0) {
                    lineWidth.value = 80;
                }
            })    
        }, 50); 
    },
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";

.ebook-loading {
    position: relative;
    z-index: 400;
    width: px2rem(200); //63
    height: px2rem(100); //40
    background: transparent;
    border: px2rem(1.5) solid white;
    border-radius: px2rem(3);

    .ebook-loading-wrapper {
        display: flex;
        width: 100%;
        height: 100%;

        .ebook-loading-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: px2rem(7) 0;

            .ebook-loading-line-wrapper {
                flex: 1;
                @include left;
                padding: 0 px2rem(10);
                box-sizing: border-box;

                .ebook-loading-line {
                    flex: 0 0 px2rem(80); //16
                    width: px2rem(80); //16
                    height: px2rem(2);
                    background: white;
                }
            }
        }

        .ebook-loading-center {
            position: absolute;
            left: 50%;
            top: 0;
            width: px2rem(1.5);
            height: 100%;
            background: white;
        }
    }
}
</style>
