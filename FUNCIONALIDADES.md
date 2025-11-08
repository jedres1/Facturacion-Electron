# Funcionalidades del Sistema de Facturación Electrónica

## ✅ Funcionalidades Implementadas

### 1. Gestión de Clientes
- ✅ Listar todos los clientes
- ✅ Agregar nuevo cliente con validación
- ✅ Editar cliente existente (ACTUALIZADO)
- ✅ Eliminar cliente
- ✅ Validación de NIT y DUI
- ✅ Modal con formulario completo
- ✅ Selección de departamento y municipio (262 municipios actualizados)
- ✅ Carga dinámica de municipios según departamento
- ✅ Códigos oficiales del Ministerio de Hacienda

### 2. Gestión de Productos/Servicios
- ✅ Listar todos los productos
- ✅ Agregar nuevo producto con cálculo de IVA
- ✅ Editar producto existente
- ✅ Eliminar producto
- ✅ Soporte para productos exentos de IVA
- ✅ Precio con y sin IVA
- ✅ Modal con formulario completo

### 3. Creación de Facturas
- ✅ Selección de cliente desde lista
- ✅ Agregar productos/servicios al detalle
- ✅ Cálculo automático de subtotales, IVA y total
- ✅ Generación de código de control y código de generación (UUID)
- ✅ Conversión de montos a letras
- ✅ Guardado en base de datos
- ✅ Estado inicial: PENDIENTE

### 4. Visualización de Facturas
- ✅ Modal de detalle con toda la información de la factura
- ✅ Información del cliente
- ✅ Detalle de items con cálculos
- ✅ Resumen de totales (Subtotal, IVA, Total)
- ✅ Badge de estado (PENDIENTE, FIRMADO, ENVIADO, etc.)
- ✅ Botones de acción según el estado

### 5. Firma de Documentos
- ✅ Integración con Firmador de Hacienda usando Puppeteer
- ✅ Autenticación con usuario y contraseña del firmador
- ✅ Ingreso de PIN del certificado digital
- ✅ Construcción del documento DTE para firma
- ✅ Actualización de estado a FIRMADO
- ✅ Manejo de errores

### 6. Envío a Hacienda
- ✅ Autenticación con API de Hacienda
- ✅ Envío del DTE firmado
- ✅ Actualización de estado a ENVIADO
- ✅ Guardado de sello de recepción
- ✅ Manejo de respuestas y errores

### 7. Base de Datos
- ✅ SQLite con better-sqlite3
- ✅ Tablas: configuracion, clientes, productos, facturas, contingencias
- ✅ Campos JSON para datos complejos
- ✅ Índices para optimización
- ✅ Timestamps automáticos

### 8. Interfaz de Usuario
- ✅ Dashboard con estadísticas
- ✅ Navegación entre vistas
- ✅ Modales para CRUD de clientes y productos
- ✅ Modal para detalle de factura
- ✅ Modal para agregar items a factura
- ✅ Sistema de notificaciones
- ✅ Badges de estado con colores
- ✅ Diseño responsive

## 🔄 Flujo de Trabajo Completo

1. **Configuración Inicial**
   - Configurar datos de la empresa
   - Configurar credenciales de Hacienda
   - Configurar ruta del certificado digital

2. **Gestión de Catálogos**
   - Agregar clientes
   - Agregar productos/servicios con sus precios

3. **Crear Factura**
   - Ir a "Nueva Factura"
   - Seleccionar cliente
   - Agregar productos con cantidades
   - Sistema calcula automáticamente totales
   - Guardar factura (estado: PENDIENTE)

4. **Firmar Factura**
   - Ir a "Facturas"
   - Click en botón "Ver" de la factura
   - Click en "Firmar Documento"
   - Ingresar PIN del certificado
   - Ingresar usuario del firmador
   - Ingresar contraseña del firmador
   - Sistema firma con Puppeteer (estado: FIRMADO)

5. **Enviar a Hacienda**
   - Abrir factura firmada
   - Click en "Enviar a Hacienda"
   - Sistema autentica con API de Hacienda
   - Sistema envía DTE
   - Recibe sello de recepción (estado: ENVIADO)

## 📊 Estados de Factura

| Estado | Descripción | Color Badge | Acciones Disponibles |
|--------|-------------|-------------|---------------------|
| PENDIENTE | Factura creada, sin firmar | Amarillo | Firmar Documento |
| FIRMADO | Documento firmado digitalmente | Azul | Enviar a Hacienda |
| ENVIADO | Enviado a Hacienda | Naranja | Ver/Consultar |
| ACEPTADO | Aprobado por Hacienda | Verde | Ver/Imprimir |
| RECHAZADO | Rechazado por Hacienda | Rojo | Ver errores |

## 🔐 Seguridad

- ✅ IPC seguro con contextBridge
- ✅ Credenciales solicitadas en tiempo de ejecución (no almacenadas)
- ✅ Validación de datos en frontend y backend
- ✅ Base de datos local protegida

## 🛠️ Tecnologías

- **Electron.js** v28.0.0 - Framework de aplicación
- **SQLite** con better-sqlite3 v9.2.2 - Base de datos
- **Puppeteer** v21.6.1 - Automatización del firmador
- **Axios** v1.6.2 - Cliente HTTP para API
- **Node.js** - Runtime

## 📝 Próximas Mejoras Sugeridas

### Prioridad Alta
- [ ] Generación de PDF de la factura
- [ ] Código QR con información de la factura
- [ ] Consulta de estado en Hacienda
- [ ] Manejo de contingencias

### Prioridad Media
- [ ] Reportes de ventas
- [ ] Respaldo automático de base de datos
- [ ] Validación de certificado digital antes de firmar
- [ ] Vista previa antes de enviar

### Prioridad Baja
- [ ] Múltiples empresas
- [ ] Control de inventario
- [ ] Cuentas por cobrar
- [ ] Integración con impresoras fiscales

## 🚀 Uso del Sistema

### Iniciar Aplicación
```bash
npm start
```

### Desarrollo
```bash
npm run dev
```

### Compilar para Distribución
```bash
npm run build
```

## 📞 Soporte

Para problemas o consultas sobre el sistema:
1. Revisar logs en la consola de desarrollo (Ctrl+Shift+I)
2. Verificar configuración de credenciales
3. Validar certificado digital (.p12)
4. Consultar documentación de API de Hacienda El Salvador

---

**Sistema desarrollado para El Salvador** 🇸🇻
**Cumplimiento con normativa del Ministerio de Hacienda**
