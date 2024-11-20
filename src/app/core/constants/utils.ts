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

export const DialogConfig: MatDialogConfig = {
  panelClass: 'dialog_primary',
  width: '90%',
  maxWidth: '500px',
  height: 'auto',
  data: {
    title_popup: '',
    description: '',
  },
};
