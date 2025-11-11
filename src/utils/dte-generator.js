/**
 * Generador de DTEs (Documentos Tributarios Electrónicos)
 * Basado en los schemas oficiales del Ministerio de Hacienda de El Salvador
 */

const { v4: uuidv4 } = require('uuid');

class DTEGenerator {
  constructor() {
    // Códigos de unidades de medida según catálogo MH
    this.unidadesMedida = {
      'UND': 99,  // Unidad
      'KG': 14,   // Kilogramo
      'LT': 20,   // Litro
      'MT': 25,   // Metro
      'HR': 18,   // Hora
      'SV': 58,   // Servicio
      'DOC': 12   // Documento
    };
  }

  /**
   * Generar Factura Electrónica (Tipo 01)
   */
  generarFactura(config, cliente, items, resumen, opciones = {}) {
    const now = new Date();
    const codigoGeneracion = this.generarCodigoGeneracion();
    const numeroControl = this.generarNumeroControl('01', config.codigo_establecimiento);

    return {
      identificacion: {
        version: 1,
        ambiente: config.hacienda_ambiente === 'produccion' ? '00' : '01',
        tipoDte: '01',
        numeroControl: numeroControl,
        codigoGeneracion: codigoGeneracion,
        tipoModelo: 1,
        tipoOperacion: 1,
        tipoContingencia: null,
        motivoContin: null,
        fecEmi: this.formatearFecha(now),
        horEmi: this.formatearHora(now),
        tipoMoneda: 'USD'
      },
      documentoRelacionado: opciones.documentoRelacionado || null,
      emisor: this.construirEmisor(config),
      receptor: this.construirReceptorFactura(cliente),
      otrosDocumentos: opciones.otrosDocumentos || null,
      ventaTercero: opciones.ventaTercero || null,
      cuerpoDocumento: this.construirCuerpoDocumento(items),
      resumen: this.construirResumenFactura(resumen),
      extension: opciones.extension || null,
      apendice: opciones.apendice || null
    };
  }

  /**
   * Generar Comprobante de Crédito Fiscal (Tipo 03)
   */
  generarCreditoFiscal(config, cliente, items, resumen, opciones = {}) {
    const now = new Date();
    const codigoGeneracion = this.generarCodigoGeneracion();
    const numeroControl = this.generarNumeroControl('03', config.codigo_establecimiento);

    return {
      identificacion: {
        version: 3,
        ambiente: config.hacienda_ambiente === 'produccion' ? '00' : '01',
        tipoDte: '03',
        numeroControl: numeroControl,
        codigoGeneracion: codigoGeneracion,
        tipoModelo: 1,
        tipoOperacion: 1,
        tipoContingencia: null,
        motivoContin: null,
        fecEmi: this.formatearFecha(now),
        horEmi: this.formatearHora(now),
        tipoMoneda: 'USD'
      },
      documentoRelacionado: opciones.documentoRelacionado || null,
      emisor: this.construirEmisor(config),
      receptor: this.construirReceptorCCF(cliente),
      otrosDocumentos: opciones.otrosDocumentos || null,
      ventaTercero: opciones.ventaTercero || null,
      cuerpoDocumento: this.construirCuerpoDocumento(items),
      resumen: this.construirResumenCCF(resumen),
      extension: opciones.extension || null,
      apendice: opciones.apendice || null
    };
  }

  /**
   * Generar Nota de Crédito (Tipo 05)
   */
  generarNotaCredito(config, cliente, items, resumen, documentoRelacionado, opciones = {}) {
    const now = new Date();
    const codigoGeneracion = this.generarCodigoGeneracion();
    const numeroControl = this.generarNumeroControl('05', config.codigo_establecimiento);

    return {
      identificacion: {
        version: 3,
        ambiente: config.hacienda_ambiente === 'produccion' ? '00' : '01',
        tipoDte: '05',
        numeroControl: numeroControl,
        codigoGeneracion: codigoGeneracion,
        tipoModelo: 1,
        tipoOperacion: 1,
        tipoContingencia: null,
        motivoContin: null,
        fecEmi: this.formatearFecha(now),
        horEmi: this.formatearHora(now),
        tipoMoneda: 'USD'
      },
      documentoRelacionado: [documentoRelacionado],
      emisor: this.construirEmisorNC(config),
      receptor: this.construirReceptorCCF(cliente),
      ventaTercero: opciones.ventaTercero || null,
      cuerpoDocumento: this.construirCuerpoDocumentoNC(items),
      resumen: this.construirResumenNC(resumen),
      extension: opciones.extension || null,
      apendice: opciones.apendice || null
    };
  }

