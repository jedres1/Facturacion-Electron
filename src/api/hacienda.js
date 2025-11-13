const axios = require('axios');
const crypto = require('crypto');

class HaciendaAPI {
  constructor(config = {}) {
    this.ambiente = config.ambiente || 'pruebas';
    this.baseURL = this.ambiente === 'produccion' 
      ? 'https://api.dtes.mh.gob.sv'
      : 'https://apitest.dtes.mh.gob.sv';
    
    this.usuario = config.usuario;
    this.password = config.password;
    this.token = config.token || null;
    
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Autenticar con el Ministerio de Hacienda
   * Según guía oficial: APIS - Sistema Transmisión de DTE
   */
  async autenticar() {
    try {
      // Preparar datos en formato application/x-www-form-urlencoded
      const params = new URLSearchParams();
      params.append('user', this.usuario);
      params.append('pwd', this.password);

      const response = await this.axiosInstance.post('/seguridad/auth', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'FacturacionElectron/1.0'
        }
      });

      // Validar respuesta según estructura oficial
      if (response.data && response.data.status === 'OK' && response.data.body && response.data.body.token) {
        this.token = response.data.body.token;
        return {
          success: true,
          token: this.token,
          user: response.data.body.user,
          rol: response.data.body.rol,
          roles: response.data.body.roles,
          tokenType: response.data.body.tokenType
        };
      }

      throw new Error('No se recibió token de autenticación');
    } catch (error) {
      const errorMsg = error.response?.data?.mensaje || error.response?.data?.body?.mensaje || error.message;
      throw new Error(`Error en autenticación: ${errorMsg}`);
    }
  }

  /**
   * Enviar DTE (Documento Tributario Electrónico) - Modelo uno a uno
   * @param {Object} dte - Documento firmado con estructura completa
   * @param {string} nit - NIT del emisor
   * @param {string} passwordPri - Password de la llave privada (si aplica)
   * @returns {Promise<Object>} Respuesta del MH con estado y sello
   */
  async enviarDTE(dte, nit, passwordPri = null) {
    if (!this.token) {
      throw new Error('No hay token de autenticación. Autentique primero.');
    }

    try {
      const payload = {
        nit: nit,
        activo: true,
        passwordPri: passwordPri,
        dteJson: dte
      };

      const response = await this.axiosInstance.post('/fesv/recepciondte', payload, {
        headers: {
          'Authorization': this.token,
          'Content-Type': 'application/json'
        }
      });

      // Respuesta esperada: { estado, codigoGeneracion, selloRecibido, observaciones }
      return {
        success: true,
        estado: response.data.estado,
        codigoGeneracion: response.data.codigoGeneracion,
        selloRecibido: response.data.selloRecibido,
        observaciones: response.data.observaciones,
        raw: response.data
      };
    } catch (error) {
      const errorMsg = error.response?.data?.mensaje || error.message;
      return {
        success: false,
        error: errorMsg,
        estado: error.response?.data?.estado,
        observaciones: error.response?.data?.observaciones
      };
    }
  }

  /**
   * Consultar estado de un DTE
   */
  async consultarDTE(codigoGeneracion) {
    if (!this.token) {
      throw new Error('No hay token de autenticación. Autentique primero.');
    }

    try {
      const response = await this.axiosInstance.get(
        `/fesv/recepciondte/${codigoGeneracion}`,
        {
          headers: {
            'Authorization': this.token
          }
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Error al consultar DTE: ${error.message}`);
    }
  }

  /**
   * Generar código de generación único
   */
  generarCodigoGeneracion() {
    const uuid = crypto.randomUUID().toUpperCase();
    return uuid;
  }

  /**
   * Generar número de control
   */
  generarNumeroControl(tipoDocumento, codigoEstablecimiento, puntoVenta, numeroDocumento) {
    // Formato: DTE-{tipo}-{establecimiento}-{punto venta}-{número (15 dígitos)}
    const numero = numeroDocumento.toString().padStart(15, '0');
    return `DTE-${tipoDocumento}-${codigoEstablecimiento}-${puntoVenta}-${numero}`;
  }

  /**
   * Construir estructura JSON del DTE según especificaciones de Hacienda
   */
  construirDTE(tipo, datos) {
    const fechaEmision = new Date().toISOString().split('T')[0];
    const horaEmision = new Date().toTimeString().split(' ')[0];

    const dteBase = {
      identificacion: {
        version: 1,
        ambiente: this.ambiente === 'produccion' ? '00' : '01',
        tipoDte: tipo,
        numeroControl: datos.numeroControl,
        codigoGeneracion: datos.codigoGeneracion || this.generarCodigoGeneracion(),
        tipoModelo: '1',
        tipoOperacion: '1',
        tipoContingencia: null,
        motivoContin: null,
        fecEmi: fechaEmision,
        horEmi: horaEmision,
        tipoMoneda: 'USD'
      },
      emisor: {
        nit: datos.emisor.nit,
        nrc: datos.emisor.nrc,
        nombre: datos.emisor.nombre,
        codActividad: datos.emisor.codActividad,
        descActividad: datos.emisor.descActividad,
        nombreComercial: datos.emisor.nombreComercial,
        tipoEstablecimiento: datos.emisor.tipoEstablecimiento || '01',
        direccion: {
          departamento: datos.emisor.departamento,
          municipio: datos.emisor.municipio,
          complemento: datos.emisor.direccion
        },
        telefono: datos.emisor.telefono,
        correo: datos.emisor.correo,
        codEstableMH: datos.emisor.codEstableMH,
        codEstable: datos.emisor.codEstable,
        codPuntoVentaMH: datos.emisor.codPuntoVentaMH,
        codPuntoVenta: datos.emisor.codPuntoVenta
      },
      receptor: {
        tipoDocumento: datos.receptor.tipoDocumento,
        numDocumento: datos.receptor.numDocumento,
        nrc: datos.receptor.nrc || null,
        nombre: datos.receptor.nombre,
        codActividad: datos.receptor.codActividad || null,
        descActividad: datos.receptor.descActividad || null,
        direccion: datos.receptor.direccion ? {
          departamento: datos.receptor.departamento,
          municipio: datos.receptor.municipio,
          complemento: datos.receptor.direccion
        } : null,
        telefono: datos.receptor.telefono,
        correo: datos.receptor.correo
      },
      cuerpoDocumento: datos.items.map((item, index) => ({
        numItem: index + 1,
        tipoItem: item.tipoItem || '1',
        numeroDocumento: null,
        cantidad: item.cantidad,
        codigo: item.codigo,
        codTributo: null,
        uniMedida: item.uniMedida || '99',
        descripcion: item.descripcion,
        precioUni: item.precioUni,
        montoDescu: item.montoDescu || 0,
        ventaNoSuj: item.ventaNoSuj || 0,
        ventaExenta: item.ventaExenta || 0,
        ventaGravada: item.ventaGravada || 0,
        tributos: item.tributos || null,
        psv: 0,
        noGravado: 0
      })),
      resumen: {
        totalNoSuj: datos.resumen.totalNoSuj || 0,
        totalExenta: datos.resumen.totalExenta || 0,
        totalGravada: datos.resumen.totalGravada,
        subTotalVentas: datos.resumen.subTotalVentas,
        descuNoSuj: 0,
        descuExenta: 0,
        descuGravada: datos.resumen.descuGravada || 0,
        porcentajeDescuento: 0,
        totalDescu: datos.resumen.totalDescu || 0,
        tributos: datos.resumen.tributos || null,
        subTotal: datos.resumen.subTotal,
        ivaRete1: 0,
        reteRenta: 0,
        montoTotalOperacion: datos.resumen.montoTotalOperacion,
        totalNoGravado: 0,
        totalPagar: datos.resumen.totalPagar,
        totalLetras: datos.resumen.totalLetras,
        totalIva: datos.resumen.totalIva || 0,
        saldoFavor: 0,
        condicionOperacion: datos.resumen.condicionOperacion || '1',
        pagos: datos.resumen.pagos || null,
        numPagoElectronico: null
      },
      extension: datos.extension || null,
      apendice: datos.apendice || null
    };

    return dteBase;
  }

  /**
   * Calcular resumen de factura
   */
  calcularResumen(items, condicionOperacion = '1') {
    let totalNoSuj = 0;
    let totalExenta = 0;
    let totalGravada = 0;
    let totalDescu = 0;

    items.forEach(item => {
      const subtotalItem = item.cantidad * item.precioUni;
      totalDescu += item.montoDescu || 0;
      
      if (item.ventaNoSuj) totalNoSuj += item.ventaNoSuj;
      if (item.ventaExenta) totalExenta += item.ventaExenta;
      if (item.ventaGravada) totalGravada += item.ventaGravada;
    });

    const subTotalVentas = totalNoSuj + totalExenta + totalGravada;
    const subTotal = subTotalVentas - totalDescu;
    const totalIva = totalGravada * 0.13; // IVA 13%
    const montoTotalOperacion = subTotal + totalIva;
    const totalPagar = montoTotalOperacion;

    return {
      totalNoSuj,
      totalExenta,
      totalGravada,
      subTotalVentas,
      descuGravada: totalDescu,
      totalDescu,
      subTotal,
      totalIva,
      montoTotalOperacion,
      totalPagar,
      totalLetras: this.numeroALetras(totalPagar),
      condicionOperacion,
      tributos: totalIva > 0 ? [{
        codigo: '20',
        descripcion: 'Impuesto al Valor Agregado 13%',
        valor: totalIva
      }] : null
    };
  }

  /**
   * Convertir número a letras
   */
  numeroALetras(numero) {
    // Implementación básica - se puede mejorar con una librería
    const entero = Math.floor(numero);
    const decimales = Math.round((numero - entero) * 100);
    return `${entero} DÓLARES CON ${decimales}/100`;
  }
}

module.exports = HaciendaAPI;
