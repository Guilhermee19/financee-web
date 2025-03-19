import { MatDialogConfig } from "@angular/material/dialog";

export const MONTHS = [
  { label: 'Janeiro', month: 1 },
  { label: 'Fevereiro', month: 2 },
  { label: 'Março', month: 3 },
  { label: 'Abril', month: 4 },
  { label: 'Maio', month: 5 },
  { label: 'Junho', month: 6 },
  { label: 'Julho', month: 7 },
  { label: 'Agosto', month: 8 },
  { label: 'Setembro', month: 9 },
  { label: 'Outubro', month: 10 },
  { label: 'Novembro', month: 11 },
  { label: 'Dezembro', month: 12 },
];

export interface IDialogActions {
  action: 'yes' | 'no';
}

export const CONFIG_MODAL_CENTER: MatDialogConfig = {
  panelClass: 'custom-dialog-center',
  width: '90%',
  maxWidth: '500px',
  height: 'auto',
  data: {
    title_popup: '',
    description: '',
  },
};

export const CONFIG_MODAL_TRANSACTION: MatDialogConfig = {
  panelClass: 'custom-dialog', // classe CSS personalizada
  disableClose: true, // Impede o fechamento automático
  position: { right: '1rem', top: '1rem' }, // posição no canto superior direito
  width: 'calc(100% - 2rem)', // ajuste o tamanho conforme necessário
  maxWidth: '380px',
  height: 'calc(100dvh - 2rem)'
};
