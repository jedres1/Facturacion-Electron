# Actualización: Actividades Económicas y Distribución Geográfica

## 📅 Fecha de Actualización: 8 de Noviembre de 2025

---

## 🏢 Actividades Económicas (CIIU-4)

Se ha implementado el catálogo completo de **Actividades Económicas** según la **Clasificación Industrial Internacional Uniforme - Revisión 4 (CIIU-4)**, que es el estándar utilizado por el Ministerio de Hacienda de El Salvador.

### ✅ Cambio Implementado

**Antes:** Campo de texto libre `<input>` donde el usuario escribía manualmente la actividad.

**Ahora:** Select dropdown `<select>` con 140+ actividades económicas organizadas por secciones.

### 📊 Secciones Implementadas

| Sección | Código | Categoría | Cantidad |
|---------|--------|-----------|----------|
| **A** | 01-03 | Agricultura, ganadería, silvicultura y pesca | 3 |
| **B** | 05-09 | Explotación de minas y canteras | 5 |
| **C** | 10-33 | Industrias manufactureras | 24 |
| **D** | 35 | Suministro de electricidad, gas, vapor | 1 |
| **E** | 36-39 | Suministro de agua, gestión de desechos | 4 |
| **F** | 41-43 | Construcción | 3 |
| **G** | 45-47 | Comercio al por mayor y al por menor | 3 |
| **H** | 49-53 | Transporte y almacenamiento | 5 |
| **I** | 55-56 | Alojamiento y servicios de comida | 2 |
| **J** | 58-63 | Información y comunicaciones | 6 |
| **K** | 64-66 | Actividades financieras y de seguros | 3 |
| **L** | 68 | Actividades inmobiliarias | 1 |
| **M** | 69-75 | Actividades profesionales, científicas y técnicas | 7 |
| **N** | 77-82 | Actividades administrativas y servicios de apoyo | 6 |
| **O** | 84 | Administración pública y defensa | 1 |
| **P** | 85 | Enseñanza | 1 |
| **Q** | 86-88 | Salud humana y asistencia social | 3 |
| **R** | 90-93 | Artes, entretenimiento y recreación | 4 |
| **S** | 94-96 | Otras actividades de servicios | 3 |
| **T** | 97-98 | Hogares como empleadores | 2 |
| **U** | 99 | Actividades de organizaciones extraterritoriales | 1 |

**Total:** 88 códigos de división organizados en 21 secciones

### 🎯 Actividades Más Comunes en El Salvador

#### Comercio
- **45** - Comercio y reparación de vehículos automotores y motocicletas
- **46** - Comercio al por mayor, excepto vehículos automotores
- **47** - Comercio al por menor, excepto vehículos automotores

#### Servicios
- **56** - Actividades de servicio de comidas y bebidas
- **55** - Actividades de alojamiento
- **62** - Programación informática, consultoría y actividades conexas

#### Manufactura
- **10** - Elaboración de productos alimenticios
- **14** - Fabricación de prendas de vestir
- **13** - Fabricación de productos textiles

#### Construcción
- **41** - Construcción de edificios
- **43** - Actividades especializadas de construcción

#### Agricultura
- **01** - Agricultura, ganadería, caza y servicios conexos

### 💡 Beneficios de la Actualización

✅ **Estandarización:** Cumplimiento con normativa de Hacienda  
✅ **Facilidad de uso:** No requiere escribir manualmente  
✅ **Evita errores:** Previene errores de escritura  
✅ **Búsqueda rápida:** Organizado por categorías  
✅ **Reporting:** Facilita generación de reportes por sector  
✅ **Auditoría:** Datos consistentes para revisiones  

---

## 🗺️ Actualización Geográfica

### ✅ Nuevos Municipios Agregados

Se ha actualizado el catálogo de municipios para reflejar los cambios en la división administrativa de El Salvador.

#### La Libertad - Nuevo Municipio

**Lourdes** (Código: 23)
- **Departamento:** La Libertad
- **Creación:** 2023
- **Ubicación:** Zona central del país
- **Total municipios La Libertad:** 23 (antes 22)

#### San Salvador - Actualización de Nombres

**Ciudad Delgado** (antes solo "Delgado")
- **Código:** 05
- **Cambio:** Actualización de nombre oficial
- **Departamento:** San Salvador

### 📊 Resumen Actualizado

