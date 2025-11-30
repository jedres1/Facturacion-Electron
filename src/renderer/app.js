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
const actividadesEconomicas = [
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

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Aplicación iniciada');
  
  // Configurar navegación
  setupNavigation();
  
  // Establecer fecha actual en filtros
  establecerFechaActualFiltros();
  
  // Cargar datos iniciales
  await loadInitialData();
  
  // Configurar event listeners
  setupEventListeners();
  
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
  const fechaStr = hoy.toISOString().split('T')[0];
  
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
  const hoy = new Date().toISOString().split('T')[0];
  const facturasHoy = state.facturas.filter(f => f.fecha_emision?.startsWith(hoy));
  
  const totalHoy = facturasHoy.reduce((sum, f) => sum + (f.total || 0), 0);
  const enviadas = state.facturas.filter(f => f.estado === 'ENVIADO' || f.estado === 'ACEPTADO').length;
  const pendientes = state.facturas.filter(f => f.estado === 'PENDIENTE').length;
  
  document.getElementById('facturas-hoy').textContent = facturasHoy.length;
  document.getElementById('total-hoy').textContent = formatCurrency(totalHoy);
  document.getElementById('enviadas-hacienda').textContent = enviadas;
  document.getElementById('pendientes').textContent = pendientes;
  
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
      facturasFiltradas = facturasFiltradas.filter(f => f.estado === estadoFiltro);
    }
    
    const tbody = document.querySelector('#tabla-facturas tbody');
    
    if (facturasFiltradas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay facturas que coincidan con los filtros</td></tr>';
    } else {
      tbody.innerHTML = facturasFiltradas.map(f => {
        const clienteData = JSON.parse(f.cliente_datos || '{}');
        return `
          <tr>
            <td>${formatDate(f.fecha_emision)}</td>
            <td>${f.numero_control || 'N/A'}</td>
            <td>${clienteData.nombre || 'N/A'}</td>
            <td>${formatCurrency(f.total)}</td>
            <td><span class="badge badge-${getEstadoBadgeClass(f.estado)}">${f.estado}</span></td>
            <td>
              <button class="btn btn-small btn-primary" onclick="verFactura(${f.id})">Ver</button>
              ${f.estado === 'PENDIENTE' ? `<button class="btn btn-small btn-success" onclick="enviarFactura(${f.id})">Enviar</button>` : ''}
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
            <td>${c.nombre}</td>
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
        } else {
          document.getElementById('config-actividad').value = config.actividad_economica;
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
      const tipoFirma = config.tipo_firma || 'web';
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
    }
  } catch (error) {
    console.error('Error cargando configuración:', error);
  }
}

// Toggle entre opciones de firma web y local
function toggleFirmaOptions(tipo) {
  const webOptions = document.getElementById('firma-web-options');
  const localOptions = document.getElementById('firma-local-options');
  
  if (tipo === 'web') {
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
    option.textContent = `${c.nombre} - ${c.numero_documento}`;
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
    // Obtener valor de actividad y extraer solo el código
    const actividadInput = document.getElementById('config-actividad');
    let actividadValue = actividadInput.value;
    
    // Si tiene el formato "XX - Descripción", extraer solo el código
    if (actividadValue.includes(' - ')) {
      actividadValue = actividadValue.split(' - ')[0].trim();
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
      certificado_password: document.getElementById('config-certificado-password').value
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

    // Validar que haya items
    if (state.currentFactura.items.length === 0) {
      showNotification('Por favor agregue al menos un producto', 'error');
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
    
    // Obtener tipo de DTE
    const tipoDte = document.getElementById('tipo-dte').value;
    
    // Preparar datos del cliente para el generador
    const clienteDatos = {
      tipoDocumento: cliente.tipo_documento,
      numeroDocumento: cliente.numero_documento,
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      email: cliente.email,
      direccion: {
        complemento: cliente.direccion,
        municipio: cliente.municipio,
        departamento: cliente.departamento
      }
    };
    
    // Si es CCF, agregar NIT y NRC si están disponibles
    if (tipoDte === '03') {
      if (cliente.nit) clienteDatos.nit = cliente.nit;
      if (cliente.nrc) clienteDatos.nrc = cliente.nrc;
    }
    
    // Preparar items para el generador
    const items = state.currentFactura.items.map((item, index) => ({
      numItem: index + 1,
      tipoItem: 1, // 1=Bien, 2=Servicio
      numeroDocumento: null,
      cantidad: item.cantidad,
      codigo: item.codigo,
      codTributo: item.exento ? null : '20', // '20' = IVA 13%
      uniMedida: 99, // 99 = Unidad
      descripcion: item.descripcion,
      precioUni: item.precioUnitario,
      montoDescu: item.descuento || 0,
      ventaNoSuj: item.exento ? (item.cantidad * item.precioUnitario) - (item.descuento || 0) : 0,
      ventaExenta: 0,
      ventaGravada: !item.exento ? (item.cantidad * item.precioUnitario) - (item.descuento || 0) : 0
    }));
    
    // Preparar resumen para el generador
    const resumenDte = {
      totalNoSuj: resumen.subtotalExento,
      totalExenta: 0,
      totalGravada: resumen.subtotalGravado,
      subTotalVentas: resumen.subtotalTotal,
      descuNoSuj: 0,
      descuExenta: 0,
      descuGravada: resumen.totalDescuento,
      totalDescu: resumen.totalDescuento,
      tributos: resumen.totalIva > 0 ? [{
        codigo: '20',
        descripcion: 'Impuesto al Valor Agregado 13%',
        valor: resumen.totalIva
      }] : null,
      subTotal: resumen.subtotalTotal,
      ivaRete1: 0,
      reteRenta: 0,
      montoTotalOperacion: resumen.total,
      totalNoGravado: 0,
      totalPagar: resumen.total,
      totalLetras: numeroALetras(resumen.total),
      condicionOperacion: parseInt(document.getElementById('condicion-operacion').value),
      pagos: [{
        codigo: '01', // Efectivo
        montoPago: resumen.total,
        referencia: null,
        plazo: null,
        periodo: null
      }]
    };
    
    // Generar DTE usando el generador oficial
    const resultadoDte = await window.electronAPI.generarDTE({
      tipo: tipoDte,
      config: state.configuracion,
      cliente: clienteDatos,
      items: items,
      resumen: resumenDte,
      opciones: {
        tipoTransmision: 1, // 1=Normal
        tipoContingencia: null
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
      items: state.currentFactura.items,
      subtotal: resumen.subtotalTotal,
      iva: resumen.totalIva,
      total: resumen.total,
      descuento: resumen.totalDescuento,
      condicion_operacion: resumenDte.condicionOperacion,
      estado: 'PENDIENTE',
      json_dte: JSON.stringify(dte)
    };

    // Guardar en base de datos
    const result = await window.electronAPI.addFactura(factura);
    
    if (result) {
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
          showNotification('✓ PDF generado exitosamente', 'success');
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
      
      // Cambiar a vista de facturas
      switchView('facturas');
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
  actualizarResumenFactura();
}

// Actualizar resumen de factura
function actualizarResumenFactura() {
  const resumen = calcularResumenFactura();
  
  document.getElementById('resumen-subtotal-gravado').textContent = formatCurrency(resumen.subtotalGravado);
  document.getElementById('resumen-subtotal-exento').textContent = formatCurrency(resumen.subtotalExento);
  document.getElementById('resumen-subtotal').textContent = formatCurrency(resumen.subtotalTotal);
  document.getElementById('resumen-iva').textContent = formatCurrency(resumen.totalIva);
  document.getElementById('resumen-total').textContent = formatCurrency(resumen.total);
  document.getElementById('resumen-letras').textContent = numeroALetras(resumen.total);
}

// Calcular resumen de factura
function calcularResumenFactura() {
  let subtotalGravado = 0;
  let subtotalExento = 0;
  let totalIva = 0;
  let totalDescuento = 0;

  state.currentFactura.items.forEach(item => {
    const subtotal = (item.cantidad * item.precioUnitario) - item.descuento;
    
    if (item.exento) {
      subtotalExento += subtotal;
    } else {
      subtotalGravado += subtotal;
      totalIva += subtotal * 0.13;
    }
    
    totalDescuento += item.descuento;
  });

  const subtotalTotal = subtotalGravado + subtotalExento;
  const total = subtotalTotal + totalIva;

  return {
    subtotalGravado,
    subtotalExento,
    subtotalTotal,
    totalIva,
    total,
    totalDescuento
  };
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
  const date = new Date(dateString);
  return date.toLocaleDateString('es-SV');
}

function getEstadoBadgeClass(estado) {
  const classes = {
    'PENDIENTE': 'warning',
    'FIRMADO': 'info',
    'ENVIADO': 'info',
    'ACEPTADO': 'success',
    'RECHAZADO': 'danger'
  };
  return classes[estado] || 'secondary';
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
  
  await enviarFacturaHacienda(factura);
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
    document.getElementById('cliente-nrc').value = cliente.nrc || '';
    document.getElementById('cliente-nombre').value = cliente.nombre;
    document.getElementById('cliente-nombre-comercial').value = cliente.nombre_comercial || '';
    document.getElementById('cliente-tipo-persona').value = cliente.tipo_persona || '';
    document.getElementById('cliente-telefono').value = cliente.telefono || '';
    document.getElementById('cliente-email').value = cliente.email || '';
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
      } else {
        document.getElementById('cliente-giro').value = cliente.giro;
      }
    }
  } else {
    // Modo nuevo
    titulo.textContent = 'Nuevo Cliente';
    document.getElementById('cliente-id').value = '';
  }
  
  modal.classList.add('active');
}

// Cerrar modal de cliente
function cerrarModalCliente() {
  const modal = document.getElementById('modal-cliente');
  modal.classList.remove('active');
  document.getElementById('form-cliente').reset();
}

// Guardar cliente (nuevo o editar)
async function guardarCliente() {
  try {
    const clienteId = document.getElementById('cliente-id').value;
    
    // Obtener valor del giro y extraer solo el código
    const giroInput = document.getElementById('cliente-giro');
    let giroValue = giroInput.value;
    
    // Si tiene el formato "XX - Descripción", extraer solo el código
    if (giroValue.includes(' - ')) {
      giroValue = giroValue.split(' - ')[0].trim();
    }
    
    const clienteData = {
      tipo_documento: document.getElementById('cliente-tipo-documento').value,
      numero_documento: document.getElementById('cliente-numero-documento').value,
      nrc: document.getElementById('cliente-nrc').value,
      nombre: document.getElementById('cliente-nombre').value,
      nombre_comercial: document.getElementById('cliente-nombre-comercial').value,
      tipo_persona: document.getElementById('cliente-tipo-persona').value,
      telefono: document.getElementById('cliente-telefono').value,
      email: document.getElementById('cliente-email').value,
      departamento: document.getElementById('cliente-departamento').value,
      municipio: document.getElementById('cliente-municipio').value,
      distrito: document.getElementById('cliente-distrito').value,
      direccion: document.getElementById('cliente-direccion').value,
      giro: giroValue
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
  
  if (tipo === '13') { // NIT
    const nitRegex = /^\d{4}-\d{6}-\d{3}-\d$/;
    if (!nitRegex.test(numero)) {
      showNotification('Formato de NIT inválido. Use: 0000-000000-000-0', 'error');
      return false;
    }
  } else if (tipo === '36') { // DUI
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
      
      if (tipo === '13') {
        numeroDocInput.placeholder = '0000-000000-000-0';
      } else if (tipo === '36') {
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
  const btnDescargarPDF = document.getElementById('btn-descargar-pdf');
  const btnImprimirPDF = document.getElementById('btn-imprimir-pdf');
  
  btnFirmar.style.display = 'none';
  btnEnviar.style.display = 'none';
  
  if (factura.estado === 'PENDIENTE') {
    btnFirmar.style.display = 'inline-flex';
    btnFirmar.onclick = () => firmarFactura(factura.id);
  }
  
  if (factura.estado === 'FIRMADO') {
    btnEnviar.style.display = 'inline-flex';
    btnEnviar.onclick = () => enviarFacturaHacienda(factura.id);
  }
  
  // Botones PDF siempre visibles (si hay DTE generado)
  if (factura.json_dte) {
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
    const tipoFirma = state.configuracion.tipo_firma || 'web';
    
    if (tipoFirma === 'local' && state.configuracion.certificado_path && state.configuracion.certificado_password) {
      // Usar certificado local
      await firmarConCertificadoLocal(facturaId);
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
        showNotification('❌ Certificado inválido: ' + (validacion.info?.error || 'Certificado no válido'), 'error');
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
    
    showNotification('Firmando documento con certificado local...', 'info');
    
    // Parsear el JSON DTE de la factura
    let jsonDte = {};
    try {
      jsonDte = JSON.parse(factura.json_dte || '{}');
    } catch (e) {
      console.error('Error parseando JSON DTE:', e);
    }
    
    // Construir documento completo para firmar
    const documento = jsonDte;
    
    // Llamar al firmador con el certificado configurado
    const result = await window.electronAPI.firmarDocumento({
      documento: documento,
      pin: state.configuracion.certificado_password,
      usuario: null,
      password: null,
      certificadoPath: state.configuracion.certificado_path,
      certificadoPassword: state.configuracion.certificado_password
    });
    
    if (result.success) {
      showNotification('✓ Documento firmado exitosamente', 'success');
      
      // Actualizar estado en base de datos
      await window.electronAPI.updateFacturaEstado(facturaId, 'FIRMADO', null);
      
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
      jsonDte = JSON.parse(factura.json_dte || '{}');
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
      await window.electronAPI.updateFacturaEstado(facturaId, 'FIRMADO', null);
      
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
    
    // Validar credenciales del firmador web
    if (!usuarioFirmador || !passwordFirmador || !pinCertificado) {
      showNotification('Por favor ingrese todas las credenciales del firmador web', 'error');
      return;
    }
    
    // Verificar configuración
    if (!state.configuracion) {
      showNotification('Por favor configure los datos de la empresa primero', 'error');
      return;
    }
    
    // Cerrar modal y mostrar progreso
    cerrarModalFirmador();
    showNotification('Firmando documento... Este proceso puede tomar varios minutos.', 'info');
    
    // Parsear el JSON DTE de la factura
    let jsonDte = {};
    try {
      jsonDte = JSON.parse(factura.json_dte || '{}');
    } catch (e) {
      console.error('Error parseando JSON DTE:', e);
    }
    
    // Construir documento completo para firmar
    const documento = {
      identificacion: {
        version: 1,
        ambiente: state.configuracion.hacienda_ambiente === 'produccion' ? '00' : '01',
        tipoDte: factura.tipo_dte,
        numeroControl: factura.numero_control,
        codigoGeneracion: factura.codigo_generacion,
        tipoModelo: '1',
        tipoOperacion: '1',
        fecEmi: new Date(factura.fecha_emision).toISOString().split('T')[0],
        horEmi: new Date(factura.fecha_emision).toTimeString().split(' ')[0],
        tipoMoneda: 'USD'
      },
      emisor: {
        nit: state.configuracion.nit,
        nrc: state.configuracion.nrc,
        nombre: state.configuracion.nombre_empresa,
        codActividad: state.configuracion.actividad_economica,
        descActividad: obtenerDescripcionActividad(state.configuracion.actividad_economica),
        nombreComercial: state.configuracion.nombre_comercial,
        tipoEstablecimiento: '01',
        direccion: {
          departamento: state.configuracion.departamento,
          municipio: state.configuracion.municipio,
          complemento: state.configuracion.direccion
        },
        telefono: state.configuracion.telefono,
        correo: state.configuracion.email,
        codEstableMH: state.configuracion.codigo_establecimiento,
        codEstable: state.configuracion.codigo_establecimiento,
        codPuntoVentaMH: state.configuracion.punto_venta,
        codPuntoVenta: state.configuracion.punto_venta
      },
      receptor: jsonDte.receptor || {},
      cuerpoDocumento: jsonDte.cuerpoDocumento || [],
      resumen: jsonDte.resumen || {}
    };
    
    // Llamar al firmador
    const result = await window.electronAPI.firmarDocumento({
      documento: documento,
      pin: pinCertificado,
      usuario: usuarioFirmador,
      password: passwordFirmador,
      certificadoPath: state.configuracion.certificado_path,
      certificadoPassword: state.configuracion.certificado_password || pinCertificado
    });
    
    if (result.success) {
      showNotification('✓ Documento firmado exitosamente', 'success');
      
      // Actualizar estado en base de datos
      await window.electronAPI.updateFacturaEstado(facturaId, 'FIRMADO', null);
      
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
  const actividad = actividadesEconomicas.find(a => a.codigo === codigo);
  return actividad ? actividad.descripcion : '';
}

// Cerrar modal del firmador
function cerrarModalFirmador() {
  const modal = document.getElementById('modal-firmador');
  modal.classList.remove('active');
  document.getElementById('form-firmador').reset();
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
      dteFirmado = JSON.parse(factura.json_dte);
    } catch (e) {
      showNotification('Error al parsear DTE: ' + e.message, 'error');
      return;
    }
    
    // Enviar DTE usando el nuevo formato (modelo uno a uno)
    const resultado = await window.electronAPI.enviarDTE({
      dteFirmado: dteFirmado,
      nit: state.configuracion.nit,
      passwordPri: null // Se puede agregar si se usa certificado con password
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
        'PROCESADO',
        resultado.selloRecibido || null
      );
      
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
      await loadFacturas();
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
              errorMsg += '\n\nDetalles:\n• ' + error.observacionesDetalle.join('\n• ');
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
                jsonDte: factura.json_dte,
                tipo: dteFirmado.dteJson?.identificacion?.tipoDte || '01',
                numeroControl: dteFirmado.dteJson?.identificacion?.numeroControl
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
                jsonDte: factura.json_dte,
                tipo: dteFirmado.dteJson?.identificacion?.tipoDte || '01',
                numeroControl: dteFirmado.dteJson?.identificacion?.numeroControl
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
          errorMsg += '\nObservaciones: ' + resultado.observaciones.join(', ');
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
        const dteFirmado = JSON.parse(factura.json_dte);
        await window.electronAPI.registrarContingencia({
          facturaId: facturaId,
          jsonDte: factura.json_dte,
          tipo: dteFirmado.dteJson?.identificacion?.tipoDte || '01',
          numeroControl: dteFirmado.dteJson?.identificacion?.numeroControl
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
window.editarCliente = editarCliente;
window.eliminarCliente = eliminarCliente;
window.cerrarModalCliente = cerrarModalCliente;

// Funciones para PDF
async function descargarPDFFactura(factura) {
  try {
    showNotification('Generando PDF...', 'info');
    
    const dteFirmado = JSON.parse(factura.json_dte);
    
    // Debug: Verificar estructura del DTE
    console.log('Estructura del DTE:', {
      tieneIdentificacion: !!dteFirmado.identificacion,
      tieneDteJson: !!dteFirmado.dteJson,
      tieneDte: !!dteFirmado.dte,
      propiedades: Object.keys(dteFirmado)
    });
    
    const pdfResult = await window.electronAPI.generarPDF({
      factura: factura,
      dte: dteFirmado,
      config: state.configuracion,
      selloRecepcion: factura.sello_recepcion
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
    
    const dteFirmado = JSON.parse(factura.json_dte);
    
    // Debug: Verificar estructura del DTE
    console.log('Estructura del DTE:', {
      tieneIdentificacion: !!dteFirmado.identificacion,
      tieneDteJson: !!dteFirmado.dteJson,
      tieneDte: !!dteFirmado.dte,
      propiedades: Object.keys(dteFirmado)
    });
    
    const pdfResult = await window.electronAPI.generarPDF({
      factura: factura,
      dte: dteFirmado,
      config: state.configuracion,
      selloRecepcion: factura.sello_recepcion
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

