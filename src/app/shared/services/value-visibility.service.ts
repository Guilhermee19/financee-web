import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValueVisibilityService {
  private _isVisible = signal<boolean>(true);

  // Signal readonly para outros componentes
  public readonly isVisible = this._isVisible.asReadonly();

  constructor() {
    // Carregar preferência do localStorage
    const savedVisibility = localStorage.getItem('values-visibility');
    if (savedVisibility !== null) {
      this._isVisible.set(JSON.parse(savedVisibility));
    }
  }

  /**
   * Alterna a visibilidade dos valores
   */
  toggleVisibility(): void {
    const newValue = !this._isVisible();
    this._isVisible.set(newValue);

    // Salvar preferência no localStorage
    localStorage.setItem('values-visibility', JSON.stringify(newValue));
  }

  /**
   * Define a visibilidade dos valores
   */
  setVisibility(visible: boolean): void {
    this._isVisible.set(visible);
    localStorage.setItem('values-visibility', JSON.stringify(visible));
  }

  /**
   * Retorna o valor atual da visibilidade
   */
  getCurrentVisibility(): boolean {
    return this._isVisible();
  }
}
