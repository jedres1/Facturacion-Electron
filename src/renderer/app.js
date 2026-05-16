// Estado de la aplicación
let state = {
  usuario: null,
  appInicializada: false,
  currentView: 'dashboard',
  clientes: [],
  productos: [],
  facturas: [],
  configuracion: null,
  pagination: {
    facturas: { page: 1, pageSize: 10 },
    clientes: { page: 1, pageSize: 10 },
    productos: { page: 1, pageSize: 10 }
  },
  currentFactura: {
    items: [],
    documentosRelacionados: [],
    cliente: null
  }
};

const TIPOS_DTE_DISPONIBLES = [
  { codigo: '01', nombre: 'Factura', nombreCorto: 'Factura', permiteDefaultCliente: true },
  { codigo: '03', nombre: 'Comprobante de Crédito Fiscal', nombreCorto: 'CCF', permiteDefaultCliente: true },
  { codigo: '05', nombre: 'Nota de Crédito', nombreCorto: 'Nota de Crédito', permiteDefaultCliente: false },
  { codigo: '06', nombre: 'Nota de Débito', nombreCorto: 'Nota de Débito', permiteDefaultCliente: false },
  { codigo: '07', nombre: 'Comprobante de Retención', nombreCorto: 'Comprobante de Retención', permiteDefaultCliente: false },
  { codigo: '11', nombre: 'Factura de Exportación', nombreCorto: 'Exportación', permiteDefaultCliente: true },
  { codigo: '14', nombre: 'Factura de Sujeto Excluido', nombreCorto: 'Sujeto Excluido', permiteDefaultCliente: true }
];

const TIPOS_DTE_DEFAULT = TIPOS_DTE_DISPONIBLES.map(tipo => tipo.codigo);

// Actividades Económicas - Clasificación BCR Rev. 4.0
let actividadesEconomicas = [
  { codigo: '01', descripcion: 'Producción agrícola, pecuaria, caza y actividades de servicios conexas' },
  { codigo: '02', descripcion: 'Silvicultura y extracción de madera' },
  { codigo: '03', descripcion: 'Pesca y acuicultura' },
  { codigo: '05', descripcion: 'Extracción de carbón de piedra y lignito' },
  { codigo: '06', descripcion: 'Extracción de petróleo crudo y gas natural' },
  { codigo: '07', descripcion: 'Extracción de minerales metalíferos' },
  { codigo: '08', descripcion: 'Explotación de otras minas y canteras' },
  { codigo: '09', descripcion: 'Actividades de servicios de apoyo para la explotación de minas' },
  { codigo: '10', descripcion: 'Elaboración de productos alimenticios' },
  { codigo: '11', descripcion: 'Elaboración de bebidas' },
  { codigo: '12', descripcion: 'Elaboración de productos de tabaco' },
  { codigo: '13', descripcion: 'Fabricación de productos textiles' },
  { codigo: '14', descripcion: 'Fabricación de prendas de vestir' },
  { codigo: '15', descripcion: 'Fabricación de cueros y productos conexos' },
  { codigo: '16', descripcion: 'Fabricación de productos de madera y corcho, excepto muebles' },
  { codigo: '17', descripcion: 'Fabricación de papel y de productos de papel' },
  { codigo: '18', descripcion: 'Impresión y reproducción de grabaciones' },
  { codigo: '19', descripcion: 'Fabricación de coque y de productos de la refinación del petróleo' },
  { codigo: '20', descripcion: 'Fabricación de sustancias y productos químicos' },
  { codigo: '21', descripcion: 'Fabricación de productos farmacéuticos' },
  { codigo: '22', descripcion: 'Fabricación de productos de caucho y plástico' },
  { codigo: '23', descripcion: 'Fabricación de otros productos minerales no metálicos' },
  { codigo: '24', descripcion: 'Fabricación de metales comunes' },
  { codigo: '25', descripcion: 'Fabricación de productos elaborados de metal, excepto maquinaria y equipo' },
  { codigo: '26', descripcion: 'Fabricación de productos de informática, de electrónica y de óptica' },
  { codigo: '27', descripcion: 'Fabricación de equipo eléctrico' },
  { codigo: '28', descripcion: 'Fabricación de maquinaria y equipo n.c.p.' },
  { codigo: '29', descripcion: 'Fabricación de vehículos automotores, remolques y semirremolques' },
  { codigo: '30', descripcion: 'Fabricación de otros tipos de equipo de transporte' },
  { codigo: '31', descripcion: 'Fabricación de muebles' },
  { codigo: '32', descripcion: 'Otras industrias manufactureras' },
  { codigo: '33', descripcion: 'Reparación e instalación de maquinaria y equipo' },
  { codigo: '35', descripcion: 'Suministro de electricidad, gas, vapor y aire acondicionado' },
  { codigo: '36', descripcion: 'Captación, tratamiento y distribución de agua' },
  { codigo: '37', descripcion: 'Evacuación de aguas residuales (alcantarillado)' },
  { codigo: '38', descripcion: 'Recolección, tratamiento y eliminación de desechos; reciclaje' },
  { codigo: '39', descripcion: 'Actividades de saneamiento y otros servicios de gestión de desechos' },
  { codigo: '41', descripcion: 'Construcción de edificios' },
  { codigo: '42', descripcion: 'Obras de ingeniería civil' },
  { codigo: '43', descripcion: 'Actividades especializadas de construcción' },
  { codigo: '45', descripcion: 'Comercio al por mayor y al por menor y reparación de vehículos automotores y motocicletas' },
  { codigo: '46', descripcion: 'Comercio al por mayor, excepto de vehículos automotores y motocicletas' },
  { codigo: '47', descripcion: 'Comercio al por menor, excepto de vehículos automotores y motocicletas' },
  { codigo: '49', descripcion: 'Transporte por vía terrestre y transporte por tuberías' },
  { codigo: '50', descripcion: 'Transporte por vía acuática' },
  { codigo: '51', descripcion: 'Transporte por vía aérea' },
  { codigo: '52', descripcion: 'Almacenamiento y actividades de apoyo al transporte' },
  { codigo: '53', descripcion: 'Actividades postales y de mensajería' },
  { codigo: '55', descripcion: 'Actividades de alojamiento' },
  { codigo: '56', descripcion: 'Actividades de servicio de comidas y bebidas' },
  { codigo: '58', descripcion: 'Actividades de edición' },
  { codigo: '59', descripcion: 'Actividades de producción de películas cinematográficas, videos y programas de televisión, grabación de sonido y edición de música' },
  { codigo: '60', descripcion: 'Actividades de programación y transmisión' },
  { codigo: '61', descripcion: 'Telecomunicaciones' },
  { codigo: '62', descripcion: 'Programación informática, consultoría informática y actividades conexas' },
  { codigo: '63', descripcion: 'Actividades de servicios de información' },
  { codigo: '64', descripcion: 'Actividades de servicios financieros, excepto las de seguros y fondos de pensiones' },
  { codigo: '65', descripcion: 'Seguros, reaseguros y fondos de pensiones, excepto planes de seguridad social de afiliación obligatoria' },
  { codigo: '66', descripcion: 'Actividades auxiliares de las actividades de servicios financieros' },
  { codigo: '68', descripcion: 'Actividades inmobiliarias' },
  { codigo: '69', descripcion: 'Actividades jurídicas y contables' },
  { codigo: '70', descripcion: 'Actividades de oficinas centrales; actividades de consultoría en gestión empresarial' },
  { codigo: '71', descripcion: 'Actividades de arquitectura e ingeniería; ensayos y análisis técnicos' },
  { codigo: '72', descripcion: 'Investigación científica y desarrollo' },
  { codigo: '73', descripcion: 'Publicidad y estudios de mercado' },
  { codigo: '74', descripcion: 'Otras actividades profesionales, científicas y técnicas' },
  { codigo: '75', descripcion: 'Actividades veterinarias' },
  { codigo: '77', descripcion: 'Actividades de alquiler y arrendamiento' },
  { codigo: '78', descripcion: 'Actividades de empleo' },
  { codigo: '79', descripcion: 'Actividades de agencias de viajes, operadores turísticos y otros servicios de reserva' },
  { codigo: '80', descripcion: 'Actividades de investigación y seguridad' },
  { codigo: '81', descripcion: 'Actividades de servicios a edificios y paisajismo' },
  { codigo: '82', descripcion: 'Actividades administrativas y de apoyo de oficinas y otras actividades de apoyo a empresas' },
  { codigo: '84', descripcion: 'Administración pública y defensa; planes de seguridad social de afiliación obligatoria' },
  { codigo: '85', descripcion: 'Enseñanza' },
  { codigo: '86', descripcion: 'Actividades de atención de la salud humana' },
  { codigo: '87', descripcion: 'Actividades de atención en instituciones' },
  { codigo: '88', descripcion: 'Actividades de asistencia social sin alojamiento' },
  { codigo: '90', descripcion: 'Actividades creativas, artísticas y de esparcimiento' },
  { codigo: '91', descripcion: 'Actividades de bibliotecas, archivos, museos y otras actividades culturales' },
  { codigo: '92', descripcion: 'Actividades de juegos de azar y apuestas' },
  { codigo: '93', descripcion: 'Actividades deportivas, de esparcimiento y recreativas' },
  { codigo: '94', descripcion: 'Actividades de asociaciones' },
  { codigo: '95', descripcion: 'Reparación de ordenadores y de efectos personales y enseres domésticos' },
  { codigo: '96', descripcion: 'Otras actividades de servicios personales' },
  { codigo: '97', descripcion: 'Actividad de los hogares en calidad de empleadores de personal doméstico' },
  { codigo: '98', descripcion: 'Actividades indiferenciadas de producción de bienes y servicios de los hogares para uso propio' },
  { codigo: '99', descripcion: 'Actividades de organizaciones y órganos extraterritoriales' }
];

// División geográfica se carga desde JSON externo en window.divisionGeografica

async function cargarCatalogoActividadesEconomicas() {
  try {
    const response = await fetch('../data/actividades-economicas.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const catalogo = await response.json();
    if (!Array.isArray(catalogo) || catalogo.length === 0) {
      throw new Error('Catálogo vacío o inválido');
    }

    actividadesEconomicas = catalogo
      .filter(act => act.codigo && act.descripcion)
      .map(act => ({
        codigo: String(act.codigo).trim(),
        descripcion: String(act.descripcion).trim()
      }));

    poblarDatalistActividades('actividades-economicas');
    poblarDatalistActividades('config-actividades-economicas');
    console.log(`Catálogo de actividades económicas cargado: ${actividadesEconomicas.length} registros`);
  } catch (error) {
    console.error('Error cargando catálogo de actividades económicas:', error);
    console.warn('Se usará el catálogo resumido embebido como respaldo.');
  }
}

function poblarDatalistActividades(datalistId) {
  const datalist = document.getElementById(datalistId);
  if (!datalist) return;

  datalist.innerHTML = '';
  actividadesEconomicas.forEach(act => {
    const option = document.createElement('option');
    option.value = `${act.codigo} - ${act.descripcion}`;
    datalist.appendChild(option);
  });
}

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Aplicación iniciada');

  setupLogin();
});

function setupLogin() {
  const formLogin = document.getElementById('form-login');
  const btnLogout = document.getElementById('btn-logout');

  if (formLogin) {
    formLogin.addEventListener('submit', async (event) => {
      event.preventDefault();
      await iniciarSesion();
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', cerrarSesion);
  }
}

async function iniciarSesion() {
  const identificadorInput = document.getElementById('login-identificador');
  const passwordInput = document.getElementById('login-password');
  const errorBox = document.getElementById('login-error');
  const submitButton = document.querySelector('#form-login .login-submit');

  const identificador = identificadorInput?.value.trim();
  const password = passwordInput?.value || '';

  if (!identificador || !password) {
    if (errorBox) errorBox.textContent = 'Ingrese su NIT, DUI o correo y la clave.';
    return;
  }

  try {
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Validando...';
    }
    if (errorBox) errorBox.textContent = '';

    const resultado = await window.electronAPI.login({ identificador, password });
    if (!resultado?.success) {
      if (errorBox) errorBox.textContent = resultado?.error || 'Credenciales inválidas';
      return;
    }

    state.usuario = resultado.user;
    mostrarAplicacionAutenticada();
    await inicializarAplicacionAutenticada();
  } catch (error) {
    console.error('Error iniciando sesión:', error);
    if (errorBox) errorBox.textContent = 'No se pudo iniciar sesión.';
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Ingresar';
    }
  }
}

function mostrarAplicacionAutenticada() {
  const loginScreen = document.getElementById('login-screen');
  const appContainer = document.getElementById('app-container');
  const usuarioActual = document.getElementById('usuario-actual');

  if (loginScreen) loginScreen.classList.add('hidden');
  if (appContainer) appContainer.classList.remove('hidden');
  if (usuarioActual) usuarioActual.textContent = state.usuario?.email || 'Usuario';
}

function cerrarSesion() {
  state.usuario = null;

  const loginScreen = document.getElementById('login-screen');
  const appContainer = document.getElementById('app-container');
  const passwordInput = document.getElementById('login-password');
  const errorBox = document.getElementById('login-error');

  if (appContainer) appContainer.classList.add('hidden');
  if (loginScreen) loginScreen.classList.remove('hidden');
  if (passwordInput) passwordInput.value = '';
  if (errorBox) errorBox.textContent = '';
}

async function inicializarAplicacionAutenticada() {
  if (state.appInicializada) {
    await loadInitialData();
    updateDashboard();
    return;
  }

  state.appInicializada = true;
  await cargarCatalogoActividadesEconomicas();
  
  // Configurar navegación
  setupNavigation();
  
  // Establecer fecha actual en filtros
  establecerFechaActualFiltros();
  
  // Cargar datos iniciales
  await loadInitialData();
  
  // Configurar event listeners
  setupEventListeners();
  actualizarCamposNotaCredito();
  
  // Actualizar dashboard
  updateDashboard();
  
  // Poblar selects de departamentos
  poblarSelectsDepartamentos();
  
  // Configurar cambio de departamento para cargar municipios
  setupDepartamentoMunicipioHandler();
  setupDepartamentoMunicipioConfigHandler();
}

// Establecer fecha actual en filtros
function establecerFechaActualFiltros() {
  const hoy = new Date();
  const fechaStr = formatearFechaLocal(hoy);
  
  const fechaDesde = document.getElementById('fecha-desde');
  const fechaHasta = document.getElementById('fecha-hasta');
  
  if (fechaDesde) fechaDesde.value = fechaStr;
  if (fechaHasta) fechaHasta.value = fechaStr;
}

// Configurar navegación
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      switchView(view);
      
      // Actualizar estado activo
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

// Cambiar vista
function switchView(viewName) {
  // Ocultar todas las vistas
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  
  // Mostrar vista seleccionada
  const targetView = document.getElementById(`${viewName}-view`);
  if (targetView) {
    targetView.classList.add('active');
    state.currentView = viewName;
    
    // Actualizar título
    const titles = {
      'dashboard': 'Dashboard',
      'nueva-factura': 'Nueva Factura',
      'facturas': 'Facturas',
      'clientes': 'Clientes',
      'productos': 'Productos',
      'configuracion': 'Configuración'
    };
    document.getElementById('view-title').textContent = titles[viewName] || viewName;
    
    // Cargar datos según la vista
    loadViewData(viewName);
  }
}

// Cargar datos de la vista
async function loadViewData(viewName) {
  switch(viewName) {
    case 'facturas':
      await loadFacturas();
      break;
    case 'clientes':
      await loadClientes();
      break;
    case 'productos':
      await loadProductos();
      break;
    case 'configuracion':
      await loadConfiguracion();
      break;
    case 'nueva-factura':
      await loadClientesSelect();
      await loadProductosSelect();
      break;
  }
}

// Cargar datos iniciales
async function loadInitialData() {
  try {
    state.clientes = await window.electronAPI.getClientes();
    state.productos = await window.electronAPI.getProductos();
    state.facturas = await window.electronAPI.getFacturas({});
    state.configuracion = await window.electronAPI.getConfiguracion();
    renderSelectsTiposDte();
    
    console.log('Datos iniciales cargados', state);
    
    // Verificar estado de conexión con Hacienda si hay credenciales guardadas
    verificarEstadoConexion();
    ejecutarBackupDiarioSiCorresponde();
  } catch (error) {
    console.error('Error cargando datos iniciales:', error);
    showNotification('Error al cargar datos', 'error');
  }
}

function fechaLocalDesdeISO(valor) {
  if (!valor) return '';
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return '';
  return formatearFechaLocal(fecha);
}

function backupHechoHoy(config = state.configuracion) {
  return fechaLocalDesdeISO(config?.backup_ultimo_at) === formatearFechaLocal(new Date());
}

async function ejecutarBackupServidor(manual = false) {
  if (!manual && (!state.configuracion?.backup_automatico || backupHechoHoy())) return;

  try {
    if (manual) showNotification('Generando y subiendo backup...', 'info');
    const resultado = await window.electronAPI.subirBackupServidor({ manual });

    if (!resultado?.success) {
      if (manual) showNotification(resultado?.error || 'No se pudo subir el backup', 'error');
      console.warn('Backup no subido:', resultado?.error || resultado);
      return false;
    }

    state.configuracion = await window.electronAPI.getConfiguracion();
    actualizarEstadoBackupConfig();

    if (manual) {
      const kb = Math.max(1, Math.round(Number(resultado.sizeBytes || 0) / 1024));
      showNotification(`Backup subido correctamente (${kb} KB)`, 'success');
    }

    return true;
  } catch (error) {
    console.error('Error subiendo backup:', error);
    if (manual) showNotification('Error subiendo backup al servidor', 'error');
    return false;
  }
}

function ejecutarBackupDiarioSiCorresponde() {
  setTimeout(() => {
    ejecutarBackupServidor(false);
  }, 1500);
}

function actualizarEstadoBackupConfig() {
  const input = document.getElementById('config-backup-ultimo');
  if (!input) return;

  if (!state.configuracion?.backup_ultimo_at) {
    input.value = 'Sin backup';
    return;
  }

  input.value = formatDate(state.configuracion.backup_ultimo_at);
}

// Verificar estado de conexión con Hacienda
function verificarEstadoConexion() {
  const estadoConexion = document.getElementById('estado-conexion');
  
  if (state.configuracion && state.configuracion.hacienda_usuario && state.configuracion.hacienda_password) {
    estadoConexion.textContent = `Configurado (${state.configuracion.hacienda_ambiente === 'produccion' ? 'Prod' : 'Test'})`;
    estadoConexion.className = 'badge badge-info';
    estadoConexion.title = 'Credenciales configuradas. Use "Probar Conexión" para verificar.';
  } else {
    estadoConexion.textContent = 'Sin configurar';
    estadoConexion.className = 'badge badge-warning';
    estadoConexion.title = 'Configure las credenciales de Hacienda';
  }
}

// Actualizar dashboard
function updateDashboard() {
  const hoy = formatearFechaLocal(new Date());
  const facturasHoy = state.facturas.filter(f => f.fecha_emision?.startsWith(hoy));
  const esEnviadaHacienda = (factura) => {
    return facturaEstaAceptada(factura);
  };
  const esAnulada = (factura) => obtenerEstadoFacturaVisual(factura) === 'ANULADO';
  
  const totalHoy = facturasHoy
    .filter(esEnviadaHacienda)
    .reduce((sum, f) => sum + (f.total || 0), 0);
  const enviadas = state.facturas.filter(esEnviadaHacienda).length;
  const pendientes = state.facturas.filter(facturaEsPendienteOperativa).length;
  const anuladas = state.facturas.filter(esAnulada).length;
  
  document.getElementById('facturas-hoy').textContent = facturasHoy.length;
  document.getElementById('total-hoy').textContent = formatCurrency(totalHoy);
  document.getElementById('enviadas-hacienda').textContent = enviadas;
  document.getElementById('pendientes').textContent = pendientes;
  document.getElementById('anuladas-hacienda').textContent = anuladas;
  
  // Tabla de recientes
  const tbody = document.querySelector('#tabla-recientes tbody');
  if (state.facturas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay facturas recientes</td></tr>';
  } else {
    const recientes = state.facturas.slice(0, 10);
    tbody.innerHTML = recientes.map(f => {
      const clienteData = JSON.parse(f.cliente_datos || '{}');
      const estado = obtenerEstadoFacturaVisual(f);
      return `
        <tr>
          <td>${formatDate(f.fecha_emision)}</td>
          <td>${f.numero_control || 'N/A'}</td>
          <td>${clienteData.nombre || 'N/A'}</td>
          <td>${formatCurrency(f.total)}</td>
          <td><span class="badge badge-${getEstadoBadgeClass(estado)}">${estado}</span></td>
        </tr>
      `;
    }).join('');
  }
}

function obtenerPagina(key, totalItems) {
  const config = state.pagination[key];
  const totalPages = Math.max(1, Math.ceil(totalItems / config.pageSize));
  config.page = Math.min(Math.max(1, config.page), totalPages);

  const start = (config.page - 1) * config.pageSize;
  const end = start + config.pageSize;

  return {
    page: config.page,
    pageSize: config.pageSize,
    totalPages,
    totalItems,
    start,
    end
  };
}

function paginarItems(items, key) {
  const info = obtenerPagina(key, items.length);
  return {
    ...info,
    items: items.slice(info.start, info.end)
  };
}

function renderPaginacion(key, totalItems) {
  const container = document.getElementById(`paginacion-${key}`);
  if (!container) return;

  const info = obtenerPagina(key, totalItems);
  if (totalItems <= info.pageSize) {
    container.innerHTML = '';
    return;
  }

  const from = info.start + 1;
  const to = Math.min(info.end, totalItems);
  const pages = Array.from({ length: info.totalPages }, (_, index) => index + 1);

  container.innerHTML = `
    <span class="pagination-summary">${from}-${to} de ${totalItems}</span>
    <div class="pagination-controls">
      <button type="button" class="btn btn-small btn-secondary" onclick="cambiarPagina('${key}', ${info.page - 1})" ${info.page === 1 ? 'disabled' : ''}>Anterior</button>
      ${pages.map(page => `
        <button type="button" class="btn btn-small ${page === info.page ? 'btn-primary' : 'btn-secondary'}" onclick="cambiarPagina('${key}', ${page})">${page}</button>
      `).join('')}
      <button type="button" class="btn btn-small btn-secondary" onclick="cambiarPagina('${key}', ${info.page + 1})" ${info.page === info.totalPages ? 'disabled' : ''}>Siguiente</button>
    </div>
  `;
}

function resetPagina(key) {
  if (state.pagination[key]) {
    state.pagination[key].page = 1;
  }
}

function cambiarPagina(key, page) {
  if (!state.pagination[key]) return;

  state.pagination[key].page = Number(page) || 1;

  if (key === 'facturas') renderFacturas();
  if (key === 'clientes') renderClientes();
  if (key === 'productos') renderProductos();
}

window.cambiarPagina = cambiarPagina;

function normalizarBusqueda(valor) {
  return String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function coincideBusqueda(busqueda, valores) {
  if (!busqueda) return true;
  return valores.some(valor => normalizarBusqueda(valor).includes(busqueda));
}

function obtenerClienteDataFactura(factura) {
  try {
    return typeof factura.cliente_datos === 'string'
      ? JSON.parse(factura.cliente_datos || '{}')
      : factura.cliente_datos || {};
  } catch (error) {
    return {};
  }
}

function renderCheckVerde(activo) {
  return activo ? '<span class="status-check" aria-label="Sí">✓</span>' : '';
}

function facturaEstaAceptada(factura) {
  const estado = obtenerEstadoFacturaVisual(factura);
  return Boolean(factura?.sello_recepcion) || estado === 'ACEPTADO';
}

function facturaTieneError(factura) {
  return obtenerEstadoFacturaVisual(factura) === 'RECHAZADO';
}

function facturaEsContingenciaOperativa(factura) {
  return obtenerEstadoFacturaVisual(factura) === 'CONTINGENCIA';
}

function facturaEsPendienteOperativa(factura) {
  const estado = obtenerEstadoFacturaVisual(factura);
  return estado === 'PENDIENTE' ||
    facturaEsContingenciaOperativa(factura) ||
    (estado === 'RECHAZADO' && !factura?.sello_recepcion);
}

function facturaRechazadaPorConexion(factura) {
  if (obtenerEstadoFacturaVisual(factura) !== 'RECHAZADO') return false;
  const bitacora = obtenerBitacoraRechazoFactura(factura);
  return bitacora?.tipo === 'RED' ||
    bitacora?.tipo === 'TIMEOUT' ||
    bitacora?.tipo === 'SERVICIO_NO_DISPONIBLE' ||
    esErrorConexionHaciendaTexto(bitacora?.mensaje) ||
    esErrorConexionHaciendaTexto(JSON.stringify(bitacora?.raw || ''));
}

function facturaPuedePasarAContingencia(factura) {
  if (obtenerEstadoFacturaVisual(factura) !== 'RECHAZADO' || factura?.sello_recepcion) return false;
  return facturaRechazadaPorConexion(factura);
}

function facturaRechazadaPorTipoOperacion(factura) {
  if (obtenerEstadoFacturaVisual(factura) !== 'RECHAZADO') return false;
  const bitacora = obtenerBitacoraRechazoFactura(factura);
  const detalle = `${bitacora?.mensaje || ''} ${JSON.stringify(bitacora?.raw || '')}`;
  return /identificacion\.tipoOperacion|tipoOperacion/i.test(detalle);
}

function facturaRechazadaPorTipoOperacionEnLote(factura) {
  if (!facturaRechazadaPorTipoOperacion(factura)) return false;
  const bitacora = obtenerBitacoraRechazoFactura(factura);
  return /lote/i.test(String(bitacora?.origen || '')) ||
    Boolean(bitacora?.raw?.consulta?.rechazados) ||
    Boolean(bitacora?.raw?.detalleDte);
}

function facturaRechazadaPorEventoContingencia(factura) {
  if (obtenerEstadoFacturaVisual(factura) !== 'RECHAZADO') return false;
  const bitacora = obtenerBitacoraRechazoFactura(factura);
  const detalle = `${bitacora?.mensaje || ''} ${JSON.stringify(bitacora?.observaciones || [])} ${JSON.stringify(bitacora?.raw || {})}`;
  return /contingencia/i.test(String(bitacora?.origen || '')) ||
    /codEstable|codPuntoVenta|detalleDTE|numeroControl|DOCUMENTO NO CUMPLE ESQUEMA JSON/i.test(detalle);
}

function dteUsaTransmisionContingencia(dte) {
  const identificacion = obtenerDTEContenido(dte)?.identificacion || {};
  return Number(identificacion.tipoOperacion) === 2 ||
    Number(identificacion.tipoModelo) === 2 ||
    (identificacion.tipoContingencia !== null &&
      identificacion.tipoContingencia !== undefined &&
      identificacion.tipoContingencia !== '');
}

function dteRetencionNecesitaRefirmaPorDocumento(dte) {
  const contenido = obtenerDTEContenido(dte);
  if (String(contenido?.identificacion?.tipoDte || '').padStart(2, '0') !== '07') return false;
  const receptor = contenido.receptor || {};
  return String(receptor.tipoDocumento || '') === '13' &&
    /^\d{9}$/.test(String(receptor.numDocumento || ''));
}

function facturaFueEnviadaPorCorreo(factura) {
  if (facturaTieneError(factura)) return false;
  return Number(factura?.correo_enviado || 0) === 1 || Boolean(factura?.fecha_correo);
}

function facturaPuedeEnviarsePorCorreo(factura) {
  if (!factura || facturaTieneError(factura)) return false;

  const estado = obtenerEstadoFacturaVisual(factura);
  if (!['ENVIADO', 'ACEPTADO', 'ANULADO'].includes(estado)) return false;
  if (estado !== 'ANULADO' && !factura.sello_recepcion) return false;

  return true;
}

function parseTiposDteHabilitados(valor) {
  let tipos = valor;

  if (typeof tipos === 'string') {
    try {
      tipos = JSON.parse(tipos);
    } catch {
      tipos = tipos.split(',');
    }
  }

  if (!Array.isArray(tipos)) tipos = TIPOS_DTE_DEFAULT;

  const permitidos = new Set(TIPOS_DTE_DEFAULT);
  const normalizados = [...new Set(tipos
    .map(tipo => String(tipo || '').padStart(2, '0'))
    .filter(tipo => permitidos.has(tipo)))];

  return normalizados.length ? normalizados : ['01'];
}

function obtenerTiposDteHabilitados() {
  return parseTiposDteHabilitados(state.configuracion?.tipos_dte_habilitados);
}

function obtenerTiposDteParaClienteDefault(valorActual = null) {
  const habilitados = new Set(obtenerTiposDteHabilitados());
  const tipos = TIPOS_DTE_DISPONIBLES
    .filter(tipo => tipo.permiteDefaultCliente && habilitados.has(tipo.codigo));

  if (valorActual && !tipos.some(tipo => tipo.codigo === valorActual)) {
    const actual = TIPOS_DTE_DISPONIBLES.find(tipo => tipo.codigo === valorActual && tipo.permiteDefaultCliente);
    if (actual) tipos.push(actual);
  }

  return tipos.length ? tipos : TIPOS_DTE_DISPONIBLES.filter(tipo => tipo.codigo === '01');
}

function poblarSelectTipoDte(select, opciones = {}) {
  if (!select) return;

  const valorActual = opciones.valorActual || select.value;
  const incluirTodos = opciones.incluirTodos || false;
  const tipos = opciones.tipos || TIPOS_DTE_DISPONIBLES
    .filter(tipo => obtenerTiposDteHabilitados().includes(tipo.codigo));

  select.innerHTML = '';

  if (incluirTodos) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Todos los documentos';
    select.appendChild(option);
  } else if (opciones.placeholder) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = opciones.placeholder;
    select.appendChild(option);
  }

  tipos.forEach(tipo => {
    const option = document.createElement('option');
    option.value = tipo.codigo;
    option.textContent = opciones.nombreCorto ? tipo.nombreCorto : tipo.nombre;
    select.appendChild(option);
  });

  if (valorActual && select.querySelector(`option[value="${valorActual}"]`)) {
    select.value = valorActual;
  } else if (!incluirTodos && select.options.length) {
    select.value = select.options[0].value;
  }
}

function renderSelectsTiposDte() {
  poblarSelectTipoDte(document.getElementById('tipo-dte'));
  poblarSelectTipoDte(document.getElementById('filtro-tipo-dte'), { incluirTodos: true });
  poblarSelectTipoDte(document.getElementById('cliente-tipo-dte-default'), {
    placeholder: 'Seleccionar...',
    tipos: obtenerTiposDteParaClienteDefault(document.getElementById('cliente-tipo-dte-default')?.value)
  });

  actualizarCamposNotaCredito();
}

function aplicarTiposDteConfiguracion(valor) {
  const habilitados = new Set(parseTiposDteHabilitados(valor));
  document.querySelectorAll('#config-tipos-dte input[type="checkbox"]').forEach(input => {
    input.checked = habilitados.has(input.value);
  });
}

function obtenerTiposDteConfiguradosFormulario() {
  const seleccionados = [...document.querySelectorAll('#config-tipos-dte input[type="checkbox"]:checked')]
    .map(input => input.value);
  return seleccionados.length ? seleccionados : ['01'];
}

// Cargar facturas
async function loadFacturas() {
  try {
    state.facturas = await window.electronAPI.getFacturas({});
    updateDashboard();
    renderFacturas();
  } catch (error) {
    console.error('Error cargando facturas:', error);
    showNotification('Error al cargar facturas', 'error');
  }
}

function obtenerFacturasFiltradas() {
  let facturasFiltradas = [...state.facturas];
  const fechaDesde = document.getElementById('fecha-desde')?.value;
  const fechaHasta = document.getElementById('fecha-hasta')?.value;
  const estadoFiltro = document.getElementById('filtro-estado')?.value;
  const tipoDteFiltro = document.getElementById('filtro-tipo-dte')?.value;
  const busqueda = normalizarBusqueda(document.getElementById('buscar-facturas')?.value);

  if (fechaDesde) {
    facturasFiltradas = facturasFiltradas.filter(f => {
      const fechaFactura = f.fecha_emision.split('T')[0];
      return fechaFactura >= fechaDesde;
    });
  }

  if (fechaHasta) {
    facturasFiltradas = facturasFiltradas.filter(f => {
      const fechaFactura = f.fecha_emision.split('T')[0];
      return fechaFactura <= fechaHasta;
    });
  }

  if (estadoFiltro) {
    facturasFiltradas = facturasFiltradas.filter(f => {
      if (estadoFiltro === 'PENDIENTE') return facturaEsPendienteOperativa(f);
      if (estadoFiltro === 'CONTINGENCIA') return facturaEsContingenciaOperativa(f);
      return obtenerEstadoFacturaVisual(f) === estadoFiltro;
    });
  }

  if (tipoDteFiltro) {
    facturasFiltradas = facturasFiltradas.filter(f => String(f.tipo_dte || '').padStart(2, '0') === tipoDteFiltro);
  }

  if (busqueda) {
    facturasFiltradas = facturasFiltradas.filter(f => {
      const clienteData = obtenerClienteDataFactura(f);
      return coincideBusqueda(busqueda, [
        f.numero_control,
        f.codigo_generacion,
        f.sello_recepcion,
        f.tipo_dte,
        f.estado,
        obtenerEstadoFacturaVisual(f),
        f.observaciones,
        f.total,
        clienteData.nombre,
        clienteData.nombre_comercial,
        clienteData.numero_documento,
        clienteData.nrc,
        clienteData.email
      ]);
    });
  }

  return facturasFiltradas;
}

function renderFacturas() {
  const tbody = document.querySelector('#tabla-facturas tbody');
  const facturasFiltradas = obtenerFacturasFiltradas();
  const pagina = paginarItems(facturasFiltradas, 'facturas');

  if (facturasFiltradas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="text-center">No hay facturas que coincidan con los filtros</td></tr>';
    renderPaginacion('facturas', 0);
    return;
  }

  tbody.innerHTML = pagina.items.map(f => {
    const clienteData = obtenerClienteDataFactura(f);
    const estado = obtenerEstadoFacturaVisual(f);
    return `
      <tr>
        <td>${formatDate(f.fecha_emision)}</td>
        <td>${f.numero_control || 'N/A'}</td>
        <td>${clienteData.nombre || 'N/A'}</td>
        <td>${formatCurrency(f.total)}</td>
        <td>
          <span class="badge badge-${getEstadoBadgeClass(estado)}">${estado}</span>
          ${estado === 'CONTINGENCIA' ? renderResumenContingenciaTabla(f) : ''}
        </td>
        <td class="status-cell">${renderCheckVerde(facturaTieneError(f))}</td>
        <td class="status-cell">${renderCheckVerde(facturaEstaAceptada(f))}</td>
        <td class="status-cell">${renderCheckVerde(facturaFueEnviadaPorCorreo(f))}</td>
        <td>
          <button class="btn btn-small btn-primary" onclick="verFactura(${f.id})">Ver</button>
          ${estado === 'PENDIENTE' ? `<button class="btn btn-small btn-success" onclick="firmarFactura(${f.id})">Firmar</button>` : ''}
          ${estado === 'FIRMADO' && !facturaEstaAceptada(f) ? `<button class="btn btn-small btn-success" onclick="enviarFactura(${f.id})">Enviar</button>` : ''}
          ${estado === 'CONTINGENCIA' && !facturaEstaAceptada(f) ? `<button class="btn btn-small btn-warning" onclick="procesarContingenciaFactura(${f.id})">Procesar Contingencia</button>` : ''}
          ${estado === 'RECHAZADO' && !facturaEstaAceptada(f) && facturaPuedePasarAContingencia(f) ? `<button class="btn btn-small btn-warning" onclick="convertirRechazoConexionAContingencia(${f.id})">Contingencia</button>` : ''}
          ${estado === 'RECHAZADO' && !facturaEstaAceptada(f) && !facturaPuedePasarAContingencia(f) ? `<button class="btn btn-small btn-warning" onclick="reenviarFacturaCorregida(${f.id})">Reenviar</button>` : ''}
          ${estado === 'ENVIADO' && facturaPuedeAnularsePorPlazo(f) ? `<button class="btn btn-small btn-danger" onclick="anularFactura(${f.id})">Anular</button>` : ''}
        </td>
      </tr>
    `;
  }).join('');

  renderPaginacion('facturas', facturasFiltradas.length);
}

// Cargar clientes
async function loadClientes() {
  try {
    state.clientes = await window.electronAPI.getClientes();
    renderClientes();
  } catch (error) {
    console.error('Error cargando clientes:', error);
    showNotification('Error al cargar clientes', 'error');
  }
}

function obtenerClientesFiltrados() {
  const busqueda = normalizarBusqueda(document.getElementById('buscar-clientes')?.value);
  if (!busqueda) return [...state.clientes];

  return state.clientes.filter(c => {
    const departamento = window.divisionGeografica?.departamentos?.find(d => d.codigo === c.departamento);
    return coincideBusqueda(busqueda, [
      c.numero_documento,
      c.nrc,
      c.nombre,
      c.nombre_comercial,
      c.tipo_persona,
      c.email,
      c.telefono,
      c.condicion_iva,
      c.plazo_pago,
      c.periodo_pago,
      c.tipo_dte_default,
      obtenerNombreTipoDte(c.tipo_dte_default || '01'),
      c.giro,
      c.actividad_economica,
      c.departamento,
      departamento?.nombre,
      c.municipio,
      c.distrito,
      obtenerNombreMunicipio(c.departamento, c.municipio),
      obtenerNombreDistrito(c.distrito)
    ]);
  });
}

function renderClientes() {
  const tbody = document.querySelector('#tabla-clientes tbody');
  const clientesFiltrados = obtenerClientesFiltrados();
  const pagina = paginarItems(clientesFiltrados, 'clientes');

  if (clientesFiltrados.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay clientes que coincidan con la búsqueda</td></tr>';
    renderPaginacion('clientes', 0);
    return;
  }

  tbody.innerHTML = pagina.items.map(c => {
    let ubicacion = '';
    if (c.distrito) {
      const nombreDistrito = obtenerNombreDistrito(c.distrito);
      ubicacion = nombreDistrito;
    } else if (c.municipio && c.departamento) {
      const nombreMunicipio = obtenerNombreMunicipio(c.departamento, c.municipio);
      ubicacion = nombreMunicipio;
    } else if (c.departamento) {
      const depto = window.divisionGeografica?.departamentos?.find(d => d.codigo === c.departamento);
      ubicacion = depto?.nombre || c.departamento;
    } else {
      ubicacion = 'N/A';
    }

    const sujetoExcluidoNoDomiciliado = c.tipo_dte_default === '14' && Number(c.sujeto_excluido_domiciliado) === 0;
    return `
      <tr>
        <td>${c.numero_documento}</td>
        <td>${c.nrc || 'N/A'}</td>
        <td>${c.nombre}${Number(c.aplica_exportacion) ? ' <span class="badge badge-info">Exportación</span>' : ''}${sujetoExcluidoNoDomiciliado ? ' <span class="badge badge-warning">No domiciliado</span>' : ''} <span class="badge ${c.condicion_iva === 'EXENTO' ? 'badge-warning' : 'badge-success'}">${c.condicion_iva === 'EXENTO' ? 'Exento' : 'Gravado'}</span><br><small>Pago: ${c.plazo_pago || '01'} / ${Number(c.periodo_pago || 1)}</small></td>
        <td>${c.tipo_persona || 'N/A'}</td>
        <td>${ubicacion}</td>
        <td>${c.telefono || 'N/A'}</td>
        <td>${c.email || 'N/A'}</td>
        <td>
          <button class="btn btn-small btn-primary" onclick="editarCliente(${c.id})">Editar</button>
          <button class="btn btn-small btn-danger" onclick="eliminarCliente(${c.id})">Eliminar</button>
        </td>
      </tr>
    `;
  }).join('');

  renderPaginacion('clientes', clientesFiltrados.length);
}

