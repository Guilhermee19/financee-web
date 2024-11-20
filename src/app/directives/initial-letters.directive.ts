import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[initialLetters]',
  standalone: true,
})
export class InitialLettersDirective implements OnInit {
  @Input() initialLetters = 'Foo Bar';
  @Input() length = 2;

  constructor(private elementRef: ElementRef) {}

  linkingPrepositions = ['de', 'da', 'do', 'das', 'dos', 'e'];

  ngOnInit() {
    // Check if initialLetters is defined and has value
    if (this.initialLetters) {
      this.removeLinkingPrepositions();
      const initials = this.initialLetters
        .split(' ')
        .map((word) => word[0])
        .slice(0, this.length)
        .join('');

      this.initialLetters = initials.toUpperCase();
      this.elementRef.nativeElement.innerHTML = this.initialLetters;
    } else {
      console.warn('initialLetters is undefined');
    }
  }

  removeLinkingPrepositions() {
    this.initialLetters = this.initialLetters
      .split(' ')
      .filter((word) => !this.linkingPrepositions.includes(word.toLowerCase()))
      .join(' ');
  }
}
