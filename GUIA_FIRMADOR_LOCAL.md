# 🔐 Guía de Uso: Firmador Local

## ✅ Estado de Implementación: COMPLETAMENTE FUNCIONAL

El firmador local ya está **100% implementado e integrado** en la aplicación.

---

## 📋 Características

### ✨ Ventajas del Firmador Local

- ⚡ **Velocidad**: Firma documentos en **milisegundos**
- 🔒 **Seguridad**: Todo el proceso es **local**, sin enviar datos a internet
- 💯 **Confiabilidad**: No depende de servicios externos
- 🎯 **Automático**: Se selecciona automáticamente si tienes certificado configurado

### 📁 Formatos Soportados

| Formato | Extensión | Descripción |
|---------|-----------|-------------|
| PKCS#12 | `.p12`, `.pfx` | Incluye certificado + clave privada (RECOMENDADO) |
| PEM | `.crt`, `.pem` | Puede requerir archivo `.key` separado |

---

## 🚀 Cómo Usar

### Paso 1: Configurar Certificado

1. **Abre la aplicación**
2. Ve a **Configuración** (⚙️)
3. Desplázate a **"Certificado Digital"**
4. Click en **"Seleccionar Certificado"**
5. Elige tu archivo `.p12` o `.pfx`
6. Ingresa la **contraseña del certificado**
7. Click **"Guardar Configuración"**

### Paso 2: Generar Factura

1. Ve a **Nueva Factura**
2. Selecciona **cliente**
3. Agrega **productos**
4. Click **"Generar Factura"**

### Paso 3: Firmar Documento

1. En la lista de **Facturas**, selecciona una factura
2. Click **"Firmar"**
3. Aparecerá un modal, ingresa:
   - **PIN del Certificado**: La contraseña del certificado (ya la configuraste)
   - Los demás campos son opcionales si usas firmador local
4. Click **"Firmar Documento"**
5. ⚡ **¡Firmado en milisegundos!**

---

## 🔧 Cómo Funciona Internamente

### 1. Carga del Certificado

```javascript
const firmadorLocal = new FirmadorLocal();
await firmadorLocal.cargarCertificado(
  '/ruta/al/certificado.p12',
  'password_del_certificado'
);
```

**Proceso:**
- Lee el archivo del certificado
- Extrae el certificado X.509
- Extrae la clave privada (con la contraseña)
- Valida que ambos estén disponibles

### 2. Firmado del Documento

```javascript
const resultado = await firmadorLocal.firmarDocumento(documentoDTE);
```

**Proceso:**
1. Convierte el DTE a JSON canónico
2. Crea un hash SHA-256 del documento
3. Firma el hash con la clave privada (RSA)
4. Codifica la firma en Base64
5. Extrae información del certificado
6. Agrega el objeto `firma` al documento

### 3. Estructura de la Firma

El documento firmado incluye:

```javascript
{
  // ... campos del DTE original ...
  firma: {
    firmante: "JUAN PEREZ",           // Del certificado CN
    fechaFirma: "2025-11-12T10:30:00Z",
    algoritmo: "SHA256withRSA",
    valorFirma: "aGVsbG8gd29ybGQ=...", // Firma en Base64
    certificado: "MIIDxTCC...",        // Certificado en Base64
    nit: "0614123456789"               // Del certificado
  }
}
```

---

## 🎯 Selección Automática del Firmador

La aplicación elige automáticamente el método de firmado:

```
¿Hay certificado configurado?
  ├─ SÍ  → Usa Firmador LOCAL (⚡ rápido)
  └─ NO  → Usa Firmador WEB Puppeteer (🐌 lento)
```

**Código de selección:**

```javascript
if (certificadoPath) {
  // Firmador LOCAL
  const firmadorLocal = new FirmadorLocal();
  await firmadorLocal.cargarCertificado(certificadoPath, password);
  return await firmadorLocal.firmarDocumento(documento);
} else {
  // Firmador WEB (Puppeteer)
  const firmador = new Firmador({ usuario, password });
  return await firmador.firmarDocumento(documento, pin);
}
```

