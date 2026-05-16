const { contextBridge, ipcRenderer } = require('electron');

// Exponer API segura al renderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Autenticación local
  login: (credenciales) => ipcRenderer.invoke('auth:login', credenciales),

  // Base de datos
  getClientes: () => ipcRenderer.invoke('db:getClientes'),
  addCliente: (cliente) => ipcRenderer.invoke('db:addCliente', cliente),
  updateCliente: (id, cliente) => ipcRenderer.invoke('db:updateCliente', { id, cliente }),
  deleteCliente: (id) => ipcRenderer.invoke('db:deleteCliente', id),
  getClienteById: (id) => ipcRenderer.invoke('db:getClienteById', id),
  getProductos: () => ipcRenderer.invoke('db:getProductos'),
  addProducto: (producto) => ipcRenderer.invoke('db:addProducto', producto),
  updateProducto: (id, producto) => ipcRenderer.invoke('db:updateProducto', { id, producto }),
  deleteProducto: (id) => ipcRenderer.invoke('db:deleteProducto', id),
  getProductoById: (id) => ipcRenderer.invoke('db:getProductoById', id),
  getFacturas: (filtros) => ipcRenderer.invoke('db:getFacturas', filtros),
  addFactura: (factura) => ipcRenderer.invoke('db:addFactura', factura),
  updateFacturaEstado: (id, estado, selloRecepcion, observaciones, jsonDte) =>
    ipcRenderer.invoke('db:updateFacturaEstado', { id, estado, selloRecepcion, observaciones, jsonDte }),
  updateFacturaCorreccion: (id, datos) =>
    ipcRenderer.invoke('db:updateFacturaCorreccion', { id, datos }),
  marcarFacturaCorreoEnviado: (id) => ipcRenderer.invoke('db:marcarFacturaCorreoEnviado', id),
  registrarAnulacion: (id, anulacion) =>
    ipcRenderer.invoke('db:registrarAnulacion', { id, anulacion }),
  getSiguienteCorrelativo: (tipoDte, opciones = {}) => ipcRenderer.invoke('db:getSiguienteCorrelativo', tipoDte, opciones),
  getCorrelativosDte: () => ipcRenderer.invoke('db:getCorrelativosDte'),
  updateCorrelativoDte: (datos) => ipcRenderer.invoke('db:updateCorrelativoDte', datos),
  getConfiguracion: () => ipcRenderer.invoke('db:getConfiguracion'),
  updateConfiguracion: (config) => ipcRenderer.invoke('db:updateConfiguracion', config),
  subirBackupServidor: (opciones) => ipcRenderer.invoke('backup:subirUltimo', opciones),
  
  // API de Hacienda
  autenticar: (credenciales) => ipcRenderer.invoke('hacienda:autenticar', credenciales),
  enviarDTE: (data) => ipcRenderer.invoke('hacienda:enviarDTE', data),
  enviarLoteDTE: (data) => ipcRenderer.invoke('hacienda:enviarLoteDTE', data),
  anularDTE: (data) => ipcRenderer.invoke('hacienda:anularDTE', data),
  enviarContingencia: (data) => ipcRenderer.invoke('hacienda:enviarContingencia', data),
  consultarDTE: (data) => ipcRenderer.invoke('hacienda:consultarDTE', data),
  consultarLoteDTE: (data) => ipcRenderer.invoke('hacienda:consultarLoteDTE', data),
  
  // Firmador
  firmarDocumento: (data) => ipcRenderer.invoke('firmador:firmarDocumento', data),
  verificarFirmadorSVFE: () => ipcRenderer.invoke('firmador:estadoSVFE'),
  validarCertificado: (data) => ipcRenderer.invoke('firmador:validarCertificado', data),
  
  // Generador de DTEs
  generarDTE: (data) => ipcRenderer.invoke('dte:generar', data),
  guardarJsonDTE: (data) => ipcRenderer.invoke('dte:guardarJson', data),
  
  // Generador de PDFs
  generarPDF: (data) => ipcRenderer.invoke('pdf:generar', data),
  abrirPDF: (pdfPath) => ipcRenderer.invoke('pdf:abrir', pdfPath),
  enviarCorreoDTE: (data) => ipcRenderer.invoke('correo:enviarDTE', data),
  
  // Contingencias
  registrarContingencia: (data) => ipcRenderer.invoke('contingencia:registrar', data),
  obtenerContingenciasPendientes: () => ipcRenderer.invoke('contingencia:obtenerPendientes'),
  reintentarContingencia: (contingenciaId) => ipcRenderer.invoke('contingencia:reintentar', contingenciaId),
  resolverContingencia: (data) => ipcRenderer.invoke('contingencia:resolver', data),
  resolverContingenciaConDatos: (data) => ipcRenderer.invoke('contingencia:resolverConDatos', data),
  debeActivarContingencia: () => ipcRenderer.invoke('contingencia:debeActivar'),
  
  // Diálogos del sistema
  selectFile: (options) => ipcRenderer.invoke('dialog:selectFile', options)
});
