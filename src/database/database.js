const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

class DatabaseManager {
  constructor() {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'facturacion.db');
    this.db = new Database(dbPath);
    this.initDatabase();
  }

  initDatabase() {
    // Tabla de configuración
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS configuracion (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nit TEXT NOT NULL,
        nrc TEXT,
        nombre_empresa TEXT NOT NULL,
        nombre_comercial TEXT,
        tipo_persona TEXT,
        actividad_economica TEXT NOT NULL,
        telefono TEXT,
        email TEXT,
        direccion TEXT,
        direccion_complementaria TEXT,
        departamento TEXT,
        municipio TEXT,
        distrito TEXT,
        codigo_establecimiento TEXT,
        punto_venta TEXT,
        hacienda_usuario TEXT,
        hacienda_password TEXT,
        hacienda_ambiente TEXT DEFAULT 'pruebas',
        certificado_path TEXT,
        pin_certificado TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de clientes
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo_documento TEXT NOT NULL,
        numero_documento TEXT NOT NULL UNIQUE,
        nrc TEXT,
        nombre TEXT NOT NULL,
        nombre_comercial TEXT,
        tipo_persona TEXT,
        telefono TEXT,
        email TEXT,
        direccion TEXT,
        departamento TEXT,
        municipio TEXT,
        distrito TEXT,
        giro TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Agregar columna distrito si no existe (para bases de datos existentes)
    try {
      this.db.exec(`ALTER TABLE clientes ADD COLUMN distrito TEXT`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }
    
    // Agregar columna nrc si no existe (para bases de datos existentes)
    try {
      this.db.exec(`ALTER TABLE clientes ADD COLUMN nrc TEXT`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }
    
    // Agregar columna tipo_persona si no existe (para bases de datos existentes)
    try {
      this.db.exec(`ALTER TABLE clientes ADD COLUMN tipo_persona TEXT`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }
    
    // Agregar columnas a configuracion si no existen (para bases de datos existentes)
    try {
      this.db.exec(`ALTER TABLE configuracion ADD COLUMN nrc TEXT`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }
    
    try {
      this.db.exec(`ALTER TABLE configuracion ADD COLUMN tipo_persona TEXT`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }
    
    try {
      this.db.exec(`ALTER TABLE configuracion ADD COLUMN direccion_complementaria TEXT`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }
    
    try {
      this.db.exec(`ALTER TABLE configuracion ADD COLUMN departamento TEXT`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }
    
    try {
      this.db.exec(`ALTER TABLE configuracion ADD COLUMN municipio TEXT`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }
    
    try {
      this.db.exec(`ALTER TABLE configuracion ADD COLUMN distrito TEXT`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }

    // Tabla de productos/servicios
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT NOT NULL UNIQUE,
        descripcion TEXT NOT NULL,
        tipo TEXT NOT NULL, -- 'producto' o 'servicio'
        precio REAL NOT NULL,
        unidad_medida TEXT DEFAULT 'UND',
        tributos TEXT, -- JSON con tributos aplicables
        exento INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de facturas
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS facturas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero_control TEXT UNIQUE,
        codigo_generacion TEXT UNIQUE,
        tipo_dte TEXT NOT NULL, -- '01' Factura, '03' CCF, '14' Nota de Crédito, etc.
        fecha_emision DATETIME NOT NULL,
        cliente_id INTEGER NOT NULL,
        cliente_datos TEXT NOT NULL, -- JSON con datos del cliente
        items TEXT NOT NULL, -- JSON con items de la factura
        subtotal REAL NOT NULL,
        iva REAL NOT NULL,
        total REAL NOT NULL,
        descuento REAL DEFAULT 0,
        retencion REAL DEFAULT 0,
        condicion_operacion TEXT DEFAULT 'CONTADO',
        estado TEXT DEFAULT 'PENDIENTE', -- PENDIENTE, FIRMADO, ENVIADO, ACEPTADO, RECHAZADO
        json_dte TEXT, -- JSON completo del DTE
        sello_recepcion TEXT,
        fecha_procesamiento DATETIME,
        observaciones TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id)
      )
    `);

    // Tabla de eventos contingencia
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS contingencias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        factura_id INTEGER NOT NULL,
        tipo_evento TEXT NOT NULL,
        fecha_evento DATETIME NOT NULL,
        motivo TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (factura_id) REFERENCES facturas(id)
      )
    `);

    // Índices
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_facturas_fecha ON facturas(fecha_emision);
      CREATE INDEX IF NOT EXISTS idx_facturas_estado ON facturas(estado);
      CREATE INDEX IF NOT EXISTS idx_facturas_cliente ON facturas(cliente_id);
      CREATE INDEX IF NOT EXISTS idx_clientes_documento ON clientes(numero_documento);
    `);
  }

  // Métodos para Configuración
  getConfiguracion() {
    const stmt = this.db.prepare('SELECT * FROM configuracion LIMIT 1');
    return stmt.get();
  }

  updateConfiguracion(config) {
    const existing = this.getConfiguracion();
    
    if (existing) {
      const stmt = this.db.prepare(`
        UPDATE configuracion 
        SET nit = ?, nrc = ?, nombre_empresa = ?, nombre_comercial = ?, tipo_persona = ?,
            actividad_economica = ?, telefono = ?, email = ?, direccion = ?,
            direccion_complementaria = ?, departamento = ?, municipio = ?, distrito = ?,
            codigo_establecimiento = ?, punto_venta = ?, 
            hacienda_usuario = ?, hacienda_password = ?, hacienda_ambiente = ?,
            certificado_path = ?, pin_certificado = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      return stmt.run(
        config.nit, config.nrc, config.nombre_empresa, config.nombre_comercial, config.tipo_persona,
        config.actividad_economica, config.telefono, config.email, config.direccion,
        config.direccion_complementaria, config.departamento, config.municipio, config.distrito,
        config.codigo_establecimiento, config.punto_venta,
        config.hacienda_usuario, config.hacienda_password, config.hacienda_ambiente,
        config.certificado_path, config.pin_certificado, existing.id
      );
    } else {
      const stmt = this.db.prepare(`
        INSERT INTO configuracion 
        (nit, nrc, nombre_empresa, nombre_comercial, tipo_persona, actividad_economica, 
         telefono, email, direccion, direccion_complementaria, departamento, municipio, 
         distrito, codigo_establecimiento, punto_venta, hacienda_usuario, 
         hacienda_password, hacienda_ambiente, certificado_path, pin_certificado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      return stmt.run(
        config.nit, config.nrc, config.nombre_empresa, config.nombre_comercial, config.tipo_persona,
        config.actividad_economica, config.telefono, config.email, config.direccion,
        config.direccion_complementaria, config.departamento, config.municipio, config.distrito,
        config.codigo_establecimiento, config.punto_venta,
        config.hacienda_usuario, config.hacienda_password, config.hacienda_ambiente,
        config.certificado_path, config.pin_certificado
      );
    }
  }

  // Métodos para Clientes
  getClientes() {
    const stmt = this.db.prepare('SELECT * FROM clientes ORDER BY nombre');
    return stmt.all();
  }

  addCliente(cliente) {
    const stmt = this.db.prepare(`
      INSERT INTO clientes 
      (tipo_documento, numero_documento, nrc, nombre, nombre_comercial, tipo_persona,
       telefono, email, direccion, departamento, municipio, distrito, giro)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      cliente.tipo_documento, cliente.numero_documento, cliente.nrc, cliente.nombre,
      cliente.nombre_comercial, cliente.tipo_persona, cliente.telefono, cliente.email,
      cliente.direccion, cliente.departamento, cliente.municipio, 
      cliente.distrito, cliente.giro
    );
  }

  updateCliente(id, cliente) {
    const stmt = this.db.prepare(`
      UPDATE clientes 
      SET tipo_documento = ?, numero_documento = ?, nrc = ?, nombre = ?, nombre_comercial = ?,
          tipo_persona = ?, telefono = ?, email = ?, direccion = ?, departamento = ?, 
          municipio = ?, distrito = ?, giro = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(
      cliente.tipo_documento, cliente.numero_documento, cliente.nrc, cliente.nombre,
      cliente.nombre_comercial, cliente.tipo_persona, cliente.telefono, cliente.email,
      cliente.direccion, cliente.departamento, cliente.municipio, 
      cliente.distrito, cliente.giro, id
    );
  }

  deleteCliente(id) {
    const stmt = this.db.prepare('DELETE FROM clientes WHERE id = ?');
    return stmt.run(id);
  }

  getClienteById(id) {
    const stmt = this.db.prepare('SELECT * FROM clientes WHERE id = ?');
    return stmt.get(id);
  }

  // Métodos para Productos
  getProductos() {
    const stmt = this.db.prepare('SELECT * FROM productos ORDER BY descripcion');
    return stmt.all();
  }

  addProducto(producto) {
    const stmt = this.db.prepare(`
      INSERT INTO productos 
      (codigo, descripcion, tipo, precio, unidad_medida, tributos, exento)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      producto.codigo, producto.descripcion, producto.tipo, producto.precio,
      producto.unidad_medida, JSON.stringify(producto.tributos || []), 
      producto.exento || 0
    );
  }

  updateProducto(id, producto) {
    const stmt = this.db.prepare(`
      UPDATE productos 
      SET codigo = ?, descripcion = ?, tipo = ?, precio = ?, unidad_medida = ?,
          tributos = ?, exento = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(
      producto.codigo, producto.descripcion, producto.tipo, producto.precio,
      producto.unidad_medida, JSON.stringify(producto.tributos || []),
      producto.exento || 0, id
    );
  }

  deleteProducto(id) {
    const stmt = this.db.prepare('DELETE FROM productos WHERE id = ?');
    return stmt.run(id);
  }

  getProductoById(id) {
    const stmt = this.db.prepare('SELECT * FROM productos WHERE id = ?');
    return stmt.get(id);
  }

  // Métodos para Facturas
  getFacturas(filtros = {}) {
    let query = 'SELECT * FROM facturas WHERE 1=1';
    const params = [];

    if (filtros.fechaInicio) {
      query += ' AND fecha_emision >= ?';
      params.push(filtros.fechaInicio);
    }
    if (filtros.fechaFin) {
      query += ' AND fecha_emision <= ?';
      params.push(filtros.fechaFin);
    }
    if (filtros.estado) {
      query += ' AND estado = ?';
      params.push(filtros.estado);
    }

    query += ' ORDER BY fecha_emision DESC';

    const stmt = this.db.prepare(query);
    return stmt.all(...params);
  }

  addFactura(factura) {
    const stmt = this.db.prepare(`
      INSERT INTO facturas 
      (numero_control, codigo_generacion, tipo_dte, fecha_emision, cliente_id,
       cliente_datos, items, subtotal, iva, total, descuento, retencion,
       condicion_operacion, estado, json_dte)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      factura.numero_control, factura.codigo_generacion, factura.tipo_dte,
      factura.fecha_emision, factura.cliente_id, JSON.stringify(factura.cliente_datos),
      JSON.stringify(factura.items), factura.subtotal, factura.iva, factura.total,
      factura.descuento || 0, factura.retencion || 0, factura.condicion_operacion,
      factura.estado || 'PENDIENTE', JSON.stringify(factura.json_dte)
    );
  }

  updateFacturaEstado(id, estado, selloRecepcion = null, observaciones = null) {
    const stmt = this.db.prepare(`
      UPDATE facturas 
      SET estado = ?, sello_recepcion = ?, fecha_procesamiento = CURRENT_TIMESTAMP,
          observaciones = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(estado, selloRecepcion, observaciones, id);
  }

  close() {
    this.db.close();
  }
}

module.exports = DatabaseManager;