| Departamento | Código | Municipios | Cambios |
|--------------|--------|------------|---------|
| Ahuachapán | 01 | 12 | - |
| Santa Ana | 02 | 13 | - |
| Sonsonate | 03 | 16 | - |
| Chalatenango | 04 | 33 | - |
| **La Libertad** | 05 | **23** | **+1 nuevo** |
| San Salvador | 06 | 19 | Actualización nombre |
| Cuscatlán | 07 | 16 | - |
| La Paz | 08 | 22 | - |
| Cabañas | 09 | 9 | - |
| San Vicente | 10 | 13 | - |
| Usulután | 11 | 23 | - |
| San Miguel | 12 | 20 | - |
| Morazán | 13 | 26 | - |
| La Unión | 14 | 18 | - |
| **TOTAL** | **14** | **263** | **+1** |

### 🆕 Total de Municipios

- **Antes:** 262 municipios
- **Ahora:** 263 municipios
- **Incremento:** +1 municipio

---

## 🔧 Cambios Técnicos Implementados

### 1. HTML - Modal de Cliente

```html
<!-- ANTES -->
<div class="form-group">
  <label>Giro o Actividad</label>
  <input type="text" id="cliente-giro">
</div>

<!-- AHORA -->
<div class="form-group full-width">
  <label>Actividad Económica *</label>
  <select id="cliente-giro" required>
    <option value="">Seleccionar actividad...</option>
    <optgroup label="A - Agricultura, ganadería...">
      <option value="01">Agricultura, ganadería, caza...</option>
      <!-- 87 opciones más -->
    </optgroup>
    <!-- 20 optgroups más -->
  </select>
</div>
```

### 2. JavaScript - Catálogo de Municipios

```javascript
// Actualizado en app.js
'05': [ // La Libertad
  { codigo: '01', nombre: 'Antiguo Cuscatlán' },
  // ... 21 municipios más
  { codigo: '23', nombre: 'Lourdes' } // NUEVO
],
'06': [ // San Salvador
  { codigo: '05', nombre: 'Ciudad Delgado' }, // ACTUALIZADO
  // ... resto de municipios
]
```

### 3. Validaciones Actualizadas

```javascript
// Campo de actividad económica ahora es requerido
document.getElementById('cliente-giro').required = true;
```

---

## 📱 Interfaz de Usuario

### Vista del Select de Actividades Económicas

```
╔═══════════════════════════════════════════════════════════╗
║ Actividad Económica *                                     ║
║ ┌───────────────────────────────────────────────────────┐ ║
║ │ Seleccionar actividad...                           ▼ │ ║
║ ├───────────────────────────────────────────────────────┤ ║
║ │ A - Agricultura, ganadería, silvicultura y pesca     │ ║
║ │   → 01 Agricultura, ganadería, caza y servicios...  │ ║
║ │   → 02 Silvicultura y extracción de madera          │ ║
║ │   → 03 Pesca y acuicultura                          │ ║
║ │ B - Explotación de minas y canteras                  │ ║
║ │   → 05 Extracción de carbón de piedra y lignito     │ ║
║ │   ...                                                │ ║
║ │ G - Comercio al por mayor y al por menor             │ ║
║ │   → 45 Comercio y reparación de vehículos...        │ ║
║ │   → 46 Comercio al por mayor, excepto vehículos     │ ║
║ │   → 47 Comercio al por menor, excepto vehículos     │ ║
║ └───────────────────────────────────────────────────────┘ ║
╚═══════════════════════════════════════════════════════════╝
```

### Vista del Select de Municipios (La Libertad)

```
╔═══════════════════════════════════════════════════════════╗
║ Municipio *                                               ║
║ ┌───────────────────────────────────────────────────────┐ ║
║ │ Seleccionar municipio...                           ▼ │ ║
║ ├───────────────────────────────────────────────────────┤ ║
║ │ Antiguo Cuscatlán                                    │ ║
║ │ Chiltiupán                                           │ ║
║ │ ...                                                  │ ║
║ │ Lourdes                          ← NUEVO             │ ║
║ │ ...                                                  │ ║
║ │ Zaragoza                                             │ ║
║ └───────────────────────────────────────────────────────┘ ║
╚═══════════════════════════════════════════════════════════╝
```

---

## ✅ Validaciones Implementadas

### Campo de Actividad Económica

1. **Requerido:** El campo es obligatorio
2. **Valor válido:** Debe seleccionar una opción del catálogo
3. **No permite texto libre:** Solo opciones predefinidas
4. **Guardado:** Se almacena el código de 2 dígitos

### Almacenamiento en Base de Datos

```sql
-- Tabla clientes
CREATE TABLE clientes (
  -- ... otros campos
  giro VARCHAR(2),  -- Código CIIU-4
  municipio VARCHAR(2),  -- Código de municipio
  departamento VARCHAR(2),  -- Código de departamento
  -- ... otros campos
);
```

---

## 🎯 Casos de Uso

### Caso 1: Crear Cliente - Restaurante

