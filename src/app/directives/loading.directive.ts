import {
  afterNextRender,
  Directive,
  ElementRef,
  inject,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

const LOADING_ICON = `<svg class="svg-inline--fa fa-spinner-third fa-spin" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="spinner-third" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 0c-17.7 0-32 14.3-32 32s14.3 32 32 32V0zM422.3 352c-8.9 15.3-3.6 34.9 11.7 43.7s34.9 3.6 43.7-11.7L422.3 352zM256 64c106 0 192 86 192 192h64C512 114.6 397.4 0 256 0V64zM448 256c0 35-9.4 67.8-25.7 96L477.7 384c21.8-37.7 34.3-81.5 34.3-128H448z"></path></svg>`;

@Directive({
  selector: '[loading]',
  standalone: true,
})
export class LoadingStateDirective implements OnChanges {
  @Input() public loading = false;

  private renderer = inject(Renderer2);
  private elementRef: ElementRef<HTMLButtonElement> = inject(ElementRef);
  private sanitizer = inject(DomSanitizer);

  private span = this.renderer.createElement('span');
  private mdcBtnLabel =
    this.elementRef.nativeElement.querySelector('.mdc-button__label');

  private enableLoading() {
    if (this.mdcBtnLabel) {
      this.renderer.addClass(this.mdcBtnLabel, 'transition');
      this.renderer.addClass(this.mdcBtnLabel, 'opacity-0');
    }

    this.renderer.removeClass(this.span, 'opacity-0');
    this.renderer.setAttribute(
      this.elementRef.nativeElement,
      'disabled',
      'true'
    );
  }

  private disableLoading() {
    this.renderer.addClass(this.span, 'opacity-0');
    if (this.mdcBtnLabel) {
      this.renderer.removeClass(this.mdcBtnLabel, 'opacity-0');
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'disabled');
    }
  }

  public constructor() {
    afterNextRender(() => {
      this.span = this.renderer.createElement('span');
      this.mdcBtnLabel =
        this.elementRef.nativeElement.querySelector('.mdc-button__label');
      this.renderer.setProperty(this.span, 'innerHTML', LOADING_ICON);
      this.renderer.addClass(this.span, 'absolute');
      this.renderer.addClass(this.span, 'transition');
      this.renderer.addClass(this.span, 'opacity-0');
      this.renderer.addClass(this.mdcBtnLabel, 'transition');
      if (this.loading && this.mdcBtnLabel) this.enableLoading();
      this.renderer.appendChild(this.elementRef.nativeElement, this.span);
    });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (!changes['loading']) return;
    if (this.loading) {
      this.enableLoading();
      return;
    }

    this.disableLoading();
  }
}