// Cargar productos
async function loadProductos() {
  try {
    state.productos = await window.electronAPI.getProductos();
    renderProductos();
  } catch (error) {
    console.error('Error cargando productos:', error);
    showNotification('Error al cargar productos', 'error');
  }
}

function obtenerProductosFiltrados() {
  const busqueda = normalizarBusqueda(document.getElementById('buscar-productos')?.value);
  if (!busqueda) return [...state.productos];

  return state.productos.filter(p => {
    const tipoNombre = getTipoProductoNombre(p.tipo);
    const ivaTexto = p.exento ? 'Exento' : 'Gravado IVA 13%';
    return coincideBusqueda(busqueda, [
      p.codigo,
      p.descripcion,
      p.tipo,
      tipoNombre,
      p.precio,
      ivaTexto
    ]);
  });
}

function renderProductos() {
  const tbody = document.querySelector('#tabla-productos tbody');
  const productosFiltrados = obtenerProductosFiltrados();
  const pagina = paginarItems(productosFiltrados, 'productos');

  if (productosFiltrados.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay productos que coincidan con la búsqueda</td></tr>';
    renderPaginacion('productos', 0);
    return;
  }

  tbody.innerHTML = pagina.items.map(p => {
    const tipoNombre = getTipoProductoNombre(p.tipo);
    const tieneIVA = !p.exento;
    const precioFinal = tieneIVA ? p.precio * 1.13 : p.precio;
    const ivaTexto = tieneIVA ? '13%' : 'Exento';

    return `
      <tr>
        <td><strong>${p.codigo}</strong></td>
        <td>${p.descripcion}</td>
        <td><span class="badge badge-info">${tipoNombre}</span></td>
        <td>${formatCurrency(p.precio)}</td>
        <td><span class="badge ${tieneIVA ? 'badge-success' : 'badge-warning'}">${ivaTexto}</span></td>
        <td><strong>${formatCurrency(precioFinal)}</strong></td>
        <td>
          <button class="btn btn-small btn-primary" onclick="editarProducto(${p.id})">Editar</button>
          <button class="btn btn-small btn-danger" onclick="eliminarProducto(${p.id})">Eliminar</button>
        </td>
      </tr>
    `;
  }).join('');

  renderPaginacion('productos', productosFiltrados.length);
}

// Cargar configuración
async function loadConfiguracion() {
  try {
    const config = await window.electronAPI.getConfiguracion();
    state.configuracion = config || state.configuracion;
    if (config) {
      document.getElementById('config-nit').value = config.nit || '';
      document.getElementById('config-nrc').value = config.nrc || '';
      document.getElementById('config-nombre').value = config.nombre_empresa || '';
      document.getElementById('config-nombre-comercial').value = config.nombre_comercial || '';
      document.getElementById('config-logo-path').value = config.logo_path || '';
      document.getElementById('config-tipo-persona').value = config.tipo_persona || '';
      
      // Mostrar actividad económica con código y descripción
      if (config.actividad_economica) {
        const actividad = actividadesEconomicas.find(a => a.codigo === config.actividad_economica);
        if (actividad) {
          document.getElementById('config-actividad').value = `${actividad.codigo} - ${actividad.descripcion}`;
          document.getElementById('config-actividad').setAttribute('data-codigo', actividad.codigo);
        } else {
          document.getElementById('config-actividad').value = config.actividad_economica;
          document.getElementById('config-actividad').removeAttribute('data-codigo');
        }
      }
      
      document.getElementById('config-telefono').value = config.telefono || '';
      document.getElementById('config-email').value = config.email || '';
      document.getElementById('config-departamento').value = config.departamento || '';
      
      // Cargar municipios y distrito si hay departamento
      if (config.departamento) {
        cargarMunicipiosConfig(config.departamento);
        setTimeout(() => {
          document.getElementById('config-municipio').value = config.municipio || '';
          
          if (config.municipio) {
            cargarDistritosConfig(config.municipio);
            setTimeout(() => {
              document.getElementById('config-distrito').value = config.distrito || '';
            }, 50);
          }
        }, 50);
      }
      
      document.getElementById('config-direccion').value = config.direccion || '';
      document.getElementById('config-hacienda-usuario').value = config.hacienda_usuario || '';
      document.getElementById('config-hacienda-password').value = config.hacienda_password || '';
      document.getElementById('config-hacienda-ambiente').value = config.hacienda_ambiente || 'pruebas';
      document.getElementById('config-establecimiento').value = config.codigo_establecimiento || '';
      document.getElementById('config-punto-venta').value = config.punto_venta || '';
      aplicarTiposDteConfiguracion(config.tipos_dte_habilitados);
      
      // Tipo de firma y credenciales
      const tipoFirma = config.tipo_firma || 'svfe';
      document.getElementById('config-tipo-firma').value = tipoFirma;
      
      // Mostrar/ocultar opciones según tipo de firma
      toggleFirmaOptions(tipoFirma);
      
      // Credenciales firmador web
      document.getElementById('config-firmador-usuario').value = config.firmador_usuario || '';
      document.getElementById('config-firmador-password').value = config.firmador_password || '';
      document.getElementById('config-firmador-pin').value = config.firmador_pin || '';
      
      // Certificado local
      document.getElementById('config-certificado-path').value = config.certificado_path || '';
      document.getElementById('config-certificado-password').value = config.certificado_password || '';
      document.getElementById('config-correo-smtp-host').value = config.correo_smtp_host || 'smtp.gmail.com';
      document.getElementById('config-correo-smtp-port').value = config.correo_smtp_port || 465;
      document.getElementById('config-correo-smtp-secure').value = String(config.correo_smtp_secure ?? 1);
      document.getElementById('config-correo-usuario').value = config.correo_usuario || '';
      document.getElementById('config-correo-password').value = config.correo_password || '';
      document.getElementById('config-correo-remitente').value = config.correo_remitente || config.correo_usuario || '';
      document.getElementById('config-correo-nombre').value = config.correo_nombre || config.nombre_empresa || '';
      document.getElementById('config-backup-url').value = config.backup_url || '';
      document.getElementById('config-backup-token').value = config.backup_token || '';
      document.getElementById('config-backup-encryption-key').value = config.backup_encryption_key || '';
      document.getElementById('config-backup-automatico').value = String(config.backup_automatico || 0);
      actualizarEstadoBackupConfig();
    } else {
      aplicarTiposDteConfiguracion(TIPOS_DTE_DEFAULT);
      actualizarEstadoBackupConfig();
    }
    renderSelectsTiposDte();
    await loadCorrelativosConfig();
    setConfiguracionEditable(false);
  } catch (error) {
    console.error('Error cargando configuración:', error);
  }
}

function setConfiguracionEditable(editable) {
  const form = document.getElementById('form-configuracion');
  if (!form) return;
  form.classList.toggle('config-locked', !editable);

  form.querySelectorAll('input, select, textarea, button').forEach(control => {
    if (control.id === 'switch-config-edicion') return;
    if (control.id === 'btn-subir-backup') return;
    control.disabled = !editable;
  });

  const switchEdicion = document.getElementById('switch-config-edicion');
  const switchLabel = document.getElementById('config-switch-label');
  const title = document.getElementById('config-lock-title');
  const help = document.getElementById('config-lock-help');

  if (switchEdicion) switchEdicion.checked = editable;
  if (switchLabel) {
    switchLabel.setAttribute('aria-label', editable ? 'Configuración desbloqueada' : 'Configuración bloqueada');
    switchLabel.title = editable ? 'Configuración desbloqueada' : 'Configuración bloqueada';
  }

  if (title) title.textContent = editable ? 'Configuración desbloqueada' : 'Configuración bloqueada';
  if (help) {
    help.textContent = editable
      ? 'Los cambios pueden afectar emisión, firma, correlativos y envío a Hacienda.'
      : 'Los campos permanecen bloqueados para evitar cambios accidentales.';
  }
}

async function loadCorrelativosConfig() {
  const tbody = document.getElementById('correlativos-body');
  if (!tbody) return;

  try {
    const correlativos = await window.electronAPI.getCorrelativosDte();
    if (!correlativos.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay correlativos registrados todavía</td></tr>';
      return;
    }

    tbody.innerHTML = correlativos.map(row => {
      const tipo = String(row.tipo_dte || '').padStart(2, '0');
      const establecimiento = row.establecimiento || '';
      const puntoVenta = row.punto_venta || '';
      const serie = establecimiento || puntoVenta ? `${establecimiento}/${puntoVenta}` : 'General';
      const minimo = Number(row.ultimo_usado || 0) + 1;
      const siguiente = Math.max(Number(row.siguiente || 1), minimo);
      const rowId = `${tipo}-${row.anio}-${establecimiento || 'GEN'}-${puntoVenta || 'GEN'}`;

      return `
        <tr>
          <td><strong>${tipo}</strong><br><small>${escaparHtml(obtenerNombreTipoDte(tipo))}</small></td>
          <td>${row.anio}</td>
          <td>${escaparHtml(serie)}</td>
          <td>${Number(row.ultimo_usado || 0)}</td>
          <td>
            <input
              type="number"
              class="table-input correlativo-input"
              id="correlativo-${rowId}"
              min="${minimo}"
              value="${siguiente}"
            >
          </td>
          <td>
            <button type="button" class="btn btn-small btn-primary" onclick="guardarCorrelativoDte('${tipo}', ${Number(row.anio)}, '${escaparHtml(establecimiento)}', '${escaparHtml(puntoVenta)}', '${rowId}')">Guardar</button>
          </td>
        </tr>
      `;
    }).join('');
  } catch (error) {
    console.error('Error cargando correlativos:', error);
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">No se pudieron cargar los correlativos</td></tr>';
  }
}

window.guardarCorrelativoDte = async function(tipoDte, anio, establecimiento, puntoVenta, rowId) {
  try {
    const input = document.getElementById(`correlativo-${rowId}`);
    const siguiente = Number(input?.value || 0);
    const minimo = Number(input?.min || 1);

    if (!Number.isInteger(siguiente) || siguiente < minimo) {
      showNotification(`El siguiente correlativo debe ser mayor o igual a ${minimo}.`, 'error');
      return;
    }

    await window.electronAPI.updateCorrelativoDte({
      tipo_dte: tipoDte,
      anio,
      establecimiento,
      punto_venta: puntoVenta,
      siguiente
    });

    showNotification('Correlativo actualizado correctamente', 'success');
    await loadCorrelativosConfig();
  } catch (error) {
    console.error('Error guardando correlativo:', error);
    showNotification(error.message || 'No se pudo actualizar el correlativo', 'error');
  }
};

// Toggle entre opciones de firma web y local
function toggleFirmaOptions(tipo) {
  const webOptions = document.getElementById('firma-web-options');
  const localOptions = document.getElementById('firma-local-options');
  
  if (tipo === 'web' || tipo === 'svfe') {
    webOptions.style.display = 'grid';
    localOptions.style.display = 'none';
  } else {
    webOptions.style.display = 'none';
    localOptions.style.display = 'grid';
  }
}

// Cargar clientes en select
async function loadClientesSelect() {
  const select = document.getElementById('cliente-select');
  select.innerHTML = '<option value="">Seleccionar cliente...</option>';
  state.clientes.forEach(c => {
    const option = document.createElement('option');
    option.value = c.id;
    option.textContent = `${c.nombre} - ${c.numero_documento} (${obtenerNombreTipoDte(c.tipo_dte_default || '01')})`;
    select.appendChild(option);
  });
}

// Configurar event listeners
function setupEventListeners() {
  // Botón filtrar facturas
  document.getElementById('btn-filtrar')?.addEventListener('click', () => {
    resetPagina('facturas');
    renderFacturas();
  });
  
  // Filtros automáticos al cambiar fecha o estado
  document.getElementById('fecha-desde')?.addEventListener('change', () => {
    resetPagina('facturas');
    renderFacturas();
  });
  document.getElementById('fecha-hasta')?.addEventListener('change', () => {
    resetPagina('facturas');
    renderFacturas();
  });
  document.getElementById('filtro-estado')?.addEventListener('change', () => {
    resetPagina('facturas');
    renderFacturas();
  });
  document.getElementById('filtro-tipo-dte')?.addEventListener('change', () => {
    resetPagina('facturas');
    renderFacturas();
  });
  document.getElementById('buscar-facturas')?.addEventListener('input', () => {
    resetPagina('facturas');
    renderFacturas();
  });
  document.getElementById('buscar-clientes')?.addEventListener('input', () => {
    resetPagina('clientes');
    renderClientes();
  });
  document.getElementById('buscar-productos')?.addEventListener('input', () => {
    resetPagina('productos');
    renderProductos();
  });
  document.getElementById('descuento-general')?.addEventListener('input', actualizarResumenFactura);
  document.getElementById('descuento-general-tipo')?.addEventListener('change', actualizarResumenFactura);
  
  // Configuración
  document.getElementById('form-configuracion')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await guardarConfiguracion();
  });
  document.getElementById('switch-config-edicion')?.addEventListener('change', (e) => {
    if (!e.target.checked) {
      setConfiguracionEditable(false);
      return;
    }

    const confirmar = confirm('Está por modificar datos sensibles de facturación. Los cambios pueden afectar emisión, firma, correlativos y envío a Hacienda. ¿Desea habilitar la edición?');
    if (confirmar) {
      setConfiguracionEditable(true);
    } else {
      setConfiguracionEditable(false);
    }
  });
  document.querySelectorAll('#config-tipos-dte input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', () => {
      const algunoMarcado = Boolean(document.querySelector('#config-tipos-dte input[type="checkbox"]:checked'));
      if (!algunoMarcado) input.checked = true;
    });
  });
  document.getElementById('btn-recargar-correlativos')?.addEventListener('click', loadCorrelativosConfig);
  document.getElementById('btn-subir-backup')?.addEventListener('click', async () => {
    await ejecutarBackupServidor(true);
  });
  
  // Nueva factura
  document.getElementById('form-factura')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await generarFactura();
  });

  document.getElementById('tipo-dte')?.addEventListener('change', () => {
    actualizarCamposNotaCredito();
    aplicarCondicionIvaClienteAItems();
    actualizarResumenFactura();
  });
  document.getElementById('cliente-select')?.addEventListener('change', () => {
    sugerirTipoDteClienteSeleccionado();
    aplicarCondicionIvaClienteAItems();
    actualizarResumenFactura();
  });
  document.getElementById('nc-tipo-generacion')?.addEventListener('change', actualizarPlaceholderDocumentoRelacionado);
  document.getElementById('btn-agregar-documento-relacionado')?.addEventListener('click', agregarDocumentoRelacionadoNotaCredito);
  document.getElementById('exportacion-tipo-item')?.addEventListener('change', actualizarCamposExportacionFactura);
  document.getElementById('retencion-monto-sujeto')?.addEventListener('input', actualizarResumenFactura);
  document.getElementById('retencion-porcentaje')?.addEventListener('input', actualizarResumenFactura);
  document.getElementById('retencion-iva-factura')?.addEventListener('input', actualizarResumenFactura);
  document.getElementById('percepcion-iva-factura')?.addEventListener('input', actualizarResumenFactura);
  document.getElementById('retencion-renta-factura')?.addEventListener('input', actualizarResumenFactura);
  
  document.getElementById('btn-agregar-item')?.addEventListener('click', agregarItem);
  document.getElementById('btn-cancelar')?.addEventListener('click', () => {
    switchView('dashboard');
    limpiarFormularioFactura();
  });
  
  // Nuevo cliente
  document.getElementById('btn-nuevo-cliente')?.addEventListener('click', () => {
    abrirModalCliente();
  });
  
  // Form cliente
  document.getElementById('form-cliente')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await guardarCliente();
  });
  
  // Nuevo producto
  document.getElementById('btn-nuevo-producto')?.addEventListener('click', () => {
    abrirModalProducto();
  });
  
  // Form producto
  document.getElementById('form-producto')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await guardarProducto();
  });
  
  // Probar conexión con Hacienda
  document.getElementById('btn-test-conexion')?.addEventListener('click', async () => {
    await probarConexionHacienda();
  });
  
  // Form firmador
  document.getElementById('form-firmador')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await procesarFirmaDocumento();
  });

  // Form anulación
  document.getElementById('form-anulacion')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await procesarAnulacionFactura();
  });

  document.getElementById('anulacion-tipo')?.addEventListener('change', (e) => {
    const facturaId = Number(document.getElementById('anulacion-factura-id')?.value || 0);
    const factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
    toggleCodigoReemplazoAnulacion(Number(e.target.value), factura?.tipo_dte);
  });

  document.getElementById('form-correo')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await procesarEnvioCorreoFactura();
  });
  
  // Botón seleccionar certificado
  document.getElementById('btn-select-certificado')?.addEventListener('click', async () => {
    await seleccionarCertificado();
  });
  document.getElementById('btn-select-logo')?.addEventListener('click', async () => {
    await seleccionarLogoPDF();
  });
  document.getElementById('btn-clear-logo')?.addEventListener('click', () => {
    document.getElementById('config-logo-path').value = '';
    showNotification('Imagen del PDF removida. Guarde la configuración para aplicar el cambio.', 'info');
  });
  
  // Cambio de tipo de firma
  document.getElementById('config-tipo-firma')?.addEventListener('change', (e) => {
    toggleFirmaOptions(e.target.value);
  });
  
  // Inicializar autocomplete de actividades económicas
  setupActividadAutocomplete('cliente-giro', 'cliente-giro-dropdown');
  setupActividadAutocomplete('config-actividad', 'config-actividad-dropdown');

  document.getElementById('cliente-aplica-exportacion')?.addEventListener('change', actualizarCamposExportacionCliente);
  document.getElementById('cliente-tipo-dte-default')?.addEventListener('change', actualizarCamposExportacionCliente);
  document.getElementById('cliente-tipo-documento')?.addEventListener('change', actualizarCamposExportacionCliente);
  document.getElementById('cliente-cod-pais')?.addEventListener('change', completarPaisExportacionCliente);
}

// Poblar selects de departamentos
function poblarSelectsDepartamentos() {
  // Si los datos no están disponibles aún, reintentar en 100ms
  if (!window.divisionGeografica) {
    console.warn('División geográfica no cargada aún, reintentando...');
    setTimeout(poblarSelectsDepartamentos, 100);
    return;
  }
  
  const clienteDepartamento = document.getElementById('cliente-departamento');
  const configDepartamento = document.getElementById('config-departamento');
  
  const departamentos = window.divisionGeografica.departamentos;
  
  // Poblar select de clientes
  if (clienteDepartamento) {
    departamentos.forEach(depto => {
      const option = document.createElement('option');
      option.value = depto.codigo;
      option.textContent = depto.nombre;
      clienteDepartamento.appendChild(option);
    });
  }
  
  // Poblar select de configuración
  if (configDepartamento) {
    departamentos.forEach(depto => {
      const option = document.createElement('option');
      option.value = depto.codigo;
      option.textContent = depto.nombre;
      configDepartamento.appendChild(option);
    });
  }
}

// Configurar manejador de departamento-municipio-distrito
function setupDepartamentoMunicipioHandler() {
  const departamentoSelect = document.getElementById('cliente-departamento');
  const municipioSelect = document.getElementById('cliente-municipio');
  
  if (departamentoSelect && municipioSelect) {
    departamentoSelect.addEventListener('change', (e) => {
      const departamento = e.target.value;
      cargarMunicipios(departamento);
    });
    
    municipioSelect.addEventListener('change', (e) => {
      const municipio = e.target.value;
      cargarDistritos(municipio);
    });
  }
}

// Cargar municipios según departamento
function cargarMunicipios(codigoDepartamento) {
  const municipioSelect = document.getElementById('cliente-municipio');
  const distritoSelect = document.getElementById('cliente-distrito');
  
  // Limpiar opciones actuales
  municipioSelect.innerHTML = '<option value="">Seleccionar municipio...</option>';
  if (distritoSelect) {
    distritoSelect.innerHTML = '<option value="">Seleccione primero un municipio...</option>';
    distritoSelect.disabled = true;
  }
  
  if (!codigoDepartamento || !window.divisionGeografica?.municipios[codigoDepartamento]) {
    municipioSelect.disabled = true;
    return;
  }
  
  municipioSelect.disabled = false;
  
  // Cargar municipios del departamento seleccionado
  const municipios = window.divisionGeografica.municipios[codigoDepartamento];
  municipios.forEach(municipio => {
    const option = document.createElement('option');
    option.value = municipio.codigo;
    option.textContent = municipio.nombre;
    municipioSelect.appendChild(option);
  });
}

// Cargar distritos según municipio
function cargarDistritos(codigoMunicipio) {
  const distritoSelect = document.getElementById('cliente-distrito');
  
  // Limpiar opciones actuales
  distritoSelect.innerHTML = '<option value="">Seleccionar distrito...</option>';
  
  if (!codigoMunicipio || !window.divisionGeografica?.distritos[codigoMunicipio]) {
    distritoSelect.disabled = true;
    return;
  }
  
  distritoSelect.disabled = false;
  
  // Cargar distritos del municipio seleccionado
  const distritos = window.divisionGeografica.distritos[codigoMunicipio];
  distritos.forEach(distrito => {
    const option = document.createElement('option');
    option.value = distrito.codigo; // Usar el código de 6 dígitos
    option.textContent = distrito.nombre;
    distritoSelect.appendChild(option);
  });
}

// Obtener nombre del municipio por código
function obtenerNombreMunicipio(codigoDepartamento, codigoMunicipio) {
  if (!window.divisionGeografica?.municipios[codigoDepartamento]) {
    return codigoMunicipio;
  }
  
  const municipio = window.divisionGeografica.municipios[codigoDepartamento].find(
    m => m.codigo === codigoMunicipio
  );
  
  return municipio ? municipio.nombre : codigoMunicipio;
}

// Obtener lista de distritos por código de municipio
function obtenerDistritosPorMunicipio(codigoMunicipio) {
  return window.divisionGeografica?.distritos[codigoMunicipio] || [];
}

// Obtener nombre del distrito por código completo (6 dígitos)
function obtenerNombreDistrito(codigoDistrito) {
  // Buscar en todos los municipios
  for (const municipio in window.divisionGeografica?.distritos || {}) {
    const distrito = window.divisionGeografica.distritos[municipio].find(d => d.codigo === codigoDistrito);
    if (distrito) {
      return distrito.nombre;
    }
  }
  return codigoDistrito;
}

// Obtener código de municipio desde código de distrito (primeros 4 dígitos)
function obtenerMunicipioDesdeDistrito(codigoDistrito) {
  return codigoDistrito.substring(0, 4);
}

// Funciones para departamento-municipio-distrito en configuración
function setupDepartamentoMunicipioConfigHandler() {
  const departamentoSelect = document.getElementById('config-departamento');
  const municipioSelect = document.getElementById('config-municipio');
  
  if (departamentoSelect && municipioSelect) {
    departamentoSelect.addEventListener('change', (e) => {
      const departamento = e.target.value;
      cargarMunicipiosConfig(departamento);
    });
    
    municipioSelect.addEventListener('change', (e) => {
      const municipio = e.target.value;
      cargarDistritosConfig(municipio);
    });
  }
}

// Cargar municipios en configuración
function cargarMunicipiosConfig(codigoDepartamento) {
  const municipioSelect = document.getElementById('config-municipio');
  const distritoSelect = document.getElementById('config-distrito');
  
  // Limpiar opciones actuales
  municipioSelect.innerHTML = '<option value="">Seleccionar municipio...</option>';
  if (distritoSelect) {
    distritoSelect.innerHTML = '<option value="">Seleccione primero un municipio...</option>';
    distritoSelect.disabled = true;
  }
  
  if (!codigoDepartamento || !window.divisionGeografica?.municipios[codigoDepartamento]) {
    municipioSelect.disabled = true;
    return;
  }
  
  municipioSelect.disabled = false;
  
  // Cargar municipios del departamento seleccionado
  const municipios = window.divisionGeografica.municipios[codigoDepartamento];
  municipios.forEach(municipio => {
    const option = document.createElement('option');
    option.value = municipio.codigo;
    option.textContent = municipio.nombre;
    municipioSelect.appendChild(option);
  });
}

// Cargar distritos en configuración
function cargarDistritosConfig(codigoMunicipio) {
  const distritoSelect = document.getElementById('config-distrito');
  
  // Limpiar opciones actuales
  distritoSelect.innerHTML = '<option value="">Seleccionar distrito...</option>';
  
  if (!codigoMunicipio || !window.divisionGeografica?.distritos[codigoMunicipio]) {
    distritoSelect.disabled = true;
    return;
  }
  
  distritoSelect.disabled = false;
  
  // Cargar distritos del municipio seleccionado
  const distritos = window.divisionGeografica.distritos[codigoMunicipio];
  distritos.forEach(distrito => {
    const option = document.createElement('option');
    option.value = distrito.codigo;
    option.textContent = distrito.nombre;
    distritoSelect.appendChild(option);
  });
}

// Guardar configuración
async function guardarConfiguracion() {
  try {
    const actividadValue = extraerCodigoActividad(document.getElementById('config-actividad'));
    if (!validarCodigoActividad(actividadValue)) {
      showNotification('Seleccione una actividad económica válida de 5 dígitos para la empresa', 'error');
      return;
    }
    
    const config = {
      nit: document.getElementById('config-nit').value,
      nrc: document.getElementById('config-nrc').value,
      nombre_empresa: document.getElementById('config-nombre').value,
      nombre_comercial: document.getElementById('config-nombre-comercial').value,
      logo_path: document.getElementById('config-logo-path').value,
      tipo_persona: document.getElementById('config-tipo-persona').value,
      actividad_economica: actividadValue,
      telefono: document.getElementById('config-telefono').value,
      email: document.getElementById('config-email').value,
      departamento: document.getElementById('config-departamento').value,
      municipio: document.getElementById('config-municipio').value,
      distrito: document.getElementById('config-distrito').value,
      direccion: document.getElementById('config-direccion').value,
      hacienda_usuario: document.getElementById('config-hacienda-usuario').value,
      hacienda_password: document.getElementById('config-hacienda-password').value,
      hacienda_ambiente: document.getElementById('config-hacienda-ambiente').value,
      codigo_establecimiento: document.getElementById('config-establecimiento').value,
      punto_venta: document.getElementById('config-punto-venta').value,
      tipo_firma: document.getElementById('config-tipo-firma').value,
      firmador_usuario: document.getElementById('config-firmador-usuario').value,
      firmador_password: document.getElementById('config-firmador-password').value,
      firmador_pin: document.getElementById('config-firmador-pin').value,
      certificado_path: document.getElementById('config-certificado-path').value,
      certificado_password: document.getElementById('config-certificado-password').value,
      correo_smtp_host: document.getElementById('config-correo-smtp-host').value || 'smtp.gmail.com',
      correo_smtp_port: Number(document.getElementById('config-correo-smtp-port').value || 465),
      correo_smtp_secure: Number(document.getElementById('config-correo-smtp-secure').value),
      correo_usuario: document.getElementById('config-correo-usuario').value,
      correo_password: document.getElementById('config-correo-password').value,
      correo_remitente: document.getElementById('config-correo-remitente').value,
      correo_nombre: document.getElementById('config-correo-nombre').value,
      backup_url: document.getElementById('config-backup-url').value,
      backup_token: document.getElementById('config-backup-token').value,
      backup_encryption_key: document.getElementById('config-backup-encryption-key').value,
      backup_automatico: Number(document.getElementById('config-backup-automatico').value || 0),
      tipos_dte_habilitados: obtenerTiposDteConfiguradosFormulario()
    };
    
    await window.electronAPI.updateConfiguracion(config);
    state.configuracion = await window.electronAPI.getConfiguracion();
    actualizarEstadoBackupConfig();
    renderSelectsTiposDte();
    showNotification('Configuración guardada exitosamente', 'success');
    
    // Actualizar estado de conexión
    verificarEstadoConexion();
  } catch (error) {
    console.error('Error guardando configuración:', error);
    showNotification('Error al guardar configuración', 'error');
  }
}

// Agregar item a factura
function agregarItem() {
  abrirModalItem();
}

function obtenerNotasFacturaFormulario(tipoDte) {
  if (!['01', '03'].includes(String(tipoDte || ''))) return '';
  return String(document.getElementById('factura-notas')?.value || '').trim().slice(0, 150);
}

function construirApendiceNotas(notas) {
  if (!notas) return null;
  return [{
    campo: 'notas',
    etiqueta: 'Notas del documento',
    valor: notas
  }];
}

// Generar factura
async function generarFactura() {
  try {
    iniciarProcesoEnvio('Envío de documento a Hacienda', [
      'Validando datos del cliente y documento',
      'Creando factura local',
      'Firmando documento',
      'Enviando a Hacienda',
      'Esperando respuesta de Hacienda',
      'Creando JSON con respuesta MH',
      'Generando PDF para correo',
      'Enviando correo'
    ]);
    await avanzarProcesoEnvio('Validando datos del cliente y documento...');

    // Validar que haya cliente seleccionado
    const clienteId = document.getElementById('cliente-select').value;
    if (!clienteId) {
      await finalizarProcesoEnvio('Seleccione un cliente para continuar.', 'error');
      showNotification('Por favor seleccione un cliente', 'error');
      return;
    }

    // Obtener tipo de DTE
    const tipoDte = document.getElementById('tipo-dte').value;
    const notasFactura = obtenerNotasFacturaFormulario(tipoDte);
    const requiereDocumentoRelacionado = ['05', '06', '07'].includes(tipoDte);
    const esRetencion = tipoDte === '07';
    const esFacturaConsumidorFinal = tipoDte === '01';

    if (!esRetencion && state.currentFactura.items.length === 0) {
      await finalizarProcesoEnvio('Agregue al menos un producto o servicio.', 'error');
      showNotification('Por favor agregue al menos un producto', 'error');
      return;
    }

    const datosRetencion = esRetencion ? obtenerDatosRetencion() : null;
    if (esRetencion && (!datosRetencion || datosRetencion.montoSujeto <= 0 || datosRetencion.porcentaje <= 0)) {
      await finalizarProcesoEnvio('Complete los datos de retención.', 'error');
      showNotification('Ingrese el monto sujeto y el porcentaje de retención.', 'error');
      return;
    }

    // Obtener datos del cliente
    const cliente = state.clientes.find(c => c.id === parseInt(clienteId));
    if (!cliente) {
      await finalizarProcesoEnvio('No se encontró el cliente seleccionado.', 'error');
      showNotification('Cliente no encontrado', 'error');
      return;
    }

    const itemsFactura = esRetencion ? [] : state.currentFactura.items.map(item => ({
      ...item,
      exento: itemEsExentoPorCliente(item, cliente, tipoDte),
      condicionIvaCliente: cliente.condicion_iva || 'GRAVADO'
    }));

    // Calcular totales
    const resumen = calcularResumenFactura(itemsFactura);
    const ajustesIvaFactura = obtenerAjustesIvaFactura(tipoDte, cliente);
    
    const documentoRelacionado = requiereDocumentoRelacionado ? obtenerDocumentoRelacionadoNotaCredito() : null;

    if (requiereDocumentoRelacionado && !documentoRelacionado) {
      await finalizarProcesoEnvio('Complete el documento relacionado antes de enviar.', 'error');
      return;
    }

    if (['05', '06'].includes(tipoDte)) {
      const relacionados = Array.isArray(documentoRelacionado) ? documentoRelacionado : [documentoRelacionado].filter(Boolean);
      const numerosRelacionados = new Set(relacionados.map(doc => doc.numeroDocumento).filter(Boolean));
      const itemSinDocumentoRelacionado = relacionados.length > 1
        ? itemsFactura.find(item => !item.numeroDocumentoRelacionado || !numerosRelacionados.has(item.numeroDocumentoRelacionado))
        : null;

      if (itemSinDocumentoRelacionado) {
        await finalizarProcesoEnvio(`Cada ítem de la ${obtenerNombreTipoDte(tipoDte)} debe seleccionar el CCF relacionado al que aplica.`, 'error');
        showNotification(`Cada ítem de la ${obtenerNombreTipoDte(tipoDte)} debe seleccionar el CCF relacionado al que aplica.`, 'error');
        return;
      }
    }

    const errorReceptor = validarReceptorParaHacienda(tipoDte, cliente, state.configuracion, resumen.total);
    if (errorReceptor) {
      await finalizarProcesoEnvio('El receptor no cumple las validaciones requeridas.', 'error');
      showNotification(errorReceptor, 'error');
      return;
    }

    const errorExportacion = validarClienteExportacion(tipoDte, cliente);
    if (errorExportacion) {
      await finalizarProcesoEnvio('El cliente de exportación tiene datos pendientes.', 'error');
      showNotification(errorExportacion, 'error');
      return;
    }

    const errorSujetoExcluido = validarClienteSujetoExcluido(tipoDte, cliente);
    if (errorSujetoExcluido) {
      await finalizarProcesoEnvio('El sujeto excluido tiene datos pendientes.', 'error');
      showNotification(errorSujetoExcluido, 'error');
      return;
    }
    
    // Preparar datos del cliente para el generador
    const clienteDatos = {
      tipo_documento: cliente.tipo_documento,
      numero_documento: cliente.numero_documento,
      nrc: cliente.nrc,
      nombre: cliente.nombre,
      nombre_comercial: cliente.nombre_comercial,
      condicion_iva: cliente.condicion_iva || 'GRAVADO',
      giro: cliente.giro,
      desc_actividad: cliente.giro ? obtenerDescripcionActividad(cliente.giro) : null,
      telefono: cliente.telefono,
      email: cliente.email,
      direccion: cliente.direccion,
      municipio: cliente.municipio,
      departamento: cliente.departamento,
      aplica_exportacion: cliente.aplica_exportacion,
      cod_pais: cliente.cod_pais,
      nombre_pais: cliente.nombre_pais,
      tipo_persona_exportacion: cliente.tipo_persona_exportacion,
      desc_actividad_exportacion: cliente.desc_actividad_exportacion
    };
    
    // Preparar items para el generador
    const items = esRetencion ? [] : itemsFactura.map((item, index) => {
      const exento = itemEsExentoPorCliente(item, cliente, tipoDte);
      const subtotalItem = (item.cantidad * item.precioUnitario) - (item.descuento || 0);
      const numeroDocumentoRelacionado = requiereDocumentoRelacionado
        ? obtenerNumeroDocumentoRelacionadoItem(item, documentoRelacionado)
        : null;

      return {
        numItem: index + 1,
        tipoItem: 1, // 1=Bien, 2=Servicio
        cantidad: item.cantidad,
        codigo: item.codigo,
        codTributo: exento ? null : '20', // '20' = IVA 13%
        unidad_medida: item.unidad_medida || 'UND',
        descripcion: item.descripcion,
        precio_unitario: item.precioUnitario,
        numero_documento: numeroDocumentoRelacionado,
        numeroDocumento: numeroDocumentoRelacionado,
        montoDescu: item.descuento || 0,
        descuento: item.descuento || 0,
        exento,
        ventaNoSuj: 0,
        ventaExenta: exento ? subtotalItem : 0,
        ventaGravada: !exento ? subtotalItem : 0
      };
    });
    
    // Preparar resumen para el generador
    const esDocumentoSinIva = ['07', '11', '14'].includes(tipoDte);
    const opcionesExportacion = tipoDte === '11' ? obtenerOpcionesExportacionFactura() : {};
    const totalGravadoDte = esFacturaConsumidorFinal
      ? roundMoney(resumen.subtotalGravado + resumen.totalIva)
      : resumen.subtotalGravado;
    const subtotalDte = esFacturaConsumidorFinal
      ? roundMoney(totalGravadoDte + resumen.subtotalExento)
      : resumen.subtotalTotal;
    const totalExportacion = tipoDte === '11'
      ? roundMoney(resumen.subtotalTotal + (opcionesExportacion.flete || 0) + (opcionesExportacion.seguro || 0))
      : null;
    const totalDte = esRetencion
      ? datosRetencion.ivaRetenido
      : tipoDte === '11'
      ? totalExportacion
      : (esDocumentoSinIva ? resumen.subtotalTotal : resumen.total);
    const totalPagarDte = esRetencion
      ? totalDte
      : roundMoney(Math.max(0, totalDte + ajustesIvaFactura.ivaPerci1 - ajustesIvaFactura.ivaRete1 - ajustesIvaFactura.reteRenta));
    const ivaDte = esDocumentoSinIva ? 0 : resumen.totalIva;
    const montoRetencion = esRetencion ? datosRetencion.ivaRetenido : 0;

    const resumenDte = {
      subtotal: subtotalDte,
      total: totalDte,
      iva: ivaDte,
      gravada: esDocumentoSinIva ? resumen.subtotalTotal : totalGravadoDte,
      exenta: resumen.subtotalExento,
      descuento: resumen.totalDescuentoCompleto,
      totalNoSuj: 0,
      totalExenta: resumen.subtotalExento,
      totalGravada: totalGravadoDte,
      subTotalVentas: subtotalDte,
      descuNoSuj: 0,
      descuExenta: resumen.descuentoGeneralDistribuido.exento,
      descuGravada: resumen.descuentoGeneralDistribuido.gravado,
      totalDescu: resumen.totalDescuentoCompleto,
      tributos: ivaDte > 0 ? [{
        codigo: '20',
        descripcion: 'Impuesto al Valor Agregado 13%',
        valor: ivaDte
      }] : null,
      subTotal: subtotalDte,
      ivaRete1: ajustesIvaFactura.ivaRete1,
      ivaPerci1: tipoDte === '03' ? ajustesIvaFactura.ivaPerci1 : undefined,
      reteRenta: ajustesIvaFactura.reteRenta,
      montoTotalOperacion: roundMoney(totalDte),
      totalNoGravado: 0,
      totalPagar: roundMoney(totalPagarDte),
      totalLetras: numeroALetras(totalPagarDte),
      condicionOperacion: parseInt(document.getElementById('condicion-operacion').value),
      pagos: [obtenerPagoDesdeCliente(cliente, totalPagarDte)],
      totalSujetoRetencion: esRetencion ? datosRetencion.montoSujeto : undefined,
      totalIVAretenido: esRetencion ? montoRetencion : undefined
    };

    const errorMaximoIvaRete1 = validarMaximoIvaRete1DTE(tipoDte, resumenDte, resumenDte.ivaRete1);
    if (errorMaximoIvaRete1) {
      await finalizarProcesoEnvio('La retención IVA excede el máximo permitido.', 'error');
      showNotification(errorMaximoIvaRete1, 'error');
      return;
    }
    
    await avanzarProcesoEnvio('Creando factura local y DTE base...');

    // Generar DTE usando el generador oficial
    const resultadoDte = await window.electronAPI.generarDTE({
      tipo: tipoDte,
      config: {
        ...state.configuracion,
        desc_actividad: obtenerDescripcionActividad(state.configuracion.actividad_economica)
      },
      cliente: clienteDatos,
      items,
      resumen: resumenDte,
      opciones: {
        tipoTransmision: 1, // 1=Normal
        tipoContingencia: null,
        documentoRelacionado,
        apendice: construirApendiceNotas(notasFactura),
        codigoRetencionMH: document.getElementById('retencion-codigo')?.value || '22',
        retencion: datosRetencion,
        ...opcionesExportacion
      }
    });
    
    if (!resultadoDte.success) {
      await finalizarProcesoEnvio('No se pudo generar el JSON DTE.', 'error');
      showNotification('Error al generar DTE: ' + resultadoDte.error, 'error');
      return;
    }
    
    const dte = resultadoDte.dte;
    const resumenFinalDte = dte.resumen || {};
    const ivaFinalDte = roundMoney(
      resumenFinalDte.totalIva ??
      (Array.isArray(resumenFinalDte.tributos)
        ? resumenFinalDte.tributos.reduce((sum, tributo) => sum + Number(tributo?.valor || 0), 0)
        : ivaDte)
    );
    const totalFinalDte = roundMoney(resumenFinalDte.totalPagar ?? resumenFinalDte.montoTotalOperacion ?? totalDte);
    const subtotalFinalDte = roundMoney(resumenFinalDte.subTotal ?? resumenFinalDte.subTotalVentas ?? resumen.subtotalTotal);
    
    // Crear objeto de factura para la base de datos
    const factura = {
      numero_control: dte.identificacion.numeroControl,
      codigo_generacion: dte.identificacion.codigoGeneracion,
      tipo_dte: tipoDte,
      fecha_emision: dte.identificacion.fecEmi,
      cliente_id: cliente.id,
      cliente_datos: {
        tipo_documento: cliente.tipo_documento,
        numero_documento: cliente.numero_documento,
        nombre: cliente.nombre,
        condicion_iva: cliente.condicion_iva || 'GRAVADO',
        telefono: cliente.telefono,
        email: cliente.email,
        direccion: cliente.direccion,
        municipio: cliente.municipio,
        departamento: cliente.departamento
      },
      items: items,
      subtotal: esRetencion ? datosRetencion.montoSujeto : subtotalFinalDte,
      iva: ivaFinalDte,
      total: totalFinalDte,
      descuento: roundMoney(resumenFinalDte.totalDescu ?? resumen.totalDescuentoCompleto),
      retencion: esRetencion ? montoRetencion : roundMoney(ajustesIvaFactura.ivaRete1 + ajustesIvaFactura.reteRenta),
      condicion_operacion: resumenDte.condicionOperacion,
      estado: 'PENDIENTE',
      json_dte: dte,
      notas: notasFactura
    };

    await avanzarProcesoEnvio('Guardando factura local antes de enviar a Hacienda...');

    // Guardar en base de datos
    const result = await window.electronAPI.addFactura(factura);
    
    if (result) {
      const facturaGuardadaId = Number(result.lastInsertRowid || result.id);
      showNotification('Factura creada. Firmando documento...', 'success');
      
      limpiarFormularioFactura();
      
      // Actualizar estadísticas
      await loadInitialData();
      updateDashboard();

      // Asegurar que la factura recién generada sea visible aunque haya filtros activos.
      const fechaDesde = document.getElementById('fecha-desde');
      const fechaHasta = document.getElementById('fecha-hasta');
      if (fechaDesde) fechaDesde.value = dte.identificacion.fecEmi;
      if (fechaHasta) fechaHasta.value = dte.identificacion.fecEmi;
      
      // Cambiar a vista de facturas
      switchView('facturas');
      await loadFacturas();

      await avanzarProcesoEnvio('Firmando JSON DTE con el certificado configurado...');
      const firmada = await firmarFactura(facturaGuardadaId, { cerrarModal: false, progreso: false });
      if (firmada) {
        await loadFacturas();
        await enviarFacturaHacienda(facturaGuardadaId, { confirmar: false, progreso: true });
        await loadFacturas();
      } else {
        await finalizarProcesoEnvio('No se pudo firmar el documento.', 'error');
      }

      const facturaActualizada = state.facturas.find(f => Number(f.id) === Number(facturaGuardadaId));
      if (facturaActualizada) {
        abrirModalVerFactura(facturaActualizada);
      }
    }
  } catch (error) {
    console.error('Error generando factura:', error);
    await finalizarProcesoEnvio('El proceso se detuvo por un error inesperado.', 'error');
    showNotification('Error al generar factura: ' + error.message, 'error');
  }
}

