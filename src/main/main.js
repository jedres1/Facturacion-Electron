const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Database = require('../database/database');
const HaciendaAPI = require('../api/hacienda');
const Firmador = require('../utils/firmador');
const FirmadorLocal = require('../utils/firmador-local');
const DTEGenerator = require('../utils/dte-generator');

let mainWindow;
let db;
let dteGenerator;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../../build/icon.png')
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  // Abrir DevTools en modo desarrollo
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Inicializar base de datos
  db = new Database();
  
  // Inicializar generador de DTEs
  dteGenerator = new DTEGenerator();
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers para la base de datos
ipcMain.handle('db:getClientes', async () => {
  return db.getClientes();
});

ipcMain.handle('db:addCliente', async (event, cliente) => {
  return db.addCliente(cliente);
});

ipcMain.handle('db:updateCliente', async (event, { id, cliente }) => {
  return db.updateCliente(id, cliente);
});

ipcMain.handle('db:deleteCliente', async (event, id) => {
  return db.deleteCliente(id);
});

ipcMain.handle('db:getClienteById', async (event, id) => {
  return db.getClienteById(id);
});

ipcMain.handle('db:getProductos', async () => {
  return db.getProductos();
});

ipcMain.handle('db:addProducto', async (event, producto) => {
  return db.addProducto(producto);
});

ipcMain.handle('db:updateProducto', async (event, { id, producto }) => {
  return db.updateProducto(id, producto);
});

ipcMain.handle('db:deleteProducto', async (event, id) => {
  return db.deleteProducto(id);
});

ipcMain.handle('db:getProductoById', async (event, id) => {
  return db.getProductoById(id);
});

ipcMain.handle('db:getFacturas', async (event, filtros) => {
  return db.getFacturas(filtros);
});

ipcMain.handle('db:addFactura', async (event, factura) => {
  return db.addFactura(factura);
});

ipcMain.handle('db:updateFacturaEstado', async (event, { id, estado, selloRecepcion }) => {
  return db.updateFacturaEstado(id, estado, selloRecepcion);
});

ipcMain.handle('db:getConfiguracion', async () => {
  return db.getConfiguracion();
});

ipcMain.handle('db:updateConfiguracion', async (event, config) => {
  return db.updateConfiguracion(config);
});

// IPC Handlers para Hacienda
ipcMain.handle('hacienda:autenticar', async (event, credenciales) => {
  try {
    const api = new HaciendaAPI(credenciales);
    const token = await api.autenticar();
    return { success: true, token };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('hacienda:enviarDTE', async (event, { dte, token }) => {
  try {
    const api = new HaciendaAPI({ token });
    const resultado = await api.enviarDTE(dte);
    return { success: true, resultado };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('hacienda:consultarDTE', async (event, { codigoGeneracion, token }) => {
  try {
    const api = new HaciendaAPI({ token });
    const estado = await api.consultarDTE(codigoGeneracion);
    return { success: true, estado };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// IPC Handler para el firmador
ipcMain.handle('firmador:firmarDocumento', async (event, { documento, pin, usuario, password, certificadoPath, certificadoPassword }) => {
  try {
    // Si hay ruta de certificado, usar firmador local
    if (certificadoPath) {
      const firmadorLocal = new FirmadorLocal();
      await firmadorLocal.cargarCertificado(certificadoPath, certificadoPassword || pin);
      const result = await firmadorLocal.firmarDocumento(documento);
      return result;
    } else {
      // Usar firmador web con Puppeteer
      const firmador = new Firmador({ 
        usuario: usuario, 
        password: password 
      });
      const documentoFirmado = await firmador.firmarDocumento(documento, pin);
      return { success: true, documentoFirmado };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// IPC Handler para diálogo de selección de archivos
ipcMain.handle('dialog:selectFile', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: options?.filters || [
      { name: 'Certificados', extensions: ['crt', 'p12', 'pfx', 'pem'] },
      { name: 'Todos los archivos', extensions: ['*'] }
    ]
  });
  
  if (result.canceled) {
    return { canceled: true };
  } else {
    return { canceled: false, filePath: result.filePaths[0] };
  }
});

// IPC Handler para generar DTE
ipcMain.handle('dte:generar', async (event, { tipo, config, cliente, items, resumen, opciones }) => {
  try {
    let dte;
    
    switch(tipo) {
      case '01': // Factura
        dte = dteGenerator.generarFactura(config, cliente, items, resumen, opciones);
        break;
      case '03': // Crédito Fiscal
        dte = dteGenerator.generarCreditoFiscal(config, cliente, items, resumen, opciones);
        break;
      case '05': // Nota de Crédito
        dte = dteGenerator.generarNotaCredito(config, cliente, items, resumen, opciones.documentoRelacionado, opciones);
        break;
      default:
        throw new Error('Tipo de DTE no soportado: ' + tipo);
    }
    
    return { success: true, dte };
  } catch (error) {
    return { success: false, error: error.message };
  }
});


