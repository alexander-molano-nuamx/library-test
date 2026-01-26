import { MaterialIcons } from '@nuam/common-fe-lib-components';

const {
  Dashboard: DashboardIcon,
  FolderOpen,
  ShowChart,
  Security,
  AccountBalance,
  Accessibility,
  Phone,
} = MaterialIcons;

export const pages = [
  { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  {
    name: 'Administrativo 1',
    path: '/administrativo',
    icon: <FolderOpen />,
    children: [
      { name: 'Opción 1', path: '/administrativo/opcion1' },
      { name: 'Opción 2', path: '/administrativo/opcion2' },
    ]
  },
  {
    name: 'Operaciones renta variable',
    path: '/operaciones-rv',
    icon: <ShowChart />,
    children: [
      { name: 'Listado', path: '/operaciones-rv/listado' },
    ]
  },
  {
    name: 'Garantías',
    path: '/garantias',
    icon: <Security />,
    children: [
      { name: 'Administración', path: '/garantias/admin' },
    ]
  },
  {
    name: 'Administración de ETF',
    path: '/etf',
    icon: <AccountBalance />,
    children: [
      { name: 'Parametrización', path: '/etf/parametrizacion' },
      { name: 'Mantenimiento de canasta', path: '/etf/mantenimiento-canasta' },
      { name: 'Creación de orden', path: '/etf/creacion-orden' },
      { name: 'Gestión de orden', path: '/etf/gestion-orden' },
      { name: 'Consulta de ordenes', path: '/etf/consulta-ordenes' },
    ]
  },
];

export const bottomMenu = [
  { name: 'Ayuda visual', path: '/ayuda', icon: <Accessibility /> },
  { name: 'Soporte', path: '/soporte', icon: <Phone /> },
];