  /**
   * Construir objeto Emisor
   */
  construirEmisor(config) {
    return {
      nit: config.nit,
      nrc: config.nrc,
      nombre: config.nombre_empresa,
      codActividad: config.actividad_economica,
      descActividad: config.desc_actividad || '',
      nombreComercial: config.nombre_comercial || null,
      tipoEstablecimiento: '01',
      direccion: {
        departamento: config.departamento,
        municipio: config.municipio,
        complemento: config.direccion
      },
      telefono: config.telefono,
      correo: config.email,
      codEstableMH: config.codigo_establecimiento || null,
      codEstable: config.codigo_establecimiento || null,
      codPuntoVentaMH: config.punto_venta || null,
      codPuntoVenta: config.punto_venta || null
    };
  }

  /**
   * Construir objeto Emisor para Nota de Crédito
   */
  construirEmisorNC(config) {
    const emisor = this.construirEmisor(config);
    // En NC no se requieren codEstableMH, codEstable, codPuntoVentaMH, codPuntoVenta
    delete emisor.codEstableMH;
    delete emisor.codEstable;
    delete emisor.codPuntoVentaMH;
    delete emisor.codPuntoVenta;
    return emisor;
  }

  /**
   * Construir objeto Receptor para Factura
   */
  construirReceptorFactura(cliente) {
    if (!cliente) return null;

    return {
      tipoDocumento: cliente.tipo_documento || null,
      numDocumento: cliente.numero_documento || null,
      nrc: cliente.nrc || null,
      nombre: cliente.nombre || null,
      codActividad: cliente.giro || null,
      descActividad: cliente.desc_actividad || null,
      direccion: cliente.direccion ? {
        departamento: cliente.departamento,
        municipio: cliente.municipio,
        complemento: cliente.direccion
      } : null,
      telefono: cliente.telefono || null,
      correo: cliente.email || null
    };
  }

  /**
   * Construir objeto Receptor para CCF/NC (todos los campos requeridos)
   */
  construirReceptorCCF(cliente) {
    return {
      nit: cliente.numero_documento,
      nrc: cliente.nrc,
      nombre: cliente.nombre,
      codActividad: cliente.giro,
      descActividad: cliente.desc_actividad || '',
      nombreComercial: cliente.nombre_comercial || null,
      direccion: {
        departamento: cliente.departamento,
        municipio: cliente.municipio,
        complemento: cliente.direccion
      },
      telefono: cliente.telefono || null,
      correo: cliente.email
    };
  }

  /**
   * Construir cuerpo del documento
   */
  construirCuerpoDocumento(items) {
    return items.map((item, index) => {
      const cantidad = parseFloat(item.cantidad);
      const precioUni = parseFloat(item.precio_unitario);
      const montoDescu = parseFloat(item.descuento || 0);
      
      let ventaGravada = 0;
      let ventaExenta = 0;
      let ventaNoSuj = 0;

      const subtotal = (cantidad * precioUni) - montoDescu;

      if (item.exento) {
        ventaExenta = subtotal;
      } else {
        ventaGravada = subtotal;
      }

      return {
        numItem: index + 1,
        tipoItem: item.tipo_item || 2, // 1=Bien, 2=Servicio, 3=Ambos
        numeroDocumento: null,
        cantidad: cantidad,
        codigo: item.codigo || null,
        codTributo: item.exento ? null : '20', // 20=IVA
        uniMedida: this.obtenerCodigoUnidadMedida(item.unidad_medida || 'UND'),
        descripcion: item.descripcion,
        precioUni: precioUni,
        montoDescu: montoDescu,
        ventaNoSuj: ventaNoSuj,
        ventaExenta: ventaExenta,
        ventaGravada: ventaGravada,
        tributos: item.exento ? null : ['20']
      };
    });
  }

  /**
   * Construir cuerpo del documento para Nota de Crédito
   */
  construirCuerpoDocumentoNC(items) {
    return items.map((item, index) => {
      const cantidad = parseFloat(item.cantidad);
      const precioUni = parseFloat(item.precio_unitario);
      const montoDescu = parseFloat(item.descuento || 0);
      
      let ventaGravada = 0;
      let ventaExenta = 0;
      let ventaNoSuj = 0;

      const subtotal = (cantidad * precioUni) - montoDescu;

      if (item.exento) {
        ventaExenta = subtotal;
      } else {
        ventaGravada = subtotal;
      }

      return {
        numItem: index + 1,
        tipoItem: item.tipo_item || 2,
        numeroDocumento: item.numero_documento || null,
        cantidad: cantidad,
        codigo: item.codigo || null,
        codTributo: item.exento ? null : '20',
        uniMedida: this.obtenerCodigoUnidadMedida(item.unidad_medida || 'UND'),
        descripcion: item.descripcion,
        precioUni: precioUni,
        montoDescu: montoDescu,
        ventaNoSuj: ventaNoSuj,
        ventaExenta: ventaExenta,
        ventaGravada: ventaGravada,
        tributos: item.exento ? null : ['20']
      };
    });
  }

