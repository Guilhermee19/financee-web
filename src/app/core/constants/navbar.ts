export type TypeProfile = 'Desenvolvedor' | 'Admin';

export const NAVBAR_PAGES: {
  label: string;
  icon: string;
  link: string;
  roles: TypeProfile[];
}[] = [
  {
    label: 'Overview',
    icon: 'overview',
    link: '/overview',
    roles: ['Admin', 'Desenvolvedor'],
  },
  {
    label: 'Financeiro',
    icon: 'finance',
    link: '/finance',
    roles: ['Admin', 'Desenvolvedor'],
  },
];
