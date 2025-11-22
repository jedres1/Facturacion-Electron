const forge = require('node-forge');
const fs = require('fs').promises;

/**
 * Firmador usando certificado digital local con node-forge
 */
class FirmadorLocal {
  constructor() {
    this.certificado = null;
    this.privateKey = null;
  }

  /**
   * Cargar certificado desde archivo
   * @param {string} certificadoPath - Ruta al archivo del certificado
   * @param {string} password - Contraseña del certificado (solo para p12/pfx)
   */
  async cargarCertificado(certificadoPath, password) {
    try {
      console.log('========== DIAGNÓSTICO DE CERTIFICADO ==========');
      console.log('Ruta del archivo:', certificadoPath);
      
      const certificadoData = await fs.readFile(certificadoPath);
      console.log('Tamaño del archivo:', certificadoData.length, 'bytes');
      
      // Determinar tipo de certificado por extensión
      const ext = certificadoPath.split('.').pop().toLowerCase();
      console.log('Extensión detectada:', ext);
      
      if (ext === 'p12' || ext === 'pfx') {
        console.log('Procesando como certificado PKCS#12...');
        // Certificado PKCS#12
        const p12Der = certificadoData.toString('binary');
        const p12Asn1 = forge.asn1.fromDer(p12Der);
        const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password || '');
        
        // Obtener certificado y clave privada
        const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
        const pkeyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
        
        if (certBags[forge.pki.oids.certBag] && certBags[forge.pki.oids.certBag].length > 0) {
          this.certificado = certBags[forge.pki.oids.certBag][0].cert;
          console.log('✓ Certificado cargado desde PKCS#12');
        }
        
        if (pkeyBags[forge.pki.oids.pkcs8ShroudedKeyBag] && pkeyBags[forge.pki.oids.pkcs8ShroudedKeyBag].length > 0) {
          this.privateKey = pkeyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0].key;
          console.log('✓ Clave privada cargada desde PKCS#12');
        }
      } else if (ext === 'crt' || ext === 'pem') {
        console.log('Procesando certificado .crt/.pem...');
        const contenido = certificadoData.toString('utf-8');
        
        // Verificar si es formato XML del Ministerio de Hacienda
        if (contenido.trim().startsWith('<CertificadoMH>')) {
          console.log('Detectado formato XML de Ministerio de Hacienda');
          await this.cargarCertificadoXMLHacienda(contenido);
        } else {
          // Formato PEM estándar
          console.log('Procesando como certificado PEM estándar...');
          await this.cargarCertificadoPEM(contenido, certificadoPath);
        }
      }
      
      if (!this.certificado) {
        console.error('✗ No se pudo cargar el certificado');
        throw new Error('No se pudo cargar el certificado');
      }
      
      if (!this.privateKey) {
        console.error('✗ No se pudo cargar la clave privada');
        throw new Error('No se pudo cargar la clave privada');
      }
      