---

## 🔍 Validación de Firma

El firmador también puede **validar** firmas:

```javascript
const esValida = await firmadorLocal.validarFirma(documentoFirmado);
console.log('¿Firma válida?', esValida); // true o false
```

**Proceso de validación:**
1. Extrae la firma del documento
2. Reconstruye el documento original (sin firma)
3. Crea hash del documento
4. Verifica la firma con la clave pública del certificado

---

## 📊 Información del Certificado

Puedes obtener información del certificado cargado:

```javascript
const info = firmadorLocal.getInfoCertificado();
console.log(info);
```

**Retorna:**
```javascript
{
  sujeto: [
    { nombre: 'commonName', valor: 'JUAN PEREZ' },
    { nombre: 'serialNumber', valor: '0614123456789' }
  ],
  emisor: [...],
  validoDesde: Date,
  validoHasta: Date,
  numeroSerie: "12345678"
}
```

---

## ⚠️ Solución de Problemas

### Error: "No se pudo cargar el certificado"

**Causas:**
- Contraseña incorrecta
- Archivo corrupto
- Formato no soportado

**Solución:**
- Verifica que la contraseña sea correcta
- Usa formato `.p12` o `.pfx` (RECOMENDADO)
- Regenera el certificado si está corrupto

### Error: "Certificado no cargado"

**Causa:** No se configuró el certificado en Settings

**Solución:**
1. Ve a Configuración
2. Selecciona certificado
3. Ingresa contraseña
4. Guarda

### La firma tarda mucho

**Causa:** Está usando Firmador Web (Puppeteer)

**Solución:**
- Configura un certificado local
- Verifica que la ruta del certificado sea correcta

---

## 🎓 Ejemplo Completo

```javascript
// 1. Crear firmador
const firmadorLocal = new FirmadorLocal();

// 2. Cargar certificado
await firmadorLocal.cargarCertificado(
  '/Users/juan/certificado.p12',
  'mi_password_super_secreto'
);

// 3. Preparar documento DTE
const dte = {
  identificacion: {
    version: 1,
    ambiente: '01',
    tipoDte: '01',
    numeroControl: 'DTE-01-0001-000000000000001',
    codigoGeneracion: 'A1B2C3D4-E5F6-47G8-H9I0-J1K2L3M4N5O6',
    // ... más campos
  },
  emisor: { /* ... */ },
  receptor: { /* ... */ },
  cuerpoDocumento: [ /* ... */ ],
  resumen: { /* ... */ }
};

// 4. Firmar documento
const resultado = await firmadorLocal.firmarDocumento(dte);

if (resultado.success) {
  console.log('✅ Documento firmado exitosamente');
  console.log('Firmante:', resultado.documentoFirmado.firma.firmante);
  console.log('Algoritmo:', resultado.documentoFirmado.firma.algoritmo);
  
  // 5. Validar firma
  const esValida = await firmadorLocal.validarFirma(resultado.documentoFirmado);
  console.log('¿Firma válida?', esValida);
}
```

---

## 📚 Recursos Adicionales

### Dependencias Utilizadas

- **node-forge**: Librería de criptografía para Node.js
  - SHA-256 hashing
  - RSA signing/verification
  - X.509 certificate parsing
  - PKCS#12 support

### Archivos Relacionados

- `/src/utils/firmador-local.js` - Implementación del firmador
- `/src/main/main.js` - Integración con IPC
- `/src/renderer/app.js` - Interfaz de usuario

---

## ✅ Checklist de Implementación

- [x] Clase FirmadorLocal creada
- [x] Soporte para .p12/.pfx
- [x] Soporte para .crt/.pem
- [x] Firmado con SHA256withRSA
- [x] Validación de firmas
- [x] Integración con main.js
- [x] Configuración en Settings
- [x] Selección automática local/web
- [x] Modal de firmado
- [x] Manejo de errores
- [x] Logging y debug

---

## 🎯 Estado: PRODUCCIÓN

El firmador local está **completamente funcional** y listo para uso en producción.

**Última actualización:** 12 de noviembre de 2025