// Limpiar formulario de factura
function limpiarFormularioFactura() {
  document.getElementById('form-factura').reset();
  state.currentFactura = { items: [], documentosRelacionados: [], cliente: null };
  document.getElementById('items-body').innerHTML = '<tr><td colspan="6" class="text-center">No hay items agregados</td></tr>';
  actualizarTablaDocumentosRelacionadosNC();
  actualizarCamposNotaCredito();
  actualizarResumenFactura();
}

function actualizarCamposNotaCredito() {
  const tipoDte = document.getElementById('tipo-dte')?.value;
  const section = document.getElementById('nota-credito-section');
  const submitButton = document.querySelector('#form-factura button[type="submit"]');
  const notasGroup = document.getElementById('factura-notas-group');
  const requerido = ['05', '06', '07'].includes(tipoDte);
  const usaMultiplesRelacionadosCCF = ['05', '06'].includes(tipoDte);
  const esRetencion = tipoDte === '07';
  const ayuda = document.getElementById('documento-relacionado-ayuda');
  const retencionCodigoGroup = document.getElementById('retencion-codigo-group');
  const retencionMontoGroup = document.getElementById('retencion-monto-group');
  const retencionPorcentajeGroup = document.getElementById('retencion-porcentaje-group');
  const retencionValorGroup = document.getElementById('retencion-valor-group');
  const tipoDocumentoSelect = document.getElementById('nc-tipo-documento');
  const agregarRelacionadoGroup = document.getElementById('nc-agregar-relacionado-group');
  const relacionadosLista = document.getElementById('nc-documentos-relacionados-lista');
  const exportacionSection = document.getElementById('exportacion-section');
  const itemsSection = document.getElementById('items-section');

  if (section) {
    section.style.display = requerido ? 'block' : 'none';
  }

  if (exportacionSection) {
    exportacionSection.style.display = tipoDte === '11' ? 'block' : 'none';
  }

  if (ayuda) {
    ayuda.textContent = obtenerAyudaDocumentoRelacionado(tipoDte);
  }

  if (retencionCodigoGroup) retencionCodigoGroup.style.display = esRetencion ? 'block' : 'none';
  if (retencionMontoGroup) retencionMontoGroup.style.display = esRetencion ? 'block' : 'none';
  if (retencionPorcentajeGroup) retencionPorcentajeGroup.style.display = esRetencion ? 'block' : 'none';
  if (retencionValorGroup) retencionValorGroup.style.display = esRetencion ? 'block' : 'none';
  if (agregarRelacionadoGroup) agregarRelacionadoGroup.style.display = usaMultiplesRelacionadosCCF ? 'block' : 'none';
  if (relacionadosLista) relacionadosLista.style.display = usaMultiplesRelacionadosCCF ? 'block' : 'none';
  if (itemsSection) itemsSection.style.display = esRetencion ? 'none' : 'block';

  if (tipoDocumentoSelect) {
    const permitidos = obtenerTiposDocumentoRelacionadoPermitidos(tipoDte);
    Array.from(tipoDocumentoSelect.options).forEach(option => {
      option.hidden = permitidos.length > 0 && !permitidos.includes(option.value);
      option.disabled = option.hidden;
    });
    if (permitidos.length > 0 && !permitidos.includes(tipoDocumentoSelect.value)) {
      tipoDocumentoSelect.value = permitidos[0];
    }
  }

  ['nc-tipo-documento', 'nc-tipo-generacion', 'nc-numero-documento', 'nc-fecha-emision'].forEach((id) => {
    const input = document.getElementById(id);
    if (input) input.required = requerido && !usaMultiplesRelacionadosCCF;
  });

  if (usaMultiplesRelacionadosCCF && tipoDocumentoSelect) {
    tipoDocumentoSelect.value = '03';
  }

  ['retencion-codigo', 'retencion-monto-sujeto', 'retencion-porcentaje'].forEach((id) => {
    const input = document.getElementById(id);
    if (input) input.required = esRetencion;
  });

  if (submitButton) {
    submitButton.textContent = obtenerTextoBotonGenerar(tipoDte);
  }

  if (notasGroup) {
    const mostrarNotas = ['01', '03'].includes(tipoDte);
    notasGroup.style.display = mostrarNotas ? '' : 'none';
    if (!mostrarNotas) {
      const notasInput = document.getElementById('factura-notas');
      if (notasInput) notasInput.value = '';
    }
  }

  actualizarPlaceholderDocumentoRelacionado();
  actualizarTablaDocumentosRelacionadosNC();
  actualizarSelectorDocumentoRelacionadoItem();
  actualizarCamposExportacionFactura();
  actualizarResumenFactura();
}

function sugerirTipoDteClienteSeleccionado() {
  const clienteId = Number(document.getElementById('cliente-select')?.value || 0);
  const cliente = state.clientes.find(c => c.id === clienteId);
  const tipoDteSelect = document.getElementById('tipo-dte');
  if (!cliente || !tipoDteSelect) return;

  const tipoSugerido = cliente.tipo_dte_default || '01';
  if (tipoDteSelect.querySelector(`option[value="${tipoSugerido}"]`)) {
    tipoDteSelect.value = tipoSugerido;
    actualizarCamposNotaCredito();
  }
}

function obtenerClienteSeleccionado() {
  const clienteId = Number(document.getElementById('cliente-select')?.value || 0);
  return state.clientes.find(c => c.id === clienteId) || null;
}

function obtenerPagoDesdeCliente(cliente, montoPago) {
  const plazo = String(cliente?.plazo_pago || '01').trim();
  const periodo = Number(cliente?.periodo_pago || 1);

  return {
    codigo: '01',
    montoPago: roundMoney(montoPago),
    referencia: null,
    plazo: ['01', '02', '03'].includes(plazo) ? plazo : '01',
    periodo: Number.isFinite(periodo) && periodo > 0 ? Math.trunc(periodo) : 1
  };
}

function clienteEsExento(cliente) {
  return String(cliente?.condicion_iva || 'GRAVADO').toUpperCase() === 'EXENTO';
}

function itemEsExentoPorCliente(item, cliente, tipoDte = null) {
  if (['11', '14'].includes(String(tipoDte || ''))) return true;
  if (cliente) return clienteEsExento(cliente);
  return Boolean(item?.exento);
}

function aplicarCondicionIvaClienteAItems() {
  const cliente = obtenerClienteSeleccionado();
  if (!cliente || !state.currentFactura.items.length) {
    actualizarResumenFactura();
    return;
  }

  const tipoDte = document.getElementById('tipo-dte')?.value;
  const exento = itemEsExentoPorCliente(null, cliente, tipoDte);
  state.currentFactura.items = state.currentFactura.items.map(item => ({
    ...item,
    exento,
    condicionIvaCliente: cliente.condicion_iva || 'GRAVADO'
  }));

  actualizarTablaItems();
  actualizarResumenFactura();
}

function obtenerNombreTipoDte(tipoDte) {
  const tipo = TIPOS_DTE_DISPONIBLES.find(item => item.codigo === String(tipoDte || '').padStart(2, '0'));
  return tipo?.nombreCorto || tipoDte;
}

function actualizarCamposExportacionFactura() {
  const tipoDte = document.getElementById('tipo-dte')?.value;
  const tipoItemExpor = Number(document.getElementById('exportacion-tipo-item')?.value || 2);
  const requiereIncoterm = tipoDte === '11' && tipoItemExpor !== 2;
  const requiereAduana = tipoDte === '11' && tipoItemExpor !== 2;

  document.querySelectorAll('.exportacion-incoterm-field').forEach((field) => {
    field.style.display = requiereIncoterm ? 'block' : 'none';
  });

  document.querySelectorAll('.exportacion-aduana-field').forEach((field) => {
    field.style.display = requiereAduana ? 'block' : 'none';
  });

  ['exportacion-incoterm', 'exportacion-flete', 'exportacion-seguro'].forEach((id) => {
    const input = document.getElementById(id);
    if (input) input.required = requiereIncoterm;
  });

  ['exportacion-recinto-fiscal', 'exportacion-regimen'].forEach((id) => {
    const input = document.getElementById(id);
    if (input) input.required = requiereAduana;
  });
}

function obtenerOpcionesExportacionFactura() {
  const tipoItemExpor = Number(document.getElementById('exportacion-tipo-item')?.value || 2);
  const incotermSelect = document.getElementById('exportacion-incoterm');
  const selectedIncoterm = incotermSelect?.selectedOptions?.[0];

  const opciones = {
    tipoItemExpor,
    codIncoterms: tipoItemExpor === 2 ? null : incotermSelect?.value,
    descIncoterms: tipoItemExpor === 2 ? null : selectedIncoterm?.dataset?.desc,
    flete: tipoItemExpor === 2 ? 0 : roundMoney(document.getElementById('exportacion-flete')?.value || 0),
    seguro: tipoItemExpor === 2 ? 0 : roundMoney(document.getElementById('exportacion-seguro')?.value || 0),
    recintoFiscal: tipoItemExpor === 2 ? null : normalizarRecintoFiscal(document.getElementById('exportacion-recinto-fiscal')?.value),
    regimen: tipoItemExpor === 2 ? null : String(document.getElementById('exportacion-regimen')?.value || '').trim().toUpperCase()
  };

  if (tipoItemExpor !== 2 && (!opciones.recintoFiscal || !opciones.regimen)) {
    throw new Error('Complete recinto fiscal y régimen para la factura de exportación.');
  }

  return opciones;
}

function normalizarRecintoFiscal(valor) {
  const limpio = String(valor || '').replace(/[^0-9]/g, '');
  return limpio ? limpio.padStart(2, '0') : '';
}

function obtenerTextoBotonGenerar(tipoDte) {
  const textos = {
    '05': 'Generar Nota de Crédito',
    '06': 'Generar Nota de Débito',
    '07': 'Generar Comprobante de Retención',
    '11': 'Generar Factura de Exportación',
    '14': 'Generar Factura Sujeto Excluido'
  };
  return textos[tipoDte] || 'Generar Factura';
}

function obtenerAyudaDocumentoRelacionado(tipoDte) {
  const ayudas = {
    '05': 'Para Nota de Crédito tipo 05, agregue uno o varios CCF relacionados. Cada ítem puede aplicar el monto total o parcial al CCF seleccionado.',
    '06': 'Para Nota de Débito tipo 06, agregue uno o varios CCF relacionados. Cada ítem puede aplicar el monto total o parcial al CCF seleccionado.',
    '07': 'Para Comprobante de Retención tipo 07, relacione la Factura, CCF o Sujeto Excluido sujeto a retención.'
  };
  return ayudas[tipoDte] || 'Hacienda requiere relacionar el documento tributario afectado.';
}

function obtenerTiposDocumentoRelacionadoPermitidos(tipoDte) {
  if (tipoDte === '05' || tipoDte === '06') return ['03'];
  if (tipoDte === '07') return ['01', '03', '14'];
  return [];
}

function actualizarPlaceholderDocumentoRelacionado() {
  const tipoGeneracion = document.getElementById('nc-tipo-generacion')?.value;
  const numeroInput = document.getElementById('nc-numero-documento');
  if (!numeroInput) return;

  numeroInput.placeholder = tipoGeneracion === '2'
    ? 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'
    : 'Número del documento físico relacionado';
}

function obtenerDocumentoRelacionadoNotaCredito() {
  const tipoDte = document.getElementById('tipo-dte')?.value;
  if (['05', '06'].includes(tipoDte)) {
    let relacionados = obtenerDocumentosRelacionadosNotaCredito({ silencioso: true });

    if (!relacionados) {
      const relacionadoFormulario = obtenerDocumentoRelacionadoDesdeFormulario();
      if (!relacionadoFormulario) return null;
      relacionados = [relacionadoFormulario];
    }

    const errorItems = validarItemsNotaCreditoContraRelacionados(relacionados);
    if (errorItems) {
      showNotification(errorItems, 'error');
      return null;
    }

    return relacionados;
  }

  return obtenerDocumentoRelacionadoDesdeFormulario();
}

function obtenerDocumentoRelacionadoDesdeFormulario() {
  const tipoDte = document.getElementById('tipo-dte')?.value;
  const tipoDocumento = document.getElementById('nc-tipo-documento')?.value;
  const tipoGeneracion = Number(document.getElementById('nc-tipo-generacion')?.value);
  const numeroDocumento = String(document.getElementById('nc-numero-documento')?.value || '').trim().toUpperCase();
  const fechaEmision = document.getElementById('nc-fecha-emision')?.value;
  const permitidos = obtenerTiposDocumentoRelacionadoPermitidos(tipoDte);

  if (permitidos.length > 0 && !permitidos.includes(tipoDocumento)) {
    showNotification(`El documento relacionado permitido para tipo ${tipoDte} debe ser: ${permitidos.join(', ')}.`, 'error');
    return null;
  }

  if (![1, 2].includes(tipoGeneracion)) {
    showNotification('Seleccione un tipo de generación válido para el documento relacionado.', 'error');
    return null;
  }

  if (!numeroDocumento || !fechaEmision) {
    showNotification('Complete el número y fecha del documento relacionado.', 'error');
    return null;
  }

  if (tipoGeneracion === 2 && !/^[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}$/.test(numeroDocumento)) {
    showNotification('Para documento relacionado DTE, ingrese el código de generación UUID de 36 caracteres.', 'error');
    return null;
  }

  return {
    tipoDocumento,
    tipoGeneracion,
    numeroDocumento,
    fechaEmision
  };
}

function agregarDocumentoRelacionadoNotaCredito() {
  const tipoDte = document.getElementById('tipo-dte')?.value;
  const relacionado = obtenerDocumentoRelacionadoDesdeFormulario();
  if (!relacionado) return;

  if (relacionado.tipoDocumento !== '03') {
    showNotification(`${obtenerNombreTipoDte(tipoDte)} debe relacionar Comprobantes de Crédito Fiscal tipo 03.`, 'error');
    return;
  }

  const existentes = state.currentFactura.documentosRelacionados || [];
  if (existentes.some(doc => doc.numeroDocumento === relacionado.numeroDocumento)) {
    showNotification(`Ese CCF ya fue agregado a la ${obtenerNombreTipoDte(tipoDte)}.`, 'warning');
    return;
  }

  if (existentes.length >= 50) {
    showNotification(`${obtenerNombreTipoDte(tipoDte)} admite hasta 50 documentos relacionados.`, 'error');
    return;
  }

  state.currentFactura.documentosRelacionados = [...existentes, relacionado];
  document.getElementById('nc-numero-documento').value = '';
  document.getElementById('nc-fecha-emision').value = '';
  actualizarTablaDocumentosRelacionadosNC();
  actualizarSelectorDocumentoRelacionadoItem();
  actualizarTablaItems();
  showNotification('CCF relacionado agregado', 'success');
}

function obtenerDocumentosRelacionadosNotaCredito(opciones = {}) {
  const tipoDte = document.getElementById('tipo-dte')?.value;
  const relacionados = state.currentFactura.documentosRelacionados || [];
  if (relacionados.length === 0) {
    if (!opciones.silencioso) {
      showNotification(`Agregue al menos un CCF relacionado para la ${obtenerNombreTipoDte(tipoDte)}.`, 'error');
    }
    return null;
  }

  return relacionados;
}

function validarItemsNotaCreditoContraRelacionados(relacionados) {
  const tipoDte = document.getElementById('tipo-dte')?.value;
  if (!state.currentFactura.items.length) {
    return `Agregue al menos un ítem para la ${obtenerNombreTipoDte(tipoDte)}.`;
  }

  const numerosPermitidos = new Set(relacionados.map(doc => doc.numeroDocumento));
  const itemSinDocumento = relacionados.length > 1
    ? state.currentFactura.items.find(item => !item.numeroDocumentoRelacionado || !numerosPermitidos.has(item.numeroDocumentoRelacionado))
    : null;

  if (itemSinDocumento) {
    return `Cada ítem de la ${obtenerNombreTipoDte(tipoDte)} debe seleccionar el CCF relacionado al que aplica.`;
  }

  return null;
}

function actualizarTablaDocumentosRelacionadosNC() {
  const tbody = document.getElementById('nc-documentos-relacionados-body');
  if (!tbody) return;

  const relacionados = state.currentFactura.documentosRelacionados || [];
  if (relacionados.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="text-center">No hay CCF relacionados</td></tr>';
    return;
  }

  tbody.innerHTML = relacionados.map((doc) => `
    <tr>
      <td><strong>${doc.tipoDocumento}</strong><br><small>${doc.numeroDocumento}</small></td>
      <td>${doc.fechaEmision}</td>
      <td><button type="button" class="btn btn-small btn-danger" onclick="eliminarDocumentoRelacionadoNC('${doc.numeroDocumento}')">×</button></td>
    </tr>
  `).join('');
}

function actualizarSelectorDocumentoRelacionadoItem() {
  const select = document.getElementById('item-documento-relacionado');
  if (!select) return;

  const relacionados = state.currentFactura.documentosRelacionados || [];
  select.innerHTML = '<option value="">Seleccionar CCF...</option>' + relacionados.map(doc => (
    `<option value="${doc.numeroDocumento}">${doc.numeroDocumento}</option>`
  )).join('');
}

function obtenerNumeroDocumentoRelacionadoItem(item, documentoRelacionado) {
  if (Array.isArray(documentoRelacionado)) {
    return item.numeroDocumentoRelacionado || documentoRelacionado[0]?.numeroDocumento || null;
  }

  return documentoRelacionado?.numeroDocumento || null;
}

window.eliminarDocumentoRelacionadoNC = function(numeroDocumento) {
  state.currentFactura.documentosRelacionados = (state.currentFactura.documentosRelacionados || [])
    .filter(doc => doc.numeroDocumento !== numeroDocumento);
  state.currentFactura.items = state.currentFactura.items.map(item => (
    item.numeroDocumentoRelacionado === numeroDocumento
      ? { ...item, numeroDocumentoRelacionado: null }
      : item
  ));
  actualizarTablaDocumentosRelacionadosNC();
  actualizarSelectorDocumentoRelacionadoItem();
  actualizarTablaItems();
  showNotification('CCF relacionado eliminado', 'info');
};

// Actualizar resumen de factura
function actualizarResumenFactura() {
  const resumen = calcularResumenFactura();
  const tipoDte = document.getElementById('tipo-dte')?.value;
  const esRetencion = tipoDte === '07';
  const esFacturaConsumidorFinal = tipoDte === '01';
  const esCCF = tipoDte === '03';
  const esSujetoExcluido = tipoDte === '14';
  const clienteSeleccionado = obtenerClienteSeleccionadoFactura();
  const datosRetencion = esRetencion ? obtenerDatosRetencion() : null;
  const mostrarSinIva = ['07', '11', '14'].includes(tipoDte);
  const montoOperacionVisual = esRetencion ? datosRetencion.ivaRetenido : (mostrarSinIva ? resumen.subtotalTotal : resumen.total);
  const ajustesIvaFactura = obtenerAjustesIvaFactura(tipoDte, clienteSeleccionado);
  const totalVisual = esRetencion
    ? datosRetencion.ivaRetenido
    : roundMoney(Math.max(0, montoOperacionVisual + ajustesIvaFactura.ivaPerci1 - ajustesIvaFactura.ivaRete1 - ajustesIvaFactura.reteRenta));
  const ivaVisual = mostrarSinIva ? 0 : resumen.totalIva;
  const subtotalGravadoVisual = esRetencion ? datosRetencion.montoSujeto : resumen.subtotalGravado;
  const subtotalExentoVisual = esRetencion ? 0 : resumen.subtotalExento;
  const subtotalTotalVisual = esRetencion ? datosRetencion.montoSujeto : resumen.subtotalTotal;
  const mostrarRetencionIvaFactura = (esFacturaConsumidorFinal || esCCF) && !esClienteGenericoFactura(clienteSeleccionado);
  const mostrarPercepcionIvaFactura = esCCF;
  const mostrarRetencionRentaFactura = esSujetoExcluido;
  const retencionRentaInput = document.getElementById('retencion-renta-factura');
  if (retencionRentaInput && esSujetoExcluido) {
    const porcentajeRenta = obtenerPorcentajeRentaSujetoExcluido(clienteSeleccionado);
    retencionRentaInput.value = String(roundMoney(subtotalTotalVisual * (porcentajeRenta / 100)));
    retencionRentaInput.readOnly = true;
    retencionRentaInput.title = `Calculado automáticamente al ${porcentajeRenta}%`;
  } else if (retencionRentaInput) {
    retencionRentaInput.readOnly = false;
    retencionRentaInput.title = '';
  }
  const maximoIvaRete1 = obtenerMaximoIvaRete1DTE(tipoDte, {
    totalGravada: esFacturaConsumidorFinal
      ? roundMoney(resumen.subtotalGravado + resumen.totalIva)
      : resumen.subtotalGravado,
    subTotal: montoOperacionVisual,
    totalCompra: montoOperacionVisual,
    montoTotalOperacion: montoOperacionVisual,
    total: montoOperacionVisual
  });
  const retencionIvaInput = document.getElementById('retencion-iva-factura');
  if (retencionIvaInput) {
    retencionIvaInput.max = String(maximoIvaRete1);
    retencionIvaInput.title = maximoIvaRete1 > 0
      ? `Máximo permitido: ${formatCurrency(maximoIvaRete1)}`
      : '';
  }
  
  document.getElementById('resumen-subtotal-gravado').textContent = formatCurrency(subtotalGravadoVisual);
  document.getElementById('resumen-subtotal-exento').textContent = formatCurrency(subtotalExentoVisual);
  document.getElementById('resumen-subtotal').textContent = formatCurrency(subtotalTotalVisual);
  document.getElementById('resumen-descuento-general').textContent = formatCurrency(esRetencion ? 0 : resumen.descuentoGeneral);
  document.getElementById('resumen-iva').textContent = formatCurrency(esRetencion ? datosRetencion.ivaRetenido : ivaVisual);
  document.getElementById('resumen-monto-operacion').textContent = formatCurrency(montoOperacionVisual);
  document.getElementById('resumen-total').textContent = formatCurrency(totalVisual);
  document.getElementById('resumen-letras').textContent = numeroALetras(totalVisual);

  actualizarVisibilidadAjustesIvaFactura(mostrarRetencionIvaFactura, mostrarPercepcionIvaFactura, mostrarRetencionRentaFactura);
  actualizarEtiquetasResumenRetencion(esRetencion);
  actualizarValorRetencionCalculado(datosRetencion);
}

function obtenerDescuentoGeneralFormulario(base = 0) {
  const tipo = document.getElementById('descuento-general-tipo')?.value || 'monto';
  const valor = Number(document.getElementById('descuento-general')?.value || 0);
  const baseRedondeada = roundMoney(base);

  if (!Number.isFinite(valor) || valor <= 0 || baseRedondeada <= 0) {
    return {
      tipo,
      valor: 0,
      monto: 0
    };
  }

  const monto = tipo === 'porcentaje'
    ? roundMoney(baseRedondeada * (Math.min(valor, 100) / 100))
    : roundMoney(Math.min(valor, baseRedondeada));

  return {
    tipo,
    valor: roundMoney(valor),
    monto
  };
}

function distribuirDescuentoGeneral(descuento, subtotalGravado, subtotalExento) {
  const totalBase = roundMoney(subtotalGravado + subtotalExento);
  const monto = roundMoney(Math.min(descuento || 0, totalBase));
  if (monto <= 0 || totalBase <= 0) {
    return { gravado: 0, exento: 0, noSujeto: 0 };
  }

  const gravado = subtotalGravado > 0
    ? roundMoney(monto * (subtotalGravado / totalBase))
    : 0;
  const exento = roundMoney(monto - gravado);

  return { gravado, exento, noSujeto: 0 };
}

// Calcular resumen de factura
function calcularResumenFactura(items = state.currentFactura.items) {
  let subtotalGravado = 0;
  let subtotalExento = 0;
  let totalIva = 0;
  let totalDescuento = 0;

  items.forEach(item => {
    const subtotal = roundMoney((item.cantidad * item.precioUnitario) - item.descuento);
    
    if (item.exento) {
      subtotalExento += subtotal;
    } else {
      subtotalGravado += subtotal;
      totalIva += roundMoney(subtotal * 0.13);
    }
    
    totalDescuento += item.descuento;
  });

  totalDescuento = roundMoney(totalDescuento);

  const subtotalAntesDescuentoGeneral = roundMoney(subtotalGravado + subtotalExento);
  const descuentoGeneralData = obtenerDescuentoGeneralFormulario(subtotalAntesDescuentoGeneral);
  const descuentoGeneralDistribuido = distribuirDescuentoGeneral(descuentoGeneralData.monto, subtotalGravado, subtotalExento);

  subtotalGravado = roundMoney(Math.max(0, subtotalGravado - descuentoGeneralDistribuido.gravado));
  subtotalExento = roundMoney(Math.max(0, subtotalExento - descuentoGeneralDistribuido.exento));
  totalIva = roundMoney(subtotalGravado * 0.13);

  const subtotalTotal = roundMoney(subtotalGravado + subtotalExento);
  const total = roundMoney(subtotalTotal + totalIva);

  return {
    subtotalGravado,
    subtotalExento,
    subtotalTotal,
    totalIva,
    total,
    totalDescuento,
    descuentoGeneral: descuentoGeneralData.monto,
    descuentoGeneralTipo: descuentoGeneralData.tipo,
    descuentoGeneralValor: descuentoGeneralData.valor,
    descuentoGeneralDistribuido,
    totalDescuentoCompleto: roundMoney(totalDescuento + descuentoGeneralData.monto)
  };
}

function roundMoney(value) {
  return Number(Number(value || 0).toFixed(2));
}

function obtenerClienteSeleccionadoFactura() {
  const clienteId = document.getElementById('cliente-select')?.value;
  return state.clientes.find(c => Number(c.id) === Number(clienteId)) || null;
}

function clienteSujetoExcluidoNoDomiciliado(cliente = {}) {
  const tipoDocumento = String(cliente?.tipo_documento || '');
  return ['37', '03', '02'].includes(tipoDocumento) && Number(cliente?.sujeto_excluido_domiciliado) === 0;
}

function obtenerPorcentajeRentaSujetoExcluido(cliente = {}) {
  return clienteSujetoExcluidoNoDomiciliado(cliente) ? 20 : 10;
}

function calcularIvaRete1DesdeResumenDTE(resumen = {}) {
  const baseGravadaConIva = roundMoney(Number(resumen.totalGravada || 0));
  return baseGravadaConIva > 0 ? roundMoney(baseGravadaConIva * 0.01) : 0;
}

function obtenerMaximoIvaRete1DTE(tipoDte, resumen = {}) {
  const tipo = String(tipoDte || '').padStart(2, '0');
  if (!['01', '03', '14'].includes(tipo)) return 0;

  if (tipo === '14') {
    return 0;
  }

  return calcularIvaRete1DesdeResumenDTE(resumen);
}

function validarMaximoIvaRete1DTE(tipoDte, resumen = {}, ivaRete1 = 0) {
  const valor = roundMoney(Number(ivaRete1 || 0));
  const maximo = obtenerMaximoIvaRete1DTE(tipoDte, resumen);
  if (valor <= maximo + 0.000001) return null;

  const tipo = String(tipoDte || '').padStart(2, '0');
  const regla = tipo === '14'
    ? 'Sujeto Excluido no aplica IVA retenido; use Retención Renta'
    : '1% de la venta gravada';
  return `La retención IVA no puede exceder ${formatCurrency(maximo)} (${regla}). Valor ingresado: ${formatCurrency(valor)}.`;
}

function limitarIvaRete1DTE(tipoDte, resumen = {}, ivaRete1 = 0) {
  const valor = roundMoney(Number(ivaRete1 || 0));
  const maximo = obtenerMaximoIvaRete1DTE(tipoDte, resumen);
  return roundMoney(Math.min(valor, maximo));
}

function obtenerMontoManualInput(id) {
  const input = document.getElementById(id);
  const valor = roundMoney(Number(input?.value || 0));
  return Number.isFinite(valor) && valor > 0 ? valor : 0;
}

function obtenerAjustesIvaFactura(tipoDte, cliente = null) {
  const tipo = String(tipoDte || '').padStart(2, '0');
  const puedeRetener = ['01', '03'].includes(tipo) && !esClienteGenericoFactura(cliente);
  const puedePercibir = tipo === '03';
  const puedeRetenerRenta = tipo === '14';
  const resumen = calcularResumenFactura();
  const rentaSujetoExcluido = puedeRetenerRenta
    ? roundMoney(resumen.subtotalTotal * (obtenerPorcentajeRentaSujetoExcluido(cliente) / 100))
    : 0;

  return {
    ivaRete1: puedeRetener ? obtenerMontoManualInput('retencion-iva-factura') : 0,
    ivaPerci1: puedePercibir ? obtenerMontoManualInput('percepcion-iva-factura') : 0,
    reteRenta: rentaSujetoExcluido
  };
}

function actualizarVisibilidadAjustesIvaFactura(mostrarRetencion, mostrarPercepcion, mostrarRetencionRenta = false) {
  const retencionRow = document.getElementById('resumen-retencion-iva-row');
  const percepcionRow = document.getElementById('resumen-percepcion-iva-row');
  const retencionRentaRow = document.getElementById('resumen-retencion-renta-row');
  const montoOperacionRow = document.getElementById('resumen-monto-operacion-row');
  const inputRetencion = document.getElementById('retencion-iva-factura');
  const inputPercepcion = document.getElementById('percepcion-iva-factura');
  const inputRetencionRenta = document.getElementById('retencion-renta-factura');
  const mostrarMontoOperacion = Boolean(mostrarRetencion || mostrarPercepcion || mostrarRetencionRenta);

  if (retencionRow) retencionRow.style.display = mostrarRetencion ? '' : 'none';
  if (percepcionRow) percepcionRow.style.display = mostrarPercepcion ? '' : 'none';
  if (retencionRentaRow) retencionRentaRow.style.display = mostrarRetencionRenta ? '' : 'none';
  if (montoOperacionRow) montoOperacionRow.style.display = mostrarMontoOperacion ? '' : 'none';
  if (!mostrarRetencion && inputRetencion) {
    inputRetencion.value = '0';
  }
  if (!mostrarPercepcion && inputPercepcion) {
    inputPercepcion.value = '0';
  }
  if (!mostrarRetencionRenta && inputRetencionRenta) {
    inputRetencionRenta.value = '0';
  }
}

function obtenerDatosRetencion() {
  const montoSujeto = roundMoney(Number(document.getElementById('retencion-monto-sujeto')?.value || 0));
  const porcentajeValue = document.getElementById('retencion-porcentaje')?.value;
  const porcentaje = roundMoney(porcentajeValue === '' ? 0 : Number(porcentajeValue ?? 1));
  const ivaRetenido = roundMoney(montoSujeto * (porcentaje / 100));

  return { montoSujeto, porcentaje, ivaRetenido };
}

function actualizarValorRetencionCalculado(datosRetencion = null) {
  const input = document.getElementById('retencion-valor-calculado');
  if (!input) return;

  const datos = datosRetencion || obtenerDatosRetencion();
  input.value = formatCurrency(datos.ivaRetenido);
}

function actualizarEtiquetasResumenRetencion(esRetencion) {
  const labels = {
    'resumen-subtotal-gravado-label': esRetencion ? 'Monto Sujeto:' : 'Subtotal Gravado:',
    'resumen-subtotal-exento-label': esRetencion ? 'Exento:' : 'Subtotal Exento:',
    'resumen-subtotal-label': esRetencion ? 'Base de Cálculo:' : 'Subtotal Total:',
    'resumen-iva-label': esRetencion ? 'IVA Retenido:' : 'IVA (13%):',
    'resumen-total-label': esRetencion ? 'Total Retenido:' : 'Total a Pagar:'
  };

  Object.entries(labels).forEach(([id, text]) => {
    const label = document.getElementById(id);
    if (label) label.textContent = text;
  });
}

// Generar número de control
function generarNumeroControl() {
  const config = state.configuracion || {};
  const tipoDoc = document.getElementById('tipo-dte').value;
  const establecimiento = config.codigo_establecimiento || '0001';
  const puntoVenta = config.punto_venta || '001';
  const numero = String(state.facturas.length + 1).padStart(15, '0');
  
  return `DTE-${tipoDoc}-${establecimiento}-${puntoVenta}-${numero}`;
}

// Generar código de generación (UUID)
function generarCodigoGeneracion() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16).toUpperCase();
  });
}

// Convertir número a letras (implementación del helper)
function numeroALetras(numero) {
  const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
  const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

  function convertirGrupo(n) {
    let texto = '';
    const c = Math.floor(n / 100);
    const d = Math.floor((n % 100) / 10);
    const u = n % 10;

    if (c > 0) {
      texto += (c === 1 && d === 0 && u === 0) ? 'CIEN' : centenas[c];
    }

    if (d === 1 && u > 0) {
      if (texto) texto += ' ';
      texto += especiales[u];
    } else {
      if (d > 0) {
        if (texto) texto += ' ';
        texto += decenas[d];
      }
      if (u > 0) {
        if (texto) texto += ' Y ';
        texto += unidades[u];
      }
    }

    return texto;
  }

  const entero = Math.floor(numero);
  const decimales = Math.round((numero - entero) * 100);

  let resultado = '';

  if (entero === 0) {
    resultado = 'CERO';
  } else if (entero < 1000) {
    resultado = convertirGrupo(entero);
  } else if (entero < 1000000) {
    const miles = Math.floor(entero / 1000);
    const resto = entero % 1000;
    resultado = (miles === 1 ? 'MIL' : convertirGrupo(miles) + ' MIL');
    if (resto > 0) resultado += ' ' + convertirGrupo(resto);
  }

  return `${resultado} DÓLARES CON ${decimales}/100`;
}

// Utilidades
function formatCurrency(value) {
  return new Intl.NumberFormat('es-SV', {
    style: 'currency',
    currency: 'USD'
  }).format(value || 0);
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const soloFecha = String(dateString).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (soloFecha) {
    const [, year, month, day] = soloFecha;
    return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('es-SV');
  }

  const date = new Date(dateString);
  return date.toLocaleDateString('es-SV');
}

function formatearFechaLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatearHoraLocal(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function limpiarFirmasDTE(dte) {
  if (!dte) return dte;

  delete dte.firmaMh;
  delete dte.documentoFirmado;
  delete dte.documento;
  delete dte.firma;
  delete dte.firmaElectronica;
  delete dte.selloRecibido;
  delete dte.respuestaHacienda;

  return dte;
}

function refrescarFechaEmisionDTE(dte) {
  if (!dte?.identificacion) return dte;

  const ahora = new Date();
  dte.identificacion.fecEmi = formatearFechaLocal(ahora);
  dte.identificacion.horEmi = formatearHoraLocal(ahora);
  limpiarFirmasDTE(dte);

  return dte;
}

function obtenerFechaHoraEmisionOriginal(factura, dteOriginal = null) {
  const dte = dteOriginal || obtenerDTEContenido(parseDTEGuardado(factura?.json_dte));
  const fecha = dte?.identificacion?.fecEmi || String(factura?.fecha_emision || '').slice(0, 10);
  const hora = dte?.identificacion?.horEmi || (
    String(factura?.fecha_emision || '').includes('T')
      ? String(factura.fecha_emision).slice(11, 19)
      : null
  );

  return {
    fecha: fecha || null,
    hora: hora || null
  };
}

function preservarFechaEmisionDTE(dte, factura, dteOriginal = null) {
  if (!dte?.identificacion) return dte;

  const original = obtenerFechaHoraEmisionOriginal(factura, dteOriginal);
  if (original.fecha) dte.identificacion.fecEmi = original.fecha;
  if (original.hora) dte.identificacion.horEmi = original.hora;
  limpiarFirmasDTE(dte);

  return dte;
}

function limpiarDocumentoFiscal(valor) {
  return String(valor || '').replace(/[^0-9]/g, '');
}

function valorTextoNoVacio(valor) {
  const texto = String(valor || '').trim();
  return texto || null;
}

function limpiarDocumentoAlfanumerico(valor) {
  return String(valor || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function normalizarTextoComparacion(valor) {
  return String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase();
}

function normalizarNumeroDocumentoCliente(tipoDocumento, valor) {
  const tipo = String(tipoDocumento || '');
  const limpio = limpiarDocumentoFiscal(valor);

  if (tipo === '13') {
    return limpio.length === 9 ? `${limpio.slice(0, 8)}-${limpio.slice(8)}` : limpio;
  }

  if (tipo === '36') {
    return limpio;
  }

  return limpiarDocumentoAlfanumerico(valor);
}

function esDocumentoFiscalSinValor(numero) {
  return Boolean(numero) && /^(\d)\1+$/.test(String(numero));
}

function validarNumeroDocumentoCliente(tipoDocumento, valor, contexto = 'receptor') {
  const tipo = String(tipoDocumento || '');
  const numeroFiscal = limpiarDocumentoFiscal(valor);
  const numeroAlfanumerico = limpiarDocumentoAlfanumerico(valor);

  if (!['13', '36', '37', '03', '02'].includes(tipo)) {
    return 'Seleccione un tipo de documento válido para el receptor.';
  }

  if (tipo === '13') {
    if (numeroFiscal.length !== 9) return `El DUI del ${contexto} debe tener 9 dígitos.`;
    if (esDocumentoFiscalSinValor(numeroFiscal)) return `El DUI del ${contexto} no puede estar compuesto por dígitos repetidos.`;
    return null;
  }

  if (tipo === '36') {
    if (numeroFiscal.length !== 14) return `El NIT del ${contexto} debe tener 14 dígitos.`;
    if (esDocumentoFiscalSinValor(numeroFiscal)) return `El NIT del ${contexto} no puede estar compuesto por dígitos repetidos.`;
    return null;
  }

  if (numeroAlfanumerico.length < 3 || numeroAlfanumerico.length > 20) {
    return `El documento del ${contexto} debe tener entre 3 y 20 caracteres alfanuméricos.`;
  }

  return null;
}

function esClienteGenericoFactura(cliente) {
  const nombre = normalizarTextoComparacion(cliente?.nombre);
  return [
    'CLIENTES VARIOS',
    'CLIENTE VARIOS',
    'CONSUMIDOR FINAL',
    'PUBLICO EN GENERAL'
  ].includes(nombre);
}

function debeOmitirReceptorFactura(cliente, montoTotalOperacion = 0) {
  return esClienteGenericoFactura(cliente) && Number(montoTotalOperacion || 0) < 1095;
}

function facturaRequiereDuiReceptor(montoTotalOperacion = 0) {
  return Number(montoTotalOperacion || 0) >= 1095;
}

function describirDocumentoReceptorDTE(dte) {
  const contenido = obtenerDTEContenido(dte);
  const receptor = contenido?.receptor || contenido?.sujetoExcluido || {};
  const tipoDocumento = receptor.tipoDocumento || (receptor.nit ? '36' : '');
  const numDocumento = Object.prototype.hasOwnProperty.call(receptor, 'numDocumento')
    ? receptor.numDocumento
    : receptor.nit;

  return [
    tipoDocumento ? `tipoDocumento=${tipoDocumento}` : null,
    numDocumento ? `numDocumento=${numDocumento}` : null,
    receptor.nombre ? `nombre=${receptor.nombre}` : null
  ].filter(Boolean).join(', ');
}

function agregarDetalleDocumentoReceptor(mensaje, dte) {
  const detalle = describirDocumentoReceptorDTE(dte);
  return detalle ? `${mensaje}\n\nReceptor en el DTE: ${detalle}` : mensaje;
}

function normalizarDocumentoReceptorDTE(tipoDocumento, valor) {
  const tipo = String(tipoDocumento || '');
  const limpio = limpiarDocumentoFiscal(valor);
  if (tipo === '13' && limpio.length === 9) return `${limpio.slice(0, 8)}-${limpio.slice(8)}`;
  if (tipo === '36') return limpio;
  return limpiarDocumentoAlfanumerico(valor);
}

function normalizarDocumentoSujetoExcluidoDTE(tipoDocumento, valor) {
  const tipo = String(tipoDocumento || '');
  const limpio = limpiarDocumentoFiscal(valor);
  if (['13', '36'].includes(tipo)) return limpio;
  return limpiarDocumentoAlfanumerico(valor);
}

function normalizarDocumentoRetencionDTE(tipoDocumento, valor) {
  const tipo = String(tipoDocumento || '');
  const limpio = limpiarDocumentoFiscal(valor);
  if (tipo === '13' && limpio.length === 9) return `${limpio.slice(0, 8)}-${limpio.slice(8)}`;
  if (tipo === '36') return limpio;
  return limpiarDocumentoAlfanumerico(valor);
}

function normalizarDocumentosReceptorDTE(dte) {
  const contenido = obtenerDTEContenido(dte);
  if (!contenido) return dte;

  if (contenido.receptor?.tipoDocumento && Object.prototype.hasOwnProperty.call(contenido.receptor, 'numDocumento')) {
    const tipoDte = String(contenido.identificacion?.tipoDte || '').padStart(2, '0');
    contenido.receptor.numDocumento = normalizarDocumentoReceptorDTE(
      contenido.receptor.tipoDocumento,
      contenido.receptor.numDocumento
    );
    if (tipoDte === '07') {
      contenido.receptor.numDocumento = normalizarDocumentoRetencionDTE(
        contenido.receptor.tipoDocumento,
        contenido.receptor.numDocumento
      );
    }
  }

  if (contenido.sujetoExcluido?.tipoDocumento && Object.prototype.hasOwnProperty.call(contenido.sujetoExcluido, 'numDocumento')) {
    contenido.sujetoExcluido.numDocumento = normalizarDocumentoSujetoExcluidoDTE(
      contenido.sujetoExcluido.tipoDocumento,
      contenido.sujetoExcluido.numDocumento
    );
  }

  return dte;
}

function validarFormatoDocumentoDTEHacienda(tipoDocumento, valor, contexto = 'receptor del DTE firmado') {
  const tipo = String(tipoDocumento || '');
  const documento = String(valor || '').trim();
  if (tipo === '13' && !/^\d{8}-\d{1}$/.test(documento)) {
    return `El DUI del ${contexto} debe enviarse a Hacienda con formato 00000000-0.`;
  }
  if (tipo === '36' && !/^\d{14}$/.test(documento)) {
    return `El NIT del ${contexto} debe enviarse a Hacienda como 14 dígitos sin guiones.`;
  }
  return null;
}

function validarFormatoDocumentoRetencionDTE(tipoDocumento, valor, contexto = 'receptor del Comprobante de Retención') {
  const tipo = String(tipoDocumento || '');
  const documento = String(valor || '').trim();
  if (tipo === '13' && !/^\d{8}-\d{1}$/.test(documento)) {
    return `El DUI del ${contexto} debe enviarse a Hacienda con formato 00000000-0.`;
  }
  if (tipo === '36' && !/^(\d{14}|\d{9})$/.test(documento)) {
    return `El NIT del ${contexto} debe enviarse a Hacienda como 14 dígitos o DUI homologado de 9 dígitos, sin guiones.`;
  }
  return null;
}

function esDocumentoContribuyenteNaturalValido(tipoDocumento, valor) {
  const tipo = String(tipoDocumento || '');
  const numero = limpiarDocumentoFiscal(valor);
  if (tipo === '13') return numero.length === 9;
  if (tipo === '36') return numero.length === 14 || numero.length === 9;
  return false;
}

function validarReceptorParaHacienda(tipoDte, cliente, config, montoTotalOperacion = 0) {
  const tipo = String(tipoDte || '');
  if (!['01', '03', '05', '06', '07'].includes(tipo)) return null;

  const nitEmisor = limpiarDocumentoFiscal(config?.nit || config?.hacienda_usuario);
  const tipoDocumento = String(cliente?.tipo_documento || '');
  const numeroReceptor = limpiarDocumentoFiscal(cliente?.numero_documento);
  const direccionReceptor = String(cliente?.direccion || '').trim();

  if (direccionReceptor && direccionReceptor.length < 5) {
    return 'La dirección del receptor debe tener al menos 5 caracteres o dejarse vacía cuando el tipo de DTE lo permita.';
  }

  if (tipo === '01') {
    if (debeOmitirReceptorFactura(cliente, montoTotalOperacion)) return null;
    const facturaAlta = facturaRequiereDuiReceptor(montoTotalOperacion);

    if (esClienteGenericoFactura(cliente)) {
      return 'Para Factura de $1,095.00 o más, CLIENTES VARIOS no es válido: seleccione un receptor real con DUI válido de 9 dígitos.';
    }

    if (facturaAlta && (tipoDocumento !== '13' || numeroReceptor.length !== 9)) {
      return 'Para Factura de $1,095.00 o más, el receptor debe estar registrado con DUI válido de 9 dígitos.';
    }

    if (facturaAlta) {
      const telefonoReceptor = limpiarDocumentoFiscal(cliente?.telefono);
      if (!cliente?.departamento || !cliente?.municipio || direccionReceptor.length < 5) {
        return 'Para Factura de $1,095.00 o más con DUI, complete departamento, municipio y dirección real del receptor.';
      }
      if (telefonoReceptor.length !== 8) {
        return 'Para Factura de $1,095.00 o más con DUI, complete un teléfono del receptor de 8 dígitos.';
      }
    }

    if (!tipoDocumento && !numeroReceptor) return null;

    const errorDocumento = validarNumeroDocumentoCliente(tipoDocumento, cliente?.numero_documento, 'receptor');
    if (errorDocumento) return `Para Factura, ${errorDocumento}`;

    if (tipoDocumento === '36' && nitEmisor && numeroReceptor === nitEmisor) {
      return 'El receptor no puede ser el mismo NIT del emisor.';
    }

    return null;
  }

  if (tipo === '07') {
    if (!String(cliente?.numero_documento || '').trim()) {
      return 'Ingrese el número de documento del sujeto de retención.';
    }

    const errorDocumento = validarNumeroDocumentoCliente(tipoDocumento, cliente?.numero_documento, 'sujeto de retención');
    if (errorDocumento) return `Para Comprobante de Retención, ${errorDocumento}`;

    if (tipoDocumento === '36' && nitEmisor && numeroReceptor === nitEmisor) {
      return 'Para Comprobante de Retención el receptor no puede ser el mismo NIT del emisor.';
    }

    return null;
  }

  if (!esDocumentoContribuyenteNaturalValido(tipoDocumento, cliente?.numero_documento)) {
    return 'Para CCF y notas el receptor debe tener NIT de 14 dígitos o DUI homologado de 9 dígitos.';
  }

  if (nitEmisor && numeroReceptor === nitEmisor) {
    return 'Para CCF y notas el receptor no puede ser el mismo NIT del emisor.';
  }

  return null;
}

function validarClienteExportacion(tipoDte, cliente) {
  if (String(tipoDte || '') !== '11') return null;

  const errorDocumento = validarNumeroDocumentoCliente(cliente?.tipo_documento || '37', cliente?.numero_documento, 'receptor de exportación');
  if (errorDocumento) return errorDocumento;

  if (Number(cliente?.aplica_exportacion) !== 1) {
    return 'Marque el cliente como cliente para factura de exportación y complete los datos de país/tipo de persona.';
  }

  if (!cliente.cod_pais || !cliente.nombre_pais || !cliente.tipo_persona_exportacion || !cliente.desc_actividad_exportacion) {
    return 'Complete los campos de exportación del cliente: código país, nombre país, tipo persona y actividad del receptor.';
  }

  return null;
}

function validarClienteSujetoExcluido(tipoDte, cliente) {
  if (String(tipoDte || '') !== '14') return null;

  const tipoDocumento = String(cliente?.tipo_documento || '');
  const numero = limpiarDocumentoFiscal(cliente?.numero_documento);

  if (tipoDocumento === '13' && numero.length !== 9) {
    return 'Para Sujeto Excluido con DUI, el documento debe tener 9 dígitos.';
  }

  if (tipoDocumento === '36' && numero.length !== 14) {
    return 'Para Sujeto Excluido con NIT, el documento debe tener 14 dígitos.';
  }

  if (!['13', '36', '37', '03', '02'].includes(tipoDocumento)) {
    return 'Seleccione un tipo de documento válido para el sujeto excluido.';
  }

  return null;
}

function validarReceptorDTEParaHacienda(dte, config) {
  const tipoDte = dte?.identificacion?.tipoDte;
  if (!['01', '03', '05', '06', '07', '11'].includes(String(tipoDte || ''))) return null;

  const nitEmisor = limpiarDocumentoFiscal(config?.nit || dte?.emisor?.nit);
  if (tipoDte === '01' || tipoDte === '11') {
    const receptor = dte?.receptor || {};
    const tipoDocumento = String(dte?.receptor?.tipoDocumento || '');
    const numeroReceptor = limpiarDocumentoFiscal(dte?.receptor?.numDocumento);
    const documentoReceptor = dte?.receptor?.numDocumento;
    const montoTotalOperacion = Number(dte?.resumen?.montoTotalOperacion || dte?.resumen?.totalPagar || 0);

    if (tipoDte === '01' && !tipoDocumento && !numeroReceptor) {
      if (facturaRequiereDuiReceptor(montoTotalOperacion)) {
        return 'La Factura firmada supera $1,095.00 y requiere receptor real con DUI válido de 9 dígitos. Genere nuevamente el DTE.';
      }
      return null;
    }

    if (tipoDte === '01' && esClienteGenericoFactura({ nombre: receptor.nombre })) {
      const mensaje = facturaRequiereDuiReceptor(montoTotalOperacion)
        ? 'La Factura firmada usa CLIENTES VARIOS, pero por el monto requiere un receptor real con DUI válido de 9 dígitos. Genere nuevamente el DTE.'
        : 'La Factura firmada usa CLIENTES VARIOS como receptor identificado. Genere nuevamente el DTE para emitirla como consumidor final sin receptor.';
      return agregarDetalleDocumentoReceptor(mensaje, dte);
    }

    const errorDocumento = validarNumeroDocumentoCliente(tipoDocumento, documentoReceptor, 'receptor del DTE firmado');
    if (errorDocumento) return agregarDetalleDocumentoReceptor(`${errorDocumento} Genere nuevamente el DTE.`, dte);
    const errorFormatoDocumento = validarFormatoDocumentoDTEHacienda(tipoDocumento, documentoReceptor);
    if (errorFormatoDocumento) return agregarDetalleDocumentoReceptor(`${errorFormatoDocumento} Genere nuevamente el DTE.`, dte);

    if (tipoDte === '01' && facturaRequiereDuiReceptor(montoTotalOperacion) && (tipoDocumento !== '13' || numeroReceptor.length !== 9)) {
      return agregarDetalleDocumentoReceptor('La Factura firmada supera $1,095.00 y debe usar receptor con DUI válido de 9 dígitos. Genere nuevamente el DTE con un cliente registrado con DUI.', dte);
    }

    if (tipoDte === '01' && tipoDocumento === '36' && nitEmisor && numeroReceptor === nitEmisor) {
      return agregarDetalleDocumentoReceptor('El DTE firmado tiene el mismo NIT en emisor y receptor. Genere una nueva factura con un cliente distinto.', dte);
    }

    return null;
  }

  if (tipoDte === '07') {
    const tipoRelacionadoInvalido = (dte?.cuerpoDocumento || [])
      .map((item) => String(item?.tipoDte || '').padStart(2, '0'))
      .find((tipoRelacionado) => !['01', '03', '14'].includes(tipoRelacionado));

    if (tipoRelacionadoInvalido) {
      return `El Comprobante de Retención tiene cuerpoDocumento.tipoDte ${tipoRelacionadoInvalido}, pero Hacienda solo acepta Factura 01, CCF 03 o Sujeto Excluido 14 en ese campo. Genere nuevamente el DTE.`;
    }

    const tipoDocumento = String(dte?.receptor?.tipoDocumento || '');
    const numeroReceptor = limpiarDocumentoFiscal(dte?.receptor?.numDocumento);
    const documentoReceptor = dte?.receptor?.numDocumento;

    const errorDocumento = validarNumeroDocumentoCliente(tipoDocumento, documentoReceptor, 'receptor del DTE firmado');
    if (errorDocumento) return agregarDetalleDocumentoReceptor(`${errorDocumento} Genere nuevamente el DTE.`, dte);
    const errorFormatoDocumento = validarFormatoDocumentoRetencionDTE(tipoDocumento, documentoReceptor);
    if (errorFormatoDocumento) return agregarDetalleDocumentoReceptor(`${errorFormatoDocumento} Genere nuevamente el DTE.`, dte);

    if (tipoDocumento === '36' && nitEmisor && numeroReceptor === nitEmisor) {
      return agregarDetalleDocumentoReceptor('El DTE firmado tiene el mismo NIT en emisor y receptor. Genere una nueva factura con un cliente distinto.', dte);
    }

    return null;
  }

  const nitReceptor = limpiarDocumentoFiscal(dte?.receptor?.nit);

  if (!nitReceptor || ![9, 14].includes(nitReceptor.length)) {
    return 'El DTE firmado tiene receptor.nit inválido. Genere nuevamente el DTE con NIT de 14 dígitos o DUI homologado de 9 dígitos.';
  }

  if (nitEmisor && nitReceptor === nitEmisor) {
    return agregarDetalleDocumentoReceptor('El DTE firmado tiene el mismo NIT en emisor y receptor. Genere una nueva factura con un cliente distinto.', dte);
  }

  return null;
}

function formatearObservaciones(observaciones) {
  const lista = Array.isArray(observaciones) ? observaciones : [observaciones];

  return lista
    .filter(obs => obs !== null && obs !== undefined && obs !== '')
    .map(obs => {
      if (typeof obs === 'string') return obs;
      if (typeof obs !== 'object') return String(obs);

      const partes = [
        obs.codigo || obs.cod || obs.codigoError,
        obs.campo || obs.path || obs.propiedad,
        obs.mensaje || obs.message || obs.descripcion || obs.error
      ].filter(Boolean);

      return partes.length ? partes.join(' - ') : JSON.stringify(obs);
    });
}

function formatearObservacionesFactura(observaciones) {
  if (!observaciones) return '';

  try {
    const parsed = typeof observaciones === 'string' ? JSON.parse(observaciones) : observaciones;
    if (parsed?.contingenciaLote) {
      const lote = parsed.contingenciaLote;
      return [
        lote.mensaje,
        lote.codigoLote ? `Lote: ${lote.codigoLote}` : null,
        lote.estado ? `Estado: ${lote.estado}` : null,
        lote.descripcionMsg
      ].filter(Boolean).join(' | ');
    }
    if (parsed?.bitacoraRechazo) {
      const bitacora = parsed.bitacoraRechazo;
      const detalles = formatearObservaciones(bitacora.observaciones || []);
      return detalles.length
        ? detalles.join(' | ')
        : (bitacora.mensaje || bitacora.error || '');
    }
    return formatearObservaciones(parsed).join(' | ');
  } catch {
    return String(observaciones);
  }
}

function parseObservacionesFactura(observaciones) {
  if (!observaciones) return null;
  if (typeof observaciones !== 'string') return observaciones;

  try {
    return JSON.parse(observaciones);
  } catch {
    return observaciones;
  }
}

function crearBitacoraRechazoHacienda(resultado = {}, mensajeMostrado = '') {
  const detalle = resultado.errorDetalle || {};
  const observaciones = detalle.observacionesDetalle ||
    detalle.observaciones ||
    resultado.observaciones ||
    [];

  return {
    bitacoraRechazo: {
      fecha: new Date().toISOString(),
      origen: 'API Hacienda',
      estado: resultado.estado || detalle.estado || 'RECHAZADO',
      tipo: detalle.tipo || null,
      codigo: detalle.codigo || resultado.codigo || null,
      mensaje: detalle.mensaje || resultado.error || mensajeMostrado || 'Documento rechazado por Hacienda',
      observaciones,
      raw: resultado
    }
  };
}

function textoObservacionContieneDocumentoInvalido(valor) {
  const texto = typeof valor === 'string' ? valor : JSON.stringify(valor || '');
  return /numDocumento/i.test(texto) && /(VALOR\s+NO\s+VALIDO|VALOR\s+NO\s+V[AÁ]LIDO|NO\s+VALIDO|NO\s+V[AÁ]LIDO|INVALID)/i.test(texto);
}

function observacionContieneDocumentoInvalido(valor) {
  if (!valor) return false;
  if (textoObservacionContieneDocumentoInvalido(valor)) return true;

  if (Array.isArray(valor)) {
    return valor.some(item => observacionContieneDocumentoInvalido(item));
  }

  if (typeof valor === 'object') {
    return Object.values(valor).some(item => observacionContieneDocumentoInvalido(item));
  }

  return false;
}

function facturaTieneObservacionDocumentoInvalido(factura) {
  if (factura?.sello_recepcion) return false;
  const observaciones = parseObservacionesFactura(factura?.observaciones);
  return observacionContieneDocumentoInvalido(observaciones);
}

function obtenerEstadoFacturaVisual(factura) {
  if (!factura?.sello_recepcion && facturaTieneObservacionDocumentoInvalido(factura)) return 'RECHAZADO';
  return normalizarEstadoFactura(factura?.estado);
}

function observacionesMencionanReceptorNumDocumento(resultado = {}) {
  const detalle = resultado.errorDetalle || {};
  const observaciones = [
    detalle.mensaje,
    detalle.descripcionMsg,
    resultado.error,
    ...(Array.isArray(detalle.observacionesDetalle) ? detalle.observacionesDetalle : []),
    ...(Array.isArray(detalle.observaciones) ? detalle.observaciones : []),
    ...(Array.isArray(resultado.observaciones) ? resultado.observaciones : [])
  ];

  return observaciones
    .map(obs => typeof obs === 'string' ? obs : JSON.stringify(obs || ''))
    .some(obs => /receptor\.numDocumento|numDocumento/i.test(obs));
}

function respuestaHaciendaTieneDocumentoInvalido(resultado = {}) {
  return observacionContieneDocumentoInvalido([
    resultado.error,
    resultado.mensaje,
    resultado.descripcionMsg,
    resultado.observaciones,
    resultado.errorDetalle
  ]);
}

function respuestaHaciendaEstaRechazada(resultado = {}) {
  return normalizarEstadoFactura(resultado.estado || resultado.raw?.estado) === 'RECHAZADO';
}

function esErrorConexionHaciendaTexto(mensaje = '') {
  return /(ENOTFOUND|ENETUNREACH|EAI_AGAIN|ECONNRESET|ECONNREFUSED|EHOSTUNREACH|getaddrinfo|network|internet|conexi[oó]n)/i.test(String(mensaje));
}

function obtenerBitacoraRechazoFactura(factura) {
  const parsed = parseObservacionesFactura(factura?.observaciones);
  if (!parsed) return null;

  if (parsed.bitacoraRechazo) return parsed.bitacoraRechazo;

  return {
    fecha: factura?.fecha_procesamiento || factura?.updated_at || null,
    origen: 'API Hacienda',
    estado: obtenerEstadoFacturaVisual(factura),
    tipo: null,
    codigo: null,
    mensaje: typeof parsed === 'string' ? parsed : 'Documento rechazado por Hacienda',
    observaciones: typeof parsed === 'string' ? [parsed] : parsed,
    raw: parsed
  };
}

function obtenerRespuestaContingenciaFactura(factura) {
  const parsed = parseObservacionesFactura(factura?.observaciones);
  if (!parsed || typeof parsed === 'string') return null;
  return parsed.contingenciaLote || null;
}

function renderResumenContingenciaTabla(factura) {
  const respuesta = obtenerRespuestaContingenciaFactura(factura);
  if (!respuesta) return '';

  const titulo = [
    respuesta.mensaje,
    respuesta.codigoLote ? `Lote: ${respuesta.codigoLote}` : null,
    respuesta.estado ? `Estado: ${respuesta.estado}` : null,
    respuesta.descripcionMsg
  ].filter(Boolean).join('\n');

  const texto = respuesta.codigoLote
    ? `Lote ${respuesta.codigoLote.slice(0, 8)}... ${respuesta.estado || 'pendiente'}`
    : (respuesta.estado || respuesta.mensaje || 'Respuesta MH');

  return `<div class="mh-response-summary" title="${escaparHtml(titulo)}">${escaparHtml(texto)}</div>`;
}

function renderRespuestaContingencia(factura) {
  const section = document.getElementById('factura-respuesta-contingencia');
  const container = document.getElementById('factura-respuesta-contingencia-contenido');
  if (!section || !container) return;

  const respuesta = obtenerRespuestaContingenciaFactura(factura);
  if (!respuesta) {
    section.style.display = 'none';
    container.innerHTML = '';
    return;
  }

  const raw = respuesta.raw ? JSON.stringify(respuesta.raw, null, 2) : '';
  const filas = [
    ['Fecha', respuesta.fecha ? formatDate(respuesta.fecha) : 'N/A'],
    ['Código de lote', respuesta.codigoLote || 'N/A'],
    ['Estado', respuesta.estado || 'N/A'],
    ['Código', respuesta.codigoMsg || respuesta.codigo || 'N/A'],
    ['Mensaje', respuesta.descripcionMsg || respuesta.mensaje || 'Sin mensaje adicional']
  ];

  section.style.display = '';
  container.innerHTML = `
    ${filas.map(([label, value]) => `
      <div class="rejection-log-row">
        <span class="rejection-log-label">${escaparHtml(label)}</span>
        <span class="rejection-log-value">${escaparHtml(value)}</span>
      </div>
    `).join('')}
    ${raw ? `
      <details open>
        <summary>Ver respuesta completa de Hacienda</summary>
        <pre>${escaparHtml(raw)}</pre>
      </details>
    ` : ''}
  `;
}

function renderBitacoraRechazo(factura) {
  const section = document.getElementById('factura-bitacora-rechazo');
  const container = document.getElementById('factura-bitacora-rechazo-contenido');
  if (!section || !container) return;

  const estadoFactura = obtenerEstadoFacturaVisual(factura);
  const bitacora = estadoFactura === 'RECHAZADO' ? obtenerBitacoraRechazoFactura(factura) : null;
  if (!bitacora) {
    section.style.display = 'none';
    container.innerHTML = '';
    return;
  }

  const observaciones = formatearObservaciones(bitacora.observaciones || []);
  const raw = bitacora.raw ? JSON.stringify(bitacora.raw, null, 2) : '';
  const filas = [
    ['Fecha', bitacora.fecha ? formatDate(bitacora.fecha) : 'N/A'],
    ['Origen', bitacora.origen || 'API Hacienda'],
    ['Estado', bitacora.estado || 'RECHAZADO'],
    ['Tipo de error', bitacora.tipo || 'N/A'],
    ['Código', bitacora.codigo || 'N/A'],
    ['Mensaje', bitacora.mensaje || 'Documento rechazado por Hacienda']
  ];

  section.style.display = '';
  container.innerHTML = `
    ${filas.map(([label, value]) => `
      <div class="rejection-log-row">
        <span class="rejection-log-label">${escaparHtml(label)}</span>
        <span class="rejection-log-value">${escaparHtml(value)}</span>
      </div>
    `).join('')}
    <div class="rejection-log-row">
      <span class="rejection-log-label">Observaciones</span>
      <div class="rejection-log-value">
        ${observaciones.length
          ? `<ul class="rejection-log-list">${observaciones.map(obs => `<li>${escaparHtml(obs)}</li>`).join('')}</ul>`
          : 'Sin observaciones adicionales'}
      </div>
    </div>
    ${raw ? `
      <details>
        <summary>Ver respuesta completa de Hacienda</summary>
        <pre>${escaparHtml(raw)}</pre>
      </details>
    ` : ''}
  `;
}

function obtenerNotasFacturaGuardada(factura) {
  if (factura?.notas) return String(factura.notas);

  try {
    const dte = obtenerDTEContenido(parseDTEGuardado(factura?.json_dte));
    const notaApendice = Array.isArray(dte.apendice)
      ? dte.apendice.find(item => item.campo === 'notas' || item.etiqueta === 'Notas del documento')
      : null;
    return notaApendice?.valor || '';
  } catch {
    return '';
  }
}

function generarCodigoGeneracionEventoLocal() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID().toUpperCase();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.random() * 16 | 0;
    const value = char === 'x' ? random : (random & 0x3 | 0x8);
    return value.toString(16).toUpperCase();
  });
}

function normalizarTipoContingenciaDTE(valor) {
  const tipo = Number(valor || 5);
  return [1, 2, 3, 4, 5].includes(tipo) ? tipo : 5;
}

function normalizarMotivoContingenciaDTE(motivo, tipoContingencia = 5) {
  const motivoNormalizado = String(motivo || (tipoContingencia === 5 ? 'Otro motivo de contingencia' : 'Falla tecnica de transmision'))
    .trim()
    .slice(0, 150);

  return motivoNormalizado.length >= 5 ? motivoNormalizado : 'Falla tecnica de transmision';
}

function prepararDTEParaContingencia(dteOriginal, tipoContingencia, motivo) {
  const dte = JSON.parse(JSON.stringify(obtenerDTEContenido(dteOriginal)));
  limpiarFirmasDTE(dte);

  const tipo = normalizarTipoContingenciaDTE(tipoContingencia);
  const motivoNormalizado = normalizarMotivoContingenciaDTE(motivo, tipo);
  const motivoKey = Object.prototype.hasOwnProperty.call(dte.identificacion || {}, 'motivoContigencia')
    ? 'motivoContigencia'
    : 'motivoContin';

  dte.identificacion = {
    ...dte.identificacion,
    tipoModelo: 2,
    tipoOperacion: 2,
    tipoContingencia: tipo,
    [motivoKey]: motivoNormalizado
  };

  if (motivoKey === 'motivoContin') {
    delete dte.identificacion.motivoContigencia;
  } else {
    delete dte.identificacion.motivoContin;
  }

  return dte;
}

async function registrarDocumentoEnContingencia(facturaId, tipoContingencia, motivo) {
  const factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
  if (!factura?.json_dte) return false;

  const tipo = normalizarTipoContingenciaDTE(tipoContingencia);
  const motivoNormalizado = normalizarMotivoContingenciaDTE(motivo, tipo);
  const dteContingencia = prepararDTEParaContingencia(parseDTEGuardado(factura.json_dte), tipo, motivoNormalizado);
  await window.electronAPI.updateFacturaEstado(
    facturaId,
    'CONTINGENCIA',
    null,
    `Documento en contingencia: ${motivoNormalizado}`,
    dteContingencia
  );

  await window.electronAPI.registrarContingencia({
    facturaId,
    tipo: String(tipo),
    motivo: motivoNormalizado
  });

  await loadFacturas();
  return true;
}

async function convertirRechazoConexionAContingencia(facturaId) {
  const factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
  if (!facturaPuedePasarAContingencia(factura)) {
    showNotification('Este rechazo no parece recuperable como contingencia. Revise la bitácora antes de pasarlo a contingencia.', 'warning');
    return false;
  }

  const bitacora = obtenerBitacoraRechazoFactura(factura);
  const motivo = bitacora?.mensaje || 'No se pudo conectar con Hacienda';
  await registrarDocumentoEnContingencia(facturaId, '1', motivo);
  cerrarModalVerFactura();
  showNotification('Documento movido a contingencia para reprocesar.', 'success');
  return true;
}

function construirEventoContingencia(factura, contingencia, dte) {
  const ahora = new Date();
  const config = state.configuracion || {};
  const identificacion = dte.identificacion || {};
  const emisor = dte.emisor || {};
  const fechaInicio = identificacion.fecEmi || String(factura.fecha_emision || contingencia?.fecha_contingencia || '').slice(0, 10);
  const horaInicio = identificacion.horEmi || (
    String(factura.fecha_emision || '').includes('T')
      ? String(factura.fecha_emision).slice(11, 19)
      : '00:00:00'
  );
  const tipoContingencia = normalizarTipoContingenciaDTE(contingencia?.tipo_contingencia || identificacion.tipoContingencia || 5);
  const motivo = normalizarMotivoContingenciaDTE(
    contingencia?.motivo || identificacion.motivoContin || identificacion.motivoContigencia,
    tipoContingencia
  );
  const telefonoEmisor = valorTextoNoVacio(emisor.telefono || config.telefono);
  const correoEmisor = valorTextoNoVacio(emisor.correo || config.email);

  return {
    identificacion: {
      version: 3,
      ambiente: identificacion.ambiente || (String(config.hacienda_ambiente || '').toLowerCase() === 'produccion' ? '01' : '00'),
      codigoGeneracion: generarCodigoGeneracionEventoLocal(),
      fTransmision: formatearFechaLocal(ahora),
      hTransmision: formatearHoraLocal(ahora)
    },
    emisor: {
      nit: limpiarDocumentoFiscal(emisor.nit || config.nit || config.hacienda_usuario),
      nombre: emisor.nombre || config.nombre_empresa || config.nombre,
      nombreResponsable: emisor.nombre || config.nombre_empresa || config.nombre,
      tipoDocResponsable: '36',
      numeroDocResponsable: limpiarDocumentoFiscal(config.nit || config.hacienda_usuario),
      tipoEstablecimiento: emisor.tipoEstablecimiento || config.tipo_establecimiento || '01',
      codEstableMH: emisor.codEstableMH || config.codigo_establecimiento || null,
      codPuntoVenta: emisor.codPuntoVenta || config.punto_venta || null,
      telefono: telefonoEmisor,
      correo: correoEmisor
    },
    detalleDTE: [{
      noItem: 1,
      codigoGeneracion: identificacion.codigoGeneracion,
      tipoDoc: identificacion.tipoDte || factura.tipo_dte
    }],
    motivo: {
      fInicio: fechaInicio,
      fFin: formatearFechaLocal(ahora),
      hInicio: horaInicio,
      hFin: formatearHoraLocal(ahora),
      tipoContingencia,
      motivoContingencia: motivo
    }
  };
}

async function firmarJsonDTE(documento) {
  return await window.electronAPI.firmarDocumento({
    metodo: 'interno',
    documento,
    certificadoPath: state.configuracion.certificado_path,
    certificadoPassword: state.configuracion.certificado_password || state.configuracion.firmador_pin,
    pin: state.configuracion.certificado_password || state.configuracion.firmador_pin,
    usuario: state.configuracion.firmador_usuario || state.configuracion.hacienda_usuario || state.configuracion.nit,
    nit: state.configuracion.firmador_usuario || state.configuracion.hacienda_usuario || state.configuracion.nit
  });
}

function obtenerDetalleDteDesdeLote(consultaLote, codigoGeneracion) {
  const lote = consultaLote?.raw || consultaLote || {};
  const detalles = [
    ...(Array.isArray(lote.feDtes) ? lote.feDtes : []),
    ...(Array.isArray(lote.procesados) ? lote.procesados : []),
    ...(Array.isArray(lote.rechazados) ? lote.rechazados : [])
  ];
  const codigo = String(codigoGeneracion || '').toUpperCase();

  for (const item of detalles) {
    const detalle = item?.detalleDte || item?.detalleDTE || item?.detalle || item;
    if (String(detalle?.codigoGeneracion || '').toUpperCase() === codigo) {
      return detalle;
    }
  }

  return detalles.length === 1
    ? (detalles[0]?.detalleDte || detalles[0]?.detalleDTE || detalles[0]?.detalle || detalles[0])
    : null;
}

function loteDteFueAceptado(detalleDte) {
  const estado = normalizarEstadoFactura(detalleDte?.estado);
  const codigoMsg = String(detalleDte?.codigoMsg || detalleDte?.codigo || '').padStart(3, '0');
  return estado === 'ENVIADO' || ['001', '002'].includes(codigoMsg) || Boolean(detalleDte?.selloRecibido);
}

function loteDteFueRechazado(detalleDte) {
  return normalizarEstadoFactura(detalleDte?.estado) === 'RECHAZADO';
}

async function transmitirDTEContingenciaPorLote(facturaId, factura, dteFirmado) {
  const dte = obtenerDTEContenido(dteFirmado);
  const codigoGeneracion = dte?.identificacion?.codigoGeneracion || factura.codigo_generacion;
  const documentoFirmado = dteFirmado?.firmaMh || dteFirmado?.documentoFirmado || dteFirmado?.documento || dteFirmado;

  const resultadoLote = await window.electronAPI.enviarLoteDTE({
    dtesFirmados: [dteFirmado],
    nit: state.configuracion.nit
  });

  if (!resultadoLote.success) {
    throw new Error(obtenerMensajeErrorHacienda(resultadoLote, 'enviar lote de contingencia'));
  }

  const codigoLote = resultadoLote.codigoLote || resultadoLote.raw?.codigoLote || resultadoLote.raw?.codigoGeneracion;
  if (!codigoLote) {
    throw new Error('Hacienda recibió el lote, pero no devolvió código de lote para consultarlo.');
  }

  const crearObservacionPendiente = (consultaLote = null) => JSON.stringify({
    contingenciaLote: {
      fecha: new Date().toISOString(),
      mensaje: 'Lote recibido por Hacienda. Pendiente de procesamiento.',
      codigoLote,
      estado: consultaLote?.estado || consultaLote?.raw?.estado || resultadoLote.estado || 'PENDIENTE',
      codigoMsg: consultaLote?.codigoMsg || consultaLote?.raw?.codigoMsg || resultadoLote.codigoMsg || null,
      descripcionMsg: consultaLote?.descripcionMsg || consultaLote?.raw?.descripcionMsg || resultadoLote.descripcionMsg || null,
      raw: {
        envio: resultadoLote.raw || resultadoLote,
        consulta: consultaLote?.raw || consultaLote || null
      }
    }
  });
  let ultimaConsultaLote = null;

  for (let intento = 0; intento < 8; intento++) {
    await esperar(intento === 0 ? 2500 : 8000);

    const consultaLote = await window.electronAPI.consultarLoteDTE({ codigoLote });
    if (!consultaLote.success) continue;
    ultimaConsultaLote = consultaLote;

    const lote = consultaLote.raw || consultaLote || {};
    const estadoLote = String(lote.estado || '').toUpperCase();
    const tieneDetalleLote = ['feDtes', 'procesados', 'rechazados']
      .some(key => Array.isArray(lote[key]) && lote[key].length > 0);
    if (estadoLote !== 'PROCESADO' && !tieneDetalleLote) continue;

    const detalleDte = obtenerDetalleDteDesdeLote(consultaLote, codigoGeneracion);
    if (!detalleDte) continue;

    if (loteDteFueRechazado(detalleDte)) {
      const bitacoraRechazo = {
        bitacoraRechazo: {
          fecha: new Date().toISOString(),
          origen: 'API Hacienda - Lote',
          estado: 'RECHAZADO',
          tipo: 'VALIDACION',
          codigo: detalleDte.codigoMsg || detalleDte.codigo || null,
          mensaje: detalleDte.descripcionMsg || detalleDte.mensaje || 'DTE rechazado dentro del lote de contingencia.',
          observaciones: detalleDte.observaciones || [],
          raw: {
            envio: resultadoLote.raw || resultadoLote,
            consulta: lote,
            detalleDte
          }
        }
      };

      await window.electronAPI.updateFacturaEstado(
        facturaId,
        'RECHAZADO',
        null,
        JSON.stringify(bitacoraRechazo),
        documentoFirmado
      );

      return { success: false, rechazado: true, codigoLote, detalleDte, resultadoLote, consultaLote };
    }

    if (!loteDteFueAceptado(detalleDte)) {
      throw new Error(detalleDte.descripcionMsg || detalleDte.mensaje || 'El DTE fue rechazado dentro del lote de contingencia.');
    }

    const selloRecibido = detalleDte.selloRecibido || detalleDte.numValidacion || detalleDte.numeroValidacion || null;
    await window.electronAPI.updateFacturaEstado(
      facturaId,
      normalizarEstadoFactura(detalleDte.estado || 'PROCESADO'),
      selloRecibido,
      detalleDte.observaciones ? JSON.stringify(detalleDte.observaciones) : null,
      documentoFirmado
    );

    return { success: true, selloRecibido, codigoLote, detalleDte, resultadoLote, consultaLote };
  }

  await window.electronAPI.updateFacturaEstado(
    facturaId,
    'CONTINGENCIA',
    null,
    crearObservacionPendiente(ultimaConsultaLote),
    documentoFirmado
  );

  return { success: false, pendiente: true, codigoLote, resultadoLote };
}

