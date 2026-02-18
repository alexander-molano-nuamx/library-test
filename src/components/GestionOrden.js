import { useState, useEffect, useMemo } from "react";
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
  Modal,
  Select,
  Switch,
  DatePicker,
  Button,
  TabsWrapper,
  TabItem,
} from "@nuam/common-fe-lib-components";
import { useGridApiRef } from "@mui/x-data-grid";
import { useAuth } from "../hooks/useAuth";
import { pages, bottomMenu } from "../config/navigation";
import etfOrdersData from "../data/etfOrders.json";

const { Box } = DefaultComponents;
const { RestartAlt } = MaterialIcons;

function GestionOrden() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [gridKey, setGridKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    paisNuam: "",
    codigo: "",
    nombreCorto: "",
    nombre: "",
    tipoParticipante: "",
    paisOrigen: "",
    tipoEntidad: "",
    codigoFiscal: "",
    fechaIngreso: null,
    estado: "",
    calidadTributaria: "",
    moneda: "",
    patrimonio: "",
    formadorMercado: false,
    direccionOficina: "",
    codigoTelefono: "",
    telefono: "",
    paginaWeb: "",
    correoElectronico: "",
  });

  const location = useLocation();
  const navigate = useNavigate();
  const apiRef = useGridApiRef();

  // Cargar datos del JSON
  useEffect(() => {
    setRows(etfOrdersData.rows);
  }, []);

  // Auto-ajustar columnas cuando los datos se cargan
  useEffect(() => {
    if (rows.length > 0 && apiRef.current) {
      // Pequeño delay para asegurar que la tabla está renderizada
      const timer = setTimeout(() => {
        apiRef.current?.autosizeColumns({
          includeHeaders: true,
          includeOutliers: true,
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [rows, apiRef]);

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

  // Procesar columnas del JSON y agregar renderCell para tipo "link"
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
                setSelectedRow(params.row);
                setModalOpen(true);
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
    { name: "Administración de ETF", path: "/etf" },
    { name: "Gestión de orden", path: "/etf/gestion-orden" },
  ];

  const handleRefresh = () => {
    setRows([...etfOrdersData.rows]);
  };

  const handleResetColumns = () => {
    setGridKey((prev) => prev + 1);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRow(null);
    setCurrentTab(0);
    setFormData({
      paisNuam: "",
      codigo: "",
      nombreCorto: "",
      nombre: "",
      tipoParticipante: "",
      paisOrigen: "",
      tipoEntidad: "",
      codigoFiscal: "",
      fechaIngreso: null,
      estado: "",
      calidadTributaria: "",
      moneda: "",
      patrimonio: "",
      formadorMercado: false,
      direccionOficina: "",
      codigoTelefono: "",
      telefono: "",
      paginaWeb: "",
      correoElectronico: "",
    });
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCrear = () => {
    console.log("Crear participante:", formData, "para:", selectedRow);
    handleCloseModal();
  };

  // Options for Select components
  const paisNuamOptions = [
    { value: "CO", label: "Colombia" },
    { value: "PE", label: "Perú" },
    { value: "CL", label: "Chile" },
  ];

  const tipoParticipanteOptions = [
    { value: "corredor", label: "Corredor" },
    { value: "CorredorExtrangero", label: "Corredor Extranjero" },
    { value: "bancoComercial", label: "Banco Comercial" },
    { value: "compania", label: "Compañía de seguros" },
  ];

  const paisOrigenOptions = [
    { value: "CO", label: "Colombia" },
    { value: "PE", label: "Perú" },
    { value: "CL", label: "Chile" },
    { value: "MX", label: "México" },
    { value: "US", label: "Estados Unidos" },
  ];

  const tipoEntidadOptions = [
    { value: "banco", label: "Banco" },
    { value: "corredora", label: "Corredora de Bolsa" },
    { value: "fondo", label: "Fondo de Inversión" },
    { value: "aseguradora", label: "Aseguradora" },
  ];

  const estadoOptions = [
    { value: "activo", label: "Activo" },
    { value: "inactivo", label: "Inactivo" },
    { value: "suspendido", label: "Suspendido" },
  ];

  const calidadTributariaOptions = [
    { value: "gran_contribuyente", label: "Gran Contribuyente" },
    { value: "autorretenedor", label: "Autorretenedor" },
  ];

  const monedaOptions = [
    { value: "COP", label: "COP" },
    { value: "USD", label: "USD" },
    { value: "PEN", label: "PEN" },
    { value: "CLP", label: "CLP" },
  ];

  const codigoTelefonoOptions = [
    { value: "+57", label: "+57" },
    { value: "+51", label: "+51" },
    { value: "+56", label: "+56" },
    { value: "+1", label: "+1" },
  ];

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
            Gestión de orden
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
              apiRef={apiRef}
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

      {/* Modal Crear Participante */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        boxProps={{
          sx: {
            width: "90%",
            maxWidth: 900,
            maxHeight: "90vh",
            overflow: "auto",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ mb: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 400 }}>
              Crear Participante
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Los campos marcados con <span style={{ color: "red" }}>*</span>{" "}
              son obligatorios
            </Typography>
          </Box>

          {/* Tabs */}
          <TabsWrapper currentTab={currentTab} setCurrentTab={setCurrentTab}>
            <TabItem id={0} title="GENERAL">
              <Box sx={{ pt: 3 }}>
                {/* Información Básica */}
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Información Básica
                </Typography>

                {/* Fila 1 */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Select
                    label="País nuam"
                    value={formData.paisNuam}
                    onChange={(value) => handleFormChange("paisNuam", value)}
                    options={paisNuamOptions}
                    size="small"
                    fullWidth
                    showClearIndicator
                  />
                  <TextField
                    label="CO Código *"
                    value={formData.codigo}
                    onChange={(value) => handleFormChange("codigo", value)}
                    size="small"
                    fullWidth
                    showClearIndicator
                  />
                  <TextField
                    label="Nombre Corto *"
                    value={formData.nombreCorto}
                    onChange={(value) => handleFormChange("nombreCorto", value)}
                    size="small"
                    fullWidth
                    showClearIndicator
                  />
                </Box>

                {/* Fila 2 */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "start" }}>
                    <TextField
                      label="Nombre *"
                      value={formData.nombre}
                      onChange={(value) => handleFormChange("nombre", value)}
                      size="small"
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Select
                      label="Tipo de Participante *"
                      value={formData.tipoParticipante}
                      onChange={(value) =>
                        handleFormChange("tipoParticipante", value)
                      }
                      options={tipoParticipanteOptions}
                      size="small"
                      fullWidth
                      showClearIndicator
                    />
                    <Typography
                      variant="caption"
                      color="text.tertiary"
                      mt={1}
                      ml={1}
                    >
                      Máximo 5 opciones
                    </Typography>
                  </Box>
                </Box>

                {/* Fila 3 */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Select
                    label="País de Origen *"
                    value={formData.paisOrigen}
                    onChange={(value) => handleFormChange("paisOrigen", value)}
                    options={paisOrigenOptions}
                    size="small"
                    fullWidth
                    showClearIndicator
                  />
                  <Select
                    label="Tipo de Entidad *"
                    value={formData.tipoEntidad}
                    onChange={(value) => handleFormChange("tipoEntidad", value)}
                    options={tipoEntidadOptions}
                    size="small"
                    fullWidth
                    showClearIndicator
                  />
                  <TextField
                    label="Código Fiscal *"
                    value={formData.codigoFiscal}
                    onChange={(value) =>
                      handleFormChange("codigoFiscal", value)
                    }
                    size="small"
                    fullWidth
                  />
                </Box>

                {/* Fila 4 */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <DatePicker
                    label="Fecha de Ingreso *"
                    value={formData.fechaIngreso}
                    onChange={(value) =>
                      handleFormChange("fechaIngreso", value)
                    }
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                    showClearIndicator
                  />
                  <Select
                    label="Estado *"
                    value={formData.estado}
                    onChange={(value) => handleFormChange("estado", value)}
                    options={estadoOptions}
                    size="small"
                    fullWidth
                    showClearIndicator
                  />
                  <Box />
                </Box>

                {/* Financiero */}
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Financiero
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr auto",
                    gap: 2,
                    mb: 3,
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Select
                      label="Calidad Tributaria *"
                      value={formData.calidadTributaria}
                      onChange={(value) =>
                        handleFormChange("calidadTributaria", value)
                      }
                      options={calidadTributariaOptions}
                      size="small"
                      fullWidth
                      showClearIndicator
                    />
                    <Typography variant="caption" color="text.secondary">
                      Máximo 2 opciones
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Select
                      label="Moneda"
                      value={formData.moneda}
                      onChange={(value) => handleFormChange("moneda", value)}
                      options={monedaOptions}
                      size="small"
                      sx={{ width: 100 }}
                    />
                    <TextField
                      label="Patrimonio"
                      value={formData.patrimonio}
                      onChange={(value) =>
                        handleFormChange("patrimonio", value)
                      }
                      size="small"
                      fullWidth
                    />
                  </Box>
                  <Box />
                  <Switch
                    label="Formador de Mercado"
                    checked={formData.formadorMercado}
                    onChange={(e) =>
                      handleFormChange("formadorMercado", e.target.checked)
                    }
                  />
                </Box>

                {/* Contacto */}
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Contacto
                </Typography>

                {/* Fila 1 Contacto */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <TextField
                    label="Dirección Oficina Principal *"
                    value={formData.direccionOficina}
                    onChange={(value) =>
                      handleFormChange("direccionOficina", value)
                    }
                    size="small"
                    fullWidth
                  />
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Select
                      label="Código"
                      value={formData.codigoTelefono}
                      onChange={(value) =>
                        handleFormChange("codigoTelefono", value)
                      }
                      options={codigoTelefonoOptions}
                      size="small"
                      sx={{ width: 100 }}
                    />
                    <TextField
                      label="Teléfono"
                      value={formData.telefono}
                      onChange={(value) => handleFormChange("telefono", value)}
                      size="small"
                      fullWidth
                    />
                  </Box>
                  <Box />
                </Box>

                {/* Fila 2 Contacto */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <TextField
                    label="Página web"
                    value={formData.paginaWeb}
                    onChange={(value) => handleFormChange("paginaWeb", value)}
                    size="small"
                    fullWidth
                  />
                  <TextField
                    label="Correo Electrónico"
                    value={formData.correoElectronico}
                    onChange={(value) =>
                      handleFormChange("correoElectronico", value)
                    }
                    size="small"
                    fullWidth
                  />
                </Box>
              </Box>
            </TabItem>

            <TabItem id={1} title="EQUIVALENCIAS">
              <Box sx={{ pt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Configuración de equivalencias del participante.
                </Typography>
              </Box>
            </TabItem>

            <TabItem id={2} title="CONVENIOS">
              <Box sx={{ pt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Configuración de convenios del participante.
                </Typography>
              </Box>
            </TabItem>
          </TabsWrapper>

          {/* Botones de acción */}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}
          >
            <Button variant="outlined" onClick={handleCloseModal}>
              CANCELAR
            </Button>
            <Button variant="contained" onClick={handleCrear}>
              CREAR
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default GestionOrden;
