// Estado de la aplicación
let state = {
  currentView: 'dashboard',
  clientes: [],
  productos: [],
  facturas: [],
  configuracion: null,
  currentFactura: {
    items: [],
    cliente: null
  }
};

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
});

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
    
    console.log('Datos iniciales cargados', state);
    
    // Verificar estado de conexión con Hacienda si hay credenciales guardadas
    verificarEstadoConexion();
  } catch (error) {
    console.error('Error cargando datos iniciales:', error);
    showNotification('Error al cargar datos', 'error');
  }
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
    const estado = normalizarEstadoFactura(factura.estado);
    return estado === 'ENVIADO' || estado === 'ACEPTADO';
  };
  const esAnulada = (factura) => normalizarEstadoFactura(factura.estado) === 'ANULADO';
  
  const totalHoy = facturasHoy
    .filter(esEnviadaHacienda)
    .reduce((sum, f) => sum + (f.total || 0), 0);
  const enviadas = state.facturas.filter(esEnviadaHacienda).length;
  const pendientes = state.facturas.filter(f => !esEnviadaHacienda(f) && !esAnulada(f)).length;
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
      return `
        <tr>
          <td>${formatDate(f.fecha_emision)}</td>
          <td>${f.numero_control || 'N/A'}</td>
          <td>${clienteData.nombre || 'N/A'}</td>
          <td>${formatCurrency(f.total)}</td>
          <td><span class="badge badge-${getEstadoBadgeClass(f.estado)}">${f.estado}</span></td>
        </tr>
      `;
    }).join('');
  }
}

// Cargar facturas
async function loadFacturas() {
  try {
    state.facturas = await window.electronAPI.getFacturas({});
    updateDashboard();
    
    // Aplicar filtros
    let facturasFiltradas = [...state.facturas];
    
    const fechaDesde = document.getElementById('fecha-desde')?.value;
    const fechaHasta = document.getElementById('fecha-hasta')?.value;
    const estadoFiltro = document.getElementById('filtro-estado')?.value;
    
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
      facturasFiltradas = facturasFiltradas.filter(f => normalizarEstadoFactura(f.estado) === estadoFiltro);
    }
    
    const tbody = document.querySelector('#tabla-facturas tbody');
    
    if (facturasFiltradas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay facturas que coincidan con los filtros</td></tr>';
    } else {
      tbody.innerHTML = facturasFiltradas.map(f => {
        const clienteData = JSON.parse(f.cliente_datos || '{}');
        const estado = normalizarEstadoFactura(f.estado);
        return `
          <tr>
            <td>${formatDate(f.fecha_emision)}</td>
            <td>${f.numero_control || 'N/A'}</td>
            <td>${clienteData.nombre || 'N/A'}</td>
            <td>${formatCurrency(f.total)}</td>
            <td><span class="badge badge-${getEstadoBadgeClass(f.estado)}">${f.estado}</span></td>
            <td>
              <button class="btn btn-small btn-primary" onclick="verFactura(${f.id})">Ver</button>
              ${estado === 'PENDIENTE' ? `<button class="btn btn-small btn-success" onclick="firmarFactura(${f.id})">Firmar</button>` : ''}
              ${estado === 'FIRMADO' ? `<button class="btn btn-small btn-success" onclick="enviarFactura(${f.id})">Enviar</button>` : ''}
              ${estado === 'ENVIADO' ? `<button class="btn btn-small btn-danger" onclick="anularFactura(${f.id})">Anular</button>` : ''}
            </td>
          </tr>
        `;
      }).join('');
    }
  } catch (error) {
    console.error('Error cargando facturas:', error);
    showNotification('Error al cargar facturas', 'error');
  }
}

