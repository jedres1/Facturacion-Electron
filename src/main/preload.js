const { contextBridge, ipcRenderer } = require('electron');

// Exponer API segura al renderer
contextBridge.exposeInMainWorld('electronAPI', {
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
  updateFacturaEstado: (id, estado, selloRecepcion) => ipcRenderer.invoke('db:updateFacturaEstado', { id, estado, selloRecepcion }),
  getConfiguracion: () => ipcRenderer.invoke('db:getConfiguracion'),
  updateConfiguracion: (config) => ipcRenderer.invoke('db:updateConfiguracion', config),
  
  // API de Hacienda
  autenticar: (credenciales) => ipcRenderer.invoke('hacienda:autenticar', credenciales),
  enviarDTE: (data) => ipcRenderer.invoke('hacienda:enviarDTE', data),
  consultarDTE: (data) => ipcRenderer.invoke('hacienda:consultarDTE', data),
  
  // Firmador
  firmarDocumento: (data) => ipcRenderer.invoke('firmador:firmarDocumento', data)
});
