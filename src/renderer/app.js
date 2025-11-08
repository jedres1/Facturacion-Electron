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

// Municipios de El Salvador por departamento (Actualizado 2025)
const municipiosPorDepartamento = {
  '01': [ // Ahuachapán
    { codigo: '01', nombre: 'Ahuachapán' },
    { codigo: '02', nombre: 'Apaneca' },
    { codigo: '03', nombre: 'Atiquizaya' },
    { codigo: '04', nombre: 'Concepción de Ataco' },
    { codigo: '05', nombre: 'El Refugio' },
    { codigo: '06', nombre: 'Guaymango' },
    { codigo: '07', nombre: 'Jujutla' },
    { codigo: '08', nombre: 'San Francisco Menéndez' },
    { codigo: '09', nombre: 'San Lorenzo' },
    { codigo: '10', nombre: 'San Pedro Puxtla' },
    { codigo: '11', nombre: 'Tacuba' },
    { codigo: '12', nombre: 'Turín' }
  ],
  '02': [ // Santa Ana
    { codigo: '01', nombre: 'Candelaria de la Frontera' },
    { codigo: '02', nombre: 'Chalchuapa' },
    { codigo: '03', nombre: 'Coatepeque' },
    { codigo: '04', nombre: 'El Congo' },
    { codigo: '05', nombre: 'El Porvenir' },
    { codigo: '06', nombre: 'Masahuat' },
    { codigo: '07', nombre: 'Metapán' },
    { codigo: '08', nombre: 'San Antonio Pajonal' },
    { codigo: '09', nombre: 'San Sebastián Salitrillo' },
    { codigo: '10', nombre: 'Santa Ana' },
    { codigo: '11', nombre: 'Santa Rosa Guachipilín' },
    { codigo: '12', nombre: 'Santiago de la Frontera' },
    { codigo: '13', nombre: 'Texistepeque' }
  ],
  '03': [ // Sonsonate
    { codigo: '01', nombre: 'Acajutla' },
    { codigo: '02', nombre: 'Armenia' },
    { codigo: '03', nombre: 'Caluco' },
    { codigo: '04', nombre: 'Cuisnahuat' },
    { codigo: '05', nombre: 'Izalco' },
    { codigo: '06', nombre: 'Juayúa' },
    { codigo: '07', nombre: 'Nahuizalco' },
    { codigo: '08', nombre: 'Nahulingo' },
    { codigo: '09', nombre: 'Salcoatitán' },
    { codigo: '10', nombre: 'San Antonio del Monte' },
    { codigo: '11', nombre: 'San Julián' },
    { codigo: '12', nombre: 'Santa Catarina Masahuat' },
    { codigo: '13', nombre: 'Santa Isabel Ishuatán' },
    { codigo: '14', nombre: 'Santo Domingo de Guzmán' },
    { codigo: '15', nombre: 'Sonsonate' },
    { codigo: '16', nombre: 'Sonzacate' }
  ],
  '04': [ // Chalatenango
    { codigo: '01', nombre: 'Agua Caliente' },
    { codigo: '02', nombre: 'Arcatao' },
    { codigo: '03', nombre: 'Azacualpa' },
    { codigo: '04', nombre: 'Chalatenango' },
    { codigo: '05', nombre: 'Citalá' },
    { codigo: '06', nombre: 'Comalapa' },
    { codigo: '07', nombre: 'Concepción Quezaltepeque' },
    { codigo: '08', nombre: 'Dulce Nombre de María' },
    { codigo: '09', nombre: 'El Carrizal' },
    { codigo: '10', nombre: 'El Paraíso' },
    { codigo: '11', nombre: 'La Laguna' },
    { codigo: '12', nombre: 'La Palma' },
    { codigo: '13', nombre: 'La Reina' },
    { codigo: '14', nombre: 'Las Vueltas' },
    { codigo: '15', nombre: 'Nueva Concepción' },
    { codigo: '16', nombre: 'Nueva Trinidad' },
    { codigo: '17', nombre: 'Nombre de Jesús' },
    { codigo: '18', nombre: 'Ojos de Agua' },
    { codigo: '19', nombre: 'Potonico' },
    { codigo: '20', nombre: 'San Antonio de la Cruz' },
    { codigo: '21', nombre: 'San Antonio Los Ranchos' },
    { codigo: '22', nombre: 'San Fernando' },
    { codigo: '23', nombre: 'San Francisco Lempa' },
    { codigo: '24', nombre: 'San Francisco Morazán' },
    { codigo: '25', nombre: 'San Ignacio' },
    { codigo: '26', nombre: 'San Isidro Labrador' },
    { codigo: '27', nombre: 'San José Cancasque' },
    { codigo: '28', nombre: 'San José Las Flores' },
    { codigo: '29', nombre: 'San Luis del Carmen' },
    { codigo: '30', nombre: 'San Miguel de Mercedes' },
    { codigo: '31', nombre: 'San Rafael' },
    { codigo: '32', nombre: 'Santa Rita' },
    { codigo: '33', nombre: 'Tejutla' }
  ],
  '05': [ // La Libertad
    { codigo: '01', nombre: 'Antiguo Cuscatlán' },
    { codigo: '02', nombre: 'Chiltiupán' },
    { codigo: '03', nombre: 'Ciudad Arce' },
    { codigo: '04', nombre: 'Colón' },
    { codigo: '05', nombre: 'Comasagua' },
    { codigo: '06', nombre: 'Huizúcar' },
    { codigo: '07', nombre: 'Jayaque' },
    { codigo: '08', nombre: 'Jicalapa' },
    { codigo: '09', nombre: 'La Libertad' },
    { codigo: '10', nombre: 'Santa Tecla' },
    { codigo: '11', nombre: 'Nuevo Cuscatlán' },
    { codigo: '12', nombre: 'San Juan Opico' },
    { codigo: '13', nombre: 'Quezaltepeque' },
    { codigo: '14', nombre: 'Sacacoyo' },
    { codigo: '15', nombre: 'San José Villanueva' },
    { codigo: '16', nombre: 'San Matías' },
    { codigo: '17', nombre: 'San Pablo Tacachico' },
    { codigo: '18', nombre: 'Talnique' },
    { codigo: '19', nombre: 'Tamanique' },
    { codigo: '20', nombre: 'Teotepeque' },
    { codigo: '21', nombre: 'Tepecoyo' },
    { codigo: '22', nombre: 'Zaragoza' }
  ],
  '06': [ // San Salvador
    { codigo: '01', nombre: 'Aguilares' },
    { codigo: '02', nombre: 'Apopa' },
    { codigo: '03', nombre: 'Ayutuxtepeque' },
    { codigo: '04', nombre: 'Cuscatancingo' },
    { codigo: '05', nombre: 'Delgado' },
    { codigo: '06', nombre: 'El Paisnal' },
    { codigo: '07', nombre: 'Guazapa' },
    { codigo: '08', nombre: 'Ilopango' },
    { codigo: '09', nombre: 'Mejicanos' },
    { codigo: '10', nombre: 'Nejapa' },
    { codigo: '11', nombre: 'Panchimalco' },
    { codigo: '12', nombre: 'Rosario de Mora' },
    { codigo: '13', nombre: 'San Marcos' },
    { codigo: '14', nombre: 'San Martín' },
    { codigo: '15', nombre: 'San Salvador' },
    { codigo: '16', nombre: 'Santiago Texacuangos' },
    { codigo: '17', nombre: 'Santo Tomás' },
    { codigo: '18', nombre: 'Soyapango' },
    { codigo: '19', nombre: 'Tonacatepeque' }
  ],
  '07': [ // Cuscatlán
    { codigo: '01', nombre: 'Candelaria' },
    { codigo: '02', nombre: 'Cojutepeque' },
    { codigo: '03', nombre: 'El Carmen' },
    { codigo: '04', nombre: 'El Rosario' },
    { codigo: '05', nombre: 'Monte San Juan' },
    { codigo: '06', nombre: 'Oratorio de Concepción' },
    { codigo: '07', nombre: 'San Bartolomé Perulapía' },
    { codigo: '08', nombre: 'San Cristóbal' },
    { codigo: '09', nombre: 'San José Guayabal' },
    { codigo: '10', nombre: 'San Pedro Perulapán' },
    { codigo: '11', nombre: 'San Rafael Cedros' },
    { codigo: '12', nombre: 'San Ramón' },
    { codigo: '13', nombre: 'Santa Cruz Analquito' },
    { codigo: '14', nombre: 'Santa Cruz Michapa' },
    { codigo: '15', nombre: 'Suchitoto' },
    { codigo: '16', nombre: 'Tenancingo' }
  ],
  '08': [ // La Paz
    { codigo: '01', nombre: 'Cuyultitán' },
    { codigo: '02', nombre: 'El Rosario' },
    { codigo: '03', nombre: 'Jerusalén' },
    { codigo: '04', nombre: 'Mercedes La Ceiba' },
    { codigo: '05', nombre: 'Olocuilta' },
    { codigo: '06', nombre: 'Paraíso de Osorio' },
    { codigo: '07', nombre: 'San Antonio Masahuat' },
    { codigo: '08', nombre: 'San Emigdio' },
    { codigo: '09', nombre: 'San Francisco Chinameca' },
    { codigo: '10', nombre: 'San Juan Nonualco' },
    { codigo: '11', nombre: 'San Juan Talpa' },
    { codigo: '12', nombre: 'San Juan Tepezontes' },
    { codigo: '13', nombre: 'San Luis La Herradura' },
    { codigo: '14', nombre: 'San Luis Talpa' },
    { codigo: '15', nombre: 'San Miguel Tepezontes' },
    { codigo: '16', nombre: 'San Pedro Masahuat' },
    { codigo: '17', nombre: 'San Pedro Nonualco' },
    { codigo: '18', nombre: 'San Rafael Obrajuelo' },
    { codigo: '19', nombre: 'Santa María Ostuma' },
    { codigo: '20', nombre: 'Santiago Nonualco' },
    { codigo: '21', nombre: 'Tapalhuaca' },
    { codigo: '22', nombre: 'Zacatecoluca' }
  ],
  '09': [ // Cabañas
    { codigo: '01', nombre: 'Cinquera' },
    { codigo: '02', nombre: 'Dolores' },
    { codigo: '03', nombre: 'Guacotecti' },
    { codigo: '04', nombre: 'Ilobasco' },
    { codigo: '05', nombre: 'Jutiapa' },
    { codigo: '06', nombre: 'San Isidro' },
    { codigo: '07', nombre: 'Sensuntepeque' },
    { codigo: '08', nombre: 'Tejutepeque' },
    { codigo: '09', nombre: 'Victoria' }
  ],
  '10': [ // San Vicente
    { codigo: '01', nombre: 'Apastepeque' },
    { codigo: '02', nombre: 'Guadalupe' },
    { codigo: '03', nombre: 'San Cayetano Istepeque' },
    { codigo: '04', nombre: 'San Esteban Catarina' },
    { codigo: '05', nombre: 'San Ildefonso' },
    { codigo: '06', nombre: 'San Lorenzo' },
    { codigo: '07', nombre: 'San Sebastián' },
    { codigo: '08', nombre: 'San Vicente' },
    { codigo: '09', nombre: 'Santa Clara' },
    { codigo: '10', nombre: 'Santo Domingo' },
    { codigo: '11', nombre: 'Tecoluca' },
    { codigo: '12', nombre: 'Tepetitán' },
    { codigo: '13', nombre: 'Verapaz' }
  ],
  '11': [ // Usulután
    { codigo: '01', nombre: 'Alegría' },
    { codigo: '02', nombre: 'Berlín' },
    { codigo: '03', nombre: 'California' },
    { codigo: '04', nombre: 'Concepción Batres' },
    { codigo: '05', nombre: 'El Triunfo' },
    { codigo: '06', nombre: 'Ereguayquín' },
    { codigo: '07', nombre: 'Estanzuelas' },
    { codigo: '08', nombre: 'Jiquilisco' },
    { codigo: '09', nombre: 'Jucuapa' },
    { codigo: '10', nombre: 'Jucuarán' },
    { codigo: '11', nombre: 'Mercedes Umaña' },
    { codigo: '12', nombre: 'Nueva Granada' },
    { codigo: '13', nombre: 'Ozatlán' },
    { codigo: '14', nombre: 'Puerto El Triunfo' },
    { codigo: '15', nombre: 'San Agustín' },
    { codigo: '16', nombre: 'San Buenaventura' },
    { codigo: '17', nombre: 'San Dionisio' },
    { codigo: '18', nombre: 'San Francisco Javier' },
    { codigo: '19', nombre: 'Santa Elena' },
    { codigo: '20', nombre: 'Santa María' },
    { codigo: '21', nombre: 'Santiago de María' },
    { codigo: '22', nombre: 'Tecapán' },
    { codigo: '23', nombre: 'Usulután' }
  ],
  '12': [ // San Miguel
    { codigo: '01', nombre: 'Carolina' },
    { codigo: '02', nombre: 'Chapeltique' },
    { codigo: '03', nombre: 'Chinameca' },
    { codigo: '04', nombre: 'Chirilagua' },
    { codigo: '05', nombre: 'Ciudad Barrios' },
    { codigo: '06', nombre: 'Comacarán' },
    { codigo: '07', nombre: 'El Tránsito' },
    { codigo: '08', nombre: 'Lolotique' },
    { codigo: '09', nombre: 'Moncagua' },
    { codigo: '10', nombre: 'Nueva Guadalupe' },
    { codigo: '11', nombre: 'Nuevo Edén de San Juan' },
    { codigo: '12', nombre: 'Quelepa' },
    { codigo: '13', nombre: 'San Antonio' },
    { codigo: '14', nombre: 'San Gerardo' },
    { codigo: '15', nombre: 'San Jorge' },
    { codigo: '16', nombre: 'San Luis de la Reina' },
    { codigo: '17', nombre: 'San Miguel' },
    { codigo: '18', nombre: 'San Rafael Oriente' },
    { codigo: '19', nombre: 'Sesori' },
    { codigo: '20', nombre: 'Uluazapa' }
  ],
  '13': [ // Morazán
    { codigo: '01', nombre: 'Arambala' },
    { codigo: '02', nombre: 'Cacaopera' },
    { codigo: '03', nombre: 'Chilanga' },
    { codigo: '04', nombre: 'Corinto' },
    { codigo: '05', nombre: 'Delicias de Concepción' },
    { codigo: '06', nombre: 'El Divisadero' },
    { codigo: '07', nombre: 'El Rosario' },
    { codigo: '08', nombre: 'Gualococti' },
    { codigo: '09', nombre: 'Guatajiagua' },
    { codigo: '10', nombre: 'Joateca' },
    { codigo: '11', nombre: 'Jocoaitique' },
    { codigo: '12', nombre: 'Jocoro' },
    { codigo: '13', nombre: 'Lolotiquillo' },
    { codigo: '14', nombre: 'Meanguera' },
    { codigo: '15', nombre: 'Osicala' },
    { codigo: '16', nombre: 'Perquín' },
    { codigo: '17', nombre: 'San Carlos' },
    { codigo: '18', nombre: 'San Fernando' },
    { codigo: '19', nombre: 'San Francisco Gotera' },
    { codigo: '20', nombre: 'San Isidro' },
    { codigo: '21', nombre: 'San Simón' },
    { codigo: '22', nombre: 'Sensembra' },
    { codigo: '23', nombre: 'Sociedad' },
    { codigo: '24', nombre: 'Torola' },
    { codigo: '25', nombre: 'Yamabal' },
    { codigo: '26', nombre: 'Yoloaiquín' }
  ],
  '14': [ // La Unión
    { codigo: '01', nombre: 'Anamorós' },
    { codigo: '02', nombre: 'Bolívar' },
    { codigo: '03', nombre: 'Concepción de Oriente' },
    { codigo: '04', nombre: 'Conchagua' },
    { codigo: '05', nombre: 'El Carmen' },
    { codigo: '06', nombre: 'El Sauce' },
    { codigo: '07', nombre: 'Intipucá' },
    { codigo: '08', nombre: 'La Unión' },
    { codigo: '09', nombre: 'Lislique' },
    { codigo: '10', nombre: 'Meanguera del Golfo' },
    { codigo: '11', nombre: 'Nueva Esparta' },
    { codigo: '12', nombre: 'Pasaquina' },
    { codigo: '13', nombre: 'Polorós' },
    { codigo: '14', nombre: 'San Alejo' },
    { codigo: '15', nombre: 'San José' },
    { codigo: '16', nombre: 'Santa Rosa de Lima' },
    { codigo: '17', nombre: 'Yayantique' },
    { codigo: '18', nombre: 'Yucuaiquín' }
  ]
};

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Aplicación iniciada');
  
  // Configurar navegación
  setupNavigation();
  
  // Cargar datos iniciales
  await loadInitialData();
  
  // Configurar event listeners
  setupEventListeners();
  
  // Actualizar dashboard
  updateDashboard();
  
  // Configurar cambio de departamento para cargar municipios
  setupDepartamentoMunicipioHandler();
});

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
  } catch (error) {
    console.error('Error cargando datos iniciales:', error);
    showNotification('Error al cargar datos', 'error');
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
    const tbody = document.querySelector('#tabla-facturas tbody');
    
    if (state.facturas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay facturas</td></tr>';
    } else {
      tbody.innerHTML = state.facturas.map(f => {
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
      tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay clientes</td></tr>';
    } else {
      tbody.innerHTML = state.clientes.map(c => `
        <tr>
          <td>${c.numero_documento}</td>
          <td>${c.nombre}</td>
          <td>${c.telefono || 'N/A'}</td>
          <td>${c.email || 'N/A'}</td>
          <td>
            <button class="btn btn-small btn-primary" onclick="editarCliente(${c.id})">Editar</button>
            <button class="btn btn-small btn-danger" onclick="eliminarCliente(${c.id})">Eliminar</button>
          </td>
        </tr>
      `).join('');
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
      document.getElementById('config-nombre').value = config.nombre_empresa || '';
      document.getElementById('config-nombre-comercial').value = config.nombre_comercial || '';
      document.getElementById('config-actividad').value = config.actividad_economica || '';
      document.getElementById('config-telefono').value = config.telefono || '';
      document.getElementById('config-email').value = config.email || '';
      document.getElementById('config-direccion').value = config.direccion || '';
      document.getElementById('config-hacienda-usuario').value = config.hacienda_usuario || '';
      document.getElementById('config-hacienda-ambiente').value = config.hacienda_ambiente || 'pruebas';
      document.getElementById('config-establecimiento').value = config.codigo_establecimiento || '';
      document.getElementById('config-punto-venta').value = config.punto_venta || '';
    }
  } catch (error) {
    console.error('Error cargando configuración:', error);
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
}

// Configurar manejador de departamento-municipio
function setupDepartamentoMunicipioHandler() {
  const departamentoSelect = document.getElementById('cliente-departamento');
  const municipioSelect = document.getElementById('cliente-municipio');
  
  if (departamentoSelect && municipioSelect) {
    departamentoSelect.addEventListener('change', (e) => {
      const departamento = e.target.value;
      cargarMunicipios(departamento);
    });
  }
}

// Cargar municipios según departamento
function cargarMunicipios(codigoDepartamento) {
  const municipioSelect = document.getElementById('cliente-municipio');
  
  // Limpiar opciones actuales
  municipioSelect.innerHTML = '<option value="">Seleccionar municipio...</option>';
  
  if (!codigoDepartamento || !municipiosPorDepartamento[codigoDepartamento]) {
    municipioSelect.disabled = true;
    return;
  }
  
  municipioSelect.disabled = false;
  
  // Cargar municipios del departamento seleccionado
  const municipios = municipiosPorDepartamento[codigoDepartamento];
  municipios.forEach(municipio => {
    const option = document.createElement('option');
    option.value = municipio.codigo;
    option.textContent = municipio.nombre;
    municipioSelect.appendChild(option);
  });
}

// Obtener nombre del municipio por código
function obtenerNombreMunicipio(codigoDepartamento, codigoMunicipio) {
  if (!municipiosPorDepartamento[codigoDepartamento]) {
    return codigoMunicipio;
  }
  
  const municipio = municipiosPorDepartamento[codigoDepartamento].find(
    m => m.codigo === codigoMunicipio
  );
  
  return municipio ? municipio.nombre : codigoMunicipio;
}

// Guardar configuración
async function guardarConfiguracion() {
  try {
    const config = {
      nit: document.getElementById('config-nit').value,
      nombre_empresa: document.getElementById('config-nombre').value,
      nombre_comercial: document.getElementById('config-nombre-comercial').value,
      actividad_economica: document.getElementById('config-actividad').value,
      telefono: document.getElementById('config-telefono').value,
      email: document.getElementById('config-email').value,
      direccion: document.getElementById('config-direccion').value,
      hacienda_usuario: document.getElementById('config-hacienda-usuario').value,
      hacienda_password: document.getElementById('config-hacienda-password').value,
      hacienda_ambiente: document.getElementById('config-hacienda-ambiente').value,
      codigo_establecimiento: document.getElementById('config-establecimiento').value,
      punto_venta: document.getElementById('config-punto-venta').value
    };
    
    await window.electronAPI.updateConfiguracion(config);
    state.configuracion = config;
    showNotification('Configuración guardada exitosamente', 'success');
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
    
    // Crear objeto de factura
    const factura = {
      numero_control: generarNumeroControl(),
      codigo_generacion: generarCodigoGeneracion(),
      tipo_dte: document.getElementById('tipo-dte').value,
      fecha_emision: new Date().toISOString(),
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
      condicion_operacion: document.getElementById('condicion-operacion').value,
      estado: 'PENDIENTE',
      json_dte: null // Se generará al firmar
    };

    // Guardar en base de datos
    const result = await window.electronAPI.addFactura(factura);
    
    if (result) {
      showNotification('Factura generada exitosamente', 'success');
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
    document.getElementById('cliente-nombre').value = cliente.nombre;
    document.getElementById('cliente-nombre-comercial').value = cliente.nombre_comercial || '';
    document.getElementById('cliente-telefono').value = cliente.telefono || '';
    document.getElementById('cliente-email').value = cliente.email || '';
    document.getElementById('cliente-departamento').value = cliente.departamento || '';
    
    // Cargar municipios del departamento seleccionado
    if (cliente.departamento) {
      cargarMunicipios(cliente.departamento);
      // Esperar un momento para que se carguen los municipios antes de seleccionar
      setTimeout(() => {
        document.getElementById('cliente-municipio').value = cliente.municipio || '';
      }, 50);
    }
    
    document.getElementById('cliente-direccion').value = cliente.direccion || '';
    document.getElementById('cliente-giro').value = cliente.giro || '';
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
    
    const clienteData = {
      tipo_documento: document.getElementById('cliente-tipo-documento').value,
      numero_documento: document.getElementById('cliente-numero-documento').value,
      nombre: document.getElementById('cliente-nombre').value,
      nombre_comercial: document.getElementById('cliente-nombre-comercial').value,
      telefono: document.getElementById('cliente-telefono').value,
      email: document.getElementById('cliente-email').value,
      departamento: document.getElementById('cliente-departamento').value,
      municipio: document.getElementById('cliente-municipio').value,
      direccion: document.getElementById('cliente-direccion').value,
      giro: document.getElementById('cliente-giro').value
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
  
  modal.classList.add('active');
}

// Cerrar modal de ver factura
function cerrarModalVerFactura() {
  const modal = document.getElementById('modal-ver-factura');
  modal.classList.remove('active');
}

// Firmar factura con Puppeteer
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
    
    const pinCertificado = prompt('Ingrese el PIN del certificado digital:');
    if (!pinCertificado) return;
    
    const usuarioFirmador = prompt('Ingrese el usuario del Firmador de Hacienda:');
    if (!usuarioFirmador) return;
    
    const passwordFirmador = prompt('Ingrese la contraseña del Firmador de Hacienda:');
    if (!passwordFirmador) return;
    
    showNotification('Firmando documento...', 'info');
    
    // Construir documento para firmar
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
      }
    };
    
    // Llamar al firmador
    const result = await window.electronAPI.firmarDocumento({
      documento: documento,
      pin: pinCertificado,
      usuario: usuarioFirmador,
      password: passwordFirmador
    });
    
    if (result.success) {
      showNotification('Documento firmado exitosamente', 'success');
      
      // Actualizar estado en base de datos
      await window.electronAPI.updateFacturaEstado(facturaId, 'FIRMADO', null);
      
      cerrarModalVerFactura();
      await loadFacturas();
    } else {
      showNotification('Error al firmar: ' + result.error, 'error');
    }
  } catch (error) {
    console.error('Error firmando factura:', error);
    showNotification('Error al firmar factura: ' + error.message, 'error');
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
    
    const confirmacion = confirm('¿Está seguro de enviar esta factura al Ministerio de Hacienda?');
    if (!confirmacion) return;
    
    showNotification('Autenticando con Hacienda...', 'info');
    
    // Autenticar con Hacienda
    const authResult = await window.electronAPI.autenticar({
      usuario: state.configuracion.hacienda_usuario,
      password: state.configuracion.hacienda_password,
      ambiente: state.configuracion.hacienda_ambiente
    });
    
    if (!authResult.success) {
      showNotification('Error de autenticación: ' + authResult.error, 'error');
      return;
    }
    
    showNotification('Enviando DTE a Hacienda...', 'info');
    
    // Enviar DTE
    const dteResult = await window.electronAPI.enviarDTE({
      dte: {
        emisor: {
          nit: state.configuracion.nit
        },
        documento: JSON.parse(factura.json_dte || '{}')
      },
      token: authResult.token
    });
    
    if (dteResult.success) {
      showNotification('Factura enviada exitosamente a Hacienda', 'success');
      
      // Actualizar estado
      await window.electronAPI.updateFacturaEstado(
        facturaId, 
        'ENVIADO', 
        dteResult.resultado?.selloRecepcion || null
      );
      
      cerrarModalVerFactura();
      await loadFacturas();
    } else {
      showNotification('Error al enviar: ' + dteResult.error, 'error');
    }
  } catch (error) {
    console.error('Error enviando factura:', error);
    showNotification('Error al enviar factura: ' + error.message, 'error');
  }
}

// Hacer funciones globales
window.cerrarModalVerFactura = cerrarModalVerFactura;
window.editarCliente = editarCliente;
window.eliminarCliente = eliminarCliente;
window.cerrarModalCliente = cerrarModalCliente;
