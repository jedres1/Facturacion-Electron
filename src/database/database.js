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
        departamento TEXT,
        municipio TEXT,
        distrito TEXT,
        codigo_establecimiento TEXT,
        punto_venta TEXT,
        hacienda_usuario TEXT,
        hacienda_password TEXT,
        hacienda_ambiente TEXT DEFAULT 'pruebas',
        tipo_firma TEXT DEFAULT 'web',
        firmador_usuario TEXT,
        firmador_password TEXT,
        firmador_pin TEXT,
        certificado_path TEXT,
        certificado_password TEXT,
        correo_smtp_host TEXT DEFAULT 'smtp.gmail.com',
        correo_smtp_port INTEGER DEFAULT 465,
        correo_smtp_secure INTEGER DEFAULT 1,
        correo_usuario TEXT,
        correo_password TEXT,
        correo_remitente TEXT,
        correo_nombre TEXT,
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
        tipo_dte_default TEXT NOT NULL DEFAULT '01',
        aplica_exportacion INTEGER DEFAULT 0,
        cod_pais TEXT,
        nombre_pais TEXT,
        tipo_persona_exportacion INTEGER,
        desc_actividad_exportacion TEXT,
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

    [
      [`aplica_exportacion`, `INTEGER DEFAULT 0`],
      [`tipo_dte_default`, `TEXT NOT NULL DEFAULT '01'`],
      [`cod_pais`, `TEXT`],
      [`nombre_pais`, `TEXT`],
      [`tipo_persona_exportacion`, `INTEGER`],
      [`desc_actividad_exportacion`, `TEXT`]
    ].forEach(([columna, tipo]) => {
      try {
        this.db.exec(`ALTER TABLE clientes ADD COLUMN ${columna} ${tipo}`);
      } catch (error) {
        // La columna ya existe, ignorar error
      }
    });
    
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
    
    // Agregar columnas de certificado si no existen
    try {
      this.db.exec(`ALTER TABLE configuracion ADD COLUMN certificado_path TEXT`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }
    
    try {
      this.db.exec(`ALTER TABLE configuracion ADD COLUMN certificado_password TEXT`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }

    try {
      this.db.exec(`ALTER TABLE configuracion ADD COLUMN tipo_firma TEXT DEFAULT 'web'`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }

    try {
      this.db.exec(`ALTER TABLE configuracion ADD COLUMN firmador_usuario TEXT`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }

    try {
      this.db.exec(`ALTER TABLE configuracion ADD COLUMN firmador_password TEXT`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }

    try {
      this.db.exec(`ALTER TABLE configuracion ADD COLUMN firmador_pin TEXT`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }

    [
      [`correo_smtp_host`, `TEXT DEFAULT 'smtp.gmail.com'`],
      [`correo_smtp_port`, `INTEGER DEFAULT 465`],
      [`correo_smtp_secure`, `INTEGER DEFAULT 1`],
      [`correo_usuario`, `TEXT`],
      [`correo_password`, `TEXT`],
      [`correo_remitente`, `TEXT`],
      [`correo_nombre`, `TEXT`]
    ].forEach(([columna, tipo]) => {
      try {
        this.db.exec(`ALTER TABLE configuracion ADD COLUMN ${columna} ${tipo}`);
      } catch (error) {
        // La columna ya existe, ignorar error
      }
    });

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
        sello_anulacion TEXT,
        fecha_anulacion DATETIME,
        motivo_anulacion TEXT,
        json_anulacion TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id)
      )
    `);

    try {
      this.db.exec(`ALTER TABLE facturas ADD COLUMN sello_anulacion TEXT`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }

    try {
      this.db.exec(`ALTER TABLE facturas ADD COLUMN fecha_anulacion DATETIME`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }

    try {
      this.db.exec(`ALTER TABLE facturas ADD COLUMN motivo_anulacion TEXT`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }

    try {
      this.db.exec(`ALTER TABLE facturas ADD COLUMN json_anulacion TEXT`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }

    // Tabla de eventos contingencia
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS contingencias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        factura_id INTEGER NOT NULL,
        tipo_contingencia TEXT NOT NULL,
        fecha_contingencia DATETIME NOT NULL,
        motivo TEXT,
        estado TEXT DEFAULT 'PENDIENTE',
        intentos_reenvio INTEGER DEFAULT 0,
        ultimo_intento DATETIME,
        fecha_resolucion DATETIME,
        sello_resolucion TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (factura_id) REFERENCES facturas(id)
      )
    `);

    try {
      this.db.exec(`ALTER TABLE contingencias ADD COLUMN tipo_contingencia TEXT`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }

    try {
      this.db.exec(`ALTER TABLE contingencias ADD COLUMN fecha_contingencia DATETIME`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }

    try {
      this.db.exec(`ALTER TABLE contingencias ADD COLUMN estado TEXT DEFAULT 'PENDIENTE'`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }

    try {
      this.db.exec(`ALTER TABLE contingencias ADD COLUMN intentos_reenvio INTEGER DEFAULT 0`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }

    try {
      this.db.exec(`ALTER TABLE contingencias ADD COLUMN ultimo_intento DATETIME`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }

    try {
      this.db.exec(`ALTER TABLE contingencias ADD COLUMN fecha_resolucion DATETIME`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }

    try {
      this.db.exec(`ALTER TABLE contingencias ADD COLUMN sello_resolucion TEXT`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }

    const contingenciaColumns = this.db.prepare(`PRAGMA table_info(contingencias)`).all();
    const contingencyColumnNames = contingenciaColumns.map((column) => column.name);

    if (contingencyColumnNames.includes('tipo_evento')) {
      this.db.exec(`
        UPDATE contingencias
        SET tipo_contingencia = COALESCE(tipo_contingencia, tipo_evento, '5')
        WHERE tipo_contingencia IS NULL
      `);
    } else {
      this.db.exec(`
        UPDATE contingencias
        SET tipo_contingencia = COALESCE(tipo_contingencia, '5')
        WHERE tipo_contingencia IS NULL
      `);
    }

    if (contingencyColumnNames.includes('fecha_evento')) {
      this.db.exec(`
        UPDATE contingencias
        SET fecha_contingencia = COALESCE(fecha_contingencia, fecha_evento, CURRENT_TIMESTAMP)
        WHERE fecha_contingencia IS NULL
      `);
    } else {
      this.db.exec(`
        UPDATE contingencias
        SET fecha_contingencia = COALESCE(fecha_contingencia, CURRENT_TIMESTAMP)
        WHERE fecha_contingencia IS NULL
      `);
    }

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
            departamento = ?, municipio = ?, distrito = ?,
            codigo_establecimiento = ?, punto_venta = ?, 
            hacienda_usuario = ?, hacienda_password = ?, hacienda_ambiente = ?,
            tipo_firma = ?, firmador_usuario = ?, firmador_password = ?, firmador_pin = ?,
            certificado_path = ?, certificado_password = ?,
            correo_smtp_host = ?, correo_smtp_port = ?, correo_smtp_secure = ?,
            correo_usuario = ?, correo_password = ?, correo_remitente = ?, correo_nombre = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      return stmt.run(
        config.nit, config.nrc, config.nombre_empresa, config.nombre_comercial, config.tipo_persona,
        config.actividad_economica, config.telefono, config.email, config.direccion,
        config.departamento, config.municipio, config.distrito,
        config.codigo_establecimiento, config.punto_venta,
        config.hacienda_usuario, config.hacienda_password, config.hacienda_ambiente,
        config.tipo_firma || 'web', config.firmador_usuario, config.firmador_password, config.firmador_pin,
        config.certificado_path, config.certificado_password,
        config.correo_smtp_host || 'smtp.gmail.com',
        Number(config.correo_smtp_port || 465),
        Number(config.correo_smtp_secure ?? 1),
        config.correo_usuario,
        config.correo_password,
        config.correo_remitente,
        config.correo_nombre,
        existing.id
      );
    } else {
      const stmt = this.db.prepare(`
        INSERT INTO configuracion 
        (nit, nrc, nombre_empresa, nombre_comercial, tipo_persona, actividad_economica, 
         telefono, email, direccion, departamento, municipio, 
         distrito, codigo_establecimiento, punto_venta, hacienda_usuario, 
         hacienda_password, hacienda_ambiente, tipo_firma, firmador_usuario, 
         firmador_password, firmador_pin, certificado_path, certificado_password,
         correo_smtp_host, correo_smtp_port, correo_smtp_secure, correo_usuario,
         correo_password, correo_remitente, correo_nombre)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      return stmt.run(
        config.nit, config.nrc, config.nombre_empresa, config.nombre_comercial, config.tipo_persona,
        config.actividad_economica, config.telefono, config.email, config.direccion,
        config.departamento, config.municipio, config.distrito,
        config.codigo_establecimiento, config.punto_venta,
        config.hacienda_usuario, config.hacienda_password, config.hacienda_ambiente,
        config.tipo_firma || 'web', config.firmador_usuario, config.firmador_password, config.firmador_pin,
        config.certificado_path, config.certificado_password,
        config.correo_smtp_host || 'smtp.gmail.com',
        Number(config.correo_smtp_port || 465),
        Number(config.correo_smtp_secure ?? 1),
        config.correo_usuario,
        config.correo_password,
        config.correo_remitente,
        config.correo_nombre
      );
    }
  }

  // Métodos para Clientes
  getClientes() {
    const stmt = this.db.prepare('SELECT * FROM clientes ORDER BY nombre');
    return stmt.all();
  }

  addCliente(cliente) {
    this.validarEmailCliente(cliente);
    const stmt = this.db.prepare(`
      INSERT INTO clientes 
      (tipo_documento, numero_documento, nrc, nombre, nombre_comercial, tipo_persona,
       telefono, email, direccion, departamento, municipio, distrito, giro,
       tipo_dte_default, aplica_exportacion, cod_pais, nombre_pais, tipo_persona_exportacion, desc_actividad_exportacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      cliente.tipo_documento, cliente.numero_documento, cliente.nrc, cliente.nombre,
      cliente.nombre_comercial, cliente.tipo_persona, cliente.telefono, cliente.email,
      cliente.direccion, cliente.departamento, cliente.municipio, 
      cliente.distrito, cliente.giro, cliente.tipo_dte_default || '01',
      cliente.aplica_exportacion ? 1 : 0,
      cliente.cod_pais, cliente.nombre_pais, cliente.tipo_persona_exportacion,
      cliente.desc_actividad_exportacion
    );
  }

  updateCliente(id, cliente) {
    this.validarEmailCliente(cliente);
    const stmt = this.db.prepare(`
      UPDATE clientes 
      SET tipo_documento = ?, numero_documento = ?, nrc = ?, nombre = ?, nombre_comercial = ?,
          tipo_persona = ?, telefono = ?, email = ?, direccion = ?, departamento = ?, 
          municipio = ?, distrito = ?, giro = ?, tipo_dte_default = ?, aplica_exportacion = ?, cod_pais = ?,
          nombre_pais = ?, tipo_persona_exportacion = ?, desc_actividad_exportacion = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(
      cliente.tipo_documento, cliente.numero_documento, cliente.nrc, cliente.nombre,
      cliente.nombre_comercial, cliente.tipo_persona, cliente.telefono, cliente.email,
      cliente.direccion, cliente.departamento, cliente.municipio, 
      cliente.distrito, cliente.giro, cliente.tipo_dte_default || '01',
      cliente.aplica_exportacion ? 1 : 0,
      cliente.cod_pais, cliente.nombre_pais, cliente.tipo_persona_exportacion,
      cliente.desc_actividad_exportacion, id
    );
  }

  validarEmailCliente(cliente) {
    const email = String(cliente?.email || '').trim();
    if (!email) {
      throw new Error('El correo electrónico del cliente es obligatorio.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('El correo electrónico del cliente no es válido.');
    }
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
      factura.estado || 'PENDIENTE',
      typeof factura.json_dte === 'string' ? factura.json_dte : JSON.stringify(factura.json_dte)
    );
  }

  updateFacturaEstado(id, estado, selloRecepcion = null, observaciones = null, jsonDte = null) {
    const campos = [
      'estado = ?',
      'sello_recepcion = ?',
      'observaciones = ?',
      'fecha_procesamiento = CURRENT_TIMESTAMP',
      'updated_at = CURRENT_TIMESTAMP'
    ];
    const params = [estado, selloRecepcion, observaciones];

    if (jsonDte !== null) {
      campos.push('json_dte = ?');
      params.push(typeof jsonDte === 'string' ? jsonDte : JSON.stringify(jsonDte));
    }

    params.push(id);

    const stmt = this.db.prepare(`
      UPDATE facturas
      SET ${campos.join(', ')}
      WHERE id = ?
    `);
    return stmt.run(...params);
  }

  registrarAnulacion(id, anulacion = {}) {
    const stmt = this.db.prepare(`
      UPDATE facturas
      SET estado = 'ANULADO',
          sello_anulacion = ?,
          fecha_anulacion = CURRENT_TIMESTAMP,
          motivo_anulacion = ?,
          json_anulacion = ?,
          observaciones = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    return stmt.run(
      anulacion.selloAnulacion || anulacion.selloRecibido || null,
      anulacion.motivo || null,
      anulacion.jsonAnulacion
        ? (typeof anulacion.jsonAnulacion === 'string' ? anulacion.jsonAnulacion : JSON.stringify(anulacion.jsonAnulacion))
        : null,
      anulacion.observaciones
        ? (typeof anulacion.observaciones === 'string' ? anulacion.observaciones : JSON.stringify(anulacion.observaciones))
        : null,
      id
    );
  }

  // Obtener siguiente correlativo para número de control
  getSiguienteCorrelativo(tipoDte) {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as total FROM facturas WHERE tipo_dte = ?
    `);
    const result = stmt.get(tipoDte);
    return (result.total || 0) + 1;
  }

  close() {
    this.db.close();
  }
}

module.exports = DatabaseManager;
