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
        tipos_dte_habilitados TEXT DEFAULT '["01","03","05","06","07","11","14"]',
        logo_path TEXT,
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
        condicion_iva TEXT NOT NULL DEFAULT 'GRAVADO',
        plazo_pago TEXT NOT NULL DEFAULT '01',
        periodo_pago INTEGER NOT NULL DEFAULT 1,
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
      [`condicion_iva`, `TEXT NOT NULL DEFAULT 'GRAVADO'`],
      [`plazo_pago`, `TEXT NOT NULL DEFAULT '01'`],
      [`periodo_pago`, `INTEGER NOT NULL DEFAULT 1`],
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
      [`correo_nombre`, `TEXT`],
      [`tipos_dte_habilitados`, `TEXT DEFAULT '["01","03","05","06","07","11","14"]'`],
      [`logo_path`, `TEXT`]
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
        numero_control TEXT,
        codigo_generacion TEXT UNIQUE,
        tipo_dte TEXT NOT NULL, -- '01' Factura, '03' CCF, '14' Nota de Crédito, etc.
        fecha_emision DATETIME NOT NULL,
        cliente_id INTEGER NOT NULL,
        cliente_datos TEXT NOT NULL, -- JSON con datos del cliente
        items TEXT NOT NULL, -- JSON con items de la factura
        total REAL NOT NULL,
        estado TEXT DEFAULT 'PENDIENTE', -- PENDIENTE, FIRMADO, ENVIADO, ACEPTADO, RECHAZADO
        json_dte TEXT, -- JSON completo del DTE
        sello_recepcion TEXT,
        fecha_procesamiento DATETIME,
        observaciones TEXT,
        correo_enviado INTEGER DEFAULT 0,
        fecha_correo DATETIME,
        notas TEXT,
        sello_anulacion TEXT,
        fecha_anulacion DATETIME,
        motivo_anulacion TEXT,
        json_anulacion TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id)
      )
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS correlativos_dte (
        tipo_dte TEXT NOT NULL,
        anio INTEGER NOT NULL,
        establecimiento TEXT NOT NULL DEFAULT '',
        punto_venta TEXT NOT NULL DEFAULT '',
        siguiente INTEGER NOT NULL DEFAULT 1,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (tipo_dte, anio, establecimiento, punto_venta)
      )
    `);
    this.migrarCorrelativosDteAnuales();

    try {
      this.db.exec(`ALTER TABLE facturas ADD COLUMN notas TEXT`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }

    try {
      this.db.exec(`ALTER TABLE facturas ADD COLUMN correo_enviado INTEGER DEFAULT 0`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }

    try {
      this.db.exec(`ALTER TABLE facturas ADD COLUMN fecha_correo DATETIME`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }

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
        numero_validacion TEXT,
        json_evento TEXT,
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

    try {
      this.db.exec(`ALTER TABLE contingencias ADD COLUMN numero_validacion TEXT`);
    } catch (error) {
      // La columna ya existe, ignorar error
    }

    try {
      this.db.exec(`ALTER TABLE contingencias ADD COLUMN json_evento TEXT`);
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

    this.migrarFacturasNumeroControlAnual();
    this.eliminarColumnasObsoletas();

    // Índices
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_facturas_fecha ON facturas(fecha_emision);
      CREATE INDEX IF NOT EXISTS idx_facturas_estado ON facturas(estado);
      CREATE INDEX IF NOT EXISTS idx_facturas_cliente ON facturas(cliente_id);
      CREATE INDEX IF NOT EXISTS idx_facturas_tipo_estado ON facturas(tipo_dte, estado);
      CREATE UNIQUE INDEX IF NOT EXISTS idx_facturas_numero_control_anio
        ON facturas(numero_control, substr(fecha_emision, 1, 4))
        WHERE numero_control IS NOT NULL;
      CREATE INDEX IF NOT EXISTS idx_clientes_documento ON clientes(numero_documento);
      CREATE INDEX IF NOT EXISTS idx_contingencias_estado ON contingencias(estado);
      CREATE INDEX IF NOT EXISTS idx_contingencias_factura ON contingencias(factura_id);
    `);
  }

  obtenerColumnas(tabla) {
    return new Set(this.db.prepare(`PRAGMA table_info(${tabla})`).all().map(columna => columna.name));
  }

  eliminarColumnaSiExiste(tabla, columna) {
    const columnas = this.obtenerColumnas(tabla);
    if (!columnas.has(columna)) return;

    try {
      this.db.exec(`ALTER TABLE ${tabla} DROP COLUMN ${columna}`);
    } catch (error) {
      console.warn(`No se pudo eliminar columna obsoleta ${tabla}.${columna}:`, error.message);
    }
  }

  eliminarColumnasObsoletas() {
    [
      ['configuracion', 'pin_certificado'],
      ['configuracion', 'direccion_complementaria'],
      ['contingencias', 'tipo_evento'],
      ['contingencias', 'fecha_evento'],
      ['facturas', 'subtotal'],
      ['facturas', 'iva'],
      ['facturas', 'descuento'],
      ['facturas', 'retencion'],
      ['facturas', 'condicion_operacion']
    ].forEach(([tabla, columna]) => this.eliminarColumnaSiExiste(tabla, columna));
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
            tipos_dte_habilitados = ?,
            logo_path = ?,
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
        this.normalizarTiposDteHabilitados(config.tipos_dte_habilitados),
        config.logo_path,
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
         correo_password, correo_remitente, correo_nombre, tipos_dte_habilitados, logo_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        this.normalizarTiposDteHabilitados(config.tipos_dte_habilitados),
        config.logo_path
      );
    }
  }

  normalizarTiposDteHabilitados(tipos) {
    const permitidos = ['01', '03', '05', '06', '07', '11', '14'];
    let lista = tipos;

    if (typeof lista === 'string') {
      try {
        lista = JSON.parse(lista);
      } catch {
        lista = lista.split(',');
      }
    }

    if (!Array.isArray(lista)) lista = permitidos;

    const normalizados = [...new Set(lista
      .map(tipo => String(tipo || '').padStart(2, '0'))
      .filter(tipo => permitidos.includes(tipo)))];

    return JSON.stringify(normalizados.length ? normalizados : ['01']);
  }

  migrarCorrelativosDteAnuales() {
    const columnas = this.db.prepare(`PRAGMA table_info(correlativos_dte)`).all();
    const nombres = columnas.map(columna => columna.name);
    const pkColumnas = columnas.filter(columna => columna.pk > 0).length;

    if (nombres.includes('anio') && nombres.includes('establecimiento') && nombres.includes('punto_venta') && pkColumnas >= 4) {
      return;
    }

    const anioActual = new Date().getFullYear();
    const existentes = this.db.prepare(`
      SELECT tipo_dte, siguiente
      FROM correlativos_dte
    `).all();

    this.db.exec(`DROP TABLE IF EXISTS correlativos_dte_legacy`);
    this.db.exec(`ALTER TABLE correlativos_dte RENAME TO correlativos_dte_legacy`);
    this.db.exec(`
      CREATE TABLE correlativos_dte (
        tipo_dte TEXT NOT NULL,
        anio INTEGER NOT NULL,
        establecimiento TEXT NOT NULL DEFAULT '',
        punto_venta TEXT NOT NULL DEFAULT '',
        siguiente INTEGER NOT NULL DEFAULT 1,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (tipo_dte, anio, establecimiento, punto_venta)
      )
    `);

    const insert = this.db.prepare(`
      INSERT INTO correlativos_dte (tipo_dte, anio, establecimiento, punto_venta, siguiente, updated_at)
      VALUES (?, ?, '', '', ?, CURRENT_TIMESTAMP)
    `);

    existentes.forEach(row => {
      const tipo = String(row.tipo_dte || '').padStart(2, '0');
      if (tipo) insert.run(tipo, anioActual, Number(row.siguiente || 1));
    });

    this.db.exec(`DROP TABLE correlativos_dte_legacy`);
  }

  facturasTieneNumeroControlUnicoGlobal() {
    const indices = this.db.prepare(`PRAGMA index_list(facturas)`).all();

    return indices.some(indice => {
      if (!indice.unique) return false;
      const columnas = this.db.prepare(`PRAGMA index_info(${JSON.stringify(indice.name)})`).all();
      return columnas.length === 1 && columnas[0].name === 'numero_control';
    });
  }

  migrarFacturasNumeroControlAnual() {
    if (!this.facturasTieneNumeroControlUnicoGlobal()) return;

    try {
      this.db.exec(`
        PRAGMA foreign_keys = OFF;
        BEGIN IMMEDIATE;
        DROP TABLE IF EXISTS contingencias_legacy;
        DROP TABLE IF EXISTS facturas_legacy;
        ALTER TABLE contingencias RENAME TO contingencias_legacy;
        ALTER TABLE facturas RENAME TO facturas_legacy;

        CREATE TABLE facturas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          numero_control TEXT,
          codigo_generacion TEXT UNIQUE,
          tipo_dte TEXT NOT NULL,
          fecha_emision DATETIME NOT NULL,
          cliente_id INTEGER NOT NULL,
          cliente_datos TEXT NOT NULL,
          items TEXT NOT NULL,
          total REAL NOT NULL,
          estado TEXT DEFAULT 'PENDIENTE',
          json_dte TEXT,
          sello_recepcion TEXT,
          fecha_procesamiento DATETIME,
          observaciones TEXT,
          correo_enviado INTEGER DEFAULT 0,
          fecha_correo DATETIME,
          notas TEXT,
          sello_anulacion TEXT,
          fecha_anulacion DATETIME,
          motivo_anulacion TEXT,
          json_anulacion TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (cliente_id) REFERENCES clientes(id)
        );

        INSERT INTO facturas (
          id, numero_control, codigo_generacion, tipo_dte, fecha_emision, cliente_id,
          cliente_datos, items, total, estado, json_dte, sello_recepcion,
          fecha_procesamiento, observaciones, correo_enviado, fecha_correo, notas,
          sello_anulacion, fecha_anulacion, motivo_anulacion, json_anulacion,
          created_at, updated_at
        )
        SELECT
          id, numero_control, codigo_generacion, tipo_dte, fecha_emision, cliente_id,
          cliente_datos, items, total, estado, json_dte, sello_recepcion,
          fecha_procesamiento, observaciones, correo_enviado, fecha_correo, notas,
          sello_anulacion, fecha_anulacion, motivo_anulacion, json_anulacion,
          created_at, updated_at
        FROM facturas_legacy;

        CREATE TABLE contingencias (
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
          numero_validacion TEXT,
          json_evento TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (factura_id) REFERENCES facturas(id)
        );

        INSERT INTO contingencias (
          id, factura_id, tipo_contingencia, fecha_contingencia, motivo, estado,
          intentos_reenvio, ultimo_intento, fecha_resolucion, sello_resolucion,
          numero_validacion, json_evento, created_at
        )
        SELECT
          id, factura_id, tipo_contingencia, fecha_contingencia, motivo, estado,
          intentos_reenvio, ultimo_intento, fecha_resolucion, sello_resolucion,
          numero_validacion, json_evento, created_at
        FROM contingencias_legacy;

        DROP TABLE facturas_legacy;
        DROP TABLE contingencias_legacy;
        COMMIT;
        PRAGMA foreign_keys = ON;
      `);
    } catch (error) {
      try {
        this.db.exec(`ROLLBACK; PRAGMA foreign_keys = ON;`);
      } catch {
        this.db.exec(`PRAGMA foreign_keys = ON;`);
      }
      throw error;
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
       tipo_dte_default, condicion_iva, plazo_pago, periodo_pago, aplica_exportacion, cod_pais, nombre_pais, tipo_persona_exportacion, desc_actividad_exportacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      cliente.tipo_documento, cliente.numero_documento, cliente.nrc, cliente.nombre,
      cliente.nombre_comercial, cliente.tipo_persona, cliente.telefono, cliente.email,
      cliente.direccion, cliente.departamento, cliente.municipio, 
      cliente.distrito, cliente.giro, cliente.tipo_dte_default || '01',
      cliente.condicion_iva || 'GRAVADO',
      cliente.plazo_pago || '01',
      Number(cliente.periodo_pago || 1),
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
          municipio = ?, distrito = ?, giro = ?, tipo_dte_default = ?, condicion_iva = ?, plazo_pago = ?, periodo_pago = ?, aplica_exportacion = ?, cod_pais = ?,
          nombre_pais = ?, tipo_persona_exportacion = ?, desc_actividad_exportacion = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(
      cliente.tipo_documento, cliente.numero_documento, cliente.nrc, cliente.nombre,
      cliente.nombre_comercial, cliente.tipo_persona, cliente.telefono, cliente.email,
      cliente.direccion, cliente.departamento, cliente.municipio, 
      cliente.distrito, cliente.giro, cliente.tipo_dte_default || '01',
      cliente.condicion_iva || 'GRAVADO',
      cliente.plazo_pago || '01',
      Number(cliente.periodo_pago || 1),
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
       cliente_datos, items, total, estado, json_dte, notas)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      factura.numero_control, factura.codigo_generacion, factura.tipo_dte,
      factura.fecha_emision, factura.cliente_id, JSON.stringify(factura.cliente_datos),
      JSON.stringify(factura.items), factura.total,
      factura.estado || 'PENDIENTE',
      typeof factura.json_dte === 'string' ? factura.json_dte : JSON.stringify(factura.json_dte),
      factura.notas || null
    );
    this.registrarCorrelativoUsado(factura.tipo_dte, factura.numero_control, factura.fecha_emision);
    return result;
  }

  existeNumeroControl(numeroControl, fecha = null) {
    const anio = this.obtenerAnioCorrelativo(fecha);
    const stmt = this.db.prepare(`
      SELECT 1 FROM facturas
      WHERE numero_control = ?
        AND substr(fecha_emision, 1, 4) = ?
      LIMIT 1
    `);
    return Boolean(stmt.get(numeroControl, String(anio)));
  }

  obtenerCorrelativoDesdeNumeroControl(numeroControl) {
    const match = String(numeroControl || '').match(/-(\d{15})$/);
    return match ? Number(match[1]) : null;
  }

  obtenerSerieDesdeNumeroControl(numeroControl) {
    const match = String(numeroControl || '').match(/^DTE-[0-9]{2}-([A-Z0-9]{8})-[0-9]{15}$/);
    if (!match) return { establecimiento: '', puntoVenta: '' };

    return {
      establecimiento: match[1].slice(0, 4),
      puntoVenta: match[1].slice(4, 8)
    };
  }

  normalizarCodigoControl(valor, fallback = '') {
    return String(valor || fallback)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .padStart(4, '0')
      .slice(0, 4);
  }

  obtenerAnioCorrelativo(fecha = null) {
    const valor = String(fecha || '').slice(0, 4);
    const anio = Number(valor);
    return Number.isInteger(anio) && anio >= 2000 ? anio : new Date().getFullYear();
  }

  registrarCorrelativoUsado(tipoDte, numeroControl, fecha = null) {
    const tipo = String(tipoDte || '').padStart(2, '0');
    const correlativoUsado = this.obtenerCorrelativoDesdeNumeroControl(numeroControl);
    if (!tipo || !Number.isFinite(correlativoUsado) || correlativoUsado < 1) return;
    const anio = this.obtenerAnioCorrelativo(fecha);
    const serie = this.obtenerSerieDesdeNumeroControl(numeroControl);

    const stmt = this.db.prepare(`
      INSERT INTO correlativos_dte (tipo_dte, anio, establecimiento, punto_venta, siguiente, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(tipo_dte, anio, establecimiento, punto_venta) DO UPDATE SET
        siguiente = MAX(correlativos_dte.siguiente, excluded.siguiente),
        updated_at = CURRENT_TIMESTAMP
    `);
    stmt.run(tipo, anio, serie.establecimiento, serie.puntoVenta, correlativoUsado + 1);
  }

  getCorrelativosDte() {
    return this.db.prepare(`
      WITH usados AS (
        SELECT
          tipo_dte,
          CAST(substr(fecha_emision, 1, 4) AS INTEGER) AS anio,
          substr(numero_control, 8, 4) AS establecimiento,
          substr(numero_control, 12, 4) AS punto_venta,
          MAX(CAST(substr(numero_control, -15) AS INTEGER)) AS ultimo_usado,
          COUNT(*) AS documentos
        FROM facturas
        WHERE numero_control IS NOT NULL
        GROUP BY tipo_dte, anio, establecimiento, punto_venta
      )
      SELECT
        c.tipo_dte,
        c.anio,
        c.establecimiento,
        c.punto_venta,
        c.siguiente,
        COALESCE(u.ultimo_usado, 0) AS ultimo_usado,
        COALESCE(u.documentos, 0) AS documentos,
        c.updated_at
      FROM correlativos_dte c
      LEFT JOIN usados u
        ON u.tipo_dte = c.tipo_dte
       AND u.anio = c.anio
       AND u.establecimiento = c.establecimiento
       AND u.punto_venta = c.punto_venta
      WHERE c.establecimiento <> ''
         OR c.punto_venta <> ''
         OR NOT EXISTS (
           SELECT 1 FROM correlativos_dte c2
           WHERE c2.tipo_dte = c.tipo_dte
             AND c2.anio = c.anio
             AND (c2.establecimiento <> '' OR c2.punto_venta <> '')
         )
      ORDER BY c.anio DESC, c.tipo_dte, c.establecimiento, c.punto_venta
    `).all();
  }

  updateCorrelativoDte(datos = {}) {
    const tipo = String(datos.tipo_dte || '').padStart(2, '0');
    const anio = this.obtenerAnioCorrelativo(datos.anio);
    const establecimiento = this.normalizarCodigoControl(datos.establecimiento, '');
    const puntoVenta = this.normalizarCodigoControl(datos.punto_venta || datos.puntoVenta, '');
    const siguiente = Number(datos.siguiente);

    if (!tipo || !Number.isInteger(siguiente) || siguiente < 1) {
      throw new Error('Ingrese un correlativo válido.');
    }

    const serieControl = `${establecimiento}${puntoVenta}`;
    const usado = this.db.prepare(`
      SELECT MAX(CAST(substr(numero_control, -15) AS INTEGER)) AS ultimo
      FROM facturas
      WHERE tipo_dte = ?
        AND substr(fecha_emision, 1, 4) = ?
        AND numero_control LIKE ?
    `).get(tipo, String(anio), `DTE-${tipo}-${serieControl}-%`);
    const minimo = Number(usado?.ultimo || 0) + 1;

    if (siguiente < minimo) {
      throw new Error(`El siguiente correlativo no puede ser menor que ${minimo}; ya existen documentos locales en esa serie.`);
    }

    return this.db.prepare(`
      INSERT INTO correlativos_dte (tipo_dte, anio, establecimiento, punto_venta, siguiente, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(tipo_dte, anio, establecimiento, punto_venta) DO UPDATE SET
        siguiente = excluded.siguiente,
        updated_at = CURRENT_TIMESTAMP
    `).run(tipo, anio, establecimiento, puntoVenta, siguiente);
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

  updateFacturaCorreccion(id, datos = {}) {
    const campos = [
      'estado = ?',
      'sello_recepcion = NULL',
      'observaciones = ?',
      'fecha_procesamiento = NULL',
      'updated_at = CURRENT_TIMESTAMP'
    ];
    const params = [datos.estado || 'PENDIENTE', datos.observaciones || null];

    if (datos.cliente_datos !== undefined) {
      campos.push('cliente_datos = ?');
      params.push(typeof datos.cliente_datos === 'string' ? datos.cliente_datos : JSON.stringify(datos.cliente_datos));
    }

    if (datos.items !== undefined) {
      campos.push('items = ?');
      params.push(typeof datos.items === 'string' ? datos.items : JSON.stringify(datos.items));
    }

    ['numero_control', 'codigo_generacion', 'fecha_emision', 'total'].forEach((campo) => {
      if (datos[campo] !== undefined) {
        campos.push(`${campo} = ?`);
        params.push(datos[campo]);
      }
    });

    if (datos.json_dte !== undefined) {
      campos.push('json_dte = ?');
      params.push(typeof datos.json_dte === 'string' ? datos.json_dte : JSON.stringify(datos.json_dte));
    }

    params.push(id);

    const stmt = this.db.prepare(`
      UPDATE facturas
      SET ${campos.join(', ')}
      WHERE id = ?
    `);
    return stmt.run(...params);
  }

  marcarFacturaCorreoEnviado(id) {
    const stmt = this.db.prepare(`
      UPDATE facturas
      SET correo_enviado = 1,
          fecha_correo = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(id);
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
  getSiguienteCorrelativo(tipoDte, opciones = {}) {
    const tipo = String(tipoDte || '').padStart(2, '0');
    const anio = this.obtenerAnioCorrelativo(opciones.fecha || opciones.fechaEmision);
    const establecimiento = this.normalizarCodigoControl(opciones.establecimiento || opciones.codigo_establecimiento, '');
    const puntoVenta = this.normalizarCodigoControl(opciones.puntoVenta || opciones.punto_venta, '');
    const serieControl = `${establecimiento}${puntoVenta}`;
    const localStmt = this.db.prepare(`
      SELECT MAX(CAST(SUBSTR(numero_control, -15) AS INTEGER)) as ultimo
      FROM facturas
      WHERE tipo_dte = ?
        AND numero_control LIKE ?
        AND substr(fecha_emision, 1, 4) = ?
    `);
    const local = localStmt.get(tipo, `DTE-${tipo}-${serieControl}-%`, String(anio));
    const legacy = this.db
      .prepare(`
        SELECT MAX(siguiente) as siguiente FROM correlativos_dte
        WHERE tipo_dte = ?
          AND anio = ?
          AND establecimiento = ''
          AND punto_venta = ''
      `)
      .get(tipo, anio);
    const guardado = this.db
      .prepare(`
        SELECT siguiente FROM correlativos_dte
        WHERE tipo_dte = ?
          AND anio = ?
          AND establecimiento = ?
          AND punto_venta = ?
      `)
      .get(tipo, anio, establecimiento, puntoVenta);
    const siguiente = Math.max(
      Number(local?.ultimo || 0) + 1,
      Number(legacy?.siguiente || 1),
      Number(guardado?.siguiente || 1)
    );

    this.db.prepare(`
      INSERT INTO correlativos_dte (tipo_dte, anio, establecimiento, punto_venta, siguiente, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(tipo_dte, anio, establecimiento, punto_venta) DO UPDATE SET
        siguiente = MAX(correlativos_dte.siguiente, excluded.siguiente),
        updated_at = CURRENT_TIMESTAMP
    `).run(tipo, anio, establecimiento, puntoVenta, siguiente);

    return siguiente;
  }

  close() {
    this.db.close();
  }
}

module.exports = DatabaseManager;
