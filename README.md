# Facturación Electrónica El Salvador

Sistema de facturación electrónica con integración al Ministerio de Hacienda de El Salvador, desarrollado con Electron.js, SQLite y Puppeteer.

## 🚀 Características

- ✅ Generación de Documentos Tributarios Electrónicos (DTE)
- ✅ Integración con API de Hacienda El Salvador
- ✅ Firmado automático de documentos con Puppeteer
- ✅ Base de datos SQLite local
- ✅ Gestión de clientes y productos
- ✅ Interfaz de usuario intuitiva
- ✅ Soporte para múltiples tipos de documentos (Facturas, CCF, Notas de Crédito)

## 📋 Requisitos Previos

- Node.js 18 o superior
- npm o yarn
- Cuenta en el sistema de Hacienda El Salvador (usuario y contraseña)
- Acceso al Firmador de Hacienda (usuario y contraseña del firmador)
- Certificado digital para firma de documentos (.p12)

## 🔧 Instalación

1. Clonar el repositorio o extraer los archivos del proyecto

2. Instalar dependencias:
```bash
npm install
```

## 🏃 Ejecutar la Aplicación

### Modo desarrollo:
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

## 📦 Compilar la Aplicación

### Para Windows:
```bash
npm run build:win
```

### Para macOS:
```bash
npm run build:mac
```

### Para Linux:
```bash
npm run build:linux
```

## 🗂️ Estructura del Proyecto

```
facturacion-electron/
├── src/
│   ├── main/              # Proceso principal de Electron
│   │   ├── main.js        # Punto de entrada
│   │   └── preload.js     # Script de preload para IPC
│   ├── renderer/          # Interfaz de usuario
│   │   ├── index.html     # HTML principal
│   │   ├── styles.css     # Estilos
│   │   └── app.js         # Lógica del frontend
│   ├── database/          # Gestión de base de datos
│   │   └── database.js    # SQLite manager
│   ├── api/               # Integración con Hacienda
│   │   └── hacienda.js    # API de Hacienda
│   └── utils/             # Utilidades
│       ├── firmador.js    # Puppeteer para firmado
│       └── helpers.js     # Funciones auxiliares
├── build/                 # Recursos para compilación
├── package.json
└── README.md
```

## ⚙️ Configuración

### Credenciales Requeridas

Para utilizar este sistema, necesitas tener:

1. **Usuario y contraseña de la API de Hacienda** (para envío de DTEs)
2. **Usuario y contraseña del Firmador de Hacienda** (para firma digital de documentos)
3. **Certificado digital .p12** con su PIN correspondiente

### Pasos de Configuración

1. **Configurar Datos de la Empresa:**
   - Abrir la aplicación
   - Ir a "Configuración"
   - Llenar los datos de la empresa (NIT, nombre, dirección, etc.)

2. **Configurar Acceso a Hacienda:**
   - Ingresar usuario y contraseña de la API de Hacienda
   - Ingresar credenciales del Firmador de Hacienda (usuario y contraseña)
   - Seleccionar ambiente (Pruebas o Producción)
   - Configurar código de establecimiento y punto de venta

3. **Certificado Digital:**
   - Guardar el certificado .p12 en una ubicación segura
   - Configurar la ruta del certificado en la aplicación
   - Guardar el PIN del certificado

## 📝 Uso

### Crear una Nueva Factura

1. Ir a "Nueva Factura"
2. Seleccionar el cliente
3. Agregar productos/servicios
4. Revisar el resumen
5. Generar factura
6. Firmar el documento
7. Enviar a Hacienda

### Gestionar Clientes

1. Ir a "Clientes"
2. Click en "Nuevo Cliente"
3. Llenar la información requerida
4. Guardar

### Gestionar Productos

1. Ir a "Productos"
2. Click en "Nuevo Producto"
3. Ingresar código, descripción y precio
4. Guardar

## 🔐 Seguridad

- Las credenciales se almacenan de forma segura en la base de datos local
- La comunicación con Hacienda usa HTTPS
- El proceso de firmado usa el certificado digital oficial
- IPC seguro entre proceso principal y renderer

## 🛠️ Tecnologías Utilizadas

- **Electron.js**: Framework para aplicaciones de escritorio
- **SQLite (better-sqlite3)**: Base de datos local
- **Puppeteer**: Automatización del firmador web
- **Axios**: Cliente HTTP para API de Hacienda
- **PDF-lib**: Generación y manipulación de PDFs
- **QRCode**: Generación de códigos QR

## 📚 Documentación de Referencia

- [Documentación Oficial MH El Salvador](https://www.mh.gob.sv/dte/)
- [Especificaciones Técnicas DTE](https://www.mh.gob.sv/downloads/)
- [Electron Documentation](https://www.electronjs.org/docs)

## ⚠️ Notas Importantes

- Este sistema está diseñado para cumplir con las especificaciones del Ministerio de Hacienda de El Salvador
- Es responsabilidad del usuario configurar correctamente sus credenciales y certificados
- Se recomienda realizar pruebas exhaustivas en el ambiente de pruebas antes de pasar a producción
- Mantener respaldos regulares de la base de datos

## 🐛 Solución de Problemas

### Error de conexión con Hacienda
- Verificar credenciales
- Verificar ambiente seleccionado (Pruebas/Producción)
- Verificar conexión a Internet

### Error al firmar documentos
- Verificar que el certificado digital esté vigente
- Verificar la ruta del certificado
- Verificar el PIN del certificado

### Base de datos no se crea
- Verificar permisos de escritura en la carpeta de la aplicación
- Reiniciar la aplicación

## 📄 Licencia

ISC

## 👥 Soporte

Para soporte técnico o consultas, contactar al desarrollador.

---

**Desarrollado para cumplir con los requisitos de facturación electrónica del Ministerio de Hacienda de El Salvador**
