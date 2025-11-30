const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const QRCode = require('qrcode');
const fs = require('fs').promises;
const path = require('path');

/**
 * Generador de PDF para Documentos Tributarios Electrónicos
 * Cumple con los requisitos del Ministerio de Hacienda de El Salvador
 */
class PDFGenerator {
  constructor() {
    this.pageWidth = 595.28; // A4 width in points
    this.pageHeight = 841.89; // A4 height in points
    this.margin = 50;
    this.currentY = this.pageHeight - this.margin;
  }

  /**
   * Generar PDF de factura electrónica
   * @param {Object} factura - Datos de la factura
   * @param {Object} dte - DTE generado con toda la información
   * @param {Object} config - Configuración de la empresa
   * @returns {Promise<Buffer>} - PDF en formato Buffer
   */
  async generarPDFFactura(factura, dte, config) {
    try {
      // Normalizar estructura del DTE (puede venir con dteJson o directamente)
      let dteData = dte.dteJson || dte;
      
      // Si no tiene identificacion directamente, podría estar en un nivel más profundo
      if (!dteData.identificacion && dteData.dte) {
        dteData = dteData.dte;
      }
      
      // Validar que el DTE tiene la estructura necesaria
      if (!dteData.identificacion) {
        console.error('Estructura del DTE recibida:', JSON.stringify(dte, null, 2));
        throw new Error('DTE no tiene la estructura esperada. Falta propiedad "identificacion"');
      }
      
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
      
      // Cargar fuentes
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSmall = await pdfDoc.embedFont(StandardFonts.Helvetica);

      this.currentY = this.pageHeight - this.margin;

      // 1. Título del documento
      await this.drawTitle(page, fontBold, this.getTipoDocumentoNombre(dteData.identificacion.tipoDte));

      // 2. Leyenda legal obligatoria
      this.currentY -= 15;
      page.drawText('DOCUMENTO TRIBUTARIO ELECTRÓNICO AUTORIZADO POR EL MINISTERIO DE HACIENDA', {
        x: this.margin,
        y: this.currentY,
        size: 8,
        font: fontSmall,
        color: rgb(0.3, 0.3, 0.3)
      });

      // 3. Información del emisor (izquierda) y datos DTE (derecha)
      this.currentY -= 30;
      await this.drawEmisorYDTE(page, fontBold, fontRegular, config, dteData);

      // 4. Información del receptor
      this.currentY -= 40;
      await this.drawReceptor(page, fontBold, fontRegular, dteData.receptor);

      // 5. Tabla de productos/servicios
      this.currentY -= 30;
      await this.drawItemsTable(page, fontBold, fontRegular, dteData.cuerpoDocumento);

      // 6. Resumen de totales
      this.currentY -= 20;
      await this.drawResumen(page, fontBold, fontRegular, dteData.resumen);

      // 7. Código QR (obligatorio)
      const qrDataUrl = await this.generarQR(dteData, config.hacienda_ambiente);
      const qrImage = await pdfDoc.embedPng(qrDataUrl);
      const qrSize = 120;
      page.drawImage(qrImage, {
        x: this.margin,
        y: this.margin + 20,
        width: qrSize,
        height: qrSize
      });

      // 8. Información adicional junto al QR
      this.drawInfoAdicional(page, fontSmall, dteData, factura, qrSize);

      // 9. Pie de página con sello de recepción del MH
      if (factura.sello_recepcion) {
        this.drawSelloRecepcion(page, fontSmall, factura.sello_recepcion);
      }

      // Generar PDF
      const pdfBytes = await pdfDoc.save();
      return Buffer.from(pdfBytes);
    } catch (error) {
      console.error('Error generando PDF:', error);
      throw new Error(`Error al generar PDF: ${error.message}`);
    }
  }

  /**
   * Dibujar título del documento
   */
  async drawTitle(page, font, titulo) {
    page.drawText(titulo, {
      x: this.margin,
      y: this.currentY,
      size: 20,
      font: font,
      color: rgb(0, 0, 0)
    });
  }

