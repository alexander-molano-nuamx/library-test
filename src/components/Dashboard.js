import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  AppBar,
  SideBar,
  Content,
  Typography,
  TabsWrapper,
  TabItem,
  CalendarButton,
  NotificationButton,
  SwitchThemeButton,
  LanguageButton,
  UserButton,
  DefaultComponents,
  MaterialIcons
} from '@nuam/common-fe-lib-components';
import { useAuth } from '../hooks/useAuth';

const { Box, Paper, IconButton } = DefaultComponents;
const {
  Dashboard: DashboardIcon,
  FolderOpen,
  ShowChart,
  Security,
  AccountBalance,
  Accessibility,
  Phone,
  MoreHoriz,
  ArrowForward,
  DragIndicator
} = MaterialIcons;

// Componente de card arrastrable
function SortableMetricCard({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </Box>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Estado para las metric cards con sus datos
  const [metricCards, setMetricCards] = useState([
    {
      id: 'card-1',
      title: 'Monto de cumplimiento diarios',
      value: '$50K',
      change: '+10%',
      changeType: 'positive',
      chartType: 'bar'
    },
    {
      id: 'card-2',
      title: 'Monto de garantías constituidas',
      value: '$50K',
      change: '+10%',
      changeType: 'positive',
      chartType: 'bar'
    },
    {
      id: 'card-3',
      title: 'Tiempo de cierre de operaciones',
      value: '3 días',
      change: '-2%',
      changeType: 'negative',
      chartType: 'line'
    },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setMetricCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

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

  const MetricCard = ({ title, value, change, changeType, children }) => (
    <Paper sx={{ p: 2, height: '100%', cursor: 'grab', '&:active': { cursor: 'grabbing' } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DragIndicator fontSize="small" color="action" sx={{ mr: 0.5 }} />
          <IconButton size="small"><MoreHoriz fontSize="small" /></IconButton>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
        <Typography variant="h4" fontWeight="bold">{value}</Typography>
        {change && (
          <Typography
            variant="body2"
            color={changeType === 'positive' ? 'success.main' : 'error.main'}
          >
            {change}
          </Typography>
        )}
      </Box>
      {children}
    </Paper>
  );

  const SimpleBarChart = () => (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 80 }}>
      <Box sx={{ width: 30, height: 60, bgcolor: '#FF6B35', borderRadius: 1 }} />
      <Box sx={{ width: 30, height: 40, bgcolor: '#FF6B35', borderRadius: 1 }} />
      <Box sx={{ width: 30, height: 70, bgcolor: '#FF6B35', borderRadius: 1 }} />
    </Box>
  );

  const AccessCard = ({ title }) => (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        '&:hover': { bgcolor: 'action.hover' }
      }}
    >
      <Typography variant="body2">{title}</Typography>
      <ArrowForward color="action" />
    </Paper>
  );

  const StatItem = ({ value, label }) => (
    <Box sx={{ textAlign: 'center', mb: 3 }}>
      <Typography variant="h5" color="primary">{value}</Typography>
      <Typography variant="body1" color="text.primary" align="center" sx={{ whiteSpace: 'pre-line' }}>
        {label}
      </Typography>
    </Box>
  );

  const renderCardContent = (card) => {
    if (card.chartType === 'bar') {
      return (
        <>
          <SimpleBarChart />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption">29/oct</Typography>
            <Typography variant="caption">30/oct</Typography>
            <Typography variant="caption">Hoy</Typography>
          </Box>
        </>
      );
    }
    return (
      <Box sx={{ height: 80, display: 'flex', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Gráfico de línea
        </Typography>
      </Box>
    );
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
        <Box sx={{ display: 'flex', gap: 3, p: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ mb: 3 }}>
              <TabsWrapper currentTab={currentTab} setCurrentTab={setCurrentTab}>
                <TabItem id={0} title="RENTA VARIABLE">
                  <Box sx={{ p: 3 }}>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={metricCards.map(card => card.id)}
                        strategy={rectSortingStrategy}
                      >
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, mb: 3 }}>
                          {metricCards.map((card) => (
                            <SortableMetricCard key={card.id} id={card.id}>
                              <MetricCard
                                title={card.title}
                                value={card.value}
                                change={card.change}
                                changeType={card.changeType}
                              >
                                {renderCardContent(card)}
                              </MetricCard>
                            </SortableMetricCard>
                          ))}
                        </Box>
                      </SortableContext>
                    </DndContext>

                    <Paper sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Accesos Recientes</Typography>
                        <IconButton size="small"><MoreHoriz /></IconButton>
                      </Box>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 2 }}>
                        <AccessCard title="Visualización de operaciones" />
                        <AccessCard title="Operaciones renta fija" />
                        <AccessCard title="Administración de garantías" />
                      </Box>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                        <AccessCard title="Reportería" />
                      </Box>
                    </Paper>
                  </Box>
                </TabItem>
                <TabItem id={1} title="RENTA FIJA">
                  <Box sx={{ p: 3 }}>
                    <Typography>Contenido de Renta Fija</Typography>
                  </Box>
                </TabItem>
              </TabsWrapper>
            </Paper>
          </Box>

          <Box sx={{ width: 220, alignSelf: 'flex-start' }}>
            {/* Información de conexión - fuera del card */}
            <Typography variant="caption" color="text.secondary" display="block" textAlign="right" sx={{ mb: 0.5 }}>
              Dirección IP: {user?.ip || 'No disponible'}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" textAlign="right" sx={{ mb: 2 }}>
              Última conexión: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Primera sesión'}
            </Typography>

            {/* Card con estadísticas */}
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <StatItem value="12" label="Operaciones negociadas" />
              <StatItem value="90" label="Operaciones FTL 31/10/2024" />
              <StatItem value="100" label="Operaciones corregidas Octubre" />
              <StatItem value="4 días" label="Promedio de cierre de operación" />
              <StatItem value="$5.000" label="Valor medio de la operación" />
            </Paper>
          </Box>
        </Box>
      </Content>
    </Box>
  );
}

export default Dashboard;