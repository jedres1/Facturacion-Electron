const axios = require('axios');

class FirmadorSVFE {
  constructor(config = {}) {
    this.baseURL = (config.baseURL || 'http://localhost:8113').replace(/\/$/, '');
    this.timeout = config.timeout || 15000;
    this.paths = [
      '/firmardocumento/',
      '/firma/firmardocumento/'
    ];
  }

  async verificarEstado() {
    const errores = [];

    for (const path of this.paths) {
      try {
        const response = await axios.get(`${this.baseURL}${path}status`, {
          timeout: 5000
        });

        return {
          disponible: true,
          endpoint: path,
          data: response.data
        };
      } catch (error) {
        errores.push(`${path}status: ${error.message}`);
      }
    }

    return {
      disponible: false,
      error: errores.join(' | ')
    };
  }

  async firmarDocumento(documento, { nit, passwordPri }) {
    if (!nit) {
      throw new Error('El NIT del emisor es requerido para firmar con SVFE.');
    }

    if (!passwordPri) {
      throw new Error('La contraseña de la llave privada/certificado es requerida para firmar con SVFE.');
    }

    const payload = {
      nit: this.limpiarDocumento(nit),
      activo: true,
      passwordPri,
      dteJson: documento
    };

    const errores = [];

    for (const path of this.paths) {
      try {
        const response = await axios.post(`${this.baseURL}${path}`, payload, {
          timeout: this.timeout,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (this.esRespuestaError(response.data)) {
          throw new Error(this.formatearRespuestaError(response.data));
        }

        const firmaMh = this.extraerDocumentoFirmado(response.data);
        if (!firmaMh) {
          throw new Error(`El firmador respondió sin documento firmado: ${this.resumirRespuesta(response.data)}`);
        }

        return {
          success: true,
          documentoFirmado: {
            ...documento,
            firmaMh
          },
          firmaMh,
          raw: response.data
        };
      } catch (error) {
        const detalle = error.response?.data
          ? JSON.stringify(error.response.data)
          : error.message;
        errores.push(`${path}: ${detalle}`);
      }
    }

    throw new Error(`No se pudo firmar con el servicio SVFE local (${this.baseURL}). ${errores.join(' | ')}`);
  }

  extraerDocumentoFirmado(data) {
    if (!data) return null;
    if (typeof data === 'string') return data;
    if (typeof data.body === 'string') return data.body;
    if (typeof data.documento === 'string') return data.documento;
    if (typeof data.documentoFirmado === 'string') return data.documentoFirmado;
    if (typeof data.firma === 'string') return data.firma;
    if (typeof data.firmaMh === 'string') return data.firmaMh;
    if (typeof data.compactSerialization === 'string') return data.compactSerialization;
    if (data.body && typeof data.body === 'object') {
      return data.body.documento
        || data.body.documentoFirmado
        || data.body.firma
        || data.body.firmaMh
        || data.body.compactSerialization
        || null;
    }
    return null;
  }

  esRespuestaError(data) {
    return data && typeof data === 'object' && String(data.status || '').toUpperCase() === 'ERROR';
  }

  formatearRespuestaError(data) {
    const body = data.body || data;
    if (body && typeof body === 'object') {
      const codigo = body.codigo || body.code || body.cod || body.estado;
      const mensaje = body.mensaje || body.message || body.descripcion || body.error;
      return [codigo, mensaje].filter(Boolean).join(': ') || JSON.stringify(body);
    }
    return String(body || 'Respuesta ERROR del firmador.');
  }

  resumirRespuesta(data) {
    if (data === undefined) return 'sin respuesta';
    if (typeof data === 'string') return data.slice(0, 300);
    try {
      return JSON.stringify(data).slice(0, 500);
    } catch (error) {
      return String(data);
    }
  }

  limpiarDocumento(valor) {
    return String(valor || '').replace(/[^0-9]/g, '');
  }
}

module.exports = FirmadorSVFE;
