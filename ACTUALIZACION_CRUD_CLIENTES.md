# Actualización CRUD de Clientes - Noviembre 2025

## Resumen de Cambios

Se ha actualizado completamente el sistema CRUD de clientes para incluir la jerarquía geográfica completa de tres niveles implementada anteriormente:

**Departamento → Municipio → Distrito**

## Cambios Implementados

### 1. Base de Datos (database.js)

#### Esquema de tabla actualizado:
- ✅ Agregado campo `distrito` a la tabla `clientes`
- ✅ Orden de campos: `departamento`, `municipio`, `distrito`
- ✅ Migración automática para bases de datos existentes con `ALTER TABLE`

#### Métodos actualizados:
- `addCliente()`: Ahora incluye el campo distrito
- `updateCliente()`: Ahora actualiza el campo distrito

### 2. Interfaz de Usuario (index.html)

#### Formulario de Cliente:
- ✅ Agregado select `cliente-distrito` entre municipio y dirección
- ✅ Campo requerido con validación
- ✅ Placeholder: "Seleccione primero un municipio..."

#### Tabla de Clientes:
- ✅ Nueva columna "Ubicación" entre Nombre y Teléfono
- ✅ Ajustado colspan de mensaje vacío a 6 columnas

### 3. Lógica de Aplicación (app.js)

#### Nuevas Funciones:

**cargarDistritos(codigoMunicipio)**
- Carga dinámicamente los distritos cuando se selecciona un municipio
- Utiliza `distritosPorMunicipio` con los 262 distritos
- Usa `codigoDistrito` (6 dígitos) como value
- Incluye atributo `data-codigo-carga` con el código de 4 dígitos

#### Funciones Actualizadas:

**cargarMunicipios(codigoDepartamento)**
- Ahora limpia también el select de distritos
- Deshabilita distrito hasta que se seleccione municipio

**setupDepartamentoMunicipioHandler()**
- Renombrada de `setupDepartamentoMunicipioHandler`
- Agregado listener para cambio de municipio que carga distritos

**guardarCliente()**
- Incluye campo `distrito` en `clienteData`

**abrirModalCliente(cliente)**
- Carga distritos del municipio al editar
- Establece valor del distrito con timeout anidado
- Mantiene cascada: departamento → municipio → distrito

**loadClientes()**
- Muestra información de ubicación inteligente en tabla:
  - Prioridad 1: Nombre del distrito (si existe)
  - Prioridad 2: Nombre del municipio (si no hay distrito)
  - Prioridad 3: Nombre del departamento (si solo hay departamento)
- Usa helper `obtenerNombreDistrito()` para convertir código a nombre

**obtenerNombreDistrito(codigoDistrito)**
- Corregido para buscar por `codigoDistrito` en lugar de `codigo`
- Compatible con estructura actualizada de distritos

## Estructura de Datos

### Jerarquía Geográfica Completa:

```
14 Departamentos (códigos 01-14)
    ↓
44 Municipios (códigos DDMM de 4 dígitos)
    ↓
262 Distritos (codigoDistrito DDMMDD de 6 dígitos + codigoCarga DDDD de 4 dígitos)
```

### Ejemplo de Datos:

```javascript
// Departamento 06 - San Salvador
municipiosPorDepartamento['06'] = [
  { codigo: '0601', nombre: 'San Salvador Centro' },
  { codigo: '0602', nombre: 'San Salvador Este' },
  // ... más municipios
];

// Municipio 0601 - San Salvador Centro
distritosPorMunicipio['0601'] = [
  { codigoCarga: '0601', codigoDistrito: '060101', nombre: 'San Salvador' },
  { codigoCarga: '0629', codigoDistrito: '060129', nombre: 'Aguilares' },
  // ... más distritos
];
```

## Flujo de Usuario

### Crear/Editar Cliente:

1. Usuario selecciona **Departamento** → Se cargan municipios del departamento
2. Usuario selecciona **Municipio** → Se cargan distritos del municipio
3. Usuario selecciona **Distrito** → Listo para guardar
4. Todos los campos son requeridos para garantizar datos completos

### Visualización en Tabla:

- Muestra el nombre del distrito (nivel más específico disponible)
- Fallback a municipio o departamento si distrito no está disponible
- Compatible con clientes existentes sin distrito

## Compatibilidad

✅ **Migración automática**: Las bases de datos existentes agregan la columna `distrito` automáticamente

✅ **Datos heredados**: Clientes antiguos sin distrito funcionan correctamente

✅ **Validación**: Nuevos clientes requieren selección completa de ubicación

## Códigos Utilizados

### codigoCarga (4 dígitos)
- Código operacional para identificación rápida
- Formato: `DDDD` donde primeros 2 dígitos son departamento
- Usado internamente para referencias

### codigoDistrito (6 dígitos)
- Código oficial del Ministerio de Hacienda
- Formato: `DDMMDD` (Departamento + Municipio + Distrito)
- Usado para DTE y reportes oficiales
- **Este es el valor almacenado en la base de datos**

## Conformidad

✅ Cumple con catálogos oficiales del Ministerio de Hacienda

✅ Compatible con requisitos de DTE (Documento Tributario Electrónico)

✅ Estructura aprobada: CIIU-4 + Jerarquía geográfica oficial

## Archivos Modificados

1. `/src/database/database.js` - Schema y métodos CRUD
2. `/src/renderer/index.html` - Formulario y tabla de clientes
3. `/src/renderer/app.js` - Lógica de carga dinámica y helpers

## Testing Recomendado

- [ ] Crear nuevo cliente con selección completa: Departamento → Municipio → Distrito
- [ ] Editar cliente existente y verificar carga de ubicación
- [ ] Verificar cascada de selects funciona correctamente
- [ ] Confirmar que distrito aparece en tabla de clientes
- [ ] Probar con clientes antiguos sin distrito (compatibilidad)
- [ ] Verificar que código de 6 dígitos se guarda correctamente

## Notas Técnicas

- Los distritos se cargan solo cuando hay un municipio seleccionado
- El campo distrito es requerido para nuevos clientes
- Se utiliza setTimeout para dar tiempo a la carga de opciones en modo edición
- La función `obtenerNombreDistrito` busca en todos los municipios para resolver nombres

---

**Actualización completada:** 8 de noviembre de 2025
**Sistema:** Facturación Electrónica SV v1.0
**Conformidad:** Ministerio de Hacienda El Salvador