  /**
   * Dibujar información del emisor y datos del DTE
   */
  async drawEmisorYDTE(page, fontBold, fontRegular, config, dte) {
    const leftX = this.margin;
    const rightX = this.pageWidth - this.margin - 200;
    let leftY = this.currentY;
    let rightY = this.currentY;

    // Emisor (izquierda)
    page.drawText('EMISOR', { x: leftX, y: leftY, size: 12, font: fontBold });
    leftY -= 15;
    
    page.drawText(config.nombre_empresa || dte.emisor.nombre, { 
      x: leftX, y: leftY, size: 10, font: fontBold 
    });
    leftY -= 12;
    
    if (config.nombre_comercial) {
      page.drawText(config.nombre_comercial, { 
        x: leftX, y: leftY, size: 9, font: fontRegular 
      });
      leftY -= 12;
    }
    
    page.drawText(`NIT: ${dte.emisor.nit}`, { 
      x: leftX, y: leftY, size: 9, font: fontRegular 
    });
    leftY -= 12;
    
    page.drawText(`NRC: ${dte.emisor.nrc}`, { 
      x: leftX, y: leftY, size: 9, font: fontRegular 
    });
    leftY -= 12;
    
    page.drawText(`Giro: ${dte.emisor.descActividad}`, { 
      x: leftX, y: leftY, size: 8, font: fontRegular 
    });
    leftY -= 12;
    
    const direccionEmisor = `${dte.emisor.direccion.complemento}`;
    page.drawText(this.wrapText(direccionEmisor, 40), { 
      x: leftX, y: leftY, size: 8, font: fontRegular 
    });
    leftY -= 12;
    
    page.drawText(`Tel: ${dte.emisor.telefono}`, { 
      x: leftX, y: leftY, size: 8, font: fontRegular 
    });

    // Datos del DTE (derecha)
    page.drawText('DATOS DEL DOCUMENTO', { x: rightX, y: rightY, size: 10, font: fontBold });
    rightY -= 15;
    
    page.drawText(`Número de Control:`, { x: rightX, y: rightY, size: 8, font: fontBold });
    rightY -= 10;
    page.drawText(dte.identificacion.numeroControl, { x: rightX, y: rightY, size: 8, font: fontRegular });
    rightY -= 15;
    
    page.drawText(`Código de Generación:`, { x: rightX, y: rightY, size: 8, font: fontBold });
    rightY -= 10;
    page.drawText(this.formatCodigoGeneracion(dte.identificacion.codigoGeneracion), { 
      x: rightX, y: rightY, size: 7, font: fontRegular 
    });
    rightY -= 15;
    
    page.drawText(`Fecha de Emisión:`, { x: rightX, y: rightY, size: 8, font: fontBold });
    rightY -= 10;
    page.drawText(`${dte.identificacion.fecEmi} ${dte.identificacion.horEmi}`, { 
      x: rightX, y: rightY, size: 8, font: fontRegular 
    });
    rightY -= 15;
    
    page.drawText(`Modelo de Facturación:`, { x: rightX, y: rightY, size: 8, font: fontBold });
    rightY -= 10;
    page.drawText(`Modelo ${dte.identificacion.tipoModelo}`, { 
      x: rightX, y: rightY, size: 8, font: fontRegular 
    });
    rightY -= 15;
    
    page.drawText(`Tipo de Transmisión:`, { x: rightX, y: rightY, size: 8, font: fontBold });
    rightY -= 10;
    page.drawText(dte.identificacion.tipoOperacion === 1 ? 'Normal' : 'Contingencia', { 
      x: rightX, y: rightY, size: 8, font: fontRegular 
    });

    this.currentY = Math.min(leftY, rightY);
  }

  /**
   * Dibujar información del receptor
   */
  async drawReceptor(page, fontBold, fontRegular, receptor) {
    const boxY = this.currentY;
    const boxHeight = 80;
    
    // Fondo gris claro
    page.drawRectangle({
      x: this.margin,
      y: boxY - boxHeight,
      width: this.pageWidth - 2 * this.margin,
      height: boxHeight,
      color: rgb(0.95, 0.95, 0.95)
    });

    let y = boxY - 15;
    
    page.drawText('RECEPTOR', { 
      x: this.margin + 10, y, size: 11, font: fontBold 
    });
    y -= 15;
    
    page.drawText(`Nombre: ${receptor.nombre}`, { 
      x: this.margin + 10, y, size: 9, font: fontRegular 
    });
    y -= 12;
    
    if (receptor.nit) {
      page.drawText(`NIT: ${receptor.nit}`, { 
        x: this.margin + 10, y, size: 9, font: fontRegular 
      });
      y -= 12;
    }
    
    if (receptor.numDocumento) {
      page.drawText(`Documento: ${receptor.numDocumento}`, { 
        x: this.margin + 10, y, size: 9, font: fontRegular 
      });
      y -= 12;
    }
    
    if (receptor.direccion) {
      page.drawText(`Dirección: ${receptor.direccion.complemento}`, { 
        x: this.margin + 10, y, size: 8, font: fontRegular 
      });
    }

    this.currentY = boxY - boxHeight;
  }