      console.log('========== CERTIFICADO CARGADO EXITOSAMENTE ==========');
      return { success: true };
    } catch (error) {
      console.error('========== ERROR AL CARGAR CERTIFICADO ==========');
      console.error('Tipo de error:', error.constructor.name);
      console.error('Mensaje:', error.message);
      console.error('Stack:', error.stack);
      console.error('==================================================');
      throw new Error(`Error al cargar certificado: ${error.message}`);
    }
  }

  /**
   * Cargar certificado desde formato XML del Ministerio de Hacienda
   * @param {string} xmlContent - Contenido XML del certificado
   */
  async cargarCertificadoXMLHacienda(xmlContent) {
    try {
      // Extraer clave pública
      const publicKeyMatch = xmlContent.match(/<publicKey>[\s\S]*?<encodied>([\s\S]*?)<\/encodied>[\s\S]*?<\/publicKey>/);
      if (!publicKeyMatch) {
        throw new Error('No se encontró la clave pública en el XML');
      }
      
      const publicKeyBase64 = publicKeyMatch[1].replace(/\s/g, '');
      console.log('✓ Clave pública extraída del XML');
      
      // Extraer clave privada
      const privateKeyMatch = xmlContent.match(/<privateKey>[\s\S]*?<encodied>([\s\S]*?)<\/encodied>[\s\S]*?<\/privateKey>/);
      if (!privateKeyMatch) {
        throw new Error('No se encontró la clave privada en el XML');
      }
      
      const privateKeyBase64 = privateKeyMatch[1].replace(/\s/g, '');
      console.log('✓ Clave privada extraída del XML');
      
      // Convertir a formato PEM y cargar con forge
      const publicKeyDer = forge.util.decode64(publicKeyBase64);
      const publicKeyAsn1 = forge.asn1.fromDer(publicKeyDer);
      const publicKey = forge.pki.publicKeyFromAsn1(publicKeyAsn1);
      
      const privateKeyDer = forge.util.decode64(privateKeyBase64);
      const privateKeyAsn1 = forge.asn1.fromDer(privateKeyDer);
      this.privateKey = forge.pki.privateKeyFromAsn1(privateKeyAsn1);
      
      console.log('✓ Claves convertidas a formato forge');
      
      // Crear un certificado auto-firmado básico para compatibilidad
      // (El XML no contiene el certificado X.509 completo, solo las claves)
      const subjectMatch = xmlContent.match(/<commonName>(.*?)<\/commonName>/);
      const nitMatch = xmlContent.match(/<nit>(.*?)<\/nit>/);
      
      const attrs = [{
        name: 'commonName',
        value: subjectMatch ? subjectMatch[1] : 'Certificado MH'
      }];
      
      if (nitMatch) {
        attrs.push({
          name: 'organizationName',
          value: `NIT: ${nitMatch[1]}`
        });
      }
      
      this.certificado = forge.pki.createCertificate();
      this.certificado.publicKey = publicKey;
      this.certificado.serialNumber = '01';
      this.certificado.validity.notBefore = new Date();
      this.certificado.validity.notAfter = new Date();
      this.certificado.validity.notAfter.setFullYear(this.certificado.validity.notBefore.getFullYear() + 5);
      this.certificado.setSubject(attrs);
      this.certificado.setIssuer(attrs);
      this.certificado.sign(this.privateKey, forge.md.sha256.create());
      
      console.log('✓ Certificado generado desde XML de Hacienda');
      console.log('  NIT:', nitMatch ? nitMatch[1] : 'N/A');
      console.log('  Common Name:', subjectMatch ? subjectMatch[1] : 'N/A');
      
    } catch (error) {
      console.error('Error procesando certificado XML de Hacienda:', error);
      throw error;
    }
  }

  /**
   * Cargar certificado desde formato PEM estándar
   * @param {string} pemString - Contenido PEM
   * @param {string} certificadoPath - Ruta del archivo
   */
  async cargarCertificadoPEM(pemString, certificadoPath) {
    // Mostrar primeras líneas del archivo para diagnóstico
    const primerasLineas = pemString.split('\n').slice(0, 5).join('\n');
    console.log('Primeras líneas del archivo:');
    console.log(primerasLineas);
    console.log('...');
    
    // Verificar si contiene múltiples bloques PEM
    const certMatch = pemString.match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/);
    const keyMatch = pemString.match(/-----BEGIN (RSA )?PRIVATE KEY-----[\s\S]+?-----END (RSA )?PRIVATE KEY-----/);
    
    console.log('Bloques encontrados en el archivo:');
    console.log('- Certificado (BEGIN CERTIFICATE):', certMatch ? '✓ SÍ' : '✗ NO');
    console.log('- Clave privada (BEGIN PRIVATE KEY):', keyMatch ? '✓ SÍ' : '✗ NO');
    
    if (certMatch) {
      try {
        this.certificado = forge.pki.certificateFromPem(certMatch[0]);
        console.log('✓ Certificado PEM parseado exitosamente');
        console.log('  Subject:', this.certificado.subject.getField('CN').value);
        console.log('  Issuer:', this.certificado.issuer.getField('CN').value);
      } catch (e) {
        console.error('✗ Error al parsear certificado:', e.message);
        throw new Error(`Error al parsear certificado PEM: ${e.message}`);
      }
    } else {
      console.error('✗ No se encontró bloque -----BEGIN CERTIFICATE-----');
      throw new Error('No se encontró un certificado válido en el archivo PEM');
    }
    
    if (keyMatch) {
      try {
        this.privateKey = forge.pki.privateKeyFromPem(keyMatch[0]);
        console.log('✓ Clave privada PEM parseada exitosamente');
      } catch (e) {
        console.error('✗ Error al parsear clave privada:', e.message);
        throw new Error(`Error al parsear clave privada: ${e.message}`);
      }
    } else {
      // Buscar archivo .key correspondiente
      console.log('No se encontró clave privada, buscando archivo .key...');
      const keyPath = certificadoPath.replace(/\.(crt|pem)$/i, '.key');
      console.log('Ruta esperada:', keyPath);
      
      try {
        const keyData = await fs.readFile(keyPath);
        const keyPemString = keyData.toString('utf-8');
        this.privateKey = forge.pki.privateKeyFromPem(keyPemString);
        console.log('✓ Clave privada cargada desde archivo .key separado');
      } catch (e) {
        console.error('✗ No se pudo cargar archivo .key:', e.message);
        throw new Error(`Se requiere un archivo .key con la clave privada`);
      }
    }
  }

  /**
   * Firmar documento JSON
   * @param {Object} documento - Documento a firmar
   * @returns {Object} - Documento firmado con firma digital
   */
  async firmarDocumento(documento) {
    try {
      if (!this.certificado || !this.privateKey) {
        throw new Error('Certificado no cargado. Use cargarCertificado() primero.');
      }
      
      // Convertir documento a JSON string canónico
      const documentoJson = JSON.stringify(documento, null, 0);
      
      // Crear hash del documento
      const md = forge.md.sha256.create();
      md.update(documentoJson, 'utf8');
      
      // Firmar el hash
      const signature = this.privateKey.sign(md);
      
      // Convertir firma a Base64
      const signatureBase64 = forge.util.encode64(signature);
      
      // Obtener información del certificado
      const certPem = forge.pki.certificateToPem(this.certificado);
      const certBase64 = certPem
        .replace('-----BEGIN CERTIFICATE-----', '')
        .replace('-----END CERTIFICATE-----', '')
        .replace(/\n/g, '');
      
      // Construir documento firmado según especificación de Hacienda
      const documentoFirmado = {
        ...documento,
        firma: {
          firmante: this.certificado.subject.getField('CN')?.value || 'Firmante',
          fechaFirma: new Date().toISOString(),
          algoritmo: 'SHA256withRSA',
          valorFirma: signatureBase64,
          certificado: certBase64,
          nit: this.certificado.subject.getField('serialNumber')?.value || ''
        }
      };
      
      return { success: true, documentoFirmado };
    } catch (error) {
      console.error('Error firmando documento:', error);
      throw new Error(`Error al firmar documento: ${error.message}`);
    }
  }

  /**
   * Validar firma de un documento
   * @param {Object} documentoFirmado - Documento con firma
   * @returns {Boolean} - true si la firma es válida
   */
  async validarFirma(documentoFirmado) {
    try {
      if (!documentoFirmado.firma) {
        throw new Error('El documento no contiene firma');
      }
      
      // Extraer firma y certificado
      const { valorFirma, certificado: certBase64 } = documentoFirmado.firma;
      
      // Reconstruir documento sin firma
      const { firma, ...documentoSinFirma } = documentoFirmado;
      const documentoJson = JSON.stringify(documentoSinFirma, null, 0);
      
      // Convertir certificado de Base64 a objeto
      const certPem = `-----BEGIN CERTIFICATE-----\n${certBase64}\n-----END CERTIFICATE-----`;
      const cert = forge.pki.certificateFromPem(certPem);
      
      // Crear hash del documento
      const md = forge.md.sha256.create();
      md.update(documentoJson, 'utf8');
      
      // Decodificar firma de Base64
      const signature = forge.util.decode64(valorFirma);
      
      // Verificar firma
      const publicKey = cert.publicKey;
      const verified = publicKey.verify(md.digest().bytes(), signature);
      
      return verified;
    } catch (error) {
      console.error('Error validando firma:', error);
      return false;
    }
  }

  /**
   * Obtener información del certificado cargado
   */
  getInfoCertificado() {
    if (!this.certificado) {
      return null;
    }
    
    return {
      sujeto: this.certificado.subject.attributes.map(attr => ({
        nombre: attr.name,
        valor: attr.value
      })),
      emisor: this.certificado.issuer.attributes.map(attr => ({
        nombre: attr.name,
        valor: attr.value
      })),
      validoDesde: this.certificado.validity.notBefore,
      validoHasta: this.certificado.validity.notAfter,
      numeroSerie: this.certificado.serialNumber
    };
  }
}

module.exports = FirmadorLocal;
