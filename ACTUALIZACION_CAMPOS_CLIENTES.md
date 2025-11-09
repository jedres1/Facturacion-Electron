# Actualización: Campos NRC y Tipo de Persona en Clientes

## Fecha
8 de noviembre de 2025

## Descripción
Se agregaron dos nuevos campos al módulo de clientes:
1. **NRC** (Número de Registro de Contribuyente) - Campo opcional
2. **Tipo de Persona** - Puede ser Natural o Jurídica

## Cambios Realizados

### 1. Base de Datos (`src/database/database.js`)

#### Esquema de Tabla
Se agregaron dos nuevas columnas a la tabla `clientes`:
- `nrc TEXT` - Almacena el Número de Registro de Contribuyente
- `tipo_persona TEXT` - Almacena "Natural" o "Jurídica"

#### Migración Automática
Se agregaron bloques try-catch para agregar las columnas automáticamente en bases de datos existentes:
```javascript
// Agregar columna nrc si no existe
try {
  this.db.exec(`ALTER TABLE clientes ADD COLUMN nrc TEXT`);
} catch (error) {
  // La columna ya existe, ignorar error
}

// Agregar columna tipo_persona si no existe
try {
  this.db.exec(`ALTER TABLE clientes ADD COLUMN tipo_persona TEXT`);
} catch (error) {
  // La columna ya existe, ignorar error
}
```

#### Funciones CRUD Actualizadas
- **addCliente()**: Ahora incluye `nrc` y `tipo_persona` en el INSERT
- **updateCliente()**: Ahora incluye `nrc` y `tipo_persona` en el UPDATE

### 2. Interfaz HTML (`src/renderer/index.html`)

#### Formulario de Cliente
Se agregaron dos nuevos campos después del campo "Número de Documento":

**Campo NRC:**
```html
<div class="form-group">
  <label>NRC (Número de Registro de Contribuyente)</label>
  <input type="text" id="cliente-nrc" placeholder="000000-0">
</div>
```

**Campo Tipo de Persona:**
```html
<div class="form-group">
  <label>Tipo de Persona</label>
  <select id="cliente-tipo-persona">
    <option value="">Seleccionar...</option>
    <option value="Natural">Natural</option>
    <option value="Jurídica">Jurídica</option>
  </select>
</div>
```

#### Tabla de Clientes
Se agregaron dos nuevas columnas en la tabla de visualización:
- **NRC** - Entre "Documento" y "Nombre"
- **Tipo Persona** - Entre "Nombre" y "Ubicación"

Encabezados actualizados:
```html
<th>Documento</th>
<th>NRC</th>
<th>Nombre</th>
<th>Tipo Persona</th>
<th>Ubicación</th>
<th>Teléfono</th>
<th>Email</th>
<th>Acciones</th>
```

### 3. Lógica de Aplicación (`src/renderer/app.js`)

#### Función `guardarCliente()`
Actualizada para incluir los nuevos campos en `clienteData`:
```javascript
const clienteData = {
  tipo_documento: document.getElementById('cliente-tipo-documento').value,
  numero_documento: document.getElementById('cliente-numero-documento').value,
  nrc: document.getElementById('cliente-nrc').value,  // NUEVO
  nombre: document.getElementById('cliente-nombre').value,
  nombre_comercial: document.getElementById('cliente-nombre-comercial').value,
  tipo_persona: document.getElementById('cliente-tipo-persona').value,  // NUEVO
  telefono: document.getElementById('cliente-telefono').value,
  email: document.getElementById('cliente-email').value,
  departamento: document.getElementById('cliente-departamento').value,
  municipio: document.getElementById('cliente-municipio').value,
  distrito: document.getElementById('cliente-distrito').value,
  direccion: document.getElementById('cliente-direccion').value,
  giro: document.getElementById('cliente-giro').value
};
```

#### Función `abrirModalCliente()`
Actualizada para cargar los valores de NRC y Tipo de Persona al editar:
```javascript
document.getElementById('cliente-nrc').value = cliente.nrc || '';
document.getElementById('cliente-tipo-persona').value = cliente.tipo_persona || '';
```