  /**
   * Dibujar tabla de items
   */
  async drawItemsTable(page, fontBold, fontRegular, items) {
    const tableWidth = this.pageWidth - 2 * this.margin;
    const colWidths = [40, 200, 60, 80, 80, 90]; // Cant, Desc, P.Unit, Desc, Exento/Gravado, Total
    
    // Encabezado
    let x = this.margin;
    let y = this.currentY;
    
    // Fondo del encabezado
    page.drawRectangle({
      x: this.margin,
      y: y - 15,
      width: tableWidth,
      height: 15,
      color: rgb(0.2, 0.2, 0.2)
    });
    
    y -= 11;
    const headers = ['Cant.', 'Descripción', 'P. Unit.', 'Desc.', 'Gravado/Exento', 'Total'];
    headers.forEach((header, i) => {
      page.drawText(header, {
        x: x + 5,
        y: y,
        size: 8,
        font: fontBold,
        color: rgb(1, 1, 1)
      });
      x += colWidths[i];
    });
    
    y -= 15;
    
    // Items
    items.forEach((item, index) => {
      if (y < this.margin + 150) {
        // Nueva página si no hay espacio
        // TODO: Implementar paginación
        return;
      }
      
      // Fondo alternado
      if (index % 2 === 0) {
        page.drawRectangle({
          x: this.margin,
          y: y - 12,
          width: tableWidth,
          height: 12,
          color: rgb(0.98, 0.98, 0.98)
        });
      }
      
      x = this.margin;
      
      // Cantidad
      page.drawText(item.cantidad.toString(), {
        x: x + 5, y: y - 8, size: 8, font: fontRegular
      });
      x += colWidths[0];
      
      // Descripción (truncar si es muy largo)
      const desc = this.truncateText(item.descripcion, 35);
      page.drawText(desc, {
        x: x + 5, y: y - 8, size: 8, font: fontRegular
      });
      x += colWidths[1];
      
      // Precio Unitario
      page.drawText(`$${item.precioUni.toFixed(2)}`, {
        x: x + 5, y: y - 8, size: 8, font: fontRegular
      });
      x += colWidths[2];
      
      // Descuento
      page.drawText(`$${item.montoDescu.toFixed(2)}`, {
        x: x + 5, y: y - 8, size: 8, font: fontRegular
      });
      x += colWidths[3];
      
      // Gravado/Exento
      const valor = item.ventaGravada > 0 ? item.ventaGravada : item.ventaExenta;
      const tipo = item.ventaGravada > 0 ? 'G' : 'E';
      page.drawText(`$${valor.toFixed(2)} (${tipo})`, {
        x: x + 5, y: y - 8, size: 8, font: fontRegular
      });
      x += colWidths[4];
      
      // Total
      const total = (item.cantidad * item.precioUni) - item.montoDescu;
      page.drawText(`$${total.toFixed(2)}`, {
        x: x + 5, y: y - 8, size: 8, font: fontRegular
      });
      
      y -= 12;
    });
    
    // Línea de cierre
    page.drawLine({
      start: { x: this.margin, y: y },
      end: { x: this.pageWidth - this.margin, y: y },
      thickness: 1,
      color: rgb(0, 0, 0)
    });
    
    this.currentY = y - 5;
  }

