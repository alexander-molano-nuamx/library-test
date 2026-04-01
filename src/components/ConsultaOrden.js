import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Link,
} from "@nuam/common-fe-lib-components";
import { useAuth } from "../hooks/useAuth";
import { pages, bottomMenu } from "../config/navigation";
import etfOrdersData from "../data/etfOrders.json";

const {
  Box,
  Tooltip,
  IconButton,
  Typography: MuiTypography,
} = DefaultComponents;
const { RestartAlt, InfoOutlined, KeyboardArrowDown } = MaterialIcons;

function ConsultaOrden() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [gridKey, setGridKey] = useState(0);
  const [nivelAprobacionOpen, setNivelAprobacionOpen] = useState(false);
  const [categoriaOpen, setCategoriaOpen] = useState(false);

  const handleNivelToggle = useCallback(
    () => setNivelAprobacionOpen((prev) => !prev),
    [],
  );
  const handleCategoriaToggle = useCallback(
    () => setCategoriaOpen((prev) => !prev),
    [],
  );

  const detailPanelExpandedRowIds =
    nivelAprobacionOpen || categoriaOpen ? new Set([2]) : new Set();
  const location = useLocation();
  const navigate = useNavigate();
  // Cargar datos del JSON
  useEffect(() => {
    setRows(etfOrdersData.rows);
  }, []);

  // Filtrar datos según búsqueda
  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;
    return rows.filter(
      (row) =>
        row.nombreEtf.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.codigoIsinEtf.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.nemotecnico.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [rows, searchTerm]);

  // Procesar columnas del JSON y agregar renderCell
  const columns = useMemo(() => {
    return etfOrdersData.columns.map((col) => {
      if (col.type === "link") {
        return {
          ...col,
          renderCell: (params) => (
            <Link
              href="#"
              underline="hover"
              onClick={(e) => {
                e.preventDefault();
                console.log("Ver ordenes para:", params.row.codigoIsinEtf);
              }}
            >
              {params.value}
            </Link>
          ),
        };
      }

      if (col.type === "nivelAprobacion" || col.type === "categoria") {
        const isNivel = col.type === "nivelAprobacion";
        return {
          ...col,
          renderCell: (params) => {
            const { id } = params.row;
            const secundario = isNivel
              ? params.row.nivelAprobacionSecundario
              : params.row.categoriaSecundaria;

            // Fila 1 → Tooltip con ícono de información
            if (id === 1) {
              const tooltipText = isNivel
                ? "Control único: un solo autorizador requerido para aprobar la operación"
                : "Administración de ETF: gestión y custodia de fondos cotizados en bolsa";
              return (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    width: "100%",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}
                  >
                    {params.value}
                  </span>
                  <Tooltip title={tooltipText} arrow placement="top">
                    <InfoOutlined
                      sx={{
                        fontSize: 16,
                        color: "text.secondary",
                        cursor: "help",
                        flexShrink: 0,
                      }}
                    />
                  </Tooltip>
                </Box>
              );
            }

            // Fila 2 → Master Detail: botón desplegable independiente por columna
            if (id === 2) {
              const isExpanded = isNivel ? nivelAprobacionOpen : categoriaOpen;
              const toggle = isNivel ? handleNivelToggle : handleCategoriaToggle;
              return (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    width: "100%",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}
                  >
                    {params.value}
                  </span>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle();
                    }}
                    sx={{ flexShrink: 0, p: 0.25 }}
                  >
                    <KeyboardArrowDown
                      sx={{
                        fontSize: 18,
                        transition: "transform 0.2s",
                        transform: isExpanded
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    />
                  </IconButton>
                </Box>
              );
            }

            // Filas 3+ → Dos datos apilados en columna dentro de la celda
            return (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  py: 0.5,
                }}
              >
                <MuiTypography variant="body2">{params.value}</MuiTypography>
                <MuiTypography variant="body2" sx={{ color: "text.secondary" }}>
                  {secundario}
                </MuiTypography>
              </Box>
            );
          },
        };
      }

      return col;
    });
  }, [nivelAprobacionOpen, categoriaOpen, handleNivelToggle, handleCategoriaToggle]);

  // Links para breadcrumbs
  const breadcrumbLinks = [
    { name: "Administración de ETF", path: "/etf" },
    { name: "Consulta de ordenes", path: "/etf/consulta-ordenes" },
  ];

  const handleRefresh = () => {
    setRows([...etfOrdersData.rows]);
  };

  const handleResetColumns = () => {
    setGridKey((prev) => prev + 1);
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppBar
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        appTitle="nuam"
        useIsotypeName
        isotypeNameProps={{
          logoSrc: "/isotype.svg",
          projectName: "nubo",
          showText: true,
        }}
        rightSideComponents={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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

      <Content
        openDrawer={sidebarOpen}
        sx={{ height: "calc(100vh - 49px)", overflow: "hidden" }}
      >
        <Box
          sx={{
            height: "calc(100% - 2rem)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            mb: 3,
          }}
        >
          {/* Header con breadcrumbs e información de sesión */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1,
              flexShrink: 0,
            }}
          >
            <Breadcrumbs links={breadcrumbLinks} navigate={navigate} />
            <Box sx={{ textAlign: "right" }}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Último Inicio de Sesión:{" "}
                {user?.lastLogin
                  ? new Date(user.lastLogin)
                      .toLocaleString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      .replace(/^\w/, (c) => c.toUpperCase())
                  : "Primera sesión"}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                IP: {user?.ip || "No disponible"}
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

          {/* Tabla DataGridPro */}
          <Box sx={{ width: "100%", flex: 1, minHeight: 0 }}>
            <DataGridPro
              key={gridKey}
              autosizeOnMount
              rows={filteredRows}
              columns={columns}
              getRowHeight={(params) => (params.id >= 3 ? 64 : 52)}
              getDetailPanelContent={(params) => {
                if (params.row.id !== 2) return null;
                if (!nivelAprobacionOpen && !categoriaOpen) return null;
                return (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      p: 2,
                      bgcolor: "action.hover",
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    {nivelAprobacionOpen && (
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: "background.paper",
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                          minWidth: 200,
                        }}
                      >
                        <MuiTypography
                          variant="caption"
                          sx={{ color: "text.secondary", display: "block" }}
                        >
                          Nivel de aprobación
                        </MuiTypography>
                        <MuiTypography variant="body2" sx={{ fontWeight: 600 }}>
                          Control dual
                        </MuiTypography>
                        <MuiTypography
                          variant="caption"
                          sx={{ color: "text.secondary", display: "block" }}
                        >
                          {params.row.nivelAprobacionSecundario}
                        </MuiTypography>
                        <MuiTypography
                          variant="caption"
                          sx={{ color: "text.secondary", display: "block", mt: 0.5 }}
                        >
                          Autorizadores requeridos: 2 de 3
                        </MuiTypography>
                      </Box>
                    )}
                    {categoriaOpen && (
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: "background.paper",
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                          minWidth: 200,
                        }}
                      >
                        <MuiTypography
                          variant="caption"
                          sx={{ color: "text.secondary", display: "block" }}
                        >
                          Categoría
                        </MuiTypography>
                        <MuiTypography variant="body2" sx={{ fontWeight: 600 }}>
                          Cuentas exentas
                        </MuiTypography>
                        <MuiTypography
                          variant="caption"
                          sx={{ color: "text.secondary", display: "block" }}
                        >
                          {params.row.categoriaSecundaria}
                        </MuiTypography>
                      </Box>
                    )}
                  </Box>
                );
              }}
              getDetailPanelHeight={() => "auto"}
              detailPanelExpandedRowIds={detailPanelExpandedRowIds}
              onDetailPanelExpandedRowIdsChange={(newIds) => {
                if (!newIds.has(2)) {
                  setNivelAprobacionOpen(false);
                  setCategoriaOpen(false);
                }
              }}
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
                    nivelAprobacion: true,
                    categoria: true,
                    // Columnas ocultas por defecto
                    codigoIsinEtf: false,
                    nombreEtf: false,
                    fechaOperacion: false,
                    NombredelParticipanteAutorizado: false,
                    CodigoAdministrador: false,
                    Fechaliquidacion: false,
                    NombreETF: false,
                    __detail_panel_toggle__: false,
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
                filters: "FILTROS",
                columns: "COLUMNAS",
                update: "ACTUALIZAR",
                removeFilters: "LIMPIAR FILTROS",
                download: "DESCARGAR",
              }}
              addMenuItems={[
                {
                  text: "Restaurar columnas",
                  icon: <RestartAlt />,
                  onClick: handleResetColumns,
                },
              ]}
              sx={{ height: "100%" }}
            />
          </Box>
        </Box>
      </Content>
    </Box>
  );
}

export default ConsultaOrden;