#### Función `loadClientes()`
Actualizada para mostrar los nuevos campos en la tabla:
```javascript
return `
  <tr>
    <td>${c.numero_documento}</td>
    <td>${c.nrc || 'N/A'}</td>              <!-- NUEVO -->
    <td>${c.nombre}</td>
    <td>${c.tipo_persona || 'N/A'}</td>    <!-- NUEVO -->
    <td>${ubicacion}</td>
    <td>${c.telefono || 'N/A'}</td>
    <td>${c.email || 'N/A'}</td>
    <td>...</td>
  </tr>
`;
```

## Características

### Campo NRC
- **Opcional**: No es requerido para guardar un cliente
- **Formato sugerido**: "000000-0" (placeholder)
- **Uso**: Identificar a contribuyentes registrados en El Salvador
- **Aplicable a**: Personas naturales y jurídicas que están registradas ante el Ministerio de Hacienda

### Campo Tipo de Persona
- **Opcional**: No es requerido para guardar un cliente
- **Opciones**:
  - `Natural`: Persona física/individual
  - `Jurídica`: Empresa, corporación, sociedad
- **Uso**: Clasificar el tipo de cliente para reportes y DTEs

## Compatibilidad

### Base de Datos Existente
✅ Los cambios son **retrocompatibles**:
- Las columnas se agregan automáticamente si no existen
- Los clientes existentes tendrán valores NULL en los nuevos campos
- No se requiere migración manual de datos

### Datos Existentes
- Los clientes guardados previamente seguirán funcionando normalmente
- Los nuevos campos se mostrarán como "N/A" si no tienen valor
- Al editar un cliente existente, se pueden agregar los nuevos valores

## Validaciones
- **NRC**: Sin validación específica (campo libre)
- **Tipo de Persona**: Sin validación (campo opcional)
- **Número de Documento**: Sigue siendo obligatorio (sin cambios)

## Uso en DTEs
Los nuevos campos pueden ser utilizados para:
- **NRC**: Incluirlo en documentos tributarios electrónicos cuando el cliente esté registrado
- **Tipo de Persona**: Determinar el formato apropiado del documento según sea persona natural o jurídica
- **Reportes**: Segmentar clientes por tipo de persona

## Testing
Para probar los cambios:

1. **Nuevo Cliente**:
   - Abrir aplicación
   - Ir a "Clientes"
   - Clic en "Nuevo Cliente"
   - Llenar datos obligatorios
   - Agregar NRC y seleccionar Tipo de Persona
   - Guardar y verificar en la tabla

2. **Editar Cliente Existente**:
   - Seleccionar un cliente de la lista
   - Clic en "Editar"
   - Agregar NRC y Tipo de Persona
   - Guardar y verificar cambios en la tabla

3. **Cliente sin NRC**:
   - Crear cliente sin llenar NRC ni Tipo de Persona
   - Verificar que se guarda correctamente
   - Verificar que aparece "N/A" en la tabla

## Estructura de Columnas en Tabla

**Orden anterior**: Documento | Nombre | Ubicación | Teléfono | Email | Acciones

**Orden nuevo**: Documento | NRC | Nombre | Tipo Persona | Ubicación | Teléfono | Email | Acciones

## Notas Técnicas
- Las columnas se agregan con `ALTER TABLE` encapsulado en try-catch
- Los campos son opcionales (NULL permitido)
- La tabla ahora tiene 8 columnas en lugar de 6
- El colspan del mensaje "No hay clientes" se actualizó de 6 a 8

## Impacto
✅ Mejora la información del cliente  
✅ Facilita emisión de DTEs con datos completos  
✅ Permite clasificación de clientes  
✅ Compatible con datos existentes  
✅ No requiere cambios en configuración de Hacienda  
✅ Campos opcionales para flexibilidad  

## Archivos Modificados
- `src/database/database.js` - Esquema y funciones CRUD
- `src/renderer/index.html` - Formulario y tabla de clientes
- `src/renderer/app.js` - Funciones de gestión de clientes
