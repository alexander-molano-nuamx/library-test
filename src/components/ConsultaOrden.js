import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  SideBar,
  Content,
  Typography,
  TextField,
  Breadcrumbs,
  DataGrid,
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
import { pages, bottomMenu } from '../config/navigation';
import etfOrdersData from '../data/etfOrders.json';

const { Box } = DefaultComponents;
const { RestartAlt } = MaterialIcons;

function ConsultaOrden() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [rows, setRows] = useState([]);
  const [gridKey, setGridKey] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Cargar datos del JSON
  useEffect(() => {
    setRows(etfOrdersData.rows);
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

  // Procesar columnas del JSON y agregar renderCell para tipo "link"
  const columns = useMemo(() => {
    return etfOrdersData.columns.map(col => {
      if (col.type === 'link') {
        return {
          ...col,
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
        };
      }
      return col;
    });
  }, []);

  // Links para breadcrumbs
  const breadcrumbLinks = [
    { name: 'Administración de ETF', path: '/etf' },
    { name: 'Consulta de ordenes', path: '/etf/consulta-ordenes' },
  ];

  const handleRefresh = () => {
    setRows([...etfOrdersData.rows]);
  };

  const handleResetColumns = () => {
    setGridKey(prev => prev + 1);
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

      <Content openDrawer={sidebarOpen} sx={{ height: 'calc(100vh - 49px)', overflow: 'hidden' }}>
        <Box sx={{
          height: 'calc(100% - 2rem)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          mb: 3
        }}>
          {/* Header con breadcrumbs e información de sesión */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexShrink: 0 }}>
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
          <Typography variant="h5" sx={{ mb: 2, flexShrink: 0 }}>
            Consulta de ordenes
          </Typography>

          {/* Buscador */}
          <Box sx={{ mb: 2, maxWidth: 400, flexShrink: 0 }}>
            <TextField
              label="Nombre del ETF"
              value={searchTerm}
              onChange={(value) => setSearchTerm(value)}
              fullWidth
              size="small"
            />
          </Box>

          {/* Tabla DataGrid */}
          <Box sx={{ width: '100%', flex: 1, minHeight: 0 }}>
            <DataGrid
              key={gridKey}
              rows={filteredRows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 12, page: 0 },
                },
                columns: {
                  columnVisibilityModel: {
                    // Columnas visibles por defecto
                    ordenesIngresadas: true,
                    nemotecnico: true,
                    NombreParticipanteRegistrador: true,
                    CodigoParticipanteAutorizado: true,
                    AdministradorETF: true,
                    Fechaingresoorden: true,
                    // Columnas ocultas por defecto
                    codigoIsinEtf: false,
                    nombreEtf: false,
                    fechaOperacion: false,
                    NombredelParticipanteAutorizado: false,
                    CodigoAdministrador: false,
                    Fechaliquidacion: false,
                    NombreETF: false,
                  },
                },
              }}
              pageSizeOptions={[4, 8, 12]}
              pagination
              onRefresh={handleRefresh}
              language="es"
              disableColumnMenu={false}
              showToolbar={true}
              toolbarText={{
                filters: 'FILTROS',
                columns: 'COLUMNAS',
                update: 'ACTUALIZAR',
                removeFilters: 'LIMPIAR FILTROS',
                download: 'DESCARGAR'
              }}
              addMenuItems={[
                {
                  text: 'Restaurar columnas',
                  icon: <RestartAlt />,
                  onClick: handleResetColumns
                }
              ]}
              sx={{ height: '100%' }}
            />
          </Box>
        </Box>
      </Content>
    </Box>
  );
}

export default ConsultaOrden;