async function procesarContingenciaFactura(facturaId) {
  try {
    let factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
    if (!factura) {
      showNotification('Factura no encontrada', 'error');
      return false;
    }

    const pendientes = await window.electronAPI.obtenerContingenciasPendientes();
    const contingencia = pendientes?.pendientes?.find(c => Number(c.factura_id) === Number(facturaId));
    if (!contingencia) {
      showNotification('No se encontró el registro de contingencia pendiente.', 'error');
      return false;
    }

    iniciarProcesoEnvio('Procesando contingencia', [
      'Firmando DTE en contingencia',
      'Firmando evento de contingencia',
      'Enviando evento a Hacienda',
      'Transmitiendo DTE diferido',
      'Esperando sello de Hacienda'
    ]);

    await avanzarProcesoEnvio('Firmando DTE en contingencia...');
    const dte = prepararDTEParaContingencia(parseDTEGuardado(factura.json_dte), contingencia.tipo_contingencia, contingencia.motivo);
    const dteFirmado = await firmarJsonDTE(dte);
    if (!dteFirmado.success) throw new Error(dteFirmado.error || 'No se pudo firmar el DTE en contingencia.');

    await window.electronAPI.updateFacturaEstado(facturaId, 'FIRMADO', null, 'DTE firmado para transmisión por contingencia.', dteFirmado.documentoFirmado);
    await loadFacturas();
    factura = state.facturas.find(f => Number(f.id) === Number(facturaId)) || factura;

    await avanzarProcesoEnvio('Firmando evento de contingencia...');
    const evento = construirEventoContingencia(factura, contingencia, dte);
    const eventoFirmado = await firmarJsonDTE(evento);
    if (!eventoFirmado.success) throw new Error(eventoFirmado.error || 'No se pudo firmar el evento de contingencia.');

    await avanzarProcesoEnvio('Enviando evento de contingencia a Hacienda...');
    const resultadoEvento = await window.electronAPI.enviarContingencia({
      eventoFirmado: eventoFirmado.documentoFirmado || { ...evento, firmaMh: eventoFirmado.firmaMh },
      nit: state.configuracion.nit
    });

    if (!resultadoEvento.success) {
      throw new Error(obtenerMensajeErrorHacienda(resultadoEvento, 'registrar contingencia'));
    }

    if (normalizarEstadoFactura(resultadoEvento.estado) === 'RECHAZADO') {
      const bitacoraEvento = crearBitacoraRechazoHacienda(
        {
          ...resultadoEvento,
          error: resultadoEvento.descripcionMsg || resultadoEvento.mensaje || 'Evento de contingencia rechazado por Hacienda',
          errorDetalle: {
            tipo: 'VALIDACION',
            codigo: resultadoEvento.codigoMsg || resultadoEvento.codigo || null,
            mensaje: resultadoEvento.descripcionMsg || resultadoEvento.mensaje || 'Evento de contingencia rechazado por Hacienda',
            observaciones: resultadoEvento.observaciones || [],
            raw: resultadoEvento.raw || resultadoEvento
          }
        },
        resultadoEvento.descripcionMsg || resultadoEvento.mensaje
      );

      await window.electronAPI.updateFacturaEstado(
        facturaId,
        'RECHAZADO',
        null,
        JSON.stringify(bitacoraEvento),
        dteFirmado.documentoFirmado || dte
      );
      await finalizarProcesoEnvio('Hacienda rechazó el evento de contingencia. Revise la respuesta.', 'error');
      await loadFacturas();
      return false;
    }

    await avanzarProcesoEnvio('Transmitiendo DTE diferido a Hacienda por lote...');
    const documentoFirmadoContingencia = dteFirmado.documentoFirmado || { ...dte, firmaMh: dteFirmado.firmaMh };
    const resultadoTransmision = await transmitirDTEContingenciaPorLote(facturaId, factura, documentoFirmadoContingencia);
    if (resultadoTransmision.pendiente) {
      await finalizarProcesoEnvio(
        `Evento registrado y lote ${resultadoTransmision.codigoLote} recibido. Hacienda aún no termina de procesarlo.`,
        'warning'
      );
      await loadFacturas();
      return false;
    }

    if (resultadoTransmision.rechazado) {
      await finalizarProcesoEnvio(
        resultadoTransmision.detalleDte?.descripcionMsg || 'Hacienda rechazó el DTE dentro del lote.',
        'error'
      );
      await loadFacturas();
      return false;
    }

    if (!resultadoTransmision.success) {
      await finalizarProcesoEnvio('Evento registrado, pero el DTE no fue aprobado en el lote.', 'error');
      return false;
    }

    await window.electronAPI.resolverContingenciaConDatos({
      contingenciaId: contingencia.contingencia_id,
      sello: resultadoTransmision.selloRecibido || resultadoEvento.numeroValidacion || resultadoEvento.selloRecibido || null,
      datos: {
        numeroValidacion: resultadoEvento.numeroValidacion,
        jsonEvento: {
          evento: eventoFirmado.documentoFirmado || evento,
          respuesta: resultadoEvento.raw || resultadoEvento,
          lote: {
            envio: resultadoTransmision.resultadoLote?.raw || resultadoTransmision.resultadoLote,
            consulta: resultadoTransmision.consultaLote?.raw || resultadoTransmision.consultaLote,
            detalleDte: resultadoTransmision.detalleDte
          }
        }
      }
    });

    await loadFacturas();
    await avanzarProcesoEnvio('Creando JSON con respuesta MH y adjuntos de correo...');
    const respuestaHaciendaContingencia = {
      estado: resultadoTransmision.detalleDte?.estado || 'PROCESADO',
      selloRecibido: resultadoTransmision.selloRecibido,
      codigoGeneracion: resultadoTransmision.detalleDte?.codigoGeneracion || dte.identificacion?.codigoGeneracion,
      observaciones: resultadoTransmision.detalleDte?.observaciones || null,
      fechaHora: resultadoTransmision.detalleDte?.fhProcesamiento || resultadoEvento.fechaHora || null,
      raw: {
        evento: resultadoEvento.raw || resultadoEvento,
        lote: {
          envio: resultadoTransmision.resultadoLote?.raw || resultadoTransmision.resultadoLote,
          consulta: resultadoTransmision.consultaLote?.raw || resultadoTransmision.consultaLote,
          detalleDte: resultadoTransmision.detalleDte
        }
      }
    };
    const jsonConRespuesta = construirJsonDTEConRespuestaHacienda(
      documentoFirmadoContingencia,
      respuestaHaciendaContingencia,
      resultadoTransmision.selloRecibido
    );
    const correoEnviado = await enviarCorreoAutomaticoDocumentoAprobado(
      facturaId,
      documentoFirmadoContingencia,
      resultadoTransmision.selloRecibido,
      jsonConRespuesta
    );

    await finalizarProcesoEnvio(
      correoEnviado
        ? 'Contingencia procesada, DTE aprobado por Hacienda y enviado por correo.'
        : 'Contingencia procesada y DTE aprobado por Hacienda. Revise el envío por correo.',
      'success'
    );
    return true;
  } catch (error) {
    console.error('Error procesando contingencia:', error);
    await finalizarProcesoEnvio('No se pudo completar la contingencia.', 'error');
    showNotification('Error procesando contingencia: ' + error.message, 'error');
    return false;
  }
}

window.procesarContingenciaFactura = procesarContingenciaFactura;
window.convertirRechazoConexionAContingencia = convertirRechazoConexionAContingencia;

function getEstadoBadgeClass(estado) {
  const classes = {
    'PENDIENTE': 'warning',
    'FIRMADO': 'info',
    'CONTINGENCIA': 'warning',
    'ENVIADO': 'info',
    'PROCESADO': 'info',
    'RECHAZADO': 'danger',
    'RECIBIDO': 'info',
    'ACEPTADO': 'success',
    'ANULADO': 'danger',
    'INVALIDADO': 'danger'
  };
  return classes[estado] || 'secondary';
}

function normalizarEstadoFactura(estado) {
  if (!estado) return 'PENDIENTE';

  const estadoNormalizado = estado.toString().toUpperCase();

  if (['PROCESADO', 'RECIBIDO', 'ENVIADO'].includes(estadoNormalizado)) {
    return 'ENVIADO';
  }

  if (['ANULADO', 'INVALIDADO'].includes(estadoNormalizado)) {
    return 'ANULADO';
  }

  if (['CONTINGENCIA', 'EN_CONTINGENCIA'].includes(estadoNormalizado)) {
    return 'CONTINGENCIA';
  }

  return estadoNormalizado;
}

function pareceJWS(valor) {
  return typeof valor === 'string' && valor.split('.').length === 3;
}

function decodificarBase64Url(valor) {
  const base64 = String(valor || '')
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(String(valor || '').length / 4) * 4, '=');
  const binario = atob(base64);
  const bytes = Uint8Array.from(binario, char => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function parseJWSDTE(jws) {
  const partes = String(jws || '').split('.');
  if (partes.length !== 3) {
    throw new Error('El documento firmado no tiene formato JWS válido.');
  }

  const payload = JSON.parse(decodificarBase64Url(partes[1]));
  return {
    ...payload,
    firmaMh: jws
  };
}

function parseDTEGuardado(jsonDte) {
  if (!jsonDte) return {};
  let parsed = jsonDte;

  if (pareceJWS(parsed)) {
    return parseJWSDTE(parsed);
  }

  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed);
    } catch (error) {
      if (pareceJWS(parsed)) return parseJWSDTE(parsed);
      throw error;
    }
  }

  if (typeof parsed === 'string') {
    if (pareceJWS(parsed)) return parseJWSDTE(parsed);
    parsed = JSON.parse(parsed);
  }
  return parsed;
}

function obtenerDTEContenido(dte) {
  const candidatos = [
    dte,
    dte?.dteJson,
    dte?.dte,
    dte?.documentoFirmado,
    dte?.documento
  ];

  for (let candidato of candidatos) {
    if (typeof candidato === 'string') {
      try {
        candidato = parseDTEGuardado(candidato);
      } catch {
        continue;
      }
    }

    if (candidato?.identificacion) {
      return candidato;
    }
  }

  return dte || {};
}

function obtenerJsonDTEFormateado(factura) {
  const dte = parseDTEGuardado(factura.json_dte);
  return JSON.stringify(dte, null, 2);
}

function obtenerNombreArchivoJson(factura) {
  const codigo = factura.codigo_generacion || factura.numero_control || `factura-${factura.id}`;
  return `DTE_${String(codigo).replace(/[^A-Za-z0-9_-]/g, '_')}.json`;
}