// Cargar clientes
async function loadClientes() {
  try {
    state.clientes = await window.electronAPI.getClientes();
    const tbody = document.querySelector('#tabla-clientes tbody');
    
    if (state.clientes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay clientes</td></tr>';
    } else {
      tbody.innerHTML = state.clientes.map(c => {
        // Construir información de ubicación
        let ubicacion = '';
        if (c.distrito) {
          const nombreDistrito = obtenerNombreDistrito(c.distrito);
          ubicacion = nombreDistrito;
        } else if (c.municipio && c.departamento) {
          const nombreMunicipio = obtenerNombreMunicipio(c.departamento, c.municipio);
          ubicacion = nombreMunicipio;
        } else if (c.departamento) {
          const depto = window.divisionGeografica?.departamentos.find(d => d.codigo === c.departamento);
          ubicacion = depto?.nombre || c.departamento;
        } else {
          ubicacion = 'N/A';
        }
        
        return `
          <tr>
            <td>${c.numero_documento}</td>
            <td>${c.nrc || 'N/A'}</td>
            <td>${c.nombre}${Number(c.aplica_exportacion) ? ' <span class="badge badge-info">Exportación</span>' : ''}</td>
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
    }
  } catch (error) {
    console.error('Error cargando clientes:', error);
    showNotification('Error al cargar clientes', 'error');
  }
}

// Cargar productos
async function loadProductos() {
  try {
    state.productos = await window.electronAPI.getProductos();
    const tbody = document.querySelector('#tabla-productos tbody');
    
    if (state.productos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay productos</td></tr>';
    } else {
      tbody.innerHTML = state.productos.map(p => {
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
    }
  } catch (error) {
    console.error('Error cargando productos:', error);
    showNotification('Error al cargar productos', 'error');
  }
}

// Cargar configuración
async function loadConfiguracion() {
  try {
    const config = await window.electronAPI.getConfiguracion();
    if (config) {
      document.getElementById('config-nit').value = config.nit || '';
      document.getElementById('config-nrc').value = config.nrc || '';
      document.getElementById('config-nombre').value = config.nombre_empresa || '';
      document.getElementById('config-nombre-comercial').value = config.nombre_comercial || '';
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
    }
  } catch (error) {
    console.error('Error cargando configuración:', error);
  }
}

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
  document.getElementById('btn-filtrar')?.addEventListener('click', loadFacturas);
  
  // Filtros automáticos al cambiar fecha o estado
  document.getElementById('fecha-desde')?.addEventListener('change', loadFacturas);
  document.getElementById('fecha-hasta')?.addEventListener('change', loadFacturas);
  document.getElementById('filtro-estado')?.addEventListener('change', loadFacturas);
  
  // Configuración
  document.getElementById('form-configuracion')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await guardarConfiguracion();
  });
  
  // Nueva factura
  document.getElementById('form-factura')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await generarFactura();
  });

  document.getElementById('tipo-dte')?.addEventListener('change', actualizarCamposNotaCredito);
  document.getElementById('cliente-select')?.addEventListener('change', sugerirTipoDteClienteSeleccionado);
  document.getElementById('nc-tipo-generacion')?.addEventListener('change', actualizarPlaceholderDocumentoRelacionado);
  document.getElementById('exportacion-tipo-item')?.addEventListener('change', actualizarCamposExportacionFactura);
  document.getElementById('retencion-monto-sujeto')?.addEventListener('input', actualizarResumenFactura);
  document.getElementById('retencion-porcentaje')?.addEventListener('input', actualizarResumenFactura);
  
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

  document.getElementById('form-correo')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await procesarEnvioCorreoFactura();
  });
  
  // Botón seleccionar certificado
  document.getElementById('btn-select-certificado')?.addEventListener('click', async () => {
    await seleccionarCertificado();
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
      correo_nombre: document.getElementById('config-correo-nombre').value
    };
    
    await window.electronAPI.updateConfiguracion(config);
    state.configuracion = config;
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

// Generar factura
async function generarFactura() {
  try {
    // Validar que haya cliente seleccionado
    const clienteId = document.getElementById('cliente-select').value;
    if (!clienteId) {
      showNotification('Por favor seleccione un cliente', 'error');
      return;
    }

    // Obtener tipo de DTE
    const tipoDte = document.getElementById('tipo-dte').value;
    const requiereDocumentoRelacionado = ['05', '06', '07'].includes(tipoDte);
    const esRetencion = tipoDte === '07';

    if (!esRetencion && state.currentFactura.items.length === 0) {
      showNotification('Por favor agregue al menos un producto', 'error');
      return;
    }

    const datosRetencion = esRetencion ? obtenerDatosRetencion() : null;
    if (esRetencion && (!datosRetencion || datosRetencion.montoSujeto <= 0 || datosRetencion.porcentaje <= 0)) {
      showNotification('Ingrese el monto sujeto y el porcentaje de retención.', 'error');
      return;
    }

    // Obtener datos del cliente
    const cliente = state.clientes.find(c => c.id === parseInt(clienteId));
    if (!cliente) {
      showNotification('Cliente no encontrado', 'error');
      return;
    }

    // Calcular totales
    const resumen = calcularResumenFactura();
    
    const documentoRelacionado = requiereDocumentoRelacionado ? obtenerDocumentoRelacionadoNotaCredito() : null;

    if (requiereDocumentoRelacionado && !documentoRelacionado) {
      return;
    }

    const errorReceptor = validarReceptorParaHacienda(tipoDte, cliente, state.configuracion);
    if (errorReceptor) {
      showNotification(errorReceptor, 'error');
      return;
    }

    const errorExportacion = validarClienteExportacion(tipoDte, cliente);
    if (errorExportacion) {
      showNotification(errorExportacion, 'error');
      return;
    }

    const errorSujetoExcluido = validarClienteSujetoExcluido(tipoDte, cliente);
    if (errorSujetoExcluido) {
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
    const items = esRetencion ? [] : state.currentFactura.items.map((item, index) => ({
      numItem: index + 1,
      tipoItem: 1, // 1=Bien, 2=Servicio
      numeroDocumento: null,
      cantidad: item.cantidad,
      codigo: item.codigo,
      codTributo: item.exento ? null : '20', // '20' = IVA 13%
      unidad_medida: item.unidad_medida || 'UND',
      descripcion: item.descripcion,
      precio_unitario: item.precioUnitario,
      numero_documento: requiereDocumentoRelacionado ? documentoRelacionado.numeroDocumento : null,
      numeroDocumento: requiereDocumentoRelacionado ? documentoRelacionado.numeroDocumento : null,
      montoDescu: item.descuento || 0,
      descuento: item.descuento || 0,
      exento: item.exento,
      ventaNoSuj: item.exento ? (item.cantidad * item.precioUnitario) - (item.descuento || 0) : 0,
      ventaExenta: 0,
      ventaGravada: !item.exento ? (item.cantidad * item.precioUnitario) - (item.descuento || 0) : 0
    }));
    
    // Preparar resumen para el generador
    const esFacturaConsumidorFinal = tipoDte === '01';
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
    const ivaDte = esDocumentoSinIva ? 0 : resumen.totalIva;
    const montoRetencion = esRetencion ? datosRetencion.ivaRetenido : 0;

    const resumenDte = {
      subtotal: subtotalDte,
      total: totalDte,
      iva: ivaDte,
      gravada: esDocumentoSinIva ? resumen.subtotalTotal : totalGravadoDte,
      exenta: 0,
      descuento: resumen.totalDescuento,
      totalNoSuj: resumen.subtotalExento,
      totalExenta: 0,
      totalGravada: totalGravadoDte,
      subTotalVentas: subtotalDte,
      descuNoSuj: 0,
      descuExenta: 0,
      descuGravada: resumen.totalDescuento,
      totalDescu: resumen.totalDescuento,
      tributos: ivaDte > 0 ? [{
        codigo: '20',
        descripcion: 'Impuesto al Valor Agregado 13%',
        valor: ivaDte
      }] : null,
      subTotal: subtotalDte,
      ivaRete1: 0,
      reteRenta: 0,
      montoTotalOperacion: roundMoney(totalDte),
      totalNoGravado: 0,
      totalPagar: roundMoney(totalDte),
      totalLetras: numeroALetras(totalDte),
      condicionOperacion: parseInt(document.getElementById('condicion-operacion').value),
      pagos: [{
        codigo: '01', // Efectivo
        montoPago: roundMoney(totalDte),
        referencia: null,
        plazo: null,
        periodo: null
      }],
      totalSujetoRetencion: esRetencion ? datosRetencion.montoSujeto : undefined,
      totalIVAretenido: esRetencion ? montoRetencion : undefined
    };
    
    // Generar DTE usando el generador oficial
    const resultadoDte = await window.electronAPI.generarDTE({
      tipo: tipoDte,
      config: {
        ...state.configuracion,
        desc_actividad: obtenerDescripcionActividad(state.configuracion.actividad_economica)
      },
      cliente: clienteDatos,
      items: items,
      resumen: resumenDte,
      opciones: {
        tipoTransmision: 1, // 1=Normal
        tipoContingencia: null,
        documentoRelacionado,
        codigoRetencionMH: document.getElementById('retencion-codigo')?.value || '22',
        retencion: datosRetencion,
        ...opcionesExportacion
      }
    });
    
    if (!resultadoDte.success) {
      showNotification('Error al generar DTE: ' + resultadoDte.error, 'error');
      return;
    }
    
    const dte = resultadoDte.dte;
    
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
        telefono: cliente.telefono,
        email: cliente.email,
        direccion: cliente.direccion,
        municipio: cliente.municipio,
        departamento: cliente.departamento
      },
      items: esRetencion ? [] : state.currentFactura.items,
      subtotal: esRetencion ? datosRetencion.montoSujeto : resumen.subtotalTotal,
      iva: ivaDte,
      total: totalDte,
      descuento: resumen.totalDescuento,
      retencion: montoRetencion,
      condicion_operacion: resumenDte.condicionOperacion,
      estado: 'PENDIENTE',
      json_dte: dte
    };

    // Guardar en base de datos
    const result = await window.electronAPI.addFactura(factura);
    
    if (result) {
      const facturaGuardadaId = Number(result.lastInsertRowid || result.id);
      showNotification('Factura generada exitosamente según schema oficial MH', 'success');
      
      // Generar PDF automáticamente
      showNotification('Generando PDF...', 'info');
      try {
        const pdfResult = await window.electronAPI.generarPDF({
          factura: {
            ...factura,
            id: result.id || Date.now()
          },
          dte: dte,
          config: state.configuracion
        });
        
        if (pdfResult.success) {
          console.log('PDF generado en:', pdfResult.pdfPath);
          showNotification('✓ PDF generado exitosamente: ' + pdfResult.pdfPath, 'success');
        } else {
          console.error('Error generando PDF:', pdfResult.error);
          showNotification('⚠ Factura guardada pero no se pudo generar PDF', 'warning');
        }
      } catch (pdfError) {
        console.error('Error al generar PDF:', pdfError);
        // No bloquear por error de PDF
      }
      
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

      const facturaGuardada = state.facturas.find(f => f.id === facturaGuardadaId);
      if (facturaGuardada) {
        abrirModalVerFactura(facturaGuardada);
      }
    }
  } catch (error) {
    console.error('Error generando factura:', error);
    showNotification('Error al generar factura: ' + error.message, 'error');
  }
}

// Limpiar formulario de factura
function limpiarFormularioFactura() {
  document.getElementById('form-factura').reset();
  state.currentFactura = { items: [], cliente: null };
  document.getElementById('items-body').innerHTML = '<tr><td colspan="6" class="text-center">No hay items agregados</td></tr>';
  actualizarCamposNotaCredito();
  actualizarResumenFactura();
}

function actualizarCamposNotaCredito() {
  const tipoDte = document.getElementById('tipo-dte')?.value;
  const section = document.getElementById('nota-credito-section');
  const submitButton = document.querySelector('#form-factura button[type="submit"]');
  const requerido = ['05', '06', '07'].includes(tipoDte);
  const esRetencion = tipoDte === '07';
  const ayuda = document.getElementById('documento-relacionado-ayuda');
  const retencionCodigoGroup = document.getElementById('retencion-codigo-group');
  const retencionMontoGroup = document.getElementById('retencion-monto-group');
  const retencionPorcentajeGroup = document.getElementById('retencion-porcentaje-group');
  const retencionValorGroup = document.getElementById('retencion-valor-group');
  const tipoDocumentoSelect = document.getElementById('nc-tipo-documento');
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
    if (input) input.required = requerido;
  });

  ['retencion-codigo', 'retencion-monto-sujeto', 'retencion-porcentaje'].forEach((id) => {
    const input = document.getElementById(id);
    if (input) input.required = esRetencion;
  });

  if (submitButton) {
    submitButton.textContent = obtenerTextoBotonGenerar(tipoDte);
  }

  actualizarPlaceholderDocumentoRelacionado();
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

function obtenerNombreTipoDte(tipoDte) {
  const nombres = {
    '01': 'Factura',
    '03': 'CCF',
    '11': 'Exportación',
    '14': 'Sujeto Excluido'
  };
  return nombres[tipoDte] || tipoDte;
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
    '05': 'Para Nota de Crédito tipo 05, Hacienda requiere relacionar un CCF o comprobante de retención previo.',
    '06': 'Para Nota de Débito tipo 06, Hacienda requiere relacionar un CCF o comprobante de retención previo.',
    '07': 'Para Comprobante de Retención tipo 07, relacione la Factura o CCF sujeto a retención.'
  };
  return ayudas[tipoDte] || 'Hacienda requiere relacionar el documento tributario afectado.';
}

function obtenerTiposDocumentoRelacionadoPermitidos(tipoDte) {
  if (tipoDte === '05' || tipoDte === '06') return ['03', '07'];
  if (tipoDte === '07') return ['01', '03'];
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
    showNotification('Complete el número y fecha del documento relacionado para la Nota de Crédito.', 'error');
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

// Actualizar resumen de factura
function actualizarResumenFactura() {
  const resumen = calcularResumenFactura();
  const tipoDte = document.getElementById('tipo-dte')?.value;
  const esRetencion = tipoDte === '07';
  const datosRetencion = esRetencion ? obtenerDatosRetencion() : null;
  const mostrarSinIva = ['07', '11', '14'].includes(tipoDte);
  const totalVisual = esRetencion ? datosRetencion.ivaRetenido : (mostrarSinIva ? resumen.subtotalTotal : resumen.total);
  const ivaVisual = mostrarSinIva ? 0 : resumen.totalIva;
  const subtotalGravadoVisual = esRetencion ? datosRetencion.montoSujeto : resumen.subtotalGravado;
  const subtotalExentoVisual = esRetencion ? 0 : resumen.subtotalExento;
  const subtotalTotalVisual = esRetencion ? datosRetencion.montoSujeto : resumen.subtotalTotal;
  
  document.getElementById('resumen-subtotal-gravado').textContent = formatCurrency(subtotalGravadoVisual);
  document.getElementById('resumen-subtotal-exento').textContent = formatCurrency(subtotalExentoVisual);
  document.getElementById('resumen-subtotal').textContent = formatCurrency(subtotalTotalVisual);
  document.getElementById('resumen-iva').textContent = formatCurrency(esRetencion ? datosRetencion.ivaRetenido : ivaVisual);
  document.getElementById('resumen-total').textContent = formatCurrency(totalVisual);
  document.getElementById('resumen-letras').textContent = numeroALetras(totalVisual);

  actualizarEtiquetasResumenRetencion(esRetencion);
  actualizarValorRetencionCalculado(datosRetencion);
}

// Calcular resumen de factura
function calcularResumenFactura() {
  let subtotalGravado = 0;
  let subtotalExento = 0;
  let totalIva = 0;
  let totalDescuento = 0;

  state.currentFactura.items.forEach(item => {
    const subtotal = roundMoney((item.cantidad * item.precioUnitario) - item.descuento);
    
    if (item.exento) {
      subtotalExento += subtotal;
    } else {
      subtotalGravado += subtotal;
      totalIva += roundMoney(subtotal * 0.13);
    }
    
    totalDescuento += item.descuento;
  });

  subtotalGravado = roundMoney(subtotalGravado);
  subtotalExento = roundMoney(subtotalExento);
  totalIva = roundMoney(totalIva);
  totalDescuento = roundMoney(totalDescuento);

  const subtotalTotal = roundMoney(subtotalGravado + subtotalExento);
  const total = roundMoney(subtotalTotal + totalIva);

  return {
    subtotalGravado,
    subtotalExento,
    subtotalTotal,
    totalIva,
    total,
    totalDescuento
  };
}

function roundMoney(value) {
  return Number(Number(value || 0).toFixed(2));
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

function refrescarFechaEmisionDTE(dte) {
  if (!dte?.identificacion) return dte;

  const ahora = new Date();
  dte.identificacion.fecEmi = formatearFechaLocal(ahora);
  dte.identificacion.horEmi = formatearHoraLocal(ahora);
  delete dte.firmaMh;
  delete dte.documentoFirmado;
  delete dte.documento;
  delete dte.firma;

  return dte;
}

function limpiarDocumentoFiscal(valor) {
  return String(valor || '').replace(/[^0-9]/g, '');
}

function validarReceptorParaHacienda(tipoDte, cliente, config) {
  const tipo = String(tipoDte || '');
  if (!['03', '05', '06', '07'].includes(tipo)) return null;

  const nitEmisor = limpiarDocumentoFiscal(config?.nit || config?.hacienda_usuario);
  const tipoDocumento = String(cliente?.tipo_documento || '');
  const numeroReceptor = limpiarDocumentoFiscal(cliente?.numero_documento);

  if (tipo === '07') {
    if (tipoDocumento === '36' && numeroReceptor.length !== 14) {
      return 'Para Comprobante de Retención con receptor NIT, el documento debe tener 14 dígitos.';
    }

    if (tipoDocumento === '13' && numeroReceptor.length !== 9) {
      return 'Para Comprobante de Retención con receptor DUI, el documento debe tener 9 dígitos.';
    }

    if (!['13', '36', '37', '03', '02'].includes(tipoDocumento)) {
      return 'Seleccione un tipo de documento válido para el sujeto de retención.';
    }

    if (!String(cliente?.numero_documento || '').trim()) {
      return 'Ingrese el número de documento del sujeto de retención.';
    }

    if (tipoDocumento === '36' && nitEmisor && numeroReceptor === nitEmisor) {
      return 'Para Comprobante de Retención el receptor no puede ser el mismo NIT del emisor.';
    }

    return null;
  }

  if (!numeroReceptor || numeroReceptor.length !== 14) {
    return 'Para CCF y notas el receptor debe tener NIT válido de 14 dígitos.';
  }

  if (nitEmisor && numeroReceptor === nitEmisor) {
    return 'Para CCF y notas el receptor no puede ser el mismo NIT del emisor.';
  }

  return null;
}

function validarClienteExportacion(tipoDte, cliente) {
  if (String(tipoDte || '') !== '11') return null;

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
  if (!['03', '05', '06', '07'].includes(String(tipoDte || ''))) return null;

  const nitEmisor = limpiarDocumentoFiscal(config?.nit || dte?.emisor?.nit);
  if (tipoDte === '07') {
    const tipoRelacionadoInvalido = (dte?.cuerpoDocumento || [])
      .map((item) => String(item?.tipoDte || '').padStart(2, '0'))
      .find((tipoRelacionado) => !['01', '03'].includes(tipoRelacionado));

    if (tipoRelacionadoInvalido) {
      return `El Comprobante de Retención tiene cuerpoDocumento.tipoDte ${tipoRelacionadoInvalido}, pero Hacienda solo acepta Factura 01 o CCF 03 en ese campo. Genere nuevamente el DTE.`;
    }

    const tipoDocumento = String(dte?.receptor?.tipoDocumento || '');
    const numeroReceptor = limpiarDocumentoFiscal(dte?.receptor?.numDocumento);

    if (tipoDocumento === '36' && numeroReceptor.length !== 14) {
      return 'El DTE firmado tiene receptor.numDocumento inválido para NIT. Genere nuevamente el DTE con un NIT de 14 dígitos.';
    }

    if (tipoDocumento === '13' && numeroReceptor.length !== 9) {
      return 'El DTE firmado tiene receptor.numDocumento inválido para DUI. Genere nuevamente el DTE con un DUI de 9 dígitos.';
    }

    if (!['13', '36', '37', '03', '02'].includes(tipoDocumento) || !String(dte?.receptor?.numDocumento || '').trim()) {
      return 'El DTE firmado tiene receptor.tipoDocumento o receptor.numDocumento inválido. Genere nuevamente el DTE.';
    }

    if (tipoDocumento === '36' && nitEmisor && numeroReceptor === nitEmisor) {
      return 'El DTE firmado tiene el mismo NIT en emisor y receptor. Genere una nueva factura con un cliente distinto.';
    }

    return null;
  }

  const nitReceptor = limpiarDocumentoFiscal(dte?.receptor?.nit);

  if (!nitReceptor || nitReceptor.length !== 14) {
    return 'El DTE firmado tiene receptor.nit inválido. Genere nuevamente el DTE con un receptor contribuyente válido.';
  }

  if (nitEmisor && nitReceptor === nitEmisor) {
    return 'El DTE firmado tiene el mismo NIT en emisor y receptor. Genere una nueva factura con un cliente distinto.';
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

function getEstadoBadgeClass(estado) {
  const classes = {
    'PENDIENTE': 'warning',
    'FIRMADO': 'info',
    'ENVIADO': 'info',
    'PROCESADO': 'info',
    'RECIBIDO': 'info',
    'ACEPTADO': 'success',
    'ANULADO': 'danger',
    'INVALIDADO': 'danger',
    'RECHAZADO': 'danger'
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

  return estadoNormalizado;
}

function parseDTEGuardado(jsonDte) {
  if (!jsonDte) return {};
  let parsed = typeof jsonDte === 'string' ? JSON.parse(jsonDte) : jsonDte;
  if (typeof parsed === 'string') {
    parsed = JSON.parse(parsed);
  }
  return parsed;
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
  try {
    const result = await window.electronAPI.guardarJsonDTE({
      nombreArchivo: obtenerNombreArchivoJson(factura),
      contenido: obtenerJsonDTEFormateado(factura)
    });

    if (result.success) {
      showNotification('JSON guardado en: ' + result.filePath, 'success');
    } else if (!result.canceled) {
      showNotification('No se pudo guardar JSON: ' + (result.error || 'Error desconocido'), 'error');
    }
  } catch (error) {
    showNotification('Error al guardar JSON: ' + error.message, 'error');
  }
}

function showNotification(message, type = 'info') {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // Aquí se puede implementar un sistema de notificaciones toast
  alert(message);
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
  const factura = state.facturas.find(f => f.id === id);
  if (!factura) {
    showNotification('Factura no encontrada', 'error');
    return;
  }
  
  abrirModalVerFactura(factura);
};

window.enviarFactura = async function(id) {
  const factura = state.facturas.find(f => f.id === id);
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
  
  if (cliente) {
    // Modo edición
    titulo.textContent = 'Editar Cliente';
    document.getElementById('cliente-id').value = cliente.id;
    document.getElementById('cliente-tipo-documento').value = cliente.tipo_documento;
    document.getElementById('cliente-numero-documento').value = cliente.numero_documento;
    document.getElementById('cliente-tipo-dte-default').value = cliente.tipo_dte_default || '01';
    document.getElementById('cliente-nrc').value = cliente.nrc || '';
    document.getElementById('cliente-nombre').value = cliente.nombre;
    document.getElementById('cliente-nombre-comercial').value = cliente.nombre_comercial || '';
    document.getElementById('cliente-tipo-persona').value = cliente.tipo_persona || '';
    document.getElementById('cliente-telefono').value = cliente.telefono || '';
    document.getElementById('cliente-email').value = cliente.email || '';
    document.getElementById('cliente-aplica-exportacion').checked = Number(cliente.aplica_exportacion) === 1;
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
    document.getElementById('cliente-tipo-dte-default').value = '01';
    document.getElementById('cliente-tipo-persona-exportacion').value = '2';
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
  const esExportacionDefault = tipoDteDefault === '11';
  const requiereDatosLocales = tipoDteDefault === '03';
  const section = document.getElementById('cliente-exportacion-section');
  const mostrarExportacion = aplica || esExportacionDefault;
  if (section) section.style.display = mostrarExportacion ? 'grid' : 'none';

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

    if (!['01', '03', '11', '14'].includes(tipoDteDefault)) {
      showNotification('Seleccione el documento a generar por defecto para el cliente.', 'error');
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
    
    const clienteData = {
      tipo_documento: document.getElementById('cliente-tipo-documento').value,
      numero_documento: document.getElementById('cliente-numero-documento').value,
      tipo_dte_default: tipoDteDefault,
      nrc: document.getElementById('cliente-nrc').value,
      nombre: document.getElementById('cliente-nombre').value,
      nombre_comercial: document.getElementById('cliente-nombre-comercial').value,
      tipo_persona: document.getElementById('cliente-tipo-persona').value,
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
  const numero = document.getElementById('cliente-numero-documento').value;
  
  if (tipo === '36') { // NIT
    const nitRegex = /^(\d{4}-\d{6}-\d{3}-\d|\d{14}|\d{9})$/;
    if (!nitRegex.test(numero)) {
      showNotification('Formato de NIT inválido. Use: 0000-000000-000-0', 'error');
      return false;
    }
  } else if (tipo === '13') { // DUI
    const duiRegex = /^\d{8}-\d$/;
    if (!duiRegex.test(numero)) {
      showNotification('Formato de DUI inválido. Use: 00000000-0', 'error');
      return false;
    }
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
  document.getElementById('item-descuento').value = '0';
  
  modal.classList.add('active');
}

// Cerrar modal de item
function cerrarModalItem() {
  const modal = document.getElementById('modal-item');
  modal.classList.remove('active');
}

// Cuando se selecciona un producto, mostrar su precio
document.addEventListener('DOMContentLoaded', () => {
  const productoSelect = document.getElementById('item-producto');
  const precioInput = document.getElementById('item-precio');
  
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
  
  // Manejar envío del formulario de item
  const formItem = document.getElementById('form-item');
  if (formItem) {
    formItem.addEventListener('submit', (e) => {
      e.preventDefault();
      agregarItemAFactura();
    });
  }
});

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
  const descuento = parseFloat(document.getElementById('item-descuento').value) || 0;
  
  const item = {
    id: Date.now(), // ID temporal para el item
    productoId: parseInt(selectedOption.value),
    codigo: selectedOption.dataset.codigo,
    descripcion: selectedOption.dataset.descripcion,
    cantidad: cantidad,
    precioUnitario: precio,
    descuento: descuento,
    exento: selectedOption.dataset.exento === '1',
    unidadMedida: selectedOption.dataset.unidadMedida
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
  const estadoBadge = `<span class="badge badge-${getEstadoBadgeClass(factura.estado)}">${factura.estado}</span>`;
  document.getElementById('factura-estado-badge').innerHTML = estadoBadge;
  
  // Información del cliente
  const clienteData = typeof factura.cliente_datos === 'string' 
    ? JSON.parse(factura.cliente_datos) 
    : factura.cliente_datos;
  
  document.getElementById('factura-cliente-nombre').textContent = clienteData.nombre || 'N/A';
  document.getElementById('factura-cliente-documento').textContent = clienteData.numero_documento || 'N/A';
  document.getElementById('factura-cliente-direccion').textContent = clienteData.direccion || 'N/A';
  
  // Items de la factura
  const items = typeof factura.items === 'string' ? JSON.parse(factura.items) : factura.items;
  const tbody = document.getElementById('factura-items-body');
  
  tbody.innerHTML = items.map(item => {
    const subtotal = (item.cantidad * item.precioUnitario) - (item.descuento || 0);
    const iva = item.exento ? 0 : subtotal * 0.13;
    
    return `
      <tr>
        <td>
          <strong>${item.codigo}</strong><br>
          <small>${item.descripcion}</small>
        </td>
        <td>${item.cantidad}</td>
        <td>${formatCurrency(item.precioUnitario)}</td>
        <td>${item.exento ? '<span class="badge badge-warning">Exento</span>' : formatCurrency(iva)}</td>
        <td><strong>${formatCurrency(subtotal)}</strong></td>
      </tr>
    `;
  }).join('');
  
  // Resumen
  document.getElementById('factura-subtotal').textContent = formatCurrency(factura.subtotal);
  document.getElementById('factura-iva').textContent = formatCurrency(factura.iva);
  document.getElementById('factura-total').textContent = formatCurrency(factura.total);
  
  // Mostrar botones según el estado
  const btnFirmar = document.getElementById('btn-firmar-factura');
  const btnEnviar = document.getElementById('btn-enviar-factura');
  const btnAnular = document.getElementById('btn-anular-factura');
  const btnDescargarPDF = document.getElementById('btn-descargar-pdf');
  const btnImprimirPDF = document.getElementById('btn-imprimir-pdf');
  const btnEnviarCorreo = document.getElementById('btn-enviar-correo');
  const btnVerJson = document.getElementById('btn-ver-json');
  const btnGuardarJson = document.getElementById('btn-guardar-json');
  const estadoFactura = normalizarEstadoFactura(factura.estado);
  
  btnFirmar.style.display = 'none';
  btnEnviar.style.display = 'none';
  if (btnAnular) btnAnular.style.display = 'none';
  if (btnVerJson) btnVerJson.style.display = 'none';
  if (btnGuardarJson) btnGuardarJson.style.display = 'none';
  if (btnEnviarCorreo) btnEnviarCorreo.style.display = 'none';
  
  if (estadoFactura === 'PENDIENTE') {
    btnFirmar.style.display = 'inline-flex';
    btnFirmar.onclick = () => firmarFactura(factura.id);
  }
  
  if (estadoFactura === 'FIRMADO') {
    btnEnviar.style.display = 'inline-flex';
    btnEnviar.onclick = () => enviarFacturaHacienda(factura.id);
  }

  if (estadoFactura === 'ENVIADO' && btnAnular) {
    btnAnular.style.display = 'inline-flex';
    btnAnular.onclick = () => anularFacturaHacienda(factura.id);
  }
  
  // Botones PDF siempre visibles (si hay DTE generado)
  if (factura.json_dte) {
    if (btnVerJson) {
      btnVerJson.style.display = 'inline-flex';
      btnVerJson.onclick = () => verJsonDTE(factura);
    }

    if (btnGuardarJson) {
      btnGuardarJson.style.display = 'inline-flex';
      btnGuardarJson.onclick = () => guardarJsonDTE(factura);
    }

    if (btnEnviarCorreo && ['ENVIADO', 'ACEPTADO', 'ANULADO'].includes(estadoFactura)) {
      btnEnviarCorreo.style.display = 'inline-flex';
      btnEnviarCorreo.onclick = () => abrirModalCorreo(factura);
    }

    if (btnDescargarPDF) {
      btnDescargarPDF.style.display = 'inline-flex';
      btnDescargarPDF.onclick = () => descargarPDFFactura(factura);
    }
    
    if (btnImprimirPDF) {
      btnImprimirPDF.style.display = 'inline-flex';
      btnImprimirPDF.onclick = () => abrirPDFFactura(factura);
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
async function firmarFactura(facturaId) {
  try {
    const factura = state.facturas.find(f => f.id === facturaId);
    if (!factura) {
      showNotification('Factura no encontrada', 'error');
      return;
    }
    
    // Verificar configuración
    if (!state.configuracion) {
      showNotification('Por favor configure los datos de la empresa primero', 'error');
      return;
    }
    
    // Verificar tipo de firma configurado
    const tipoFirma = state.configuracion.tipo_firma || 'svfe';
    
    if (state.configuracion.certificado_path && state.configuracion.certificado_password) {
      // Usar firmador interno con certificado local
      await firmarConCertificadoLocal(facturaId);
    } else if (tipoFirma === 'svfe' && state.configuracion.firmador_pin) {
      await firmarConFirmadorSVFE(facturaId);
    } else if (tipoFirma === 'web' && state.configuracion.firmador_usuario && state.configuracion.firmador_password) {
      // Usar firmador web con credenciales guardadas
      await firmarConFirmadorWeb(facturaId);
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
    }
  } catch (error) {
    console.error('Error al firmar factura:', error);
    showNotification('Error al firmar factura: ' + error.message, 'error');
  }
}

// Firmar con certificado local automáticamente
async function firmarConCertificadoLocal(facturaId) {
  try {
    const factura = state.facturas.find(f => f.id === facturaId);
    if (!factura) {
      showNotification('Factura no encontrada', 'error');
      return;
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
        return;
      }
      
      // Advertir si está próximo a vencer
      if (validacion.info?.advertencia) {
        const continuar = confirm(
          `⚠️ ADVERTENCIA: ${validacion.info.advertencia}\n\n` +
          `Días restantes: ${validacion.info.diasRestantes}\n\n` +
          `¿Desea continuar con la firma?`
        );
        if (!continuar) return;
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
      refrescarFechaEmisionDTE(jsonDte);
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

// Firmar con el firmador interno compatible con MH/SVFE
async function firmarConFirmadorSVFE(facturaId) {
  try {
    const factura = state.facturas.find(f => f.id === facturaId);
    if (!factura) {
      showNotification('Factura no encontrada', 'error');
      return;
    }

    showNotification('Firmando documento con firmador interno MH...', 'info');

    let jsonDte = {};
    try {
      jsonDte = parseDTEGuardado(factura.json_dte);
      refrescarFechaEmisionDTE(jsonDte);
    } catch (e) {
      showNotification('Error al parsear DTE: ' + e.message, 'error');
      return;
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

      cerrarModalVerFactura();
      await loadFacturas();
    } else {
      showNotification('✗ Error al firmar: ' + result.error, 'error');
    }
  } catch (error) {
    console.error('Error firmando con SVFE:', error);
    showNotification('Error al firmar con SVFE: ' + error.message, 'error');
  }
}

// Firmar con firmador web del MH usando credenciales guardadas
async function firmarConFirmadorWeb(facturaId) {
  try {
    const factura = state.facturas.find(f => f.id === facturaId);
    if (!factura) {
      showNotification('Factura no encontrada', 'error');
      return;
    }
    
    showNotification('Firmando documento con Firmador Web del MH...', 'info');
    
    // Parsear el JSON DTE de la factura
    let jsonDte = {};
    try {
      jsonDte = parseDTEGuardado(factura.json_dte);
      refrescarFechaEmisionDTE(jsonDte);
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

// Procesar firma del documento (solo para firmador web)
async function procesarFirmaDocumento() {
  try {
    const facturaId = parseInt(document.getElementById('firmador-factura-id').value);
    const usuarioFirmador = document.getElementById('firmador-usuario').value;
    const passwordFirmador = document.getElementById('firmador-password').value;
    const pinCertificado = document.getElementById('firmador-pin').value;
    
    const factura = state.facturas.find(f => f.id === facturaId);
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
      refrescarFechaEmisionDTE(jsonDte);
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
async function enviarFacturaHacienda(facturaId) {
  try {
    const factura = state.facturas.find(f => f.id === facturaId);
    if (!factura) {
      showNotification('Factura no encontrada', 'error');
      return;
    }
    
    if (!state.configuracion || !state.configuracion.hacienda_usuario) {
      showNotification('Por favor configure las credenciales de Hacienda primero', 'error');
      return;
    }
    
    // Verificar que la factura tenga JSON DTE
    if (!factura.json_dte) {
      showNotification('La factura no tiene DTE generado. Genere la factura primero.', 'error');
      return;
    }
    
    // Verificar que el estado sea FIRMADO o PENDIENTE
    if (factura.estado !== 'FIRMADO' && factura.estado !== 'PENDIENTE') {
      showNotification('La factura debe estar firmada antes de enviarla a Hacienda', 'error');
      return;
    }
    
    const confirmacion = confirm('¿Está seguro de enviar esta factura al Ministerio de Hacienda?');
    if (!confirmacion) return;
    
    showNotification('Enviando DTE a Hacienda (modelo uno a uno)...', 'info');
    
    // Parsear el DTE firmado
    let dteFirmado;
    try {
      dteFirmado = parseDTEGuardado(factura.json_dte);
    } catch (e) {
      showNotification('Error al parsear DTE: ' + e.message, 'error');
      return;
    }

    const errorReceptor = validarReceptorDTEParaHacienda(dteFirmado, state.configuracion);
    if (errorReceptor) {
      showNotification(errorReceptor, 'error');
      return;
    }
    
    // Enviar DTE usando el nuevo formato (modelo uno a uno)
    const resultado = await window.electronAPI.enviarDTE({
      dteFirmado: dteFirmado,
      nit: state.configuracion.nit,
      passwordPri: state.configuracion.firmador_pin || state.configuracion.certificado_password || null
    });
    
    if (resultado.success) {
      showNotification('✓ Factura enviada exitosamente a Hacienda', 'success');
      
      // Mostrar información de la respuesta
      if (resultado.selloRecibido) {
        console.log('Sello recibido:', resultado.selloRecibido);
        console.log('Estado:', resultado.estado);
      }
      
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
      
      // Regenerar PDF con sello de recepción si está disponible
      if (resultado.selloRecibido) {
        try {
          const pdfResult = await window.electronAPI.generarPDF({
            factura: factura,
            dte: dteFirmado,
            config: state.configuracion,
            selloRecepcion: resultado.selloRecibido
          });
          
          if (pdfResult.success) {
            console.log('PDF actualizado con sello MH:', pdfResult.pdfPath);
          }
        } catch (pdfError) {
          console.error('Error regenerando PDF con sello:', pdfError);
        }
      }
      
      cerrarModalVerFactura();
    } else {
      // Procesar error usando la nueva estructura de errores
      let errorMsg = 'Error al enviar a Hacienda';
      let mostrarReintento = false;
      
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
            break;
          case 'SERVICIO_NO_DISPONIBLE':
            errorMsg = '⚠️ Servicio de Hacienda temporalmente no disponible';
            errorMsg += '\n\nLa factura se ha guardado en contingencia y se reenviará automáticamente.';
            mostrarReintento = true;
            
            // Registrar en contingencia
            try {
              await window.electronAPI.registrarContingencia({
                facturaId: facturaId,
                tipo: '2',
                motivo: error.mensaje
              });
            } catch (e) {
              console.error('Error registrando contingencia:', e);
            }
            break;
          case 'TIMEOUT':
          case 'RED':
            errorMsg = '⚠️ Error de conexión: ' + error.mensaje;
            errorMsg += '\n\nVerifique su conexión a internet.';
            mostrarReintento = true;
            
            // Registrar en contingencia
            try {
              await window.electronAPI.registrarContingencia({
                facturaId: facturaId,
                tipo: '1',
                motivo: error.mensaje
              });
            } catch (e) {
              console.error('Error registrando contingencia:', e);
            }
            break;
          default:
            errorMsg = 'Error: ' + (error.mensaje || resultado.error);
        }
        
        // Mostrar código de error si está disponible
        if (error.codigo) {
          errorMsg += `\n\nCódigo: ${error.codigo}`;
        }
        
      } else {
        // Formato de error antiguo
        errorMsg = 'Error al enviar: ' + resultado.error;
        if (resultado.observaciones && resultado.observaciones.length > 0) {
          errorMsg += '\nObservaciones: ' + formatearObservaciones(resultado.observaciones).join(', ');
        }
      }
      
      showNotification(errorMsg, 'error');
      console.error('Error completo:', resultado);
      
      // Mostrar opción de reintento si aplica
      if (mostrarReintento) {
        if (confirm('¿Desea reintentar el envío ahora?')) {
          await enviarFacturaHacienda(facturaId);
        }
      }
    }
  } catch (error) {
    console.error('Error enviando factura:', error);
    
    // En caso de error inesperado, intentar registrar en contingencia
    try {
      const factura = state.facturas.find(f => f.id === facturaId);
      if (factura && factura.json_dte) {
        await window.electronAPI.registrarContingencia({
          facturaId: facturaId,
          tipo: '5',
          motivo: error.message
        });
        showNotification('⚠️ Error inesperado. Factura guardada en contingencia.', 'warning');
      } else {
        showNotification('Error al enviar factura: ' + error.message, 'error');
      }
    } catch (e) {
      showNotification('Error al enviar factura: ' + error.message, 'error');
    }
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
  const receptor = dte?.receptor || {};
  const tipoDocumento = receptor.tipoDocumento || (receptor.nit ? '36' : null) || '36';
  const numeroDocumento = receptor.numDocumento || receptor.nit || receptor.numeroDocumento || config?.nit || '';

  return {
    tipoDocumento,
    numeroDocumento: String(numeroDocumento || '')
  };
}

function obtenerMontoIvaDTE(dte) {
  const resumen = dte?.resumen || {};
  const tributoIva = Array.isArray(resumen.tributos)
    ? resumen.tributos.find(t => t?.codigo === '20')
    : null;

  return redondearDos(resumen.totalIva || tributoIva?.valor || dte?.iva || 0);
}

function crearEventoAnulacion(factura, dte, opciones = {}) {
  dte = dte || {};
  const ahora = new Date();
  const config = state.configuracion || {};
  const receptor = dte.receptor || {};
  const receptorDocumento = obtenerDocumentoReceptorParaAnulacion(dte, config);
  const nitEmisor = limpiarDocumentoFiscal(dte.emisor?.nit || config.nit || config.hacienda_usuario);
  const nombreEmisor = dte.emisor?.nombre || config.nombre_empresa;
  const telefonoEmisor = dte.emisor?.telefono || config.telefono || null;
  const correoEmisor = dte.emisor?.correo || config.email || null;
  const tipDocSolicita = receptorDocumento.tipoDocumento || '36';
  const numDocSolicita = receptorDocumento.numeroDocumento || config.nit || nitEmisor;

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
      codigoGeneracionR: null,
      tipoDocumento: receptorDocumento.tipoDocumento,
      numDocumento: receptorDocumento.numeroDocumento,
      nombre: receptor.nombre || 'CONSUMIDOR FINAL',
      telefono: receptor.telefono || null,
      correo: receptor.correo || null
    },
    motivo: {
      tipoAnulacion: Number(opciones.tipoAnulacion || 2),
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

async function anularFacturaHacienda(facturaId) {
  const factura = state.facturas.find(f => f.id === facturaId);
  if (!factura) {
    showNotification('Factura no encontrada', 'error');
    return;
  }

  if (normalizarEstadoFactura(factura.estado) !== 'ENVIADO') {
    showNotification('Solo se pueden anular facturas enviadas a Hacienda', 'warning');
    return;
  }

  if (!factura.sello_recepcion) {
    showNotification('La factura no tiene sello de recepción de Hacienda', 'error');
    return;
  }

  document.getElementById('anulacion-factura-id').value = facturaId;
  document.getElementById('anulacion-tipo').value = '2';
  document.getElementById('anulacion-motivo').value = 'Rescindir operación realizada';
  document.getElementById('modal-anulacion').classList.add('active');
}

async function procesarAnulacionFactura() {
  const btnConfirmar = document.getElementById('btn-confirmar-anulacion');

  try {
    const facturaId = Number(document.getElementById('anulacion-factura-id').value);
    const tipo = Number(document.getElementById('anulacion-tipo').value);
    const motivo = document.getElementById('anulacion-motivo').value.trim();
    const factura = state.facturas.find(f => f.id === facturaId);

    if (!factura) {
      showNotification('Factura no encontrada', 'error');
      return;
    }

    if (normalizarEstadoFactura(factura.estado) !== 'ENVIADO') {
      showNotification('Solo se pueden anular facturas enviadas a Hacienda', 'warning');
      return;
    }

    if (!factura.sello_recepcion) {
      showNotification('La factura no tiene sello de recepción de Hacienda', 'error');
      return;
    }

    if (![1, 2, 3].includes(tipo)) {
      showNotification('Tipo de anulación inválido. Use 1, 2 o 3.', 'error');
      return;
    }

    if (!motivo) {
      showNotification('Ingrese el motivo de anulación', 'error');
      return;
    }

    if (btnConfirmar) {
      btnConfirmar.disabled = true;
      btnConfirmar.textContent = 'Enviando...';
    }

    const dte = parseDTEGuardado(factura.json_dte);
    const evento = crearEventoAnulacion(factura, dte, {
      tipoAnulacion: tipo,
      motivoAnulacion: motivo
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

    showNotification('✓ Factura anulada exitosamente en Hacienda', 'success');
    cerrarModalVerFactura();
    cerrarModalAnulacion();
    await loadFacturas();
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
    estado: normalizarEstadoFactura(facturaActualizada.estado || factura.estado)
  };
}

function abrirModalCorreo(factura) {
  const facturaPDF = obtenerFacturaActualizadaParaPDF(factura);
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
  document.getElementById('correo-mensaje').value =
    `Estimado cliente,\n\nAdjunto encontrara el PDF y JSON enviados a Hacienda correspondientes al Documento Tributario Electronico ${codigo}.\n\nSaludos.`;
  modal.classList.add('active');
}

function cerrarModalCorreo() {
  document.getElementById('modal-correo')?.classList.remove('active');
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

    if (!state.configuracion?.correo_usuario || !state.configuracion?.correo_password) {
      showNotification('Configure el correo Gmail y la contraseña de aplicación en Configuración.', 'error');
      return;
    }

    const estadoFactura = normalizarEstadoFactura(facturaPDF.estado);
    if (!['ENVIADO', 'ACEPTADO', 'ANULADO'].includes(estadoFactura)) {
      showNotification('Solo puede enviar por correo documentos ya enviados a Hacienda.', 'warning');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Enviando...';
    }

    const dteFirmado = parseDTEGuardado(facturaPDF.json_dte);
    const resultado = await window.electronAPI.enviarCorreoDTE({
      factura: facturaPDF,
      dte: dteFirmado,
      config: state.configuracion,
      destinatario: document.getElementById('correo-destinatario').value.trim(),
      asunto: document.getElementById('correo-asunto').value.trim(),
      mensaje: document.getElementById('correo-mensaje').value
    });

    if (resultado.success) {
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
    showNotification('Generando PDF...', 'info');
    const facturaPDF = obtenerFacturaActualizadaParaPDF(factura);
    
    const dteFirmado = parseDTEGuardado(facturaPDF.json_dte);
    
    // Debug: Verificar estructura del DTE
    console.log('Estructura del DTE:', {
      tieneIdentificacion: !!dteFirmado.identificacion,
      tieneDteJson: !!dteFirmado.dteJson,
      tieneDte: !!dteFirmado.dte,
      propiedades: Object.keys(dteFirmado)
    });
    
    const pdfResult = await window.electronAPI.generarPDF({
      factura: facturaPDF,
      dte: dteFirmado,
      config: state.configuracion,
      selloRecepcion: facturaPDF.sello_recepcion
    });
    
    if (pdfResult.success) {
      showNotification('✓ PDF generado: ' + pdfResult.pdfPath, 'success');
      // Abrir ubicación del archivo en el explorador
      await window.electronAPI.abrirPDF(pdfResult.pdfPath);
    } else {
      showNotification('Error al generar PDF: ' + pdfResult.error, 'error');
    }
  } catch (error) {
    console.error('Error generando PDF:', error);
    showNotification('Error al generar PDF: ' + error.message, 'error');
  }
}

async function abrirPDFFactura(factura) {
  try {
    showNotification('Generando PDF...', 'info');
    const facturaPDF = obtenerFacturaActualizadaParaPDF(factura);
    
    const dteFirmado = parseDTEGuardado(facturaPDF.json_dte);
    
    // Debug: Verificar estructura del DTE
    console.log('Estructura del DTE:', {
      tieneIdentificacion: !!dteFirmado.identificacion,
      tieneDteJson: !!dteFirmado.dteJson,
      tieneDte: !!dteFirmado.dte,
      propiedades: Object.keys(dteFirmado)
    });
    
    const pdfResult = await window.electronAPI.generarPDF({
      factura: facturaPDF,
      dte: dteFirmado,
      config: state.configuracion,
      selloRecepcion: facturaPDF.sello_recepcion
    });
    
    if (pdfResult.success) {
      // Abrir con visor predeterminado
      await window.electronAPI.abrirPDF(pdfResult.pdfPath);
      showNotification('✓ PDF abierto', 'success');
    } else {
      showNotification('Error al generar PDF: ' + pdfResult.error, 'error');
    }
  } catch (error) {
    console.error('Error abriendo PDF:', error);
    showNotification('Error al abrir PDF: ' + error.message, 'error');
  }
}

window.descargarPDFFactura = descargarPDFFactura;
window.abrirPDFFactura = abrirPDFFactura;
window.cerrarModalCorreo = cerrarModalCorreo;
