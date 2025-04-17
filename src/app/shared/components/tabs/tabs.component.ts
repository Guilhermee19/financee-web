import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent implements OnInit {
  @ViewChild('underline') public underline!: ElementRef;

  // Recebe as opções do array de fora
  @Input() options: string[] = [];
  // Recebe a opção inicial selecionada
  @Input() initialSelected: string = '';

  // Emite o valor da opção selecionada para o componente pai
  @Output() optionSelected: EventEmitter<string> = new EventEmitter();

  public ngOnInit(){
    this.changeFocus(this.initialSelected);
  }

  public setFocus = signal(this.initialSelected);  // Define o foco inicial

  public textWidth = 80; // Largura do texto
  public textPosition = 0; // Posição do underline

  public changeFocus(focus: string): void {
    this.setFocus.set(focus);
    this.updateTextPosition();
    this.optionSelected.emit(focus); // Emite o evento com a opção selecionada
  }

  // Função para atualizar a posição do texto e o tamanho do span
  public updateTextPosition() {
    const selectedOption = this.setFocus();

    // Localiza o elemento correspondente à opção selecionada
    const selectedIndex = this.options.indexOf(selectedOption);
    const selectedText: HTMLElement = document.getElementById(this.options[selectedIndex]) as HTMLElement;

    // Calculando a largura do texto
    this.textWidth = selectedText.offsetWidth;

    // Calculando a posição do texto para centralizar o span
    const textLeft = selectedText.offsetLeft;
    this.textPosition = textLeft + (selectedText.offsetWidth - this.textWidth) / 2;
  }

  // Retorna o estilo com as propriedades dinâmicas
  public get styleLine() {
    const padding = 40;

    return {
      width: `${this.textWidth+padding}px`,
      transform: `translateX(${this.textPosition - padding/2}px)`,
    };
  }
}
