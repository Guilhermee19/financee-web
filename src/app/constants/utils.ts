export interface IDialogActions {
  action: 'yes' | 'no';
}

export const DialogConfig = {
  panelClass: 'dialog_primary',
  width: '90%',
  maxWidth: '500px',
  height: 'auto',
  data: {
    title_popup: '',
    description: '',
  },
};