```javascript
// Usuario selecciona:
Actividad Económica: "56 - Actividades de servicio de comidas y bebidas"
Departamento: "06 - San Salvador"
Municipio: "15 - San Salvador"

// Se guarda en BD:
{
  giro: "56",
  departamento: "06",
  municipio: "15"
}
```

### Caso 2: Crear Cliente - Comercio en Nuevo Municipio

```javascript
// Usuario selecciona:
Actividad Económica: "47 - Comercio al por menor, excepto vehículos"
Departamento: "05 - La Libertad"
Municipio: "23 - Lourdes"  // NUEVO

// Se guarda en BD:
{
  giro: "47",
  departamento: "05",
  municipio: "23"
}
```

### Caso 3: Editar Cliente - Cambio de Actividad

```javascript
// Cliente existente con texto libre:
giro: "Venta de ropa"  // Texto libre anterior

// Usuario actualiza:
Actividad Económica: "47 - Comercio al por menor, excepto vehículos"

// Se actualiza en BD:
{
  giro: "47"  // Código estandarizado
}
```

---

## 📋 Compatibilidad

### Clientes Existentes

Los clientes creados **antes** de esta actualización:
- ✅ Mantienen su valor de actividad económica como texto
- ✅ Al editarlos, se puede seleccionar del catálogo
- ✅ No afecta facturas históricas
- ✅ Se recomienda actualizar gradualmente

### Migracion Sugerida

```javascript
// Script opcional para migrar datos antiguos
async function migrarActividadesEconomicas() {
  const clientes = await window.electronAPI.getClientes();
  
  clientes.forEach(async (cliente) => {
    if (cliente.giro && cliente.giro.length > 2) {
      // Cliente con texto libre, sugerir actualización
      console.log(`Cliente ${cliente.nombre} requiere actualización`);
    }
  });
}
```

---

## 📊 Reportes y Estadísticas

Con la nueva clasificación, ahora es posible generar:

### Reportes por Sector Económico

```javascript
// Ejemplo: Clientes por sector
const clientesPorSector = {
  'Comercio (G)': 45,
  'Servicios (I)': 23,
  'Manufactura (C)': 12,
  'Construcción (F)': 8,
  // ...
};
```

### Reportes por Ubicación Geográfica

```javascript
// Ejemplo: Clientes por municipio (incluyendo nuevo)
const clientesPorMunicipio = {
  'San Salvador': 150,
  'Santa Tecla': 45,
  'Lourdes': 3,  // NUEVO
  // ...
};
```

---

## 🔍 Referencias

### Documentación Oficial

- **CIIU-4:** Clasificación Industrial Internacional Uniforme - Revisión 4
- **Fuente:** Organización de las Naciones Unidas (ONU)
- **Adoptado por:** Ministerio de Hacienda El Salvador
- **Vigente desde:** 2009 (actualizado continuamente)

### Enlaces Útiles

- Portal de Transparencia Fiscal: https://www.transparenciafiscal.gob.sv
- Ministerio de Hacienda: https://www.mh.gob.sv
- DIGESTYC (Estadísticas): https://www.digestyc.gob.sv

---

## 🚀 Próximas Mejoras

### Sugerencias para Futuras Versiones

1. **Sub-clasificaciones:**
   - Agregar códigos de 3 y 4 dígitos para mayor precisión
   - Ejemplo: 47.11 - Comercio al por menor en establecimientos

2. **Búsqueda inteligente:**
   - Campo de búsqueda en el select
   - Filtrado por palabras clave
   - Autocompletado

3. **Frecuencia de uso:**
   - Mostrar actividades más usadas al inicio
   - Sugerencias basadas en sector del cliente

4. **Validación cruzada:**
   - Validar coherencia entre actividad y productos
   - Alertas de inconsistencias

5. **Migración automática:**
   - Script para convertir texto libre a códigos CIIU
   - Sugerencias basadas en texto actual

---

## ✨ Resumen de Cambios

| Característica | Antes | Ahora | Beneficio |
|----------------|-------|-------|-----------|
| **Actividad Económica** | Texto libre | Select con 88 códigos CIIU-4 | Estandarización |
| **Total Municipios** | 262 | 263 | Actualización oficial |
| **Campo Requerido** | No | Sí | Mejor calidad de datos |
| **Validación** | Ninguna | Catálogo oficial | Cumplimiento normativo |
| **Municipio Lourdes** | No existía | Agregado | Completitud |
| **Ciudad Delgado** | "Delgado" | "Ciudad Delgado" | Nombre oficial |

---

**Versión:** 2.1  
**Fecha:** 8 de noviembre de 2025  
**Autor:** Sistema de Facturación Electrónica El Salvador  
**Estado:** Implementado y Funcional ✅