  /**
   * Construir resumen para Factura
   */
  construirResumenFactura(resumen) {
    const totalIva = parseFloat(resumen.iva || 0);
    const subtotal = parseFloat(resumen.subtotal || 0);
    const total = parseFloat(resumen.total || 0);

    return {
      totalNoSuj: 0,
      totalExenta: parseFloat(resumen.exenta || 0),
      totalGravada: parseFloat(resumen.gravada || 0),
      subTotalVentas: subtotal,
      descuNoSuj: 0,
      descuExenta: 0,
      descuGravada: parseFloat(resumen.descuento || 0),
      porcentajeDescuento: 0,
      totalDescu: parseFloat(resumen.descuento || 0),
      tributos: totalIva > 0 ? [{ codigo: '20', descripcion: 'Impuesto al Valor Agregado 13%', valor: totalIva }] : null,
      subTotal: subtotal,
      ivaRete1: 0,
      reteRenta: 0,
      montoTotalOperacion: total,
      totalNoGravado: 0,
      totalPagar: total,
      totalLetras: this.numeroALetras(total),
      totalIva: totalIva,
      saldoFavor: 0,
      condicionOperacion: resumen.condicion_operacion || 1, // 1=Contado, 2=Crédito, 3=Otro
      pagos: resumen.pagos || [
        {
          codigo: '01', // 01=Billetes y monedas
          montoPago: total,
          referencia: null,
          plazo: null,
          periodo: null
        }
      ],
      numPagoElectronico: null
    };
  }

  /**
   * Construir resumen para Crédito Fiscal
   */
  construirResumenCCF(resumen) {
    const resultado = this.construirResumenFactura(resumen);
    resultado.ivaPerci1 = 0; // IVA percibido
    delete resultado.totalIva; // No existe en CCF
    return resultado;
  }

  /**
   * Construir resumen para Nota de Crédito
   */
  construirResumenNC(resumen) {
    const totalIva = parseFloat(resumen.iva || 0);
    const subtotal = parseFloat(resumen.subtotal || 0);
    const total = parseFloat(resumen.total || 0);

    return {
      totalNoSuj: 0,
      totalExenta: parseFloat(resumen.exenta || 0),
      totalGravada: parseFloat(resumen.gravada || 0),
      subTotalVentas: subtotal,
      descuNoSuj: 0,
      descuExenta: 0,
      descuGravada: parseFloat(resumen.descuento || 0),
      totalDescu: parseFloat(resumen.descuento || 0),
      tributos: totalIva > 0 ? [{ codigo: '20', descripcion: 'Impuesto al Valor Agregado 13%', valor: totalIva }] : null,
      subTotal: subtotal,
      ivaPerci1: 0,
      ivaRete1: 0,
      reteRenta: 0,
      montoTotalOperacion: total,
      totalLetras: this.numeroALetras(total),
      condicionOperacion: resumen.condicion_operacion || 1
    };
  }

  /**
   * Generar código de generación (UUID v4)
   */
  generarCodigoGeneracion() {
    return uuidv4().toUpperCase();
  }

  /**
   * Generar número de control
   * Formato: DTE-{tipoDte}-{codEstablecimiento}-{correlativo}
   */
  generarNumeroControl(tipoDte, codEstablecimiento) {
    const establecimiento = (codEstablecimiento || '0000').padStart(8, '0');
    const correlativo = Date.now().toString().slice(-15).padStart(15, '0');
    return `DTE-${tipoDte}-${establecimiento}-${correlativo}`;
  }

  /**
   * Formatear fecha YYYY-MM-DD
   */
  formatearFecha(date) {
    return date.toISOString().split('T')[0];
  }

  /**
   * Formatear hora HH:MM:SS
   */
  formatearHora(date) {
    return date.toTimeString().split(' ')[0];
  }

  /**
   * Obtener código de unidad de medida
   */
  obtenerCodigoUnidadMedida(unidad) {
    return this.unidadesMedida[unidad] || 99;
  }

  /**
   * Convertir número a letras (simplificado)
   */
  numeroALetras(numero) {
    const entero = Math.floor(numero);
    const decimales = Math.round((numero - entero) * 100);
    
    // Implementación básica - en producción usar librería completa
    if (entero === 0) return 'CERO DÓLARES';
    
    return `${entero} DÓLARES CON ${decimales}/100`;
  }
}

module.exports = DTEGenerator;
