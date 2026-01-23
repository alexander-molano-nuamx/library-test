import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  SideBar,
  Content,
  Typography,
  TextField,
  Breadcrumbs,
  DataGridPro,
  CalendarButton,
  NotificationButton,
  SwitchThemeButton,
  LanguageButton,
  UserButton,
  DefaultComponents,
  MaterialIcons,
  Link
} from '@nuam/common-fe-lib-components';
import { useAuth } from '../hooks/useAuth';
import etfOrdersData from '../data/etfOrders.json';

const { Box, Paper } = DefaultComponents;
const {
  Dashboard: DashboardIcon,
  FolderOpen,
  ShowChart,
  Security,
  AccountBalance,
  Accessibility,
  Phone,
} = MaterialIcons;

function GestionOrden() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [rows, setRows] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Cargar datos del JSON
  useEffect(() => {
    setRows(etfOrdersData);
  }, []);

  // Filtrar datos según búsqueda
  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;
    return rows.filter(row =>
      row.nombreEtf.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.codigoIsinEtf.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.nemotecnico.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rows, searchTerm]);

  // Definición de columnas para DataGridPro
  const columns = [
    {
      field: 'ordenesIngresadas',
      headerName: 'Ordenes ingresadas',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Link
          href="#"
          underline="hover"
          onClick={(e) => {
            e.preventDefault();
            console.log('Ver ordenes para:', params.row.codigoIsinEtf);
          }}
        >
          {params.value}
        </Link>
      ),
    },
    {
      field: 'codigoIsinEtf',
      headerName: 'Código ISIN ETF',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'nombreEtf',
      headerName: 'Nombre del ETF',
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: 'nemotecnico',
      headerName: 'Nemotécnico',
      flex: 1,
      minWidth: 130,
    },
    {
      field: 'fechaOperacion',
      headerName: 'Fecha de operación',
      flex: 1,
      minWidth: 160,
    },
  ];

  const pages = [
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

  const bottomMenu = [
    { name: 'Ayuda visual', path: '/ayuda', icon: <Accessibility /> },
    { name: 'Soporte', path: '/soporte', icon: <Phone /> },
  ];

  // Links para breadcrumbs
  const breadcrumbLinks = [
    { name: 'Administración de ETF', path: '/etf' },
    { name: 'Gestión de orden', path: '/etf/gestion-orden' },
  ];

  const handleRefresh = () => {
    setRows([...etfOrdersData]);
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        appTitle="nuam"
        useIsotypeName
        isotypeNameProps={{
          logoSrc: '/isotype.svg',
          projectName: 'nubo',
          showText: true
        }}
        rightSideComponents={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarButton />
            <NotificationButton />
            <SwitchThemeButton />
            <LanguageButton />
            <UserButton onClick={logout} />
          </Box>
        }
      />

      <SideBar
        openSideBar={sidebarOpen}
        pages={pages}
        location={location}
        navigation={navigate}
        bottomMenu={bottomMenu}
      />

      <Content openDrawer={sidebarOpen}>
        <Box sx={{ p: 3 }}>
          {/* Header con breadcrumbs e información de sesión */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Breadcrumbs links={breadcrumbLinks} navigate={navigate} />
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Último Inicio de Sesión: {user?.lastLogin
                  ? new Date(user.lastLogin).toLocaleString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                    }).replace(/^\w/, c => c.toUpperCase())
                  : 'Primera sesión'}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                IP: {user?.ip || 'No disponible'}
              </Typography>
            </Box>
          </Box>

          {/* Título */}
          <Typography variant="h5" sx={{ mb: 3 }}>
            Gestión de orden
          </Typography>

          {/* Buscador */}
          <Box sx={{ mb: 3, maxWidth: 400 }}>
            <TextField
              label="Nombre del ETF"
              value={searchTerm}
              onChange={(value) => setSearchTerm(value)}
              fullWidth
              size="small"
            />
          </Box>

          {/* Tabla DataGridPro */}
          <Paper sx={{ width: '100%' }}>
            <DataGridPro
              rows={filteredRows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 12, page: 0 },
                },
              }}
              pageSizeOptions={[4, 8, 12]}
              pagination
              onRefresh={handleRefresh}
              language="es"
              autoHeight
              disableColumnMenu={false}
              showToolbar={true}
              toolbarText={{
                filters: 'FILTROS',
                columns: 'COLUMNAS',
                update: 'ACTUALIZAR',
              }}
            />
          </Paper>
        </Box>
      </Content>
    </Box>
  );
}

export default GestionOrden;
