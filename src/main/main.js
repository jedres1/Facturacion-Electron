const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Database = require('../database/database');
const HaciendaAPI = require('../api/hacienda');
const Firmador = require('../utils/firmador');
const FirmadorLocal = require('../utils/firmador-local');
const FirmadorSVFE = require('../utils/firmador-svfe');
const FirmadorInternoMH = require('../utils/firmador-interno-mh');
const DTEGenerator = require('../utils/dte-generator');
const DTEValidator = require('../utils/dte-validator');
const PDFGenerator = require('../utils/pdf-generator');
const ContingenciaManager = require('../utils/contingencias');

let mainWindow;
let db;
let dteGenerator;
let dteValidator;
let pdfGenerator;
let contingenciaManager;

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
  dteValidator = new DTEValidator();
  
  // Inicializar generador de PDFs
  pdfGenerator = new PDFGenerator();
  
  // Inicializar gestor de contingencias
  contingenciaManager = new ContingenciaManager(db.db);
  
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

ipcMain.handle('db:updateFacturaEstado', async (event, { id, estado, selloRecepcion, observaciones, jsonDte }) => {
  return db.updateFacturaEstado(id, estado, selloRecepcion, observaciones, jsonDte);
});

ipcMain.handle('db:registrarAnulacion', async (event, { id, anulacion }) => {
  return db.registrarAnulacion(id, anulacion);
});

