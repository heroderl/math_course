/**
 * 设置article标签的高度
 */
export default class ArticleComp {
    private el: HTMLElement;

    constructor (el: HTMLElement) {
        this.el = el;
    }

    private getOffsetTop (): number {
        return this.el.offsetTop || 0;
    }

    private getWinHeight (): number {
        return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }

    public setAttr (): void {
        this.el.style.height = this.getWinHeight() - this.getOffsetTop() + 'px';
    }

    public getArtHeig (): number {
        return (this.getWinHeight() - this.getOffsetTop());
    }
}
