export type TypeProfile = 'Desenvolvedor' | 'Admin';

export const NAVBAR_PAGES: {
  label: string;
  icon: string;
  router: string;
  roles: TypeProfile[];
}[] = [
  {
    label: 'Overview',
    icon: 'overview',
    router: '/overview',
    roles: ['Admin', 'Desenvolvedor'],
  },
  {
    label: 'Financeiro',
    icon: 'finance',
    router: '/finance',
    roles: ['Admin', 'Desenvolvedor'],
  },
  // {
  //   label: 'Calendario',
  //   icon: 'calendar_range',
  //   router: '/calendar',
  //   roles: ['Admin', 'Desenvolvedor'],
  // },
  {
    label: 'Assinatura',
    icon: 'plans',
    router: '/plans',
    roles: ['Admin', 'Desenvolvedor'],
  },
];