ipcMain.handle('db:getSiguienteCorrelativo', async (event, tipoDte) => {
  return db.getSiguienteCorrelativo(tipoDte);
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
    const resultado = await api.autenticar();
    return resultado; // Retorna { success, token, user, rol, roles, tokenType }
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('hacienda:enviarDTE', async (event, { dteFirmado, nit, passwordPri }) => {
  try {
    const config = db.getConfiguracion();
    if (!config || !config.hacienda_usuario || !config.hacienda_password) {
      return { success: false, error: 'Configuración de Hacienda incompleta' };
    }

    const api = new HaciendaAPI({
      ambiente: config.hacienda_ambiente || 'pruebas',
      usuario: config.hacienda_usuario,
      password: config.hacienda_password
    });

    // Autenticar primero
    await api.autenticar();

    // Enviar DTE firmado (modelo uno a uno)
    const resultado = await api.enviarDTE(dteFirmado, nit, passwordPri);
    
    return resultado;
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('hacienda:anularDTE', async (event, { eventoFirmado }) => {
  try {
    const config = db.getConfiguracion();
    if (!config || !config.hacienda_usuario || !config.hacienda_password) {
      return { success: false, error: 'Configuración de Hacienda incompleta' };
    }

    const api = new HaciendaAPI({
      ambiente: config.hacienda_ambiente || 'pruebas',
      usuario: config.hacienda_usuario,
      password: config.hacienda_password
    });

    await api.autenticar();
    return await api.anularDTE(eventoFirmado);
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
ipcMain.handle('firmador:firmarDocumento', async (event, { documento, pin, usuario, password, certificadoPath, certificadoPassword, metodo, nit }) => {
  try {
    if (metodo === 'interno') {
      const config = db.getConfiguracion() || {};
      const firmador = new FirmadorInternoMH({
        certificadoPath: certificadoPath || config.certificado_path,
        nit: nit || usuario || config.firmador_usuario || config.hacienda_usuario || config.nit,
        passwordPri: certificadoPassword || config.certificado_password || pin || config.firmador_pin
      });

      return await firmador.firmarDocumento(documento);
    }

    if (metodo === 'svfe') {
      const config = db.getConfiguracion() || {};

      if (config.certificado_path && (config.certificado_password || certificadoPassword || pin)) {
        const firmadorInterno = new FirmadorInternoMH({
          certificadoPath: certificadoPath || config.certificado_path,
          nit: nit || usuario || config.firmador_usuario || config.hacienda_usuario || config.nit,
          passwordPri: certificadoPassword || config.certificado_password || pin || config.firmador_pin
        });

        return await firmadorInterno.firmarDocumento(documento);
      }

      const baseURL = password && /^https?:\/\//i.test(password) ? password : undefined;
      const firmador = new FirmadorSVFE({ baseURL });
      return await firmador.firmarDocumento(documento, {
        nit: nit || usuario || config.nit,
        passwordPri: certificadoPassword || config.certificado_password || pin || config.firmador_pin
      });
    }

    // Si hay ruta de certificado, usar firmador local
    if (certificadoPath) {
      const firmadorInterno = new FirmadorInternoMH({
        certificadoPath,
        nit: nit || usuario,
        passwordPri: certificadoPassword || pin
      });
      return await firmadorInterno.firmarDocumento(documento);
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

ipcMain.handle('firmador:estadoSVFE', async () => {
  try {
    const firmador = new FirmadorSVFE();
    return await firmador.verificarEstado();
  } catch (error) {
    return { disponible: false, error: error.message };
  }
});

ipcMain.handle('firmador:validarCertificado', async (event, { certificadoPath, certificadoPassword }) => {
  try {
    const config = db.getConfiguracion() || {};
    const firmadorLocal = new FirmadorInternoMH({
      certificadoPath,
      nit: config.firmador_usuario || config.hacienda_usuario || config.nit,
      passwordPri: certificadoPassword || config.certificado_password
    });
    const resultado = await firmadorLocal.cargarCertificado();
    return {
      valido: true,
      info: resultado.info
    };
  } catch (error) {
    return {
      valido: false,
      error: error.message
    };
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

ipcMain.handle('dte:guardarJson', async (event, { nombreArchivo, contenido }) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: nombreArchivo || 'dte.json',
      filters: [
        { name: 'JSON', extensions: ['json'] },
        { name: 'Todos los archivos', extensions: ['*'] }
      ]
    });

    if (result.canceled || !result.filePath) {
      return { success: false, canceled: true };
    }

    const fs = require('fs').promises;
    await fs.writeFile(result.filePath, contenido, 'utf8');
    return { success: true, filePath: result.filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// IPC Handler para generar DTE
ipcMain.handle('dte:generar', async (event, { tipo, config, cliente, items, resumen, opciones }) => {
  try {
    // Obtener el siguiente correlativo de la base de datos
    const correlativo = db.getSiguienteCorrelativo(tipo);
    
    // Agregar correlativo a las opciones
    const opcionesConCorrelativo = {
      ...opciones,
      correlativo: correlativo
    };
    
    let dte;
    
    switch(tipo) {
      case '01': // Factura
        dte = dteGenerator.generarFactura(config, cliente, items, resumen, opcionesConCorrelativo);
        break;
      case '03': // Crédito Fiscal
        dte = dteGenerator.generarCreditoFiscal(config, cliente, items, resumen, opcionesConCorrelativo);
        break;
      case '05': // Nota de Crédito
        dte = dteGenerator.generarNotaCredito(config, cliente, items, resumen, opciones.documentoRelacionado, opcionesConCorrelativo);
        break;
      case '06': // Nota de Débito
        dte = dteGenerator.generarNotaDebito(config, cliente, items, resumen, opciones.documentoRelacionado, opcionesConCorrelativo);
        break;
      case '11': // Factura de Exportación
        dte = dteGenerator.generarFacturaExportacion(config, cliente, items, resumen, opcionesConCorrelativo);
        break;
      case '14': // Factura Sujeto Excluido
        dte = dteGenerator.generarFacturaSujetoExcluido(config, cliente, items, resumen, opcionesConCorrelativo);
        break;
      default:
        throw new Error('Tipo de DTE no soportado: ' + tipo);
    }

    const validacion = dteValidator.validar(dte);
    if (!validacion.valido) {
      return {
        success: false,
        error: `DTE no cumple el schema oficial: ${validacion.errores.slice(0, 8).join(' | ')}`,
        errores: validacion.errores
      };
    }

    return { success: true, dte };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// IPC Handler para generar PDF
ipcMain.handle('pdf:generar', async (event, { factura, dte, config }) => {
  try {
    // Parsear el DTE si viene como string
    let dteObj = dte;
    if (typeof dte === 'string') {
      try {
        dteObj = JSON.parse(dte);
      } catch (parseError) {
        console.error('Error parseando DTE:', parseError);
        return { success: false, error: 'DTE inválido: no se puede parsear' };
      }
    }
    
    const pdfBuffer = await pdfGenerator.generarPDFFactura(factura, dteObj, config);
    
    // Guardar PDF en carpeta temporal
    const userDataPath = app.getPath('userData');
    const pdfDir = path.join(userDataPath, 'pdfs');
    const fs = require('fs').promises;
    
    // Crear directorio si no existe
    await fs.mkdir(pdfDir, { recursive: true });
    
    const pdfPath = path.join(pdfDir, `DTE_${dteObj.identificacion.codigoGeneracion}.pdf`);
    await fs.writeFile(pdfPath, pdfBuffer);
    
    return { 
      success: true, 
      pdfBuffer: pdfBuffer.toString('base64'), // Enviar como base64
      pdfPath: pdfPath 
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// IPC Handler para abrir PDF
ipcMain.handle('pdf:abrir', async (event, pdfPath) => {
  try {
    const { shell } = require('electron');
    await shell.openPath(pdfPath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// IPC Handlers para contingencias
ipcMain.handle('contingencia:registrar', async (event, { facturaId, tipo, motivo }) => {
  return await contingenciaManager.registrarContingencia(facturaId, tipo, motivo);
});

ipcMain.handle('contingencia:obtenerPendientes', async () => {
  return await contingenciaManager.obtenerDTEsPendientes();
});

ipcMain.handle('contingencia:reintentar', async (event, contingenciaId) => {
  return await contingenciaManager.reintentarEnvio(contingenciaId);
});

ipcMain.handle('contingencia:resolver', async (event, { contingenciaId, sello }) => {
  return await contingenciaManager.resolverContingencia(contingenciaId, sello);
});

ipcMain.handle('contingencia:debeActivar', async () => {
  return await contingenciaManager.debeActivarContingencia();
});
