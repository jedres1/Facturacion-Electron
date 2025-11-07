const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('../database/database');
const HaciendaAPI = require('../api/hacienda');
const Firmador = require('../utils/firmador');

let mainWindow;
let db;

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

ipcMain.handle('db:getProductos', async () => {
  return db.getProductos();
});

ipcMain.handle('db:addProducto', async (event, producto) => {
  return db.addProducto(producto);
});

ipcMain.handle('db:getFacturas', async (event, filtros) => {
  return db.getFacturas(filtros);
});

ipcMain.handle('db:addFactura', async (event, factura) => {
  return db.addFactura(factura);
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
ipcMain.handle('firmador:firmarDocumento', async (event, { documento, pin, usuario, password }) => {
  try {
    // Crear instancia del firmador con credenciales
    const firmador = new Firmador({ 
      usuario: usuario, 
      password: password 
    });
    const documentoFirmado = await firmador.firmarDocumento(documento, pin);
    return { success: true, documentoFirmado };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