function escaparHtml(valor) {
  return String(valor)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function verJsonDTE(factura) {
  try {
    const json = obtenerJsonDTEFormateado(factura);
    const ventana = window.open('', '_blank');

    if (!ventana) {
      showNotification('No se pudo abrir la ventana del JSON. Revise el bloqueo de ventanas emergentes.', 'error');
      return;
    }

    ventana.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${escaparHtml(obtenerNombreArchivoJson(factura))}</title>
          <style>
            body { margin: 0; background: #f8f9fa; color: #1f2933; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
            header { position: sticky; top: 0; padding: 12px 16px; background: #ffffff; border-bottom: 1px solid #d9e2ec; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
            pre { margin: 0; padding: 16px; white-space: pre-wrap; word-break: break-word; font-size: 12px; line-height: 1.45; }
          </style>
        </head>
        <body>
          <header>${escaparHtml(obtenerNombreArchivoJson(factura))}</header>
          <pre>${escaparHtml(json)}</pre>
        </body>
      </html>
    `);
    ventana.document.close();
  } catch (error) {
    showNotification('Error al mostrar JSON: ' + error.message, 'error');
  }
}

async function guardarJsonDTE(factura) {
  showNotification('El JSON fiscal se genera solo como adjunto de correo; no se guarda en disco.', 'info');
}

function showNotification(message, type = 'info') {
  console.log(`[${type.toUpperCase()}] ${message}`);
  const container = document.getElementById('toast-container');
  if (!container) {
    alert(message);
    return;
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-8px)';
    toast.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    setTimeout(() => toast.remove(), 220);
  }, type === 'error' ? 9000 : 4200);
}

const procesoEnvio = {
  pasos: [],
  pasoActual: -1,
  visible: false
};

function esperar(ms = 650) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function iniciarProcesoEnvio(titulo, pasos) {
  procesoEnvio.pasos = pasos;
  procesoEnvio.pasoActual = -1;
  procesoEnvio.visible = true;

  const overlay = document.getElementById('proceso-envio');
  const tituloElement = document.getElementById('proceso-envio-titulo');
  const subtitulo = document.getElementById('proceso-envio-subtitulo');
  const badge = document.getElementById('proceso-envio-badge');
  const barra = document.getElementById('proceso-envio-barra');
  const lista = document.getElementById('proceso-envio-pasos');

  if (!overlay || !lista) return;

  tituloElement.textContent = titulo;
  subtitulo.textContent = 'Preparando documento...';
  badge.textContent = 'En proceso';
  badge.className = 'process-badge';
  barra.className = 'process-track-fill';
  barra.style.width = '0%';
  lista.innerHTML = pasos.map(paso => `<li>${paso}</li>`).join('');
  overlay.style.display = 'flex';
}

async function avanzarProcesoEnvio(texto, opciones = {}) {
  if (!procesoEnvio.visible) return;

  procesoEnvio.pasoActual += 1;
  const subtitulo = document.getElementById('proceso-envio-subtitulo');
  const barra = document.getElementById('proceso-envio-barra');
  const items = Array.from(document.querySelectorAll('#proceso-envio-pasos li'));
  const total = Math.max(procesoEnvio.pasos.length, 1);
  const indice = Math.min(procesoEnvio.pasoActual, total - 1);

  if (subtitulo) subtitulo.textContent = texto || procesoEnvio.pasos[indice] || '';
  items.forEach((item, itemIndex) => {
    item.classList.toggle('done', itemIndex < indice);
    item.classList.toggle('active', itemIndex === indice);
    item.classList.remove('error');
  });

  if (barra) {
    barra.style.width = `${Math.round(((indice + 1) / total) * 100)}%`;
  }

  await esperar(opciones.delay ?? 700);
}

async function finalizarProcesoEnvio(mensaje, tipo = 'success') {
  if (!procesoEnvio.visible) return;

  const subtitulo = document.getElementById('proceso-envio-subtitulo');
  const badge = document.getElementById('proceso-envio-badge');
  const barra = document.getElementById('proceso-envio-barra');
  const items = Array.from(document.querySelectorAll('#proceso-envio-pasos li'));

  if (subtitulo) subtitulo.textContent = mensaje;
  if (badge) {
    badge.textContent = tipo === 'success' ? 'Aprobado' : 'Revisar';
    badge.className = `process-badge ${tipo}`;
  }
  if (barra) {
    barra.style.width = '100%';
    barra.className = `process-track-fill ${tipo}`;
  }

  items.forEach((item) => {
    item.classList.remove('active');
    item.classList.toggle('done', tipo === 'success');
    item.classList.toggle('error', tipo === 'error');
  });

  await esperar(tipo === 'success' ? 1200 : 1800);
  ocultarProcesoEnvio();
}

function ocultarProcesoEnvio() {
  const overlay = document.getElementById('proceso-envio');
  if (overlay) overlay.style.display = 'none';
  procesoEnvio.visible = false;
}

// Obtener nombre del tipo de producto
function getTipoProductoNombre(tipo) {
  const tipos = {
    '1': 'Bien',
    '2': 'Servicio',
    '3': 'Ambos',
    '4': 'Otros'
  };
  return tipos[tipo] || 'Desconocido';
}

// Funciones globales para botones
window.verFactura = async function(id) {
  const factura = state.facturas.find(f => Number(f.id) === Number(id));
  if (!factura) {
    showNotification('Factura no encontrada', 'error');
    return;
  }
  
  abrirModalVerFactura(factura);
};

window.enviarFactura = async function(id) {
  const factura = state.facturas.find(f => Number(f.id) === Number(id));
  if (!factura) {
    showNotification('Factura no encontrada', 'error');
    return;
  }
  
  if (factura.estado !== 'FIRMADO') {
    showNotification('La factura debe estar firmada antes de enviarla', 'warning');
    return;
  }
  
  await enviarFacturaHacienda(id);
};

window.editarCliente = function(id) {
  console.log('Editar cliente:', id);
  const cliente = state.clientes.find(c => c.id === id);
  if (cliente) {
    abrirModalCliente(cliente);
  }
};

window.editarProducto = function(id) {
  console.log('Editar producto:', id);
  showNotification('Funcionalidad en desarrollo', 'info');
};

// ========== CONTROLADOR DE CLIENTES ==========

// Abrir modal para nuevo cliente o editar existente
function abrirModalCliente(cliente = null) {
  const modal = document.getElementById('modal-cliente');
  const titulo = document.getElementById('modal-cliente-titulo');
  const form = document.getElementById('form-cliente');
  
  // Limpiar formulario
  form.reset();
  renderSelectsTiposDte();
  
  if (cliente) {
    // Modo edición
    titulo.textContent = 'Editar Cliente';
    poblarSelectTipoDte(document.getElementById('cliente-tipo-dte-default'), {
      placeholder: 'Seleccionar...',
      valorActual: cliente.tipo_dte_default || '01',
      tipos: obtenerTiposDteParaClienteDefault(cliente.tipo_dte_default || '01')
    });
    document.getElementById('cliente-id').value = cliente.id;
    document.getElementById('cliente-tipo-documento').value = cliente.tipo_documento;
    document.getElementById('cliente-numero-documento').value = cliente.numero_documento;
    document.getElementById('cliente-tipo-dte-default').value = cliente.tipo_dte_default || '01';
    document.getElementById('cliente-nrc').value = cliente.nrc || '';
    document.getElementById('cliente-nombre').value = cliente.nombre;
    document.getElementById('cliente-nombre-comercial').value = cliente.nombre_comercial || '';
    document.getElementById('cliente-tipo-persona').value = cliente.tipo_persona || '';
    document.getElementById('cliente-condicion-iva').value = cliente.condicion_iva || 'GRAVADO';
    document.getElementById('cliente-plazo-pago').value = cliente.plazo_pago || '01';
    document.getElementById('cliente-periodo-pago').value = Number(cliente.periodo_pago || 1);
    document.getElementById('cliente-telefono').value = cliente.telefono || '';
    document.getElementById('cliente-email').value = cliente.email || '';
    document.getElementById('cliente-aplica-exportacion').checked = Number(cliente.aplica_exportacion) === 1;
    document.getElementById('cliente-sujeto-excluido-domiciliado').value = String(cliente.sujeto_excluido_domiciliado === 0 ? 0 : 1);
    document.getElementById('cliente-cod-pais').value = cliente.cod_pais || '';
    document.getElementById('cliente-nombre-pais').value = cliente.nombre_pais || '';
    document.getElementById('cliente-tipo-persona-exportacion').value = String(cliente.tipo_persona_exportacion || inferirTipoPersonaExportacion(cliente.tipo_persona));
    document.getElementById('cliente-desc-actividad-exportacion').value = cliente.desc_actividad_exportacion || '';
    document.getElementById('cliente-departamento').value = cliente.departamento || '';
    
    // Cargar municipios del departamento seleccionado
    if (cliente.departamento) {
      cargarMunicipios(cliente.departamento);
      // Esperar un momento para que se carguen los municipios antes de seleccionar
      setTimeout(() => {
        document.getElementById('cliente-municipio').value = cliente.municipio || '';
        
        // Cargar distritos del municipio seleccionado
        if (cliente.municipio) {
          cargarDistritos(cliente.municipio);
          // Esperar para cargar el distrito
          setTimeout(() => {
            document.getElementById('cliente-distrito').value = cliente.distrito || '';
          }, 50);
        }
      }, 50);
    }
    
    document.getElementById('cliente-direccion').value = cliente.direccion || '';
    
    // Mostrar giro con código y descripción
    if (cliente.giro) {
      const actividad = actividadesEconomicas.find(a => a.codigo === cliente.giro);
      if (actividad) {
        document.getElementById('cliente-giro').value = `${actividad.codigo} - ${actividad.descripcion}`;
        document.getElementById('cliente-giro').setAttribute('data-codigo', actividad.codigo);
      } else {
        document.getElementById('cliente-giro').value = cliente.giro;
        document.getElementById('cliente-giro').removeAttribute('data-codigo');
      }
    }
  } else {
    // Modo nuevo
    titulo.textContent = 'Nuevo Cliente';
    document.getElementById('cliente-id').value = '';
    const defaultSelect = document.getElementById('cliente-tipo-dte-default');
    defaultSelect.value = defaultSelect.querySelector('option[value="01"]') ? '01' : defaultSelect.options[1]?.value || defaultSelect.options[0]?.value || '';
    document.getElementById('cliente-condicion-iva').value = 'GRAVADO';
    document.getElementById('cliente-plazo-pago').value = '01';
    document.getElementById('cliente-periodo-pago').value = '1';
    document.getElementById('cliente-tipo-persona-exportacion').value = '2';
    document.getElementById('cliente-sujeto-excluido-domiciliado').value = '1';
  }

  actualizarCamposExportacionCliente();
  
  modal.classList.add('active');
}

// Cerrar modal de cliente
function cerrarModalCliente() {
  const modal = document.getElementById('modal-cliente');
  modal.classList.remove('active');
  document.getElementById('form-cliente').reset();
  actualizarCamposExportacionCliente();
}

function actualizarCamposExportacionCliente() {
  const aplica = document.getElementById('cliente-aplica-exportacion')?.checked;
  const tipoDteDefault = document.getElementById('cliente-tipo-dte-default')?.value;
  const tipoDocumento = document.getElementById('cliente-tipo-documento')?.value;
  const esExportacionDefault = tipoDteDefault === '11';
  const requiereDatosLocales = tipoDteDefault === '03';
  const esSujetoExcluido = tipoDteDefault === '14';
  const esDocumentoExtranjero = ['37', '03', '02'].includes(String(tipoDocumento || ''));
  const section = document.getElementById('cliente-exportacion-section');
  const domicilioSujetoExcluido = document.getElementById('cliente-sujeto-excluido-domicilio-group');
  const mostrarExportacion = aplica || esExportacionDefault;
  if (section) section.style.display = mostrarExportacion ? 'grid' : 'none';
  if (domicilioSujetoExcluido) {
    domicilioSujetoExcluido.style.display = esSujetoExcluido && esDocumentoExtranjero ? '' : 'none';
  }

  ['cliente-cod-pais', 'cliente-nombre-pais', 'cliente-tipo-persona-exportacion', 'cliente-desc-actividad-exportacion'].forEach((id) => {
    const input = document.getElementById(id);
    if (input) input.required = Boolean(mostrarExportacion);
  });

  ['cliente-departamento', 'cliente-municipio', 'cliente-distrito', 'cliente-giro'].forEach((id) => {
    const input = document.getElementById(id);
    if (input) input.required = requiereDatosLocales;
  });

  if (mostrarExportacion) {
    const checkbox = document.getElementById('cliente-aplica-exportacion');
    if (checkbox) checkbox.checked = true;
    completarPaisExportacionCliente();
    const tipoPersonaExportacion = document.getElementById('cliente-tipo-persona-exportacion');
    if (tipoPersonaExportacion && !tipoPersonaExportacion.value) {
      tipoPersonaExportacion.value = inferirTipoPersonaExportacion(document.getElementById('cliente-tipo-persona')?.value);
    }
  }
}

function completarPaisExportacionCliente() {
  const codPaisInput = document.getElementById('cliente-cod-pais');
  const nombrePaisInput = document.getElementById('cliente-nombre-pais');
  if (!codPaisInput || !nombrePaisInput) return;

  const paises = {
    '9300': 'ESTADOS UNIDOS DE AMERICA',
    '9301': 'GUATEMALA',
    '9302': 'HONDURAS',
    '9303': 'NICARAGUA',
    '9304': 'COSTA RICA',
    '9305': 'PANAMA',
    '9320': 'MEXICO'
  };

  const codigo = String(codPaisInput.value || '').trim();
  if (!codigo) {
    codPaisInput.value = '9300';
    nombrePaisInput.value = nombrePaisInput.value || paises['9300'];
    return;
  }

  if (paises[codigo] && (!nombrePaisInput.value || Object.values(paises).includes(nombrePaisInput.value))) {
    nombrePaisInput.value = paises[codigo];
  }
}

function inferirTipoPersonaExportacion(tipoPersona) {
  return String(tipoPersona || '').toLowerCase().startsWith('natural') ? 1 : 2;
}

// Guardar cliente (nuevo o editar)
async function guardarCliente() {
  try {
    const clienteId = document.getElementById('cliente-id').value;
    const emailCliente = document.getElementById('cliente-email').value.trim();
    const tipoDteDefault = document.getElementById('cliente-tipo-dte-default').value;
    const aplicaExportacion = document.getElementById('cliente-aplica-exportacion').checked || tipoDteDefault === '11';
    const plazoPago = document.getElementById('cliente-plazo-pago').value;
    const periodoPago = Number(document.getElementById('cliente-periodo-pago').value || 0);

    const tiposDefaultPermitidos = obtenerTiposDteParaClienteDefault().map(tipo => tipo.codigo);
    if (!tiposDefaultPermitidos.includes(tipoDteDefault)) {
      showNotification('Seleccione el documento a generar por defecto para el cliente.', 'error');
      return;
    }

    if (!['01', '02', '03'].includes(plazoPago) || !Number.isFinite(periodoPago) || periodoPago < 1) {
      showNotification('Ingrese un plazo de pago válido para el cliente.', 'error');
      return;
    }
    
    const giroValue = extraerCodigoActividad(document.getElementById('cliente-giro'));
    if (tipoDteDefault === '03' && !validarCodigoActividad(giroValue)) {
      showNotification('Seleccione una actividad económica válida de 5 dígitos para el cliente', 'error');
      return;
    }

    if (aplicaExportacion && !document.getElementById('cliente-desc-actividad-exportacion').value.trim()) {
      showNotification('Ingrese la actividad del receptor para factura de exportación.', 'error');
      return;
    }

    if (!emailCliente) {
      showNotification('Ingrese el correo electrónico del cliente para poder enviarle el PDF y JSON.', 'error');
      return;
    }

    if (!document.getElementById('cliente-email').checkValidity()) {
      showNotification('Ingrese un correo electrónico válido para el cliente.', 'error');
      return;
    }

    const tipoDocumentoCliente = document.getElementById('cliente-tipo-documento').value;
    const numeroDocumentoCliente = document.getElementById('cliente-numero-documento').value;
    const errorDocumentoCliente = validarNumeroDocumentoCliente(tipoDocumentoCliente, numeroDocumentoCliente, 'cliente');
    if (errorDocumentoCliente) {
      showNotification(errorDocumentoCliente, 'error');
      return;
    }

    if (tipoDteDefault === '03' && !esDocumentoContribuyenteNaturalValido(tipoDocumentoCliente, numeroDocumentoCliente)) {
      showNotification('Para CCF el cliente debe tener NIT de 14 dígitos o DUI homologado de 9 dígitos.', 'error');
      return;
    }

    if (tipoDteDefault === '01' && tipoDocumentoCliente !== '13') {
      showNotification('Para facturas de $1,095.00 o más este cliente debe tener DUI válido.', 'warning');
    }

    if (tipoDteDefault === '01' && tipoDocumentoCliente === '13' && giroValue) {
      showNotification('Para Factura con receptor DUI, la actividad económica guardada no se enviará en el DTE.', 'info');
    }
    
    const clienteData = {
      tipo_documento: tipoDocumentoCliente,
      numero_documento: normalizarNumeroDocumentoCliente(tipoDocumentoCliente, numeroDocumentoCliente),
      tipo_dte_default: tipoDteDefault,
      nrc: document.getElementById('cliente-nrc').value,
      nombre: document.getElementById('cliente-nombre').value,
      nombre_comercial: document.getElementById('cliente-nombre-comercial').value,
      tipo_persona: document.getElementById('cliente-tipo-persona').value,
      sujeto_excluido_domiciliado: Number(document.getElementById('cliente-sujeto-excluido-domiciliado')?.value || 1),
      condicion_iva: document.getElementById('cliente-condicion-iva').value || 'GRAVADO',
      plazo_pago: plazoPago,
      periodo_pago: Math.trunc(periodoPago),
      telefono: document.getElementById('cliente-telefono').value,
      email: emailCliente,
      departamento: document.getElementById('cliente-departamento').value,
      municipio: document.getElementById('cliente-municipio').value,
      distrito: document.getElementById('cliente-distrito').value,
      direccion: document.getElementById('cliente-direccion').value,
      giro: giroValue,
      aplica_exportacion: aplicaExportacion ? 1 : 0,
      cod_pais: document.getElementById('cliente-cod-pais').value,
      nombre_pais: document.getElementById('cliente-nombre-pais').value,
      tipo_persona_exportacion: Number(document.getElementById('cliente-tipo-persona-exportacion').value || inferirTipoPersonaExportacion(document.getElementById('cliente-tipo-persona').value)),
      desc_actividad_exportacion: document.getElementById('cliente-desc-actividad-exportacion').value
    };
    
    if (clienteId) {
      // Actualizar cliente existente
      const result = await window.electronAPI.updateCliente(parseInt(clienteId), clienteData);
      
      if (result) {
        showNotification('Cliente actualizado exitosamente', 'success');
        cerrarModalCliente();
        
        // Recargar lista de clientes
        await loadClientes();
        
        // Si estamos en vista de nueva factura, actualizar select
        if (state.currentView === 'nueva-factura') {
          await loadClientesSelect();
        }
      }
    } else {
      // Crear nuevo cliente
      const result = await window.electronAPI.addCliente(clienteData);
      
      if (result) {
        showNotification('Cliente guardado exitosamente', 'success');
        cerrarModalCliente();
        
        // Recargar lista de clientes
        await loadClientes();
        
        // Si estamos en vista de nueva factura, actualizar select
        if (state.currentView === 'nueva-factura') {
          await loadClientesSelect();
        }
      }
    }
  } catch (error) {
    console.error('Error guardando cliente:', error);
    showNotification('Error al guardar cliente: ' + error.message, 'error');
  }
}

// Editar cliente
async function editarCliente(clienteId) {
  try {
    const cliente = state.clientes.find(c => c.id === clienteId);
    if (cliente) {
      abrirModalCliente(cliente);
    } else {
      showNotification('Cliente no encontrado', 'error');
    }
  } catch (error) {
    console.error('Error al editar cliente:', error);
    showNotification('Error al cargar cliente', 'error');
  }
}

// Eliminar cliente
async function eliminarCliente(clienteId) {
  try {
    const confirmacion = confirm('¿Está seguro de eliminar este cliente? Esta acción no se puede deshacer.');
    if (!confirmacion) return;
    
    const result = await window.electronAPI.deleteCliente(clienteId);
    
    if (result) {
      showNotification('Cliente eliminado exitosamente', 'success');
      await loadClientes();
      
      if (state.currentView === 'nueva-factura') {
        await loadClientesSelect();
      }
    }
  } catch (error) {
    console.error('Error eliminando cliente:', error);
    showNotification('Error al eliminar cliente: ' + error.message, 'error');
  }
}

// Validar documento según tipo
function validarDocumento() {
  const tipo = document.getElementById('cliente-tipo-documento').value;
  const numeroDocInput = document.getElementById('cliente-numero-documento');
  const numero = numeroDocInput.value;
  const errorDocumento = validarNumeroDocumentoCliente(tipo, numero, 'cliente');

  if (errorDocumento) {
    showNotification(errorDocumento, 'error');
    return false;
  }

  if (numeroDocInput) {
    numeroDocInput.value = normalizarNumeroDocumentoCliente(tipo, numero);
  }
  
  return true;
}

// Formatear número de documento mientras se escribe
document.addEventListener('DOMContentLoaded', () => {
  const numeroDocInput = document.getElementById('cliente-numero-documento');
  const tipoDocSelect = document.getElementById('cliente-tipo-documento');
  
  if (numeroDocInput && tipoDocSelect) {
    numeroDocInput.addEventListener('blur', () => {
      validarDocumento();
    });
    
    tipoDocSelect.addEventListener('change', () => {
      numeroDocInput.value = '';
      const tipo = tipoDocSelect.value;
      
      if (tipo === '36') {
        numeroDocInput.placeholder = '0000-000000-000-0';
      } else if (tipo === '13') {
        numeroDocInput.placeholder = '00000000-0';
      } else {
        numeroDocInput.placeholder = 'Número de documento';
      }
    });
  }
});

// Hacer funciones globales para el modal
window.cerrarModalCliente = cerrarModalCliente;
window.abrirModalCliente = abrirModalCliente;

window.editarProducto = function(id) {
  console.log('Editar producto:', id);
  const producto = state.productos.find(p => p.id === id);
  if (producto) {
    abrirModalProducto(producto);
  }
};

// ========== CONTROLADOR DE PRODUCTOS ==========

// Abrir modal para nuevo producto o editar existente
function abrirModalProducto(producto = null) {
  const modal = document.getElementById('modal-producto');
  const titulo = document.getElementById('modal-producto-titulo');
  const form = document.getElementById('form-producto');
  
  // Limpiar formulario
  form.reset();
  
  if (producto) {
    // Modo edición
    titulo.textContent = 'Editar Producto/Servicio';
    document.getElementById('producto-id').value = producto.id;
    document.getElementById('producto-tipo').value = producto.tipo;
    document.getElementById('producto-codigo').value = producto.codigo;
    document.getElementById('producto-descripcion').value = producto.descripcion;
    document.getElementById('producto-precio').value = producto.precio;
    document.getElementById('producto-unidad').value = producto.unidad_medida || '99';
    document.getElementById('producto-iva').value = producto.exento ? '0' : '1';
    
    // Cargar tributos si existen
    const tributos = producto.tributos ? JSON.parse(producto.tributos) : [];
    document.getElementById('producto-notas').value = producto.notas || '';
  } else {
    // Modo nuevo
    titulo.textContent = 'Nuevo Producto/Servicio';
    document.getElementById('producto-id').value = '';
    document.getElementById('producto-iva').value = '1'; // Por defecto con IVA
  }
  
  modal.classList.add('active');
}

// Cerrar modal de producto
function cerrarModalProducto() {
  const modal = document.getElementById('modal-producto');
  modal.classList.remove('active');
  document.getElementById('form-producto').reset();
}

// Guardar producto (nuevo o editar)
async function guardarProducto() {
  try {
    const productoId = document.getElementById('producto-id').value;
    const tipoProducto = document.getElementById('producto-tipo').value;
    const exento = document.getElementById('producto-iva').value === '0';
    
    // Preparar tributos
    const tributos = [];
    if (!exento) {
      tributos.push({
        codigo: '20',
        descripcion: 'Impuesto al Valor Agregado 13%',
        valor: 0.13
      });
    }
    
    const productoData = {
      tipo: tipoProducto,
      codigo: document.getElementById('producto-codigo').value,
      descripcion: document.getElementById('producto-descripcion').value,
      precio: parseFloat(document.getElementById('producto-precio').value),
      unidad_medida: document.getElementById('producto-unidad').value,
      tributos: tributos,
      exento: exento ? 1 : 0,
      notas: document.getElementById('producto-notas').value
    };
    
    if (productoId) {
      // Actualizar producto existente
      const result = await window.electronAPI.updateProducto(productoId, productoData);
      
      if (result) {
        showNotification('Producto actualizado exitosamente', 'success');
        cerrarModalProducto();
        
        // Recargar lista de productos
        await loadProductos();
      }
    } else {
      // Crear nuevo producto
      const result = await window.electronAPI.addProducto(productoData);
      
      if (result) {
        showNotification('Producto guardado exitosamente', 'success');
        cerrarModalProducto();
        
        // Recargar lista de productos
        await loadProductos();
      }
    }
  } catch (error) {
    console.error('Error guardando producto:', error);
    showNotification('Error al guardar producto: ' + error.message, 'error');
  }
}

// Validar código de producto único
async function validarCodigoProducto(codigo, productoId = null) {
  const productos = await window.electronAPI.getProductos();
  const existe = productos.some(p => 
    p.codigo.toLowerCase() === codigo.toLowerCase() && 
    (!productoId || p.id !== parseInt(productoId))
  );
  
  if (existe) {
    showNotification('El código de producto ya existe', 'error');
    return false;
  }
  
  return true;
}

// Calcular precio con IVA
function calcularPrecioConIVA(precio, tieneIVA) {
  if (tieneIVA) {
    return precio * 1.13;
  }
  return precio;
}

// Listener para mostrar precio con IVA
document.addEventListener('DOMContentLoaded', () => {
  const precioInput = document.getElementById('producto-precio');
  const ivaSelect = document.getElementById('producto-iva');
  
  if (precioInput && ivaSelect) {
    const actualizarPreview = () => {
      const precio = parseFloat(precioInput.value) || 0;
      const tieneIVA = ivaSelect.value === '1';
      const precioConIVA = calcularPrecioConIVA(precio, tieneIVA);
      
      // Puedes mostrar esto en algún lugar del formulario si lo deseas
      console.log(`Precio base: $${precio.toFixed(2)}, Con IVA: $${precioConIVA.toFixed(2)}`);
    };
    
    precioInput.addEventListener('input', actualizarPreview);
    ivaSelect.addEventListener('change', actualizarPreview);
  }
});

// Hacer funciones globales para el modal
window.cerrarModalProducto = cerrarModalProducto;
window.abrirModalProducto = abrirModalProducto;

window.editarProducto = function(id) {
  console.log('Editar producto:', id);
  const producto = state.productos.find(p => p.id === id);
  if (producto) {
    abrirModalProducto(producto);
  }
};

// Eliminar producto
window.eliminarProducto = async function(id) {
  const producto = state.productos.find(p => p.id === id);
  if (!producto) return;
  
  const confirmacion = confirm(`¿Estás seguro de eliminar el producto "${producto.descripcion}"?`);
  if (!confirmacion) return;
  
  try {
    await window.electronAPI.deleteProducto(id);
    showNotification('Producto eliminado exitosamente', 'success');
    await loadProductos();
  } catch (error) {
    console.error('Error eliminando producto:', error);
    showNotification('Error al eliminar producto: ' + error.message, 'error');
  }
};

// ========== CONTROLADOR DE ITEMS DE FACTURA ==========

// Abrir modal para agregar item
function abrirModalItem() {
  const modal = document.getElementById('modal-item');
  const select = document.getElementById('item-producto');
  const tipoDte = document.getElementById('tipo-dte')?.value;
  const documentoRelacionadoGroup = document.getElementById('item-documento-relacionado-group');
  const documentoRelacionadoSelect = document.getElementById('item-documento-relacionado');
  
  // Limpiar y cargar productos
  select.innerHTML = '<option value="">Seleccionar producto...</option>';
  state.productos.forEach(p => {
    const option = document.createElement('option');
    option.value = p.id;
    option.textContent = `${p.codigo} - ${p.descripcion} - ${formatCurrency(p.precio)}`;
    option.dataset.precio = p.precio;
    option.dataset.exento = p.exento;
    option.dataset.descripcion = p.descripcion;
    option.dataset.codigo = p.codigo;
    option.dataset.unidadMedida = p.unidad_medida;
    select.appendChild(option);
  });
  
  // Limpiar formulario
  document.getElementById('form-item').reset();
  document.getElementById('item-precio').value = '';
  document.getElementById('item-cantidad').value = '1';
  document.getElementById('item-descuento-tipo').value = 'monto';
  document.getElementById('item-descuento').value = '0';
  actualizarAyudaDescuentoItem();

  if (documentoRelacionadoGroup) {
    documentoRelacionadoGroup.style.display = ['05', '06'].includes(tipoDte) ? 'block' : 'none';
  }
  if (documentoRelacionadoSelect) {
    documentoRelacionadoSelect.required = ['05', '06'].includes(tipoDte);
    documentoRelacionadoSelect.value = '';
  }
  actualizarSelectorDocumentoRelacionadoItem();
  
  modal.classList.add('active');
}

// Cerrar modal de item
function cerrarModalItem() {
  const modal = document.getElementById('modal-item');
  modal.classList.remove('active');
}

// Cuando se selecciona un producto, sugerir su precio para esta factura
document.addEventListener('DOMContentLoaded', () => {
  const productoSelect = document.getElementById('item-producto');
  const precioInput = document.getElementById('item-precio');
  const descuentoTipoSelect = document.getElementById('item-descuento-tipo');
  
  if (productoSelect && precioInput) {
    productoSelect.addEventListener('change', (e) => {
      const selectedOption = e.target.options[e.target.selectedIndex];
      if (selectedOption.value) {
        precioInput.value = selectedOption.dataset.precio;
      } else {
        precioInput.value = '';
      }
    });
  }

  if (descuentoTipoSelect) {
    descuentoTipoSelect.addEventListener('change', actualizarAyudaDescuentoItem);
  }
  
  // Manejar envío del formulario de item
  const formItem = document.getElementById('form-item');
  if (formItem) {
    formItem.addEventListener('submit', (e) => {
      e.preventDefault();
      agregarItemAFactura();
    });
  }
});

function actualizarAyudaDescuentoItem() {
  const tipo = document.getElementById('item-descuento-tipo')?.value || 'monto';
  const ayuda = document.getElementById('item-descuento-ayuda');
  const input = document.getElementById('item-descuento');
  if (ayuda) {
    ayuda.textContent = tipo === 'porcentaje'
      ? 'Ingrese el porcentaje de descuento para este ítem.'
      : 'Ingrese el monto de descuento para este ítem.';
  }
  if (input) {
    input.placeholder = tipo === 'porcentaje' ? '0.00%' : '0.00';
    input.max = tipo === 'porcentaje' ? '100' : '';
  }
}

function calcularDescuentoItem(cantidad, precioUnitario, valorDescuento, tipoDescuento) {
  const base = roundMoney(cantidad * precioUnitario);
  const valor = Number(valorDescuento || 0);

  if (!Number.isFinite(valor) || valor < 0) {
    return { error: 'Ingrese un descuento válido.', monto: 0 };
  }

  if (tipoDescuento === 'porcentaje') {
    if (valor > 100) {
      return { error: 'El porcentaje de descuento no puede ser mayor a 100%.', monto: 0 };
    }
    return { error: null, monto: roundMoney(base * (valor / 100)) };
  }

  if (valor > base) {
    return { error: 'El descuento no puede ser mayor al subtotal del ítem.', monto: 0 };
  }

  return { error: null, monto: roundMoney(valor) };
}

// Agregar item a la factura
function agregarItemAFactura() {
  const productoSelect = document.getElementById('item-producto');
  const selectedOption = productoSelect.options[productoSelect.selectedIndex];
  
  if (!selectedOption.value) {
    showNotification('Por favor seleccione un producto', 'error');
    return;
  }
  
  const cantidad = parseFloat(document.getElementById('item-cantidad').value);
  const precio = parseFloat(document.getElementById('item-precio').value);
  const tipoDescuento = document.getElementById('item-descuento-tipo')?.value || 'monto';
  const valorDescuento = parseFloat(document.getElementById('item-descuento').value) || 0;
  const tipoDte = document.getElementById('tipo-dte')?.value;
  const cliente = obtenerClienteSeleccionado();
  const numeroDocumentoRelacionado = document.getElementById('item-documento-relacionado')?.value || null;

  if (['05', '06'].includes(tipoDte) && !numeroDocumentoRelacionado) {
    showNotification(`Seleccione el CCF al que aplica este ítem de la ${obtenerNombreTipoDte(tipoDte)}.`, 'error');
    return;
  }

  if (!Number.isFinite(precio) || precio < 0) {
    showNotification('Ingrese un precio unitario válido para este ítem.', 'error');
    return;
  }

  if (!Number.isFinite(cantidad) || cantidad <= 0) {
    showNotification('Ingrese una cantidad válida para este ítem.', 'error');
    return;
  }

  const descuentoCalculado = calcularDescuentoItem(cantidad, precio, valorDescuento, tipoDescuento);
  if (descuentoCalculado.error) {
    showNotification(descuentoCalculado.error, 'error');
    return;
  }
  
  const item = {
    id: Date.now(), // ID temporal para el item
    productoId: parseInt(selectedOption.value),
    codigo: selectedOption.dataset.codigo,
    descripcion: selectedOption.dataset.descripcion,
    cantidad: cantidad,
    precioUnitario: precio,
    descuento: descuentoCalculado.monto,
    tipoDescuento,
    valorDescuento: roundMoney(valorDescuento),
    exento: itemEsExentoPorCliente({ exento: selectedOption.dataset.exento === '1' }, cliente, tipoDte),
    condicionIvaCliente: cliente?.condicion_iva || null,
    unidadMedida: selectedOption.dataset.unidadMedida,
    numeroDocumentoRelacionado
  };
  
  // Agregar a la lista de items
  state.currentFactura.items.push(item);
  
  // Actualizar tabla
  actualizarTablaItems();
  
  // Actualizar resumen
  actualizarResumenFactura();
  
  // Cerrar modal
  cerrarModalItem();
  
  showNotification('Producto agregado a la factura', 'success');
}

// Actualizar tabla de items
function actualizarTablaItems() {
  const tbody = document.getElementById('items-body');
  
  if (state.currentFactura.items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay items agregados</td></tr>';
    return;
  }
  
  tbody.innerHTML = state.currentFactura.items.map(item => {
    const subtotal = (item.cantidad * item.precioUnitario) - item.descuento;
    const iva = item.exento ? 0 : subtotal * 0.13;
    
    return `
      <tr>
        <td>
          <strong>${item.codigo}</strong><br>
          <small>${item.descripcion}</small>
          ${item.tipoDescuento === 'porcentaje' ? `<br><small>Desc.: ${item.valorDescuento}% (${formatCurrency(item.descuento || 0)})</small>` : ''}
          ${item.numeroDocumentoRelacionado ? `<br><small>Aplica a: ${item.numeroDocumentoRelacionado}</small>` : ''}
        </td>
        <td>${item.cantidad}</td>
        <td>${formatCurrency(item.precioUnitario)}</td>
        <td>${item.exento ? '<span class="badge badge-warning">Exento</span>' : formatCurrency(iva)}</td>
        <td><strong>${formatCurrency(subtotal)}</strong></td>
        <td>
          <button class="btn btn-small btn-danger" onclick="eliminarItemFactura(${item.id})">×</button>
        </td>
      </tr>
    `;
  }).join('');
}

// Eliminar item de la factura
window.eliminarItemFactura = function(itemId) {
  state.currentFactura.items = state.currentFactura.items.filter(item => item.id !== itemId);
  actualizarTablaItems();
  actualizarResumenFactura();
  showNotification('Producto eliminado de la factura', 'info');
};

// Hacer funciones globales
window.cerrarModalItem = cerrarModalItem;
window.abrirModalItem = abrirModalItem;

// ========== VISUALIZACIÓN Y ENVÍO DE FACTURAS ==========

function construirClienteDatosDTE(cliente) {
  return {
    tipo_documento: cliente.tipo_documento,
    numero_documento: cliente.numero_documento,
    nrc: cliente.nrc,
    nombre: cliente.nombre,
    nombre_comercial: cliente.nombre_comercial,
    condicion_iva: cliente.condicion_iva || 'GRAVADO',
    giro: cliente.giro,
    desc_actividad: cliente.giro ? obtenerDescripcionActividad(cliente.giro) : null,
    telefono: cliente.telefono,
    email: cliente.email,
    direccion: cliente.direccion,
    municipio: cliente.municipio,
    departamento: cliente.departamento,
    distrito: cliente.distrito,
    aplica_exportacion: cliente.aplica_exportacion,
    cod_pais: cliente.cod_pais,
    nombre_pais: cliente.nombre_pais,
    tipo_persona_exportacion: cliente.tipo_persona_exportacion,
    desc_actividad_exportacion: cliente.desc_actividad_exportacion,
    sujeto_excluido_domiciliado: cliente.sujeto_excluido_domiciliado === 0 ? 0 : 1
  };
}

function construirClienteDatosFactura(cliente) {
  return {
    tipo_documento: cliente.tipo_documento,
    numero_documento: cliente.numero_documento,
    nrc: cliente.nrc,
    nombre: cliente.nombre,
    nombre_comercial: cliente.nombre_comercial,
    condicion_iva: cliente.condicion_iva || 'GRAVADO',
    giro: cliente.giro,
    telefono: cliente.telefono,
    email: cliente.email,
    direccion: cliente.direccion,
    municipio: cliente.municipio,
    departamento: cliente.departamento,
    distrito: cliente.distrito,
    sujeto_excluido_domiciliado: cliente.sujeto_excluido_domiciliado === 0 ? 0 : 1
  };
}

function normalizarMunicipioDTE(departamento, municipio) {
  const depto = limpiarDocumentoFiscal(departamento).padStart(2, '0');
  const limpio = limpiarDocumentoFiscal(municipio);
  if (!limpio) return limpio;
  if (limpio.length >= 4 && limpio.startsWith(depto)) return limpio.slice(2, 4);
  if (limpio.length > 2) return limpio.slice(-2);
  return limpio.padStart(2, '0');
}

function construirDireccionReceptorDTE(clienteDte) {
  const complemento = String(clienteDte?.direccion || '').trim();
  if (complemento.length < 5) return null;

  return {
    departamento: clienteDte.departamento,
    municipio: normalizarMunicipioDTE(clienteDte.departamento, clienteDte.municipio),
    complemento
  };
}

function construirReceptorCorregido(tipoDte, cliente, montoTotalOperacion = 0) {
  const clienteDte = construirClienteDatosDTE(cliente);
  const tipoDocumento = clienteDte.tipo_documento || null;
  const numeroDocumento = limpiarDocumentoFiscal(clienteDte.numero_documento);
  const direccion = construirDireccionReceptorDTE(clienteDte);

  if (tipoDte === '01') {
    if (debeOmitirReceptorFactura(clienteDte, montoTotalOperacion)) return null;
    const esDui = tipoDocumento === '13';

    return {
      tipoDocumento,
      numDocumento: normalizarDocumentoReceptorDTE(tipoDocumento, clienteDte.numero_documento),
      nrc: tipoDocumento === '36' ? (limpiarDocumentoFiscal(clienteDte.nrc) || null) : null,
      nombre: clienteDte.nombre || null,
      codActividad: esDui ? null : (clienteDte.giro || null),
      descActividad: esDui ? null : (clienteDte.desc_actividad || null),
      direccion,
      telefono: clienteDte.telefono || null,
      correo: clienteDte.email || null
    };
  }

  if (['03', '05', '06'].includes(tipoDte)) {
    return {
      nit: numeroDocumento,
      nrc: limpiarDocumentoFiscal(clienteDte.nrc),
      nombre: clienteDte.nombre,
      codActividad: clienteDte.giro,
      descActividad: clienteDte.desc_actividad,
      nombreComercial: clienteDte.nombre_comercial || null,
      direccion,
      telefono: clienteDte.telefono || null,
      correo: clienteDte.email
    };
  }

  if (tipoDte === '07') {
    return {
      tipoDocumento,
      numDocumento: normalizarDocumentoRetencionDTE(tipoDocumento, clienteDte.numero_documento),
      nrc: limpiarDocumentoFiscal(clienteDte.nrc) || null,
      nombre: clienteDte.nombre,
      codActividad: clienteDte.giro,
      descActividad: clienteDte.desc_actividad,
      nombreComercial: clienteDte.nombre_comercial || null,
      direccion,
      telefono: clienteDte.telefono || null,
      correo: clienteDte.email
    };
  }

  if (tipoDte === '11') {
    return {
      tipoDocumento: tipoDocumento || '37',
      numDocumento: normalizarDocumentoReceptorDTE(tipoDocumento || '37', clienteDte.numero_documento),
      nombre: clienteDte.nombre,
      nombreComercial: clienteDte.nombre_comercial || null,
      codPais: clienteDte.cod_pais || '9300',
      nombrePais: clienteDte.nombre_pais || 'ESTADOS UNIDOS DE AMERICA',
      complemento: clienteDte.direccion || 'N/A',
      tipoPersona: Number(clienteDte.tipo_persona_exportacion || inferirTipoPersonaExportacion(cliente.tipo_persona)),
      descActividad: clienteDte.desc_actividad_exportacion || clienteDte.desc_actividad || 'Exportacion',
      telefono: clienteDte.telefono || null,
      correo: clienteDte.email
    };
  }

  return null;
}

function aplicarClienteCorregidoADTE(dteOriginal, factura, cliente) {
  const tipoDte = String(factura.tipo_dte || obtenerDTEContenido(dteOriginal)?.identificacion?.tipoDte || '').padStart(2, '0');
  const dte = JSON.parse(JSON.stringify(obtenerDTEContenido(dteOriginal)));
  limpiarFirmasDTE(dte);

  if (tipoDte === '14') {
    dte.sujetoExcluido = {
      tipoDocumento: cliente.tipo_documento || '36',
      numDocumento: normalizarDocumentoSujetoExcluidoDTE(cliente.tipo_documento || '36', cliente.numero_documento),
      nombre: cliente.nombre,
      codActividad: cliente.giro || null,
      descActividad: cliente.giro ? obtenerDescripcionActividad(cliente.giro) : null,
      direccion: {
        departamento: cliente.departamento,
        municipio: normalizarMunicipioDTE(cliente.departamento, cliente.municipio),
        complemento: cliente.direccion
      },
      telefono: cliente.telefono || null,
      correo: cliente.email || null
    };
  } else {
    dte.receptor = construirReceptorCorregido(tipoDte, cliente, dte.resumen?.montoTotalOperacion || dte.resumen?.totalPagar || factura.total);
  }

  preservarFechaEmisionDTE(dte, factura, obtenerDTEContenido(dteOriginal));
  return dte;
}

function editarClienteFacturaRechazada(facturaId) {
  const factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
  if (!factura) {
    showNotification('Factura no encontrada', 'error');
    return;
  }

  const cliente = state.clientes.find(c => Number(c.id) === Number(factura.cliente_id));
  if (!cliente) {
    showNotification('Cliente no encontrado para esta factura', 'error');
    return;
  }

  cerrarModalVerFactura();
  abrirModalCliente(cliente);
}

function obtenerItemsFacturaNormalizados(factura) {
  const items = typeof factura?.items === 'string' ? JSON.parse(factura.items || '[]') : (factura?.items || []);

  return items.map((item, index) => {
    const precioUnitario = Number(item.precioUnitario ?? item.precio_unitario ?? item.precioUni ?? 0);
    const unidadMedida = item.unidadMedida || item.unidad_medida || 'UND';
    return {
      id: item.id || Date.now() + index,
      productoId: item.productoId || item.producto_id || null,
      codigo: item.codigo || null,
      descripcion: item.descripcion || '',
      cantidad: Number(item.cantidad || 0),
      precioUnitario,
      precio_unitario: precioUnitario,
      descuento: Number(item.descuento ?? item.montoDescu ?? 0),
      tipoDescuento: item.tipoDescuento || 'monto',
      valorDescuento: Number(item.valorDescuento ?? item.descuento ?? item.montoDescu ?? 0),
      exento: Boolean(item.exento),
      condicionIvaCliente: item.condicionIvaCliente || null,
      unidadMedida,
      unidad_medida: unidadMedida,
      numeroDocumentoRelacionado: item.numeroDocumentoRelacionado || item.numero_documento || item.numeroDocumento || null,
      numero_documento: item.numeroDocumentoRelacionado || item.numero_documento || item.numeroDocumento || null,
      numeroDocumento: item.numeroDocumentoRelacionado || item.numero_documento || item.numeroDocumento || null
    };
  });
}

function construirResumenDteCorreccion(tipoDte, itemsFactura, factura, opciones = {}) {
  const resumen = calcularResumenFactura(itemsFactura);
  const totalesGuardados = obtenerTotalesFacturaDesdeDTE(obtenerDTEContenido(parseDTEGuardado(factura?.json_dte)), factura);
  const esFacturaConsumidorFinal = tipoDte === '01';
  const esDocumentoSinIva = ['11', '14'].includes(tipoDte);
  const totalGravadoDte = esFacturaConsumidorFinal
    ? roundMoney(resumen.subtotalGravado + resumen.totalIva)
    : resumen.subtotalGravado;
  const subtotalDte = esFacturaConsumidorFinal
    ? roundMoney(totalGravadoDte + resumen.subtotalExento)
    : resumen.subtotalTotal;
  const totalExportacion = tipoDte === '11'
    ? roundMoney(resumen.subtotalTotal + (opciones.flete || 0) + (opciones.seguro || 0))
    : null;
  const totalDte = tipoDte === '11'
    ? totalExportacion
    : (esDocumentoSinIva ? resumen.subtotalTotal : resumen.total);
  const ivaDte = esDocumentoSinIva ? 0 : resumen.totalIva;
  const resumenBaseRetencion = {
    totalGravada: totalGravadoDte,
    subTotal: subtotalDte,
    totalCompra: subtotalDte,
    montoTotalOperacion: roundMoney(totalDte),
    total: roundMoney(totalDte)
  };
  const ivaRete1 = ['01', '03', '14'].includes(tipoDte)
    ? limitarIvaRete1DTE(tipoDte, resumenBaseRetencion, totalesGuardados.ivaRete1 || 0)
    : 0;
  const ivaPerci1 = tipoDte === '03' ? roundMoney(totalesGuardados.ivaPerci1 || 0) : 0;
  const reteRenta = tipoDte === '14'
    ? roundMoney(subtotalDte * (obtenerPorcentajeRentaSujetoExcluido(obtenerClienteDataFactura(factura)) / 100))
    : 0;
  const totalPagarDte = roundMoney(Math.max(0, totalDte + ivaPerci1 - ivaRete1 - reteRenta));

  return {
    subtotal: subtotalDte,
    total: totalDte,
    iva: ivaDte,
    gravada: esDocumentoSinIva ? resumen.subtotalTotal : totalGravadoDte,
    exenta: resumen.subtotalExento,
    descuento: resumen.totalDescuentoCompleto,
    totalNoSuj: 0,
    totalExenta: resumen.subtotalExento,
    totalGravada: totalGravadoDte,
    subTotalVentas: subtotalDte,
    descuNoSuj: 0,
    descuExenta: resumen.descuentoGeneralDistribuido.exento,
    descuGravada: resumen.descuentoGeneralDistribuido.gravado,
    totalDescu: resumen.totalDescuentoCompleto,
    tributos: ivaDte > 0 ? [{
      codigo: '20',
      descripcion: 'Impuesto al Valor Agregado 13%',
      valor: ivaDte
    }] : null,
    subTotal: subtotalDte,
    ivaRete1,
    ivaPerci1: tipoDte === '03' ? ivaPerci1 : undefined,
    reteRenta,
    montoTotalOperacion: roundMoney(totalDte),
    totalNoGravado: 0,
    totalPagar: totalPagarDte,
    totalLetras: numeroALetras(totalPagarDte),
    condicionOperacion: Number(totalesGuardados.condicion_operacion || 1),
    pagos: [obtenerPagoDesdeCliente(obtenerClienteDataFactura(factura), totalPagarDte)],
    flete: tipoDte === '11' ? Number(opciones.flete || 0) : undefined,
    seguro: tipoDte === '11' ? Number(opciones.seguro || 0) : undefined,
    codIncoterms: tipoDte === '11' ? opciones.codIncoterms : undefined,
    descIncoterms: tipoDte === '11' ? opciones.descIncoterms : undefined
  };
}

function obtenerOpcionesCorreccionDesdeDTE(factura, dte) {
  const tipoDte = String(factura.tipo_dte || dte?.identificacion?.tipoDte || '').padStart(2, '0');
  const resumen = dte?.resumen || {};
  const opciones = {
    tipoTransmision: 1,
    tipoContingencia: null,
    documentoRelacionado: dte?.documentoRelacionado || null,
    apendice: dte?.apendice || construirApendiceNotas(factura.notas || '')
  };

  if (tipoDte === '11') {
    opciones.tipoItemExpor = Number(dte?.emisor?.tipoItemExpor || 2);
    opciones.codIncoterms = resumen.codIncoterms || null;
    opciones.descIncoterms = resumen.descIncoterms || null;
    opciones.flete = Number(resumen.flete || 0);
    opciones.seguro = Number(resumen.seguro || 0);
    opciones.recintoFiscal = dte?.emisor?.recintoFiscal || null;
    opciones.regimen = dte?.emisor?.regimen || null;
  }

  return opciones;
}

function obtenerTotalesFacturaDesdeDTE(dte, fallback = {}) {
  const resumen = dte?.resumen || {};
  const iva = roundMoney(
    resumen.totalIva ??
    (Array.isArray(resumen.tributos)
      ? resumen.tributos.reduce((sum, tributo) => sum + Number(tributo?.valor || 0), 0)
      : fallback.iva || 0)
  );

  return {
    subtotal: roundMoney(resumen.subTotal ?? resumen.subTotalVentas ?? resumen.totalGravada ?? fallback.subtotal ?? 0),
    iva,
    total: roundMoney(resumen.totalPagar ?? resumen.montoTotalOperacion ?? fallback.total ?? 0),
    descuento: roundMoney(resumen.totalDescu ?? fallback.descuento ?? 0),
    ivaRete1: roundMoney(resumen.ivaRete1 ?? 0),
    ivaPerci1: roundMoney(resumen.ivaPerci1 ?? 0),
    reteRenta: roundMoney(resumen.reteRenta ?? 0),
    retencion: roundMoney(resumen.totalIVAretenido ?? resumen.ivaRete1 ?? fallback.retencion ?? 0),
    condicion_operacion: Number(resumen.condicionOperacion || fallback.condicion_operacion || 1)
  };
}

function validarIvaRete1DTE(dte, cliente, aplicarRetencion) {
  const resumen = dte?.resumen || {};
  if (esClienteGenericoFactura(cliente)) {
    return {
      valido: true,
      ivaRete1: 0,
      mensaje: aplicarRetencion
        ? 'CLIENTES VARIOS no admite retención IVA en Factura; se guardará en 0.'
        : null
    };
  }

  const esperado = aplicarRetencion ? calcularIvaRete1DesdeResumenDTE(resumen) : 0;
  if (aplicarRetencion && esperado <= 0) {
    return {
      valido: false,
      mensaje: 'No se puede aplicar retención IVA porque el DTE no tiene venta gravada.'
    };
  }

  return {
    valido: true,
    ivaRete1: esperado,
    mensaje: null
  };
}

function aplicarAjustesIvaADTE(dte, ajustes = {}) {
  const copia = JSON.parse(JSON.stringify(obtenerDTEContenido(dte)));
  limpiarFirmasDTE(copia);

  const resumen = copia.resumen || {};
  const tipoDte = String(copia.identificacion?.tipoDte || '').padStart(2, '0');
  const ivaRete1 = tipoDte === '14' ? 0 : roundMoney(ajustes.ivaRete1 || 0);
  const errorMaximoIvaRete1 = validarMaximoIvaRete1DTE(tipoDte, resumen, ivaRete1);
  if (errorMaximoIvaRete1) {
    throw new Error(errorMaximoIvaRete1);
  }
  const ivaPerci1 = tipoDte === '03' ? roundMoney(ajustes.ivaPerci1 || 0) : 0;
  const montoTotalOperacion = roundMoney(tipoDte === '14'
    ? (resumen.subTotal ?? resumen.totalCompra ?? resumen.totalPagar ?? 0)
    : (resumen.montoTotalOperacion ?? resumen.totalPagar ?? 0));
  const reteRenta = tipoDte === '14' ? roundMoney(ajustes.reteRenta || 0) : roundMoney(resumen.reteRenta || 0);
  const totalPagar = roundMoney(Math.max(0, montoTotalOperacion + ivaPerci1 - ivaRete1 - reteRenta));

  resumen.ivaRete1 = ivaRete1;
  resumen.reteRenta = reteRenta;
  if (tipoDte === '03') {
    resumen.ivaPerci1 = ivaPerci1;
  } else {
    delete resumen.ivaPerci1;
  }
  resumen.totalPagar = totalPagar;
  resumen.totalLetras = numeroALetras(totalPagar);

  if (Array.isArray(resumen.pagos) && resumen.pagos.length > 0) {
    if (resumen.pagos.length === 1) {
      resumen.pagos[0].montoPago = totalPagar;
    } else {
      resumen.pagos = resumen.pagos.map((pago, index) => ({
        ...pago,
        montoPago: index === 0 ? totalPagar : 0
      }));
    }
  }

  copia.resumen = resumen;
  return copia;
}

async function regenerarDTEFacturaCorregida(factura, cliente, itemsFactura) {
  const tipoDte = String(factura.tipo_dte || '').padStart(2, '0');
  const dteOriginal = obtenerDTEContenido(parseDTEGuardado(factura.json_dte));
  const opciones = obtenerOpcionesCorreccionDesdeDTE(factura, dteOriginal);
  const resumenDte = construirResumenDteCorreccion(tipoDte, itemsFactura, factura, opciones);
  const errorMaximoIvaRete1 = validarMaximoIvaRete1DTE(tipoDte, resumenDte, resumenDte.ivaRete1);
  if (errorMaximoIvaRete1) {
    throw new Error(errorMaximoIvaRete1);
  }

  const resultadoDte = await window.electronAPI.generarDTE({
    tipo: tipoDte,
    config: {
      ...state.configuracion,
      desc_actividad: obtenerDescripcionActividad(state.configuracion.actividad_economica)
    },
    cliente: construirClienteDatosDTE(cliente),
    items: itemsFactura,
    resumen: resumenDte,
    opciones
  });

  if (!resultadoDte.success) {
    throw new Error(resultadoDte.error || 'No se pudo regenerar el DTE corregido.');
  }

  const dteCorregido = resultadoDte.dte;
  preservarFechaEmisionDTE(dteCorregido, factura, dteOriginal);
  normalizarDocumentosReceptorDTE(dteCorregido);

  return {
    dte: dteCorregido,
    totales: obtenerTotalesFacturaDesdeDTE(dteCorregido, factura)
  };
}

function renderFacturaItemsDetalle(factura, editable = false) {
  const items = obtenerItemsFacturaNormalizados(factura);
  const tbody = document.getElementById('factura-items-body');
  const ivaHeader = document.getElementById('factura-items-col-iva');
  if (!tbody) return;
  if (ivaHeader) ivaHeader.textContent = editable ? 'Descuento' : 'IVA';

  if (!items.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay ítems en este documento</td></tr>';
    return;
  }

  tbody.innerHTML = items.map((item, index) => {
    const subtotal = roundMoney((item.cantidad * item.precioUnitario) - (item.descuento || 0));
    const iva = item.exento ? 0 : roundMoney(subtotal * 0.13);

    if (editable) {
      return `
        <tr>
          <td>
            <strong>${escaparHtml(item.codigo || 'N/A')}</strong><br>
            <small>${escaparHtml(item.descripcion)}</small>
            ${item.tipoDescuento === 'porcentaje' ? `<br><small>Desc.: ${item.valorDescuento}% (${formatCurrency(item.descuento || 0)})</small>` : ''}
            ${item.numeroDocumentoRelacionado ? `<br><small>Aplica a: ${escaparHtml(item.numeroDocumentoRelacionado)}</small>` : ''}
          </td>
          <td><input type="number" class="table-input factura-item-cantidad" data-index="${index}" min="0.00000001" step="0.00000001" value="${item.cantidad}"></td>
          <td><input type="number" class="table-input factura-item-precio" data-index="${index}" min="0" step="0.00000001" value="${item.precioUnitario}"></td>
          <td>
            <select class="table-input factura-item-descuento-tipo" data-index="${index}">
              <option value="monto" ${item.tipoDescuento !== 'porcentaje' ? 'selected' : ''}>$</option>
              <option value="porcentaje" ${item.tipoDescuento === 'porcentaje' ? 'selected' : ''}>%</option>
            </select>
            <input type="number" class="table-input factura-item-descuento" data-index="${index}" min="0" step="0.01" value="${item.tipoDescuento === 'porcentaje' ? (item.valorDescuento || 0) : (item.descuento || 0)}">
          </td>
          <td><strong>${formatCurrency(subtotal)}</strong></td>
        </tr>
      `;
    }

    return `
      <tr>
        <td>
          <strong>${escaparHtml(item.codigo || 'N/A')}</strong><br>
          <small>${escaparHtml(item.descripcion)}</small>
          ${item.tipoDescuento === 'porcentaje' ? `<br><small>Desc.: ${item.valorDescuento}% (${formatCurrency(item.descuento || 0)})</small>` : ''}
          ${item.numeroDocumentoRelacionado ? `<br><small>Aplica a: ${escaparHtml(item.numeroDocumentoRelacionado)}</small>` : ''}
        </td>
        <td>${item.cantidad}</td>
        <td>${formatCurrency(item.precioUnitario)}</td>
        <td>${item.exento ? '<span class="badge badge-warning">Exento</span>' : formatCurrency(iva)}</td>
        <td><strong>${formatCurrency(subtotal)}</strong></td>
      </tr>
    `;
  }).join('');
}

function editarItemsFacturaRechazada(facturaId) {
  const factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
  if (!factura) {
    showNotification('Factura no encontrada', 'error');
    return;
  }

  renderFacturaItemsDetalle(factura, true);
  document.getElementById('btn-editar-items-factura').style.display = 'none';
  document.getElementById('btn-guardar-items-factura').style.display = 'inline-flex';
  document.getElementById('btn-guardar-items-factura').onclick = () => guardarItemsFacturaRechazada(facturaId);
}

async function guardarItemsFacturaRechazada(facturaId) {
  try {
    let factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
    if (!factura) {
      showNotification('Factura no encontrada', 'error');
      return false;
    }

    const cliente = state.clientes.find(c => Number(c.id) === Number(factura.cliente_id));
    if (!cliente) {
      showNotification('Cliente no encontrado para regenerar el DTE.', 'error');
      return false;
    }

    const items = obtenerItemsFacturaNormalizados(factura).map((item, index) => {
      const cantidad = Number(document.querySelector(`.factura-item-cantidad[data-index="${index}"]`)?.value || 0);
      const precioUnitario = Number(document.querySelector(`.factura-item-precio[data-index="${index}"]`)?.value || 0);
      const tipoDescuento = document.querySelector(`.factura-item-descuento-tipo[data-index="${index}"]`)?.value || 'monto';
      const valorDescuento = Number(document.querySelector(`.factura-item-descuento[data-index="${index}"]`)?.value || 0);
      const descuentoCalculado = calcularDescuentoItem(cantidad, precioUnitario, valorDescuento, tipoDescuento);
      return {
        ...item,
        cantidad,
        precioUnitario,
        precio_unitario: precioUnitario,
        descuento: descuentoCalculado.monto,
        tipoDescuento,
        valorDescuento: roundMoney(valorDescuento),
        numero_documento: item.numeroDocumentoRelacionado || item.numero_documento || item.numeroDocumento || null,
        numeroDocumento: item.numeroDocumentoRelacionado || item.numero_documento || item.numeroDocumento || null
      };
    });

    const itemInvalido = items.find(item => {
      const subtotal = (item.cantidad * item.precioUnitario) - item.descuento;
      const descuentoCalculado = calcularDescuentoItem(item.cantidad, item.precioUnitario, item.valorDescuento, item.tipoDescuento);
      return !Number.isFinite(item.cantidad) || item.cantidad <= 0 ||
        !Number.isFinite(item.precioUnitario) || item.precioUnitario < 0 ||
        !Number.isFinite(item.descuento) || item.descuento < 0 ||
        subtotal < 0 ||
        Boolean(descuentoCalculado.error);
    });

    if (itemInvalido) {
      showNotification('Revise cantidad, precio y descuento. El subtotal de cada ítem debe ser mayor o igual a cero.', 'error');
      return false;
    }

    showNotification('Regenerando DTE con los ítems corregidos...', 'info');
    const { dte, totales } = await regenerarDTEFacturaCorregida(factura, cliente, items);

    await window.electronAPI.updateFacturaCorreccion(facturaId, {
      estado: 'RECHAZADO',
      observaciones: 'Ítems corregidos. Presione Reenviar Documento para firmar y enviar nuevamente.',
      cliente_datos: construirClienteDatosFactura(cliente),
      items,
      numero_control: dte.identificacion.numeroControl,
      codigo_generacion: dte.identificacion.codigoGeneracion,
      total: totales.total,
      json_dte: dte
    });

    await loadFacturas();
    factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
    if (factura) abrirModalVerFactura(factura);
    showNotification('Ítems actualizados. Ahora puede presionar Reenviar Documento.', 'success');
    return true;
  } catch (error) {
    console.error('Error guardando ítems corregidos:', error);
    showNotification('Error al guardar ítems corregidos: ' + error.message, 'error');
    return false;
  }
}

function editarRetencionFacturaRechazada(facturaId) {
  const factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
  if (!factura) {
    showNotification('Factura no encontrada', 'error');
    return;
  }

  const dte = obtenerDTEContenido(parseDTEGuardado(factura.json_dte));
  const resumen = dte.resumen || {};
  const tipoDte = String(factura.tipo_dte || dte.identificacion?.tipoDte || '').padStart(2, '0');

  const retencionEditor = document.getElementById('factura-iva-retenido-editor');
  const percepcionEditor = document.getElementById('factura-iva-percibido-editor');
  const rentaEditor = document.getElementById('factura-renta-retenida-editor');
  const retencionInput = document.getElementById('factura-iva-retenido-input');
  const percepcionInput = document.getElementById('factura-iva-percibido-input');
  const rentaInput = document.getElementById('factura-renta-retenida-input');
  const btnEditar = document.getElementById('btn-editar-retencion-factura');
  const btnGuardar = document.getElementById('btn-guardar-retencion-factura');
  const cliente = state.clientes.find(c => Number(c.id) === Number(factura.cliente_id)) || obtenerClienteDataFactura(factura);
  const porcentajeRenta = obtenerPorcentajeRentaSujetoExcluido(cliente);
  const montoBaseRenta = roundMoney(resumen.subTotal ?? resumen.totalCompra ?? resumen.montoTotalOperacion ?? 0);
  const rentaCalculada = tipoDte === '14' ? roundMoney(montoBaseRenta * (porcentajeRenta / 100)) : roundMoney(resumen.reteRenta || 0);

  if (retencionEditor) retencionEditor.style.display = '';
  if (percepcionEditor) percepcionEditor.style.display = tipoDte === '03' ? '' : 'none';
  if (rentaEditor) rentaEditor.style.display = tipoDte === '14' ? '' : 'none';
  if (retencionInput) {
    const maximoIvaRete1 = obtenerMaximoIvaRete1DTE(tipoDte, resumen);
    retencionInput.value = String(roundMoney(resumen.ivaRete1 || 0));
    retencionInput.max = String(maximoIvaRete1);
    retencionInput.title = maximoIvaRete1 > 0
      ? `Máximo permitido: ${formatCurrency(maximoIvaRete1)}`
      : '';
  }
  if (percepcionInput) percepcionInput.value = String(roundMoney(resumen.ivaPerci1 || 0));
  if (rentaInput) {
    rentaInput.value = String(rentaCalculada);
    rentaInput.readOnly = tipoDte === '14';
    rentaInput.title = tipoDte === '14' ? `Calculado automáticamente al ${porcentajeRenta}%` : '';
  }
  if (btnEditar) btnEditar.style.display = 'none';
  if (btnGuardar) {
    btnGuardar.style.display = 'inline-flex';
    btnGuardar.onclick = () => guardarRetencionFacturaRechazada(facturaId);
  }
}

async function guardarRetencionFacturaRechazada(facturaId) {
  try {
    const factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
    if (!factura) {
      showNotification('Factura no encontrada', 'error');
      return false;
    }

    const dte = obtenerDTEContenido(parseDTEGuardado(factura.json_dte));
    const tipoDte = String(factura.tipo_dte || dte.identificacion?.tipoDte || '').padStart(2, '0');
    const ajustes = {
      ivaRete1: roundMoney(Number(document.getElementById('factura-iva-retenido-input')?.value || 0)),
      ivaPerci1: tipoDte === '03'
        ? roundMoney(Number(document.getElementById('factura-iva-percibido-input')?.value || 0))
        : 0,
      reteRenta: tipoDte === '14'
        ? roundMoney((dte.resumen?.subTotal ?? dte.resumen?.totalCompra ?? 0) * (obtenerPorcentajeRentaSujetoExcluido(state.clientes.find(c => Number(c.id) === Number(factura.cliente_id)) || obtenerClienteDataFactura(factura)) / 100))
        : 0
    };

    if (!['01', '03', '14'].includes(tipoDte)) {
      showNotification('Este tipo de documento no permite editar retención/percepción desde esta vista.', 'error');
      return false;
    }

    const dteCorregido = aplicarAjustesIvaADTE(dte, ajustes);
    const total = roundMoney(dteCorregido.resumen?.totalPagar ?? factura.total ?? 0);

    await window.electronAPI.updateFacturaCorreccion(facturaId, {
      estado: 'RECHAZADO',
      observaciones: tipoDte === '14'
        ? 'Retenciones de Sujeto Excluido corregidas. Presione Reenviar Documento para firmar y enviar nuevamente.'
        : tipoDte === '03'
        ? 'Retención/percepción IVA corregida. Presione Reenviar Documento para firmar y enviar nuevamente.'
        : 'Retención IVA corregida. Presione Reenviar Documento para firmar y enviar nuevamente.',
      total,
      json_dte: dteCorregido
    });

    await loadFacturas();
    const actualizada = state.facturas.find(f => Number(f.id) === Number(facturaId));
    if (actualizada) abrirModalVerFactura(actualizada);

    showNotification(tipoDte === '14'
      ? 'Retenciones actualizadas. Ahora puede presionar Reenviar Documento.'
      : tipoDte === '03'
      ? 'Retención/percepción actualizada. Ahora puede presionar Reenviar Documento.'
      : 'Retención actualizada. Ahora puede presionar Reenviar Documento.', 'success');
    return true;
  } catch (error) {
    console.error('Error guardando retención corregida:', error);
    showNotification('Error al guardar retención: ' + error.message, 'error');
    return false;
  }
}

async function reenviarFacturaCorregida(facturaId) {
  try {
    iniciarProcesoEnvio('Reenvío de documento corregido', [
      'Aplicando datos corregidos del cliente',
      'Actualizando JSON DTE',
      'Firmando documento corregido',
      'Reenviando a Hacienda',
      'Esperando respuesta de Hacienda',
      'Aprobado por Hacienda'
    ]);
    await avanzarProcesoEnvio('Aplicando datos corregidos del cliente...');

    let factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
    if (!factura) {
      await finalizarProcesoEnvio('No se encontró la factura para reenviar.', 'error');
      showNotification('Factura no encontrada', 'error');
      return false;
    }

    const cliente = state.clientes.find(c => Number(c.id) === Number(factura.cliente_id));
    if (!cliente) {
      await finalizarProcesoEnvio('No se encontró el cliente de la factura.', 'error');
      showNotification('Cliente no encontrado. Corrija o asigne el cliente antes de reenviar.', 'error');
      return false;
    }

    const errorReceptor = validarReceptorParaHacienda(factura.tipo_dte, cliente, state.configuracion, factura.total);
    if (errorReceptor) {
      await finalizarProcesoEnvio('El cliente corregido aún no cumple validación.', 'error');
      showNotification(errorReceptor, 'error');
      return false;
    }

    await avanzarProcesoEnvio('Actualizando JSON DTE con la información corregida...');
    const itemsFactura = obtenerItemsFacturaNormalizados(factura);
    const { dte: dteCorregido, totales } = await regenerarDTEFacturaCorregida(factura, cliente, itemsFactura);
    await window.electronAPI.updateFacturaCorreccion(facturaId, {
      estado: 'PENDIENTE',
      observaciones: 'Documento corregido. Pendiente de reenvío.',
      cliente_datos: construirClienteDatosFactura(cliente),
      items: itemsFactura,
      numero_control: dteCorregido.identificacion.numeroControl,
      codigo_generacion: dteCorregido.identificacion.codigoGeneracion,
      total: totales.total,
      json_dte: dteCorregido
    });

    showNotification('Datos del cliente aplicados al DTE. Firmando nuevamente...', 'info');
    await loadFacturas();
    await avanzarProcesoEnvio('Firmando nuevamente el documento corregido...');
    const firmada = await firmarFactura(facturaId, { cerrarModal: false, progreso: false });
    if (!firmada) {
      await finalizarProcesoEnvio('No se pudo firmar el documento corregido.', 'error');
      return false;
    }

    await loadFacturas();
    return await enviarFacturaHacienda(facturaId, { confirmar: false });
  } catch (error) {
    console.error('Error reenviando factura corregida:', error);
    await finalizarProcesoEnvio('El reenvío se detuvo por un error inesperado.', 'error');
    showNotification('Error al reenviar documento: ' + error.message, 'error');
    return false;
  }
}

window.reenviarFacturaCorregida = reenviarFacturaCorregida;
window.editarItemsFacturaRechazada = editarItemsFacturaRechazada;
window.guardarItemsFacturaRechazada = guardarItemsFacturaRechazada;
window.editarRetencionFacturaRechazada = editarRetencionFacturaRechazada;
window.guardarRetencionFacturaRechazada = guardarRetencionFacturaRechazada;

// Abrir modal para ver detalle de factura
function abrirModalVerFactura(factura) {
  const modal = document.getElementById('modal-ver-factura');
  
  // Información de la factura
  document.getElementById('factura-numero-control').textContent = factura.numero_control || 'N/A';
  document.getElementById('factura-codigo-generacion').textContent = factura.codigo_generacion || 'N/A';
  
  // Sello de recepción de Hacienda (si existe)
  const selloElement = document.getElementById('factura-sello-recepcion');
  if (factura.sello_recepcion) {
    selloElement.textContent = factura.sello_recepcion;
    selloElement.style.color = '#28a745';
    selloElement.style.fontWeight = 'bold';
  } else {
    selloElement.textContent = 'Pendiente de envío a Hacienda';
    selloElement.style.color = '#6c757d';
    selloElement.style.fontWeight = 'normal';
  }
  
  document.getElementById('factura-fecha').textContent = formatDate(factura.fecha_emision);
  
  // Badge de estado
  const estadoVisual = obtenerEstadoFacturaVisual(factura);
  const estadoBadge = `<span class="badge badge-${getEstadoBadgeClass(estadoVisual)}">${estadoVisual}</span>`;
  document.getElementById('factura-estado-badge').innerHTML = estadoBadge;

  const observacionesRow = document.getElementById('factura-observaciones-row');
  const observacionesElement = document.getElementById('factura-observaciones');
  if (observacionesRow && observacionesElement) {
    const observaciones = formatearObservacionesFactura(factura.observaciones);
    observacionesRow.style.display = observaciones ? '' : 'none';
    observacionesElement.textContent = observaciones;
  }

  renderBitacoraRechazo(factura);
  renderRespuestaContingencia(factura);

  const notasDetalle = document.getElementById('factura-notas-detalle');
  const notasTexto = document.getElementById('factura-notas-texto');
  if (notasDetalle && notasTexto) {
    const notas = obtenerNotasFacturaGuardada(factura);
    notasDetalle.style.display = notas ? '' : 'none';
    notasTexto.textContent = notas;
  }
  
  // Información del cliente
  const clienteData = typeof factura.cliente_datos === 'string' 
    ? JSON.parse(factura.cliente_datos) 
    : factura.cliente_datos;
  
  document.getElementById('factura-cliente-nombre').textContent = clienteData.nombre || 'N/A';
  document.getElementById('factura-cliente-documento').textContent = clienteData.numero_documento || 'N/A';
  document.getElementById('factura-cliente-direccion').textContent = clienteData.direccion || 'N/A';
  
  // Items de la factura
  renderFacturaItemsDetalle(factura);
  
  // Resumen
  const dteFactura = obtenerDTEContenido(parseDTEGuardado(factura.json_dte));
  const totalesFactura = obtenerTotalesFacturaDesdeDTE(dteFactura, factura);
  document.getElementById('factura-subtotal').textContent = formatCurrency(totalesFactura.subtotal);
  document.getElementById('factura-iva').textContent = formatCurrency(totalesFactura.iva);
  const ivaRetenidoRow = document.getElementById('factura-iva-retenido-row');
  const ivaRetenidoElement = document.getElementById('factura-iva-retenido');
  const ivaRetenidoEditor = document.getElementById('factura-iva-retenido-editor');
  const ivaPercibidoRow = document.getElementById('factura-iva-percibido-row');
  const ivaPercibidoElement = document.getElementById('factura-iva-percibido');
  const ivaPercibidoEditor = document.getElementById('factura-iva-percibido-editor');
  const rentaRetenidaRow = document.getElementById('factura-renta-retenida-row');
  const rentaRetenidaElement = document.getElementById('factura-renta-retenida');
  const rentaRetenidaEditor = document.getElementById('factura-renta-retenida-editor');
  const tipoDteFacturaDetalle = String(factura.tipo_dte || dteFactura.identificacion?.tipoDte || '').padStart(2, '0');
  if (ivaRetenidoRow && ivaRetenidoElement) {
    const mostrarRetencionDetalle = ['01', '03', '14'].includes(tipoDteFacturaDetalle);
    ivaRetenidoRow.style.display = mostrarRetencionDetalle ? '' : 'none';
    ivaRetenidoElement.textContent = formatCurrency(totalesFactura.ivaRete1 || 0);
  }
  if (ivaPercibidoRow && ivaPercibidoElement) {
    ivaPercibidoRow.style.display = tipoDteFacturaDetalle === '03' ? '' : 'none';
    ivaPercibidoElement.textContent = formatCurrency(totalesFactura.ivaPerci1 || 0);
  }
  if (rentaRetenidaRow && rentaRetenidaElement) {
    rentaRetenidaRow.style.display = tipoDteFacturaDetalle === '14' ? '' : 'none';
    rentaRetenidaElement.textContent = formatCurrency(totalesFactura.reteRenta || 0);
  }
  if (ivaRetenidoEditor) ivaRetenidoEditor.style.display = 'none';
  if (ivaPercibidoEditor) ivaPercibidoEditor.style.display = 'none';
  if (rentaRetenidaEditor) rentaRetenidaEditor.style.display = 'none';
  document.getElementById('factura-total').textContent = formatCurrency(totalesFactura.total);
  
  // Mostrar botones según el estado
  const btnFirmar = document.getElementById('btn-firmar-factura');
  const btnEnviar = document.getElementById('btn-enviar-factura');
  const btnAnular = document.getElementById('btn-anular-factura');
  const btnDescargarPDF = document.getElementById('btn-descargar-pdf');
  const btnImprimirPDF = document.getElementById('btn-imprimir-pdf');
  const btnEnviarCorreo = document.getElementById('btn-enviar-correo');
  const btnVerJson = document.getElementById('btn-ver-json');
  const btnGuardarJson = document.getElementById('btn-guardar-json');
  const btnEditarClienteFactura = document.getElementById('btn-editar-cliente-factura');
  const btnEditarItemsFactura = document.getElementById('btn-editar-items-factura');
  const btnGuardarItemsFactura = document.getElementById('btn-guardar-items-factura');
  const btnEditarRetencionFactura = document.getElementById('btn-editar-retencion-factura');
  const btnGuardarRetencionFactura = document.getElementById('btn-guardar-retencion-factura');
  const btnReenviarFactura = document.getElementById('btn-reenviar-factura');
  const estadoFactura = estadoVisual;
  const tieneSelloRecepcion = Boolean(factura.sello_recepcion) && !facturaTieneObservacionDocumentoInvalido(factura);
  
  btnFirmar.style.display = 'none';
  btnEnviar.style.display = 'none';
  if (btnAnular) btnAnular.style.display = 'none';
  if (btnVerJson) btnVerJson.style.display = 'none';
  if (btnGuardarJson) btnGuardarJson.style.display = 'none';
  if (btnDescargarPDF) btnDescargarPDF.style.display = 'none';
  if (btnImprimirPDF) btnImprimirPDF.style.display = 'none';
  if (btnEnviarCorreo) btnEnviarCorreo.style.display = 'none';
  if (btnEditarClienteFactura) btnEditarClienteFactura.style.display = 'none';
  if (btnEditarItemsFactura) btnEditarItemsFactura.style.display = 'none';
  if (btnGuardarItemsFactura) btnGuardarItemsFactura.style.display = 'none';
  if (btnEditarRetencionFactura) btnEditarRetencionFactura.style.display = 'none';
  if (btnGuardarRetencionFactura) btnGuardarRetencionFactura.style.display = 'none';
  if (btnReenviarFactura) btnReenviarFactura.style.display = 'none';
  btnEnviar.onclick = null;
  btnEnviar.textContent = '📤 Enviar a Hacienda';
  
  if (estadoFactura === 'PENDIENTE') {
    btnFirmar.style.display = 'inline-flex';
    btnFirmar.onclick = () => firmarFactura(factura.id);
  }
  
  if (estadoFactura === 'FIRMADO' && !tieneSelloRecepcion) {
    btnEnviar.style.display = 'inline-flex';
    btnEnviar.onclick = () => enviarFacturaHacienda(factura.id);
  }

  if (estadoFactura === 'CONTINGENCIA' && !tieneSelloRecepcion) {
    btnEnviar.style.display = 'inline-flex';
    btnEnviar.textContent = 'Procesar Contingencia';
    btnEnviar.onclick = () => procesarContingenciaFactura(factura.id);
  }

  if (estadoFactura === 'ENVIADO' && btnAnular && facturaPuedeAnularsePorPlazo(factura)) {
    btnAnular.style.display = 'inline-flex';
    btnAnular.onclick = () => anularFacturaHacienda(factura.id);
  }

  if (estadoFactura === 'RECHAZADO' && !tieneSelloRecepcion) {
    if (facturaPuedePasarAContingencia(factura)) {
      btnEnviar.style.display = 'inline-flex';
      btnEnviar.textContent = 'Pasar a Contingencia';
      btnEnviar.onclick = () => convertirRechazoConexionAContingencia(factura.id);
    }

    if (btnEditarClienteFactura) {
      btnEditarClienteFactura.style.display = 'inline-flex';
      btnEditarClienteFactura.onclick = () => editarClienteFacturaRechazada(factura.id);
    }

    if (btnReenviarFactura &&
      !facturaPuedePasarAContingencia(factura)) {
      btnReenviarFactura.style.display = 'inline-flex';
      btnReenviarFactura.onclick = () => reenviarFacturaCorregida(factura.id);
    }

    if (btnEditarItemsFactura) {
      btnEditarItemsFactura.style.display = 'inline-flex';
      btnEditarItemsFactura.onclick = () => editarItemsFacturaRechazada(factura.id);
    }

    if (btnEditarRetencionFactura && ['01', '03', '14'].includes(tipoDteFacturaDetalle)) {
      btnEditarRetencionFactura.style.display = 'inline-flex';
      btnEditarRetencionFactura.onclick = () => editarRetencionFacturaRechazada(factura.id);
    }
  }
  
  // El PDF y JSON fiscal se generan en memoria para correo; no se guardan como archivos.
  if (factura.json_dte && tieneSelloRecepcion) {
    if (btnVerJson) {
      btnVerJson.style.display = 'inline-flex';
      btnVerJson.onclick = () => verJsonDTE(factura);
    }

    if (btnDescargarPDF) {
      btnDescargarPDF.style.display = 'inline-flex';
      btnDescargarPDF.textContent = '📄 Generar PDF';
      btnDescargarPDF.onclick = () => descargarPDFFactura(factura);
    }

    if (btnEnviarCorreo && facturaPuedeEnviarsePorCorreo({
      ...factura,
      estado: estadoFactura,
      sello_recepcion: factura.sello_recepcion
    })) {
      btnEnviarCorreo.style.display = 'inline-flex';
      btnEnviarCorreo.onclick = () => abrirModalCorreo(factura);
    }
  }
  
  modal.classList.add('active');
}

// Cerrar modal de ver factura
function cerrarModalVerFactura() {
  const modal = document.getElementById('modal-ver-factura');
  modal.classList.remove('active');
}

// Firmar factura
async function firmarFactura(facturaId, opciones = {}) {
  try {
    const factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
    if (!factura) {
      showNotification('Factura no encontrada', 'error');
      return false;
    }
    
    // Verificar configuración
    if (!state.configuracion) {
      showNotification('Por favor configure los datos de la empresa primero', 'error');
      return false;
    }
    
    // Verificar tipo de firma configurado
    const tipoFirma = state.configuracion.tipo_firma || 'svfe';
    
    if (state.configuracion.certificado_path && state.configuracion.certificado_password) {
      // Usar firmador interno con certificado local
      return await firmarConCertificadoLocal(facturaId, opciones);
    } else if (tipoFirma === 'svfe' && state.configuracion.firmador_pin) {
      return await firmarConFirmadorSVFE(facturaId, opciones);
    } else if (tipoFirma === 'web' && state.configuracion.firmador_usuario && state.configuracion.firmador_password) {
      // Usar firmador web con credenciales guardadas
      return await firmarConFirmadorWeb(facturaId, opciones);
    } else {
      // Si no hay credenciales completas, abrir modal para pedirlas
      const modal = document.getElementById('modal-firmador');
      document.getElementById('firmador-factura-id').value = facturaId;
      document.getElementById('form-firmador').reset();
      
      // Pre-llenar con credenciales guardadas si existen
      if (state.configuracion.firmador_usuario) {
        document.getElementById('firmador-usuario').value = state.configuracion.firmador_usuario;
      }
      if (state.configuracion.firmador_password) {
        document.getElementById('firmador-password').value = state.configuracion.firmador_password;
      }
      if (state.configuracion.firmador_pin) {
        document.getElementById('firmador-pin').value = state.configuracion.firmador_pin;
      }
      
      modal.classList.add('active');
      return false;
    }
  } catch (error) {
    console.error('Error al firmar factura:', error);
    showNotification('Error al firmar factura: ' + error.message, 'error');
    return false;
  }
}

// Firmar con certificado local automáticamente
async function firmarConCertificadoLocal(facturaId, opciones = {}) {
  try {
    const factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
    if (!factura) {
      showNotification('Factura no encontrada', 'error');
      return false;
    }
    
    showNotification('Verificando certificado...', 'info');
    
    // Validar certificado antes de firmar
    try {
      const validacion = await window.electronAPI.validarCertificado({
        certificadoPath: state.configuracion.certificado_path,
        certificadoPassword: state.configuracion.certificado_password
      });
      
      if (!validacion.valido) {
        showNotification('❌ Certificado inválido: ' + (validacion.error || 'Certificado no válido'), 'error');
        return false;
      }
      
      // Advertir si está próximo a vencer
      if (validacion.info?.advertencia) {
        const continuar = confirm(
          `⚠️ ADVERTENCIA: ${validacion.info.advertencia}\n\n` +
          `Días restantes: ${validacion.info.diasRestantes}\n\n` +
          `¿Desea continuar con la firma?`
        );
        if (!continuar) return false;
      }
      
      console.log('✓ Certificado válido:', validacion.info);
    } catch (validacionError) {
      console.error('Error validando certificado:', validacionError);
      showNotification('⚠️ No se pudo validar el certificado, pero se intentará firmar', 'warning');
    }
    
    showNotification('Firmando documento con firmador interno...', 'info');
    
    // Parsear el JSON DTE de la factura
    let jsonDte = {};
    try {
      jsonDte = parseDTEGuardado(factura.json_dte);
      limpiarFirmasDTE(jsonDte);
      normalizarDocumentosReceptorDTE(jsonDte);
    } catch (e) {
      console.error('Error parseando JSON DTE:', e);
    }
    
    // Construir documento completo para firmar
    const documento = jsonDte;
    
    // Llamar al firmador con el certificado configurado
    const result = await window.electronAPI.firmarDocumento({
      metodo: 'interno',
      documento: documento,
      pin: state.configuracion.certificado_password,
      usuario: state.configuracion.firmador_usuario || state.configuracion.hacienda_usuario || state.configuracion.nit,
      password: null,
      certificadoPath: state.configuracion.certificado_path,
      certificadoPassword: state.configuracion.certificado_password,
      nit: state.configuracion.firmador_usuario || state.configuracion.hacienda_usuario || state.configuracion.nit
    });
    
    if (result.success) {
      showNotification('✓ Documento firmado exitosamente', 'success');
      
      // Actualizar estado en base de datos
      await window.electronAPI.updateFacturaEstado(
        facturaId,
        'FIRMADO',
        null,
        null,
        result.documentoFirmado
      );
      
      if (opciones.cerrarModal !== false) cerrarModalVerFactura();
      await loadFacturas();
      return true;
    } else {
      showNotification('✗ Error al firmar: ' + result.error, 'error');
      return false;
    }
  } catch (error) {
    console.error('Error firmando factura:', error);
    showNotification('Error al firmar factura: ' + error.message, 'error');
    return false;
  }
}

// Firmar con el firmador interno compatible con MH/SVFE
async function firmarConFirmadorSVFE(facturaId, opciones = {}) {
  try {
    const factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
    if (!factura) {
      showNotification('Factura no encontrada', 'error');
      return false;
    }

    showNotification('Firmando documento con firmador interno MH...', 'info');

    let jsonDte = {};
    try {
      jsonDte = parseDTEGuardado(factura.json_dte);
      limpiarFirmasDTE(jsonDte);
      normalizarDocumentosReceptorDTE(jsonDte);
    } catch (e) {
      showNotification('Error al parsear DTE: ' + e.message, 'error');
      return false;
    }

    const result = await window.electronAPI.firmarDocumento({
      metodo: 'interno',
      documento: jsonDte,
      pin: state.configuracion.certificado_password || state.configuracion.firmador_pin,
      usuario: state.configuracion.firmador_usuario || state.configuracion.nit,
      password: state.configuracion.firmador_password || 'http://localhost:8113',
      nit: state.configuracion.firmador_usuario || state.configuracion.nit,
      certificadoPassword: state.configuracion.certificado_password
    });

    if (result.success) {
      showNotification('✓ Documento firmado internamente', 'success');
      await window.electronAPI.updateFacturaEstado(
        facturaId,
        'FIRMADO',
        null,
        null,
        result.documentoFirmado
      );

      if (opciones.cerrarModal !== false) cerrarModalVerFactura();
      await loadFacturas();
      return true;
    } else {
      showNotification('✗ Error al firmar: ' + result.error, 'error');
      return false;
    }
  } catch (error) {
    console.error('Error firmando con SVFE:', error);
    showNotification('Error al firmar con SVFE: ' + error.message, 'error');
    return false;
  }
}

// Firmar con firmador web del MH usando credenciales guardadas
async function firmarConFirmadorWeb(facturaId, opciones = {}) {
  try {
    const factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
    if (!factura) {
      showNotification('Factura no encontrada', 'error');
      return false;
    }
    
    showNotification('Firmando documento con Firmador Web del MH...', 'info');
    
    // Parsear el JSON DTE de la factura
    let jsonDte = {};
    try {
      jsonDte = parseDTEGuardado(factura.json_dte);
      limpiarFirmasDTE(jsonDte);
      normalizarDocumentosReceptorDTE(jsonDte);
    } catch (e) {
      console.error('Error parseando JSON DTE:', e);
    }
    
    // Construir documento completo para firmar
    const documento = jsonDte;
    
    // Llamar al firmador web con credenciales guardadas
    const result = await window.electronAPI.firmarDocumento({
      documento: documento,
      pin: state.configuracion.firmador_pin,
      usuario: state.configuracion.firmador_usuario,
      password: state.configuracion.firmador_password,
      certificadoPath: null,
      certificadoPassword: null
    });
    
    if (result.success) {
      showNotification('✓ Documento firmado exitosamente', 'success');
      
      // Actualizar estado en base de datos
      await window.electronAPI.updateFacturaEstado(
        facturaId,
        'FIRMADO',
        null,
        null,
        result.documentoFirmado
      );
      
      if (opciones.cerrarModal !== false) cerrarModalVerFactura();
      await loadFacturas();
      return true;
    } else {
      showNotification('✗ Error al firmar: ' + result.error, 'error');
      return false;
    }
  } catch (error) {
    console.error('Error firmando factura:', error);
    showNotification('Error al firmar factura: ' + error.message, 'error');
    return false;
  }
}

// Procesar firma del documento (solo para firmador web)
async function procesarFirmaDocumento() {
  try {
    const facturaId = parseInt(document.getElementById('firmador-factura-id').value);
    const usuarioFirmador = document.getElementById('firmador-usuario').value;
    const passwordFirmador = document.getElementById('firmador-password').value;
    const pinCertificado = document.getElementById('firmador-pin').value;
    
    const factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
    if (!factura) {
      showNotification('Factura no encontrada', 'error');
      return;
    }
    
    if (!pinCertificado) {
      showNotification('Ingrese la contraseña de la llave privada/certificado', 'error');
      return;
    }
    
    // Verificar configuración
    if (!state.configuracion) {
      showNotification('Por favor configure los datos de la empresa primero', 'error');
      return;
    }
    
    // Cerrar modal y mostrar progreso
    cerrarModalFirmador();
    showNotification('Firmando documento con el firmador interno MH...', 'info');
    
    // Parsear el JSON DTE de la factura
    let jsonDte = {};
    try {
      jsonDte = parseDTEGuardado(factura.json_dte);
      limpiarFirmasDTE(jsonDte);
      normalizarDocumentosReceptorDTE(jsonDte);
    } catch (e) {
      showNotification('Error al parsear DTE: ' + e.message, 'error');
      return;
    }
    
    // Llamar al firmador
    const result = await window.electronAPI.firmarDocumento({
      metodo: 'interno',
      documento: jsonDte,
      pin: pinCertificado,
      usuario: usuarioFirmador || state.configuracion.nit,
      password: passwordFirmador || 'http://localhost:8113',
      certificadoPath: state.configuracion.certificado_path,
      certificadoPassword: pinCertificado || state.configuracion.certificado_password,
      nit: usuarioFirmador || state.configuracion.nit
    });
    
    if (result.success) {
      showNotification('✓ Documento firmado exitosamente', 'success');
      
      // Actualizar estado en base de datos
      await window.electronAPI.updateFacturaEstado(
        facturaId,
        'FIRMADO',
        null,
        null,
        result.documentoFirmado
      );
      
      cerrarModalVerFactura();
      await loadFacturas();
    } else {
      showNotification('✗ Error al firmar: ' + result.error, 'error');
    }
  } catch (error) {
    console.error('Error firmando factura:', error);
    showNotification('Error al firmar factura: ' + error.message, 'error');
  }
}

// Obtener descripción de actividad económica
function obtenerDescripcionActividad(codigo) {
  const codigoNormalizado = String(codigo || '').trim();
  const actividad = actividadesEconomicas.find(a => a.codigo === codigoNormalizado);
  return actividad ? actividad.descripcion : '';
}

function extraerCodigoActividad(input) {
  if (!input) return '';

  const dataCodigo = input.getAttribute('data-codigo');
  if (dataCodigo) return dataCodigo.trim();

  const value = input.value.trim();
  const match = value.match(/^(\d{5})\b/);
  return match ? match[1] : value;
}

function validarCodigoActividad(codigo) {
  return /^\d{5}$/.test(codigo) && actividadesEconomicas.some(a => a.codigo === codigo);
}

// Cerrar modal del firmador
function cerrarModalFirmador() {
  const modal = document.getElementById('modal-firmador');
  modal.classList.remove('active');
  document.getElementById('form-firmador').reset();
}

function cerrarModalAnulacion() {
  const modal = document.getElementById('modal-anulacion');
  modal.classList.remove('active');
  document.getElementById('form-anulacion')?.reset();
}

// Seleccionar certificado digital
async function seleccionarCertificado() {
  try {
    const result = await window.electronAPI.selectFile({
      filters: [
        { name: 'Certificados', extensions: ['crt', 'p12', 'pfx', 'pem'] },
        { name: 'Todos los archivos', extensions: ['*'] }
      ]
    });
    
    if (!result.canceled) {
      document.getElementById('config-certificado-path').value = result.filePath;
      showNotification('Certificado seleccionado: ' + result.filePath, 'success');
    }
  } catch (error) {
    console.error('Error seleccionando certificado:', error);
    showNotification('Error al seleccionar certificado', 'error');
  }
}

async function seleccionarLogoPDF() {
  try {
    const result = await window.electronAPI.selectFile({
      filters: [
        { name: 'Imágenes', extensions: ['png', 'jpg', 'jpeg'] },
        { name: 'Todos los archivos', extensions: ['*'] }
      ]
    });

    if (!result.canceled) {
      document.getElementById('config-logo-path').value = result.filePath;
      showNotification('Imagen seleccionada: ' + result.filePath, 'success');
    }
  } catch (error) {
    console.error('Error seleccionando imagen para PDF:', error);
    showNotification('Error al seleccionar imagen para PDF', 'error');
  }
}

// Probar conexión con Hacienda
async function probarConexionHacienda() {
  try {
    const usuario = document.getElementById('config-hacienda-usuario').value;
    const password = document.getElementById('config-hacienda-password').value;
    const ambiente = document.getElementById('config-hacienda-ambiente').value;
    
    // Validar que se hayan ingresado las credenciales
    if (!usuario || !password) {
      showNotification('Por favor ingrese usuario y contraseña de Hacienda', 'error');
      return;
    }
    
    const btnTest = document.getElementById('btn-test-conexion');
    const estadoConexion = document.getElementById('estado-conexion');
    
    btnTest.disabled = true;
    btnTest.textContent = 'Probando...';
    estadoConexion.textContent = 'Conectando...';
    estadoConexion.className = 'badge badge-info';
    
    showNotification('Probando conexión con Hacienda...', 'info');
    
    // Intentar autenticar
    const authResult = await window.electronAPI.autenticar({
      usuario: usuario,
      password: password,
      ambiente: ambiente
    });
    
    btnTest.disabled = false;
    btnTest.textContent = 'Probar Conexión';
    
    if (authResult.success) {
      // Actualizar badge de conexión
      estadoConexion.textContent = `✓ Conectado MH (${ambiente === 'produccion' ? 'Prod' : 'Test'})`;
      estadoConexion.className = 'badge badge-success';
      
      showNotification('✓ Conexión exitosa con el Ministerio de Hacienda', 'success');
      console.log('=== AUTENTICACIÓN EXITOSA ===');
      console.log('Usuario:', authResult.user);
      console.log('Token:', authResult.token);
      console.log('Tipo Token:', authResult.tokenType);
      console.log('Rol:', authResult.rol?.nombre);
      console.log('Roles:', authResult.roles);
      console.log('=============================');
    } else {
      // Actualizar badge a error
      estadoConexion.textContent = '✗ Sin conexión';
      estadoConexion.className = 'badge badge-danger';
      
      showNotification('✗ Error de conexión: ' + authResult.error, 'error');
      console.error('Error de autenticación:', authResult.error);
    }
  } catch (error) {
    console.error('Error probando conexión:', error);
    showNotification('Error al probar conexión: ' + error.message, 'error');
    
    const btnTest = document.getElementById('btn-test-conexion');
    const estadoConexion = document.getElementById('estado-conexion');
    
    btnTest.disabled = false;
    btnTest.textContent = 'Probar Conexión';
    estadoConexion.textContent = '✗ Error conexión';
    estadoConexion.className = 'badge badge-danger';
  }
}

// Enviar factura a Hacienda
async function enviarFacturaHacienda(facturaId, opciones = {}) {
  try {
    const usarProgreso = opciones.progreso !== false;
    if (usarProgreso && !procesoEnvio.visible) {
      iniciarProcesoEnvio('Envío de documento a Hacienda', [
        'Validando documento firmado',
        'Enviando a Hacienda',
        'Esperando respuesta de Hacienda',
        'Aprobado por Hacienda'
      ]);
    }

    const factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
    if (!factura) {
      if (usarProgreso) await finalizarProcesoEnvio('No se encontró la factura.', 'error');
      showNotification('Factura no encontrada', 'error');
      return false;
    }
    
    if (!state.configuracion || !state.configuracion.hacienda_usuario) {
      if (usarProgreso) await finalizarProcesoEnvio('Configure credenciales de Hacienda para continuar.', 'error');
      showNotification('Por favor configure las credenciales de Hacienda primero', 'error');
      return false;
    }
    
    // Verificar que la factura tenga JSON DTE
    if (!factura.json_dte) {
      if (usarProgreso) await finalizarProcesoEnvio('La factura no tiene JSON DTE generado.', 'error');
      showNotification('La factura no tiene DTE generado. Genere la factura primero.', 'error');
      return false;
    }
    
    // Verificar que el estado sea FIRMADO o PENDIENTE
    if (factura.estado !== 'FIRMADO' && factura.estado !== 'PENDIENTE') {
      if (usarProgreso) await finalizarProcesoEnvio('El documento debe estar firmado antes del envío.', 'error');
      showNotification('La factura debe estar firmada antes de enviarla a Hacienda', 'error');
      return false;
    }
    
    if (opciones.confirmar !== false) {
      const confirmacion = confirm('¿Está seguro de enviar esta factura al Ministerio de Hacienda?');
      if (!confirmacion) {
        ocultarProcesoEnvio();
        return false;
      }
    }
    
    if (usarProgreso) {
      await avanzarProcesoEnvio('Validando documento firmado antes del envío...');
    }
    showNotification('Enviando DTE a Hacienda (modelo uno a uno)...', 'info');
    
    // Parsear el DTE firmado
    let dteFirmado;
    try {
      dteFirmado = parseDTEGuardado(factura.json_dte);
    } catch (e) {
      if (usarProgreso) await finalizarProcesoEnvio('No se pudo leer el JSON firmado.', 'error');
      showNotification('Error al parsear DTE: ' + e.message, 'error');
      return false;
    }

    if (dteRetencionNecesitaRefirmaPorDocumento(dteFirmado)) {
      const dteCorregido = obtenerDTEContenido(dteFirmado);
      limpiarFirmasDTE(dteCorregido);
      normalizarDocumentosReceptorDTE(dteCorregido);
      await window.electronAPI.updateFacturaCorreccion(facturaId, {
        estado: 'PENDIENTE',
        observaciones: 'Documento de retención normalizado antes del reenvío.',
        json_dte: dteCorregido
      });
      await loadFacturas();
      if (usarProgreso) await avanzarProcesoEnvio('Re-firmando retención con DUI en formato aceptado...');
      const firmada = await firmarFactura(facturaId, { cerrarModal: false, progreso: false });
      if (!firmada) {
        if (usarProgreso) await finalizarProcesoEnvio('Se normalizó el DTE, pero no se pudo firmar nuevamente.', 'error');
        return false;
      }
      await loadFacturas();
      return await enviarFacturaHacienda(facturaId, { ...opciones, confirmar: false });
    }

    if (dteUsaTransmisionContingencia(dteFirmado) && opciones.permitirTransmisionContingencia !== true) {
      if (usarProgreso) {
        await finalizarProcesoEnvio('El DTE está marcado para transmisión por contingencia.', 'warning');
      }
      showNotification('Este DTE usa tipoOperacion 2. Procéselo desde el flujo de contingencia, no con el envío normal.', 'warning');
      return false;
    }

    const errorReceptor = validarReceptorDTEParaHacienda(dteFirmado, state.configuracion);
    if (errorReceptor) {
      if (usarProgreso) await finalizarProcesoEnvio('El receptor del DTE firmado no cumple validación.', 'error');
      showNotification(errorReceptor, 'error');
      return false;
    }
    
    if (usarProgreso) {
      await avanzarProcesoEnvio('Enviando documento a la API de Hacienda...');
      await avanzarProcesoEnvio('Esperando validación y sello de recepción...');
    }

    // Enviar DTE usando el nuevo formato (modelo uno a uno)
    const resultado = await window.electronAPI.enviarDTE({
      dteFirmado: dteFirmado,
      nit: state.configuracion.nit,
      passwordPri: state.configuracion.firmador_pin || state.configuracion.certificado_password || null
    });
    
    if (resultado.success) {
      const documentoInvalidoMH = respuestaHaciendaTieneDocumentoInvalido(resultado);
      const estadoRechazadoMH = respuestaHaciendaEstaRechazada(resultado);
      if (estadoRechazadoMH || !resultado.selloRecibido) {
        const mensajeSinSello = resultado.mensaje ||
          resultado.descripcionMsg ||
          (!resultado.selloRecibido && documentoInvalidoMH
            ? 'Hacienda rechazó el documento por receptor.numDocumento inválido.'
            : estadoRechazadoMH
            ? 'Hacienda rechazó el documento.'
            : 'Hacienda no devolvió sello de recepción para el documento.');
        const mensajeRechazo = documentoInvalidoMH
          ? agregarDetalleDocumentoReceptor(mensajeSinSello, dteFirmado)
          : mensajeSinSello;
        const bitacoraSinSello = crearBitacoraRechazoHacienda(
          {
            ...resultado,
            estado: 'RECHAZADO',
            error: mensajeRechazo,
            errorDetalle: {
              tipo: !resultado.selloRecibido && documentoInvalidoMH ? 'VALIDACION' : 'SIN_SELLO_RECEPCION',
              codigo: resultado.codigo || null,
              mensaje: mensajeRechazo,
              observaciones: resultado.observaciones || [],
              raw: resultado
            }
          },
          mensajeRechazo
        );

        await window.electronAPI.updateFacturaEstado(
          facturaId,
          'RECHAZADO',
          null,
          JSON.stringify(bitacoraSinSello)
        );
        await loadFacturas();
        showNotification(mensajeRechazo, 'error');
        cerrarModalVerFactura();
        if (usarProgreso) {
          await finalizarProcesoEnvio(mensajeRechazo, 'error');
        }
        return false;
      }

      const enviadaConObservaciones = Array.isArray(resultado.observaciones) && resultado.observaciones.length > 0;
      showNotification(
        enviadaConObservaciones
          ? '✓ Factura recibida por Hacienda con observaciones'
          : '✓ Factura enviada exitosamente a Hacienda',
        'success'
      );
      if (usarProgreso) {
        await avanzarProcesoEnvio('Aprobado por Hacienda. Sello de recepción recibido.');
      }

      console.log('Sello recibido:', resultado.selloRecibido);
      console.log('Estado:', resultado.estado);

      if (resultado.observaciones) {
        console.log('Observaciones:', resultado.observaciones);
      }
      
      // Actualizar estado en base de datos
      await window.electronAPI.updateFacturaEstado(
        facturaId, 
        normalizarEstadoFactura(resultado.estado),
        resultado.selloRecibido || null,
        resultado.observaciones ? JSON.stringify(resultado.observaciones) : null
      );
      await loadFacturas();

      if (usarProgreso) await avanzarProcesoEnvio('Creando JSON con respuesta MH y adjuntos de correo...');
      const jsonConRespuesta = construirJsonDTEConRespuestaHacienda(dteFirmado, resultado, resultado.selloRecibido);
      const correoEnviado = await enviarCorreoAutomaticoDocumentoAprobado(
        facturaId,
        dteFirmado,
        resultado.selloRecibido,
        jsonConRespuesta
      );
      
      cerrarModalVerFactura();
      if (usarProgreso) {
        await finalizarProcesoEnvio(
          correoEnviado
            ? 'Documento aprobado por Hacienda y enviado por correo.'
            : 'Documento aprobado por Hacienda. Revise el envío por correo.',
          'success'
        );
      }
      return true;
    } else {
      // Procesar error usando la nueva estructura de errores
      let errorMsg = 'Error al enviar a Hacienda';
      let mostrarReintento = false;
      let tipoContingencia = null;
      let motivoContingencia = '';
      
      if (resultado.errorDetalle) {
        const error = resultado.errorDetalle;
        
        // Mostrar mensaje específico según tipo de error
        switch(error.tipo) {
          case 'AUTENTICACION':
            errorMsg = '❌ Error de autenticación: ' + error.mensaje;
            errorMsg += '\n\nVerifique sus credenciales en la configuración.';
            break;
          case 'VALIDACION':
            errorMsg = '❌ Error de validación: ' + error.mensaje;
            if (error.observacionesDetalle && error.observacionesDetalle.length > 0) {
              errorMsg += '\n\nDetalles:\n• ' + formatearObservaciones(error.observacionesDetalle).join('\n• ');
            } else if (error.observaciones && error.observaciones.length > 0) {
              errorMsg += '\n\nDetalles:\n• ' + formatearObservaciones(error.observaciones).join('\n• ');
            }
            break;
          case 'SERVIDOR_MH':
            errorMsg = '⚠️ Error en servidor de Hacienda: ' + error.mensaje;
            errorMsg += '\n\nIntente nuevamente en unos minutos.';
            mostrarReintento = true;
            tipoContingencia = '2';
            motivoContingencia = error.mensaje;
            break;
          case 'SERVICIO_NO_DISPONIBLE':
            errorMsg = '⚠️ Servicio de Hacienda temporalmente no disponible';
            errorMsg += '\n\nEl documento se ha guardado en contingencia para transmisión diferida.';
            mostrarReintento = true;
            tipoContingencia = '2';
            motivoContingencia = error.mensaje;
            break;
          case 'TIMEOUT':
          case 'RED':
            errorMsg = '⚠️ Error de conexión: ' + error.mensaje;
            errorMsg += '\n\nEl documento se ha guardado en contingencia para transmisión diferida.';
            mostrarReintento = true;
            tipoContingencia = error.tipo === 'RED' ? '1' : '3';
            motivoContingencia = error.mensaje;
            break;
          default:
            errorMsg = 'Error: ' + (error.mensaje || resultado.error);
        }
        
        // Mostrar código de error si está disponible
        if (error.codigo) {
          errorMsg += `\n\nCódigo: ${error.codigo}`;
        }

        if (observacionesMencionanReceptorNumDocumento(resultado)) {
          errorMsg = agregarDetalleDocumentoReceptor(errorMsg, dteFirmado);
        }
        
      } else {
        // Formato de error antiguo
        errorMsg = 'Error al enviar: ' + resultado.error;
        if (esErrorConexionHaciendaTexto(resultado.error)) {
          errorMsg = '⚠️ Error de conexión: ' + resultado.error;
          errorMsg += '\n\nEl documento se ha guardado en contingencia para transmisión diferida.';
          mostrarReintento = true;
          tipoContingencia = '1';
          motivoContingencia = resultado.error;
        }
        if (resultado.observaciones && resultado.observaciones.length > 0) {
          errorMsg += '\nObservaciones: ' + formatearObservaciones(resultado.observaciones).join(', ');
        }
        if (observacionesMencionanReceptorNumDocumento(resultado)) {
          errorMsg = agregarDetalleDocumentoReceptor(errorMsg, dteFirmado);
        }
      }
      
      showNotification(errorMsg, 'error');
      console.error('Error completo:', resultado);

      if (mostrarReintento && tipoContingencia) {
        try {
          await registrarDocumentoEnContingencia(facturaId, tipoContingencia, motivoContingencia || errorMsg);
          if (usarProgreso) {
            await finalizarProcesoEnvio('Documento guardado en contingencia para transmisión posterior.', 'warning');
          }
          return false;
        } catch (e) {
          console.error('Error registrando contingencia:', e);
        }
      }

      if (usarProgreso) {
        await finalizarProcesoEnvio('Hacienda rechazó el documento. Revise las observaciones.', 'error');
      }

      const bitacoraRechazo = crearBitacoraRechazoHacienda(resultado, errorMsg);

      await window.electronAPI.updateFacturaEstado(
        facturaId,
        'RECHAZADO',
        null,
        JSON.stringify(bitacoraRechazo)
      );
      await loadFacturas();
      
      // Mostrar opción de reintento si aplica
      if (mostrarReintento) {
        if (confirm('¿Desea reintentar el envío ahora?')) {
          await enviarFacturaHacienda(facturaId);
        }
      }
      return false;
    }
  } catch (error) {
    console.error('Error enviando factura:', error);
    
    // En caso de error inesperado, intentar registrar en contingencia
    try {
      const factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
      if (factura && factura.json_dte) {
        await registrarDocumentoEnContingencia(facturaId, '5', error.message);
        showNotification('⚠️ Error inesperado. Factura guardada en contingencia.', 'warning');
      } else {
        showNotification('Error al enviar factura: ' + error.message, 'error');
      }
    } catch (e) {
      showNotification('Error al enviar factura: ' + error.message, 'error');
    }
    return false;
  }
}

function generarUuidMayusculas() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID().toUpperCase();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.random() * 16 | 0;
    const value = char === 'x' ? random : (random & 0x3 | 0x8);
    return value.toString(16);
  }).toUpperCase();
}

function redondearDos(valor) {
  return Number((Number(valor || 0) + Number.EPSILON).toFixed(2));
}

function obtenerDocumentoReceptorParaAnulacion(dte, config) {
  const dteContenido = obtenerDTEContenido(dte);
  const receptor = dteContenido?.receptor || dteContenido?.sujetoExcluido || {};
  const tieneNumDocumento = Object.prototype.hasOwnProperty.call(receptor, 'numDocumento');
  const tieneNit = Object.prototype.hasOwnProperty.call(receptor, 'nit');
  const tipoDocumento = receptor.tipoDocumento || (receptor.nit ? '36' : null) || null;
  const numeroDocumento = tieneNumDocumento
    ? receptor.numDocumento
    : (tieneNit ? receptor.nit : null);

  return {
    tipoDocumento,
    numeroDocumento: numeroDocumento === null || numeroDocumento === undefined
      ? null
      : String(numeroDocumento)
  };
}

function obtenerMontoIvaDTE(dte) {
  const resumen = dte?.resumen || {};
  const tributoIva = Array.isArray(resumen.tributos)
    ? resumen.tributos.find(t => t?.codigo === '20')
    : null;

  return redondearDos(resumen.totalIva || tributoIva?.valor || dte?.iva || 0);
}

function normalizarCodigoGeneracion(valor) {
  const codigo = String(valor || '').trim().toUpperCase();
  const match = codigo.match(/^[0-9A-F]{8}-[0-9A-F]{4}-[1-5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/);
  return match ? codigo : null;
}

function dtePermiteAnulacionSinReemplazo(tipoDte) {
  return ['05', '08'].includes(String(tipoDte || '').padStart(2, '0'));
}

function dtePermiteTipoAnulacionRescindir(tipoDte) {
  return ['01', '03', '05', '08', '11'].includes(String(tipoDte || '').padStart(2, '0'));
}

function obtenerTiposAnulacionPermitidos(tipoDte, factura = null) {
  const tipo = String(tipoDte || '').padStart(2, '0');

  if (['01', '11'].includes(tipo)) return [1, 2, 3];
  if (tipo === '03') return ccfSuperaVentanaInvalidacionDirecta(factura) ? [1, 3] : [1, 2, 3];
  if (['05', '08'].includes(tipo)) return [2];
  return [1, 3];
}

function requiereCodigoGeneracionReemplazo(tipoDte, tipoAnulacion) {
  if (![1, 3].includes(Number(tipoAnulacion))) return false;
  return !dtePermiteAnulacionSinReemplazo(tipoDte);
}

function obtenerAyudaCodigoReemplazoAnulacion(tipoDte) {
  const tipo = String(tipoDte || '').padStart(2, '0');
  if (tipo === '03') {
    return 'Para tipo 1 o 3 debe indicar el código de generación del CCF corregido que lo reemplaza. Para tipo 2 - Rescindir operación no se requiere reemplazo.';
  }
  return 'Ingrese el código de generación del DTE correcto que reemplaza al documento a invalidar.';
}

function actualizarAyudaTipoAnulacion(tipoDte, factura = null) {
  const ayuda = document.getElementById('anulacion-regla-ayuda');
  const contenido = ayuda?.querySelector('small');
  if (!ayuda || !contenido) return;

  const tipo = String(tipoDte || '').padStart(2, '0');
  if (tipo === '03') {
    if (ccfSuperaVentanaInvalidacionDirecta(factura)) {
      contenido.textContent = 'Este CCF ya superó el plazo de anulación directa de las 23:59 del día siguiente a su emisión; debe corregirse mediante Nota de Crédito relacionada.';
      ayuda.style.display = '';
      return;
    }
    contenido.textContent = 'El CCF puede invalidarse directamente hasta las 23:59 del día siguiente a su emisión. Use tipo 2 si se rescinde toda la operación; use tipo 1 o 3 cuando exista un CCF corregido que reemplaza al anterior.';
    ayuda.style.display = '';
    return;
  }

  contenido.textContent = '';
  ayuda.style.display = 'none';
}

function obtenerTipoAnulacionInicial(tipoDte, factura = null) {
  const permitidos = obtenerTiposAnulacionPermitidos(tipoDte, factura);
  return permitidos.includes(2) ? 2 : permitidos[0];
}

function actualizarOpcionesTipoAnulacion(tipoDte, factura = null) {
  const select = document.getElementById('anulacion-tipo');
  if (!select) return;

  const permitidos = obtenerTiposAnulacionPermitidos(tipoDte, factura);
  Array.from(select.options).forEach((option) => {
    const permitido = permitidos.includes(Number(option.value));
    option.hidden = !permitido;
    option.disabled = !permitido;
  });

  if (!permitidos.includes(Number(select.value))) {
    select.value = String(obtenerTipoAnulacionInicial(tipoDte, factura));
  }
}

function toggleCodigoReemplazoAnulacion(tipoAnulacion, tipoDte = null) {
  const grupo = document.getElementById('grupo-codigo-reemplazo');
  const input = document.getElementById('anulacion-codigo-reemplazo');
  const ayuda = document.getElementById('anulacion-codigo-reemplazo-ayuda');
  if (!grupo || !input) return;

  const facturaId = Number(document.getElementById('anulacion-factura-id')?.value || 0);
  const factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
  const tipoDocumento = tipoDte || factura?.tipo_dte || '01';
  const requerido = requiereCodigoGeneracionReemplazo(tipoDocumento, tipoAnulacion);

  grupo.style.display = requerido ? '' : 'none';
  input.required = requerido;
  if (ayuda) {
    ayuda.textContent = requerido ? obtenerAyudaCodigoReemplazoAnulacion(tipoDocumento) : '';
  }
  if (!requerido) {
    input.value = '';
  }
}

function validarEventoAnulacionPrevio(factura, dte, tipoAnulacion, codigoGeneracionR) {
  const tipoDte = String(dte?.identificacion?.tipoDte || factura?.tipo_dte || '').padStart(2, '0');
  const permitidos = obtenerTiposAnulacionPermitidos(tipoDte, factura);

  if (!permitidos.includes(Number(tipoAnulacion))) {
    return `Tipo de anulación inválido para DTE ${tipoDte}. Use: ${permitidos.join(', ')}.`;
  }

  const validacionPlazo = obtenerLimiteAnulacionDirecta(factura);
  if (!validacionPlazo.permitido) {
    return validacionPlazo.mensaje;
  }

  if (Number(tipoAnulacion) === 2 && !dtePermiteTipoAnulacionRescindir(tipoDte)) {
    return `El tipo 2 - Rescindir operación no aplica para DTE tipo ${tipoDte}. Use tipo 1 o 3 con el documento reemplazo si corresponde.`;
  }

  if (requiereCodigoGeneracionReemplazo(tipoDte, tipoAnulacion) && !codigoGeneracionR) {
    if (tipoDte === '03') {
      return 'Para anular un CCF debe ingresar el código de generación del CCF corregido que reemplaza al documento. Si no emitirá reemplazo, genere una Nota de Crédito relacionada al CCF.';
    }
    return 'Ingrese el código de generación del DTE que reemplaza al documento a invalidar.';
  }

  return null;
}

function crearEventoAnulacion(factura, dte, opciones = {}) {
  dte = obtenerDTEContenido(dte);
  const ahora = new Date();
  const config = state.configuracion || {};
  const receptor = dte.receptor || dte.sujetoExcluido || {};
  const receptorDocumento = obtenerDocumentoReceptorParaAnulacion(dte, config);
  const nitEmisor = limpiarDocumentoFiscal(dte.emisor?.nit || config.nit || config.hacienda_usuario);
  const nombreEmisor = dte.emisor?.nombre || config.nombre_empresa;
  const telefonoEmisor = valorTextoNoVacio(dte.emisor?.telefono || config.telefono);
  const correoEmisor = valorTextoNoVacio(dte.emisor?.correo || config.email);
  const tipDocSolicita = receptorDocumento.tipoDocumento || '36';
  const numDocSolicita = receptorDocumento.numeroDocumento || limpiarDocumentoFiscal(config.nit) || nitEmisor;
  const telefonoReceptor = valorTextoNoVacio(receptor.telefono);
  const correoReceptor = valorTextoNoVacio(receptor.correo);
  const tipoAnulacion = Number(opciones.tipoAnulacion || 2);
  const tipoDte = dte.identificacion?.tipoDte || factura.tipo_dte;
  const codigoGeneracionR = requiereCodigoGeneracionReemplazo(tipoDte, tipoAnulacion)
    ? normalizarCodigoGeneracion(opciones.codigoGeneracionR)
    : null;

  return {
    identificacion: {
      version: 2,
      ambiente: dte.identificacion?.ambiente || (config.hacienda_ambiente === 'produccion' ? '01' : '00'),
      codigoGeneracion: generarUuidMayusculas(),
      fecAnula: formatearFechaLocal(ahora),
      horAnula: formatearHoraLocal(ahora)
    },
    emisor: {
      nit: nitEmisor,
      nombre: nombreEmisor,
      tipoEstablecimiento: dte.emisor?.tipoEstablecimiento || '01',
      nomEstablecimiento: dte.emisor?.nombreComercial || config.nombre_comercial || nombreEmisor,
      codEstableMH: dte.emisor?.codEstableMH || null,
      codEstable: dte.emisor?.codEstable || config.codigo_establecimiento || null,
      codPuntoVentaMH: dte.emisor?.codPuntoVentaMH || null,
      codPuntoVenta: dte.emisor?.codPuntoVenta || config.punto_venta || null,
      telefono: telefonoEmisor,
      correo: correoEmisor
    },
    documento: {
      tipoDte: dte.identificacion?.tipoDte || factura.tipo_dte,
      codigoGeneracion: dte.identificacion?.codigoGeneracion || factura.codigo_generacion,
      selloRecibido: factura.sello_recepcion,
      numeroControl: dte.identificacion?.numeroControl || factura.numero_control,
      fecEmi: dte.identificacion?.fecEmi || String(factura.fecha_emision || '').slice(0, 10),
      montoIva: obtenerMontoIvaDTE(dte),
      codigoGeneracionR: codigoGeneracionR || null,
      tipoDocumento: receptorDocumento.tipoDocumento,
      numDocumento: receptorDocumento.numeroDocumento,
      nombre: receptor.nombre || 'CONSUMIDOR FINAL',
      ...(telefonoReceptor ? { telefono: telefonoReceptor } : {}),
      ...(correoReceptor ? { correo: correoReceptor } : {})
    },
    motivo: {
      tipoAnulacion,
      motivoAnulacion: opciones.motivoAnulacion,
      nombreResponsable: nombreEmisor,
      tipDocResponsable: '36',
      numDocResponsable: nitEmisor,
      nombreSolicita: receptor.nombre || nombreEmisor,
      tipDocSolicita,
      numDocSolicita: String(numDocSolicita || '')
    }
  };
}

function obtenerMensajeErrorHacienda(resultado, accion = 'procesar solicitud') {
  if (!resultado?.errorDetalle) {
    return `Error al ${accion}: ${resultado?.error || 'Error desconocido'}`;
  }

  const error = resultado.errorDetalle;
  let mensaje = error.mensaje || resultado.error || 'Datos inválidos. Revise las observaciones.';

  if (error.observacionesDetalle?.length) {
    mensaje += '\n\nDetalles:\n• ' + formatearObservaciones(error.observacionesDetalle).join('\n• ');
  } else if (error.observaciones?.length) {
    mensaje += '\n\nDetalles:\n• ' + formatearObservaciones(error.observaciones).join('\n• ');
  }

  if (error.codigo) {
    mensaje += `\n\nCódigo: ${error.codigo}`;
  }

  return mensaje;
}

function obtenerFechaHoraEmisionDTEParaAnulacion(factura) {
  let dte = {};
  try {
    dte = obtenerDTEContenido(parseDTEGuardado(factura.json_dte));
  } catch {
    dte = {};
  }

  const fecha = dte?.identificacion?.fecEmi || String(factura.fecha_emision || factura.created_at || '').slice(0, 10);
  const hora = dte?.identificacion?.horEmi || (
    String(factura.fecha_emision || '').includes('T')
      ? String(factura.fecha_emision).slice(11, 19)
      : '00:00:00'
  );

  if (!fecha) return null;

  const fechaHora = new Date(`${fecha}T${hora}`);
  return Number.isNaN(fechaHora.getTime()) ? null : fechaHora;
}

function obtenerFechaEmisionLocalParaAnulacion(factura) {
  let dte = {};
  try {
    dte = obtenerDTEContenido(parseDTEGuardado(factura?.json_dte));
  } catch {
    dte = {};
  }

  const fecha = dte?.identificacion?.fecEmi || String(factura?.fecha_emision || factura?.created_at || '').slice(0, 10);
  const match = String(fecha || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const [, year, month, day] = match;
  const fechaLocal = new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0, 0);
  return Number.isNaN(fechaLocal.getTime()) ? null : fechaLocal;
}

function finDeDiaLocal(fecha) {
  const fin = new Date(fecha);
  fin.setHours(23, 59, 59, 999);
  return fin;
}

function sumarDiasFechaLocal(fecha, dias) {
  const resultado = new Date(fecha);
  resultado.setDate(resultado.getDate() + dias);
  return resultado;
}

function obtenerLimiteAnulacionDirecta(factura) {
  const tipoDte = String(factura?.tipo_dte || '').padStart(2, '0');
  const fechaEmision = obtenerFechaEmisionLocalParaAnulacion(factura);
  if (!fechaEmision) {
    return {
      permitido: false,
      limite: null,
      mensaje: 'No se pudo determinar la fecha de emisión para validar el plazo de anulación.'
    };
  }

  if (tipoDte === '03') {
    const limite = finDeDiaLocal(sumarDiasFechaLocal(fechaEmision, 1));
    return {
      permitido: Date.now() <= limite.getTime(),
      limite,
      mensaje: 'El CCF solo puede anularse directamente hasta las 23:59 del día siguiente a su emisión. Después de ese plazo debe corregirse mediante Nota de Crédito.'
    };
  }

  if (['01', '11', '14'].includes(tipoDte)) {
    const limite = finDeDiaLocal(sumarDiasFechaLocal(fechaEmision, 90));
    return {
      permitido: Date.now() <= limite.getTime(),
      limite,
      mensaje: 'Este documento solo puede anularse directamente durante 90 días contados desde su fecha de emisión.'
    };
  }

  return {
    permitido: true,
    limite: null,
    mensaje: null
  };
}

function facturaPuedeAnularsePorPlazo(factura) {
  return obtenerLimiteAnulacionDirecta(factura).permitido;
}

function ccfSuperaVentanaInvalidacionDirecta(factura) {
  if (String(factura?.tipo_dte || '').padStart(2, '0') !== '03') return false;
  return !obtenerLimiteAnulacionDirecta(factura).permitido;
}

async function anularFacturaHacienda(facturaId) {
  const factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
  if (!factura) {
    showNotification('Factura no encontrada', 'error');
    return;
  }

  if (obtenerEstadoFacturaVisual(factura) !== 'ENVIADO' || facturaTieneObservacionDocumentoInvalido(factura)) {
    showNotification('Solo se pueden anular facturas enviadas a Hacienda', 'warning');
    return;
  }

  if (!factura.sello_recepcion) {
    showNotification('La factura no tiene sello de recepción de Hacienda', 'error');
    return;
  }

  const validacionPlazo = obtenerLimiteAnulacionDirecta(factura);
  if (!validacionPlazo.permitido) {
    showNotification(validacionPlazo.mensaje, 'warning');
    return;
  }

  const tipoDte = String(factura.tipo_dte || '').padStart(2, '0');
  const tipoInicial = obtenerTipoAnulacionInicial(tipoDte, factura);

  actualizarOpcionesTipoAnulacion(tipoDte, factura);
  actualizarAyudaTipoAnulacion(tipoDte, factura);
  document.getElementById('anulacion-factura-id').value = facturaId;
  document.getElementById('anulacion-tipo').value = String(tipoInicial);
  document.getElementById('anulacion-codigo-reemplazo').value = '';
  document.getElementById('anulacion-motivo').value = tipoInicial === 2
    ? 'Rescindir operación realizada'
    : 'Error en la información del documento';
  toggleCodigoReemplazoAnulacion(tipoInicial, tipoDte);
  document.getElementById('modal-anulacion').classList.add('active');
}

async function procesarAnulacionFactura() {
  const btnConfirmar = document.getElementById('btn-confirmar-anulacion');

  try {
    const facturaId = Number(document.getElementById('anulacion-factura-id').value);
    const tipo = Number(document.getElementById('anulacion-tipo').value);
    const motivo = document.getElementById('anulacion-motivo').value.trim();
    const codigoGeneracionR = normalizarCodigoGeneracion(document.getElementById('anulacion-codigo-reemplazo')?.value);
    const factura = state.facturas.find(f => Number(f.id) === Number(facturaId));

    if (!factura) {
      showNotification('Factura no encontrada', 'error');
      return;
    }

    if (obtenerEstadoFacturaVisual(factura) !== 'ENVIADO' || facturaTieneObservacionDocumentoInvalido(factura)) {
      showNotification('Solo se pueden anular facturas enviadas a Hacienda', 'warning');
      return;
    }

    if (!factura.sello_recepcion) {
      showNotification('La factura no tiene sello de recepción de Hacienda', 'error');
      return;
    }

    const validacionPlazo = obtenerLimiteAnulacionDirecta(factura);
    if (!validacionPlazo.permitido) {
      showNotification(validacionPlazo.mensaje, 'warning');
      return;
    }

    if (!motivo) {
      showNotification('Ingrese el motivo de anulación', 'error');
      return;
    }

    const dte = obtenerDTEContenido(parseDTEGuardado(factura.json_dte));
    const errorEvento = validarEventoAnulacionPrevio(factura, dte, tipo, codigoGeneracionR);
    if (errorEvento) {
      showNotification(errorEvento, 'error');
      return;
    }

    if (btnConfirmar) {
      btnConfirmar.disabled = true;
      btnConfirmar.textContent = 'Enviando...';
    }

    const evento = crearEventoAnulacion(factura, dte, {
      tipoAnulacion: tipo,
      motivoAnulacion: motivo,
      codigoGeneracionR
    });

    showNotification('Firmando evento de anulación...', 'info');
    const firmado = await window.electronAPI.firmarDocumento({
      documento: evento,
      metodo: 'interno',
      certificadoPath: state.configuracion.certificado_path,
      certificadoPassword: state.configuracion.certificado_password || state.configuracion.firmador_pin,
      pin: state.configuracion.certificado_password || state.configuracion.firmador_pin,
      usuario: state.configuracion.firmador_usuario || state.configuracion.hacienda_usuario || state.configuracion.nit,
      nit: state.configuracion.firmador_usuario || state.configuracion.hacienda_usuario || state.configuracion.nit
    });

    if (!firmado.success) {
      showNotification('Error al firmar anulación: ' + firmado.error, 'error');
      return;
    }

    const eventoFirmado = firmado.documentoFirmado || { ...evento, firmaMh: firmado.firmaMh };

    showNotification('Enviando anulación a Hacienda...', 'info');
    const resultado = await window.electronAPI.anularDTE({ eventoFirmado });

    if (!resultado.success) {
      const mensaje = obtenerMensajeErrorHacienda(resultado, 'anular factura');
      showNotification('Error de anulación: ' + mensaje, 'error');
      console.error('Error anulando factura:', resultado);
      return;
    }

    await window.electronAPI.registrarAnulacion(facturaId, {
      selloAnulacion: resultado.selloRecibido || null,
      motivo,
      observaciones: resultado.observaciones || resultado.raw || null,
      jsonAnulacion: {
        evento: eventoFirmado,
        respuesta: resultado.raw || resultado
      }
    });

    await loadFacturas();

    if (resultado.selloRecibido) {
      showNotification('Generando PDF/JSON de anulación y enviando al cliente...', 'info');
      await enviarCorreoAutomaticoDocumentoAnulado(facturaId);
    }

    showNotification('✓ Factura anulada exitosamente en Hacienda', 'success');
    cerrarModalVerFactura();
    cerrarModalAnulacion();
  } catch (error) {
    console.error('Error anulando factura:', error);
    showNotification('Error al anular factura: ' + error.message, 'error');
  } finally {
    if (btnConfirmar) {
      btnConfirmar.disabled = false;
      btnConfirmar.textContent = 'Enviar Anulación';
    }
  }
}

window.anularFactura = anularFacturaHacienda;

// Función de autocompletado para actividades económicas
function setupActividadAutocomplete(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  
  // Crear contenedor para el dropdown si no existe
  let dropdown = document.getElementById(dropdownId);
  if (!dropdown) {
    dropdown = document.createElement('div');
    dropdown.id = dropdownId;
    dropdown.className = 'autocomplete-dropdown';
    input.parentNode.style.position = 'relative';
    input.parentNode.appendChild(dropdown);
  }
  
  // Función para filtrar actividades
  function filterActividades(searchText) {
    if (!searchText) return actividadesEconomicas;
    
    const search = searchText.toLowerCase();
    return actividadesEconomicas.filter(act => 
      act.codigo.toLowerCase().includes(search) || 
      act.descripcion.toLowerCase().includes(search)
    );
  }
  
  // Función para mostrar el dropdown
  function showDropdown(items) {
    if (items.length === 0) {
      dropdown.style.display = 'none';
      return;
    }
    
    dropdown.innerHTML = items.map(act => `
      <div class="autocomplete-item" data-codigo="${act.codigo}">
        <span class="codigo">${act.codigo}</span> - ${act.descripcion}
      </div>
    `).join('');
    
    dropdown.style.display = 'block';
    
    // Agregar listeners a cada item
    dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
      item.addEventListener('click', () => {
        const codigo = item.getAttribute('data-codigo');
        const actividad = actividadesEconomicas.find(a => a.codigo === codigo);
        if (actividad) {
          input.value = `${actividad.codigo} - ${actividad.descripcion}`;
          input.setAttribute('data-codigo', actividad.codigo);
        }
        dropdown.style.display = 'none';
      });
    });
  }
  
  // Event listeners
  input.addEventListener('input', (e) => {
    input.removeAttribute('data-codigo');
    const filtered = filterActividades(e.target.value);
    showDropdown(filtered);
  });
  
  input.addEventListener('focus', (e) => {
    const filtered = filterActividades(e.target.value);
    showDropdown(filtered);
  });
  
  // Cerrar dropdown al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  });
  
  // Navegación con teclado
  input.addEventListener('keydown', (e) => {
    const items = dropdown.querySelectorAll('.autocomplete-item');
    const activeItem = dropdown.querySelector('.autocomplete-item.active');
    let activeIndex = Array.from(items).indexOf(activeItem);
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (activeIndex < items.length - 1) {
        if (activeItem) activeItem.classList.remove('active');
        items[activeIndex + 1].classList.add('active');
        items[activeIndex + 1].scrollIntoView({ block: 'nearest' });
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (activeIndex > 0) {
        if (activeItem) activeItem.classList.remove('active');
        items[activeIndex - 1].classList.add('active');
        items[activeIndex - 1].scrollIntoView({ block: 'nearest' });
      }
    } else if (e.key === 'Enter' && activeItem) {
      e.preventDefault();
      activeItem.click();
    } else if (e.key === 'Escape') {
      dropdown.style.display = 'none';
    }
  });
}

// Hacer funciones globales
window.cerrarModalVerFactura = cerrarModalVerFactura;
window.cerrarModalFirmador = cerrarModalFirmador;
window.cerrarModalAnulacion = cerrarModalAnulacion;
window.editarCliente = editarCliente;
window.eliminarCliente = eliminarCliente;
window.cerrarModalCliente = cerrarModalCliente;

// Funciones para PDF
function obtenerFacturaActualizadaParaPDF(factura) {
  const facturaActualizada = state.facturas.find(f => Number(f.id) === Number(factura.id)) || factura;
  return {
    ...factura,
    ...facturaActualizada,
    estado: obtenerEstadoFacturaVisual(facturaActualizada)
  };
}

function construirMensajeCorreoDTE(codigo) {
  return `Estimado cliente,\n\nAdjunto encontrara el PDF y JSON enviados a Hacienda correspondientes al Documento Tributario Electronico ${codigo}.\n\nSaludos.`;
}

function construirJsonDTEConRespuestaHacienda(dteFirmado, respuestaHacienda = {}, selloRecepcion = null) {
  const dte = obtenerDTEContenido(dteFirmado);
  return {
    dte,
    respuestaHacienda: {
      estado: respuestaHacienda.estado || null,
      selloRecibido: selloRecepcion || respuestaHacienda.selloRecibido || null,
      codigoGeneracion: respuestaHacienda.codigoGeneracion || dte?.identificacion?.codigoGeneracion || null,
      observaciones: respuestaHacienda.observaciones || null,
      fechaHora: respuestaHacienda.fechaHora || null,
      raw: respuestaHacienda.raw || respuestaHacienda || null
    }
  };
}

function abrirModalCorreo(factura) {
  const facturaPDF = obtenerFacturaActualizadaParaPDF(factura);
  if (!facturaPuedeEnviarsePorCorreo(facturaPDF)) {
    showNotification('No se puede enviar por correo un documento rechazado o sin sello de aprobación.', 'warning');
    return;
  }

  const clienteData = typeof facturaPDF.cliente_datos === 'string'
    ? JSON.parse(facturaPDF.cliente_datos)
    : facturaPDF.cliente_datos || {};
  const codigo = facturaPDF.codigo_generacion || facturaPDF.numero_control || '';
  const modal = document.getElementById('modal-correo');
  const form = document.getElementById('form-correo');

  form.reset();
  document.getElementById('correo-factura-id').value = facturaPDF.id;
  document.getElementById('correo-destinatario').value = clienteData.email || '';
  document.getElementById('correo-asunto').value = `Documento Tributario Electronico ${codigo}`;
  document.getElementById('correo-mensaje').value = construirMensajeCorreoDTE(codigo);
  modal.classList.add('active');
}

function cerrarModalCorreo() {
  document.getElementById('modal-correo')?.classList.remove('active');
}

async function enviarCorreoAutomaticoDocumentoAprobado(facturaId, dteFirmado, selloRecepcion = null, jsonConRespuesta = null) {
  try {
    let factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
    if (!factura) {
      await loadFacturas();
      factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
    }

    if (!factura) {
      showNotification('Documento aprobado, pero no se encontró la factura para enviar correo.', 'warning');
      return false;
    }

    const facturaCorreo = obtenerFacturaActualizadaParaPDF({
      ...factura,
      estado: selloRecepcion || factura.sello_recepcion ? 'ACEPTADO' : factura.estado,
      sello_recepcion: selloRecepcion || factura.sello_recepcion
    });

    if (facturaTieneError(facturaCorreo)) {
      showNotification('No se enviará correo porque el documento está rechazado por Hacienda.', 'warning');
      return false;
    }

    if (!facturaCorreo.sello_recepcion) {
      showNotification('No se enviará correo porque Hacienda no devolvió sello de aprobación.', 'warning');
      return false;
    }

    const clienteData = obtenerClienteDataFactura(facturaCorreo);
    const destinatario = String(clienteData.email || '').trim();

    if (!destinatario) {
      showNotification('Documento aprobado, pero el cliente no tiene correo registrado.', 'warning');
      return false;
    }

    if (!state.configuracion?.correo_usuario || !state.configuracion?.correo_password) {
      showNotification('Documento aprobado, pero falta configurar el correo SMTP en Configuración.', 'warning');
      return false;
    }

    const codigo = facturaCorreo.codigo_generacion || facturaCorreo.numero_control || '';
    const resultadoCorreo = await window.electronAPI.enviarCorreoDTE({
      factura: facturaCorreo,
      dte: dteFirmado || parseDTEGuardado(facturaCorreo.json_dte),
      config: state.configuracion,
      destinatario,
      asunto: `Documento Tributario Electronico ${codigo}`,
      mensaje: construirMensajeCorreoDTE(codigo),
      jsonAdjunto: jsonConRespuesta || construirJsonDTEConRespuestaHacienda(
        dteFirmado || parseDTEGuardado(facturaCorreo.json_dte),
        { estado: facturaCorreo.estado, selloRecibido: selloRecepcion || facturaCorreo.sello_recepcion },
        selloRecepcion || facturaCorreo.sello_recepcion
      )
    });

    if (!resultadoCorreo.success) {
      showNotification('Documento aprobado, pero no se pudo enviar el correo: ' + resultadoCorreo.error, 'warning');
      return false;
    }

    await window.electronAPI.marcarFacturaCorreoEnviado(facturaId);
    await loadFacturas();
    showNotification('PDF y JSON enviados al correo del cliente', 'success');
    return true;
  } catch (error) {
    console.error('Error enviando correo automático:', error);
    showNotification('Documento aprobado, pero falló el correo automático: ' + error.message, 'warning');
    return false;
  }
}

async function enviarCorreoAutomaticoDocumentoAnulado(facturaId) {
  try {
    let factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
    if (!factura) {
      await loadFacturas();
      factura = state.facturas.find(f => Number(f.id) === Number(facturaId));
    }

    if (!factura) {
      showNotification('Documento anulado, pero no se encontró la factura para enviar correo.', 'warning');
      return false;
    }

    const clienteData = obtenerClienteDataFactura(factura);
    const destinatario = String(clienteData.email || '').trim();

    if (!destinatario) {
      showNotification('Documento anulado, pero el cliente no tiene correo registrado.', 'warning');
      return false;
    }

    if (!state.configuracion?.correo_usuario || !state.configuracion?.correo_password) {
      showNotification('Documento anulado, pero falta configurar el correo SMTP en Configuración.', 'warning');
      return false;
    }

    const facturaCorreo = obtenerFacturaActualizadaParaPDF(factura);
    const dteOriginal = parseDTEGuardado(facturaCorreo.json_dte);
    const jsonAnulacion = parseDTEGuardado(facturaCorreo.json_anulacion || '{}');
    const codigo = facturaCorreo.codigo_generacion || facturaCorreo.numero_control || '';
    const nombreArchivo = String(codigo || `anulacion-${facturaId}`).replace(/[^A-Za-z0-9_-]/g, '_');
    const resultadoCorreo = await window.electronAPI.enviarCorreoDTE({
      factura: facturaCorreo,
      dte: dteOriginal,
      config: state.configuracion,
      destinatario,
      asunto: `Documento Tributario Electronico anulado ${codigo}`,
      mensaje: `Estimado cliente,\n\nAdjunto encontrara el PDF actualizado y el JSON de anulacion del Documento Tributario Electronico ${codigo}.\n\nSaludos.`,
      jsonAdjunto: jsonAnulacion,
      nombreJson: `ANULACION_${nombreArchivo}.json`
    });

    if (!resultadoCorreo.success) {
      showNotification('Documento anulado, pero no se pudo enviar el correo: ' + resultadoCorreo.error, 'warning');
      return false;
    }

    await window.electronAPI.marcarFacturaCorreoEnviado(facturaId);
    await loadFacturas();
    showNotification('PDF y JSON de anulación enviados al correo del cliente', 'success');
    return true;
  } catch (error) {
    console.error('Error enviando correo automático de anulación:', error);
    showNotification('Documento anulado, pero falló el correo automático: ' + error.message, 'warning');
    return false;
  }
}

async function procesarEnvioCorreoFactura() {
  const btn = document.getElementById('btn-confirmar-correo');
  try {
    const facturaId = Number(document.getElementById('correo-factura-id').value);
    const factura = state.facturas.find(f => Number(f.id) === facturaId);
    const facturaPDF = factura ? obtenerFacturaActualizadaParaPDF(factura) : null;

    if (!facturaPDF) {
      showNotification('Factura no encontrada', 'error');
      return;
    }

    if (!facturaPuedeEnviarsePorCorreo(facturaPDF)) {
      showNotification('No se puede enviar por correo un documento rechazado o sin sello de aprobación.', 'warning');
      return;
    }

    if (!state.configuracion?.correo_usuario || !state.configuracion?.correo_password) {
      showNotification('Configure el correo Gmail y la contraseña de aplicación en Configuración.', 'error');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Enviando...';
    }

    const dteFirmado = parseDTEGuardado(facturaPDF.json_dte);
    const jsonConRespuesta = construirJsonDTEConRespuestaHacienda(
      dteFirmado,
      {
        estado: facturaPDF.estado,
        selloRecibido: facturaPDF.sello_recepcion,
        observaciones: parseObservacionesFactura(facturaPDF.observaciones)
      },
      facturaPDF.sello_recepcion
    );
    const resultado = await window.electronAPI.enviarCorreoDTE({
      factura: facturaPDF,
      dte: dteFirmado,
      config: state.configuracion,
      destinatario: document.getElementById('correo-destinatario').value.trim(),
      asunto: document.getElementById('correo-asunto').value.trim(),
      mensaje: document.getElementById('correo-mensaje').value,
      jsonAdjunto: jsonConRespuesta
    });

    if (resultado.success) {
      await window.electronAPI.marcarFacturaCorreoEnviado(facturaId);
      await loadFacturas();
      showNotification('Correo enviado exitosamente', 'success');
      cerrarModalCorreo();
    } else {
      showNotification('Error al enviar correo: ' + resultado.error, 'error');
    }
  } catch (error) {
    console.error('Error enviando correo:', error);
    showNotification('Error al enviar correo: ' + error.message, 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Enviar Correo';
    }
  }
}

async function descargarPDFFactura(factura) {
  try {
    const facturaPDF = obtenerFacturaActualizadaParaPDF(factura);
    if (!facturaPDF.sello_recepcion) {
      showNotification('Solo puede generar PDF cuando Hacienda devolvió sello de aprobación.', 'warning');
      return;
    }

    showNotification('Generando PDF aprobado...', 'info');
    const dteFirmado = parseDTEGuardado(facturaPDF.json_dte);
    const pdfResult = await window.electronAPI.generarPDF({
      factura: facturaPDF,
      dte: dteFirmado,
      config: state.configuracion,
      selloRecepcion: facturaPDF.sello_recepcion
    });

    if (!pdfResult.success) {
      showNotification('Error al generar PDF: ' + pdfResult.error, 'error');
      return;
    }

    abrirPdfBase64EnVentana(pdfResult.pdfBuffer, facturaPDF);
    showNotification('PDF generado en memoria', 'success');
  } catch (error) {
    console.error('Error generando PDF:', error);
    showNotification('Error al generar PDF: ' + error.message, 'error');
  }
}

async function abrirPDFFactura(factura) {
  return descargarPDFFactura(factura);
}

function abrirPdfBase64EnVentana(pdfBase64, factura) {
  const byteCharacters = atob(pdfBase64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const blob = new Blob([new Uint8Array(byteNumbers)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const codigo = factura?.codigo_generacion || factura?.numero_control || 'DTE';
  const ventana = window.open('', '_blank');

  if (!ventana) {
    showNotification('El navegador bloqueó la ventana del PDF.', 'warning');
    URL.revokeObjectURL(url);
    return;
  }

  ventana.document.write(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>PDF ${escaparHtml(codigo)}</title>
        <style>
          html, body { margin: 0; width: 100%; height: 100%; }
          iframe { border: 0; width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <iframe src="${url}" title="PDF ${escaparHtml(codigo)}"></iframe>
      </body>
    </html>
  `);
  ventana.document.close();
  ventana.addEventListener('beforeunload', () => URL.revokeObjectURL(url), { once: true });
}

window.descargarPDFFactura = descargarPDFFactura;
window.abrirPDFFactura = abrirPDFFactura;
window.cerrarModalCorreo = cerrarModalCorreo;