  /**
   * Dibujar resumen de totales
   */
  async drawResumen(page, fontBold, fontRegular, resumen) {
    const rightX = this.pageWidth - this.margin - 150;
    let y = this.currentY;
    
    const totales = [
      { label: 'Subtotal No Sujeto:', valor: resumen.totalNoSuj || 0 },
      { label: 'Subtotal Exento:', valor: resumen.totalExenta || 0 },
      { label: 'Subtotal Gravado:', valor: resumen.totalGravada || 0 },
      { label: 'Descuentos:', valor: resumen.totalDescu || 0 },
      { label: 'Subtotal:', valor: resumen.subTotal, bold: true },
      { label: 'IVA (13%):', valor: resumen.totalIva || (resumen.tributos?.[0]?.valor || 0) },
      { label: 'IVA Retenido:', valor: resumen.ivaRete1 || 0 },
      { label: 'Retención Renta:', valor: resumen.reteRenta || 0 },
      { label: 'TOTAL A PAGAR:', valor: resumen.totalPagar, bold: true, large: true }
    ];
    
    totales.forEach(item => {
      if (item.valor === 0 && !item.bold) return; // Omitir líneas en cero
      
      const font = item.bold ? fontBold : fontRegular;
      const size = item.large ? 12 : 9;
      
      page.drawText(item.label, {
        x: rightX,
        y: y,
        size: size,
        font: font
      });
      
      page.drawText(`$${item.valor.toFixed(2)}`, {
        x: rightX + 120,
        y: y,
        size: size,
        font: font
      });
      
      y -= item.large ? 18 : 13;
    });
    
    // Total en letras
    y -= 5;
    page.drawText('Son:', {
      x: this.margin,
      y: y,
      size: 9,
      font: fontBold
    });
    
    const letras = this.wrapText(resumen.totalLetras, 70);
    page.drawText(letras, {
      x: this.margin + 35,
      y: y,
      size: 8,
      font: fontRegular
    });
    
    this.currentY = y - 30;
  }

  /**
   * Generar código QR
   */
  async generarQR(dte, ambiente) {
    const ambienteCode = ambiente === 'produccion' ? '00' : '01';
    const url = `https://admin.factura.gob.sv/consultaPublica?ambiente=${ambienteCode}&codGen=${dte.identificacion.codigoGeneracion}`;
    
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      return qrDataUrl;
    } catch (error) {
      console.error('Error generando QR:', error);
      throw error;
    }
  }

  /**
   * Dibujar información adicional junto al QR
   */
  drawInfoAdicional(page, font, dte, factura, qrSize) {
    const qrInfoX = this.margin + qrSize + 20;
    let y = this.margin + 110;
    
    page.drawText('Escanee para validar en línea', {
      x: qrInfoX,
      y: y,
      size: 8,
      font: font,
      color: rgb(0.3, 0.3, 0.3)
    });
    y -= 12;
    
    page.drawText('www.factura.gob.sv', {
      x: qrInfoX,
      y: y,
      size: 8,
      font: font,
      color: rgb(0, 0, 0.8)
    });
    y -= 20;
    
    page.drawText(`Ambiente: ${dte.identificacion.ambiente === '00' ? 'Producción' : 'Pruebas'}`, {
      x: qrInfoX,
      y: y,
      size: 7,
      font: font
    });
    y -= 12;
    
    page.drawText(`Versión: ${dte.identificacion.version}`, {
      x: qrInfoX,
      y: y,
      size: 7,
      font: font
    });
  }

  /**
   * Dibujar sello de recepción del MH
   */
  drawSelloRecepcion(page, font, sello) {
    const y = this.margin + 5;
    
    page.drawText('SELLO DE RECEPCIÓN MH:', {
      x: this.margin,
      y: y,
      size: 7,
      font: font,
      color: rgb(0, 0.5, 0)
    });
    
    page.drawText(this.truncateText(sello, 80), {
      x: this.margin + 130,
      y: y,
      size: 6,
      font: font,
      color: rgb(0, 0.5, 0)
    });
  }

  // Utilidades

  getTipoDocumentoNombre(tipo) {
    const tipos = {
      '01': 'FACTURA DE CONSUMIDOR FINAL',
      '03': 'COMPROBANTE DE CRÉDITO FISCAL',
      '05': 'NOTA DE CRÉDITO',
      '06': 'NOTA DE DÉBITO',
      '11': 'FACTURA DE EXPORTACIÓN',
      '14': 'FACTURA SUJETO EXCLUIDO'
    };
    return tipos[tipo] || 'DOCUMENTO TRIBUTARIO ELECTRÓNICO';
  }

  formatCodigoGeneracion(codigo) {
    // Formato: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
    return codigo;
  }

  wrapText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * Guardar PDF en archivo
   */
  async guardarPDF(pdfBuffer, rutaDestino) {
    await fs.writeFile(rutaDestino, pdfBuffer);
    return rutaDestino;
  }
}

module.exports = PDFGenerator;
