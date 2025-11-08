# Guía de Prueba - Gestión de Clientes

## 🧪 Cómo Probar la Nueva Funcionalidad

### Paso 1: Crear un Nuevo Cliente

1. **Abrir la aplicación**
   ```bash
   npm start
   ```

2. **Navegar a Clientes**
   - Click en el menú lateral "👥 Clientes"

3. **Crear Cliente**
   - Click en "➕ Nuevo Cliente"
   - Llenar el formulario:
     - **Tipo de Documento:** Seleccionar "NIT"
     - **Número:** `0614-123456-101-5`
     - **Nombre:** `Empresa Demo S.A. de C.V.`
     - **Nombre Comercial:** `Empresa Demo`
     - **Teléfono:** `2222-3333`
     - **Email:** `contacto@demo.com`
     - **Departamento:** Seleccionar "San Salvador"
     - **Municipio:** (Se cargará automáticamente) Seleccionar "San Salvador"
     - **Dirección:** `Calle Principal, Colonia Escalón`
     - **Giro:** `Comercio al por mayor`
   - Click en "Guardar Cliente"
   - ✅ Debería aparecer mensaje: "Cliente guardado exitosamente"

### Paso 2: Verificar Carga Dinámica de Municipios

1. **Click en "➕ Nuevo Cliente"** nuevamente
2. **Seleccionar Departamento:** "La Libertad"
3. **Verificar que el select de Municipio:**
   - Se habilita automáticamente
   - Muestra 22 municipios de La Libertad
   - Incluye: Antiguo Cuscatlán, Santa Tecla, etc.
4. **Cambiar a otro departamento:** "Ahuachapán"
5. **Verificar que se actualicen los municipios:**
   - Ahora muestra 12 municipios de Ahuachapán
   - Incluye: Ahuachapán, Atiquizaya, Tacuba, etc.

### Paso 3: Editar un Cliente Existente

1. **En la tabla de clientes**, localizar el cliente creado
2. **Click en botón "Editar"**
3. **Verificar que el modal se abre con:**
   - ✅ Título: "Editar Cliente"
   - ✅ Todos los campos pre-llenados
   - ✅ Departamento seleccionado correctamente
   - ✅ Municipios cargados automáticamente
   - ✅ Municipio seleccionado correctamente

4. **Realizar cambios:**
   - Cambiar **Teléfono** a: `2555-7788`
   - Cambiar **Departamento** a: "La Libertad"
   - Esperar que se carguen municipios
   - Seleccionar **Municipio:** "Santa Tecla"
   - Cambiar **Dirección** a: `Boulevard Los Próceres, Santa Tecla`

5. **Click en "Guardar Cliente"**
6. **Verificar:**
   - ✅ Mensaje: "Cliente actualizado exitosamente"
   - ✅ Modal se cierra
   - ✅ Tabla se actualiza con nuevos datos

### Paso 4: Probar Todos los Departamentos

Crear clientes de prueba para cada departamento:

```javascript
// Departamentos a probar:
1. Ahuachapán → Atiquizaya (12 municipios)
2. Santa Ana → Metapán (13 municipios)
3. Sonsonate → Izalco (16 municipios)
4. Chalatenango → La Palma (33 municipios)
5. La Libertad → Santa Tecla (22 municipios)
6. San Salvador → Soyapango (19 municipios)
7. Cuscatlán → Suchitoto (16 municipios)
8. La Paz → Zacatecoluca (22 municipios)
9. Cabañas → Sensuntepeque (9 municipios)
10. San Vicente → San Vicente (13 municipios)
11. Usulután → Santiago de María (23 municipios)
12. San Miguel → San Miguel (20 municipios)
13. Morazán → San Francisco Gotera (26 municipios)
14. La Unión → La Unión (18 municipios)
```

### Paso 5: Eliminar un Cliente

1. **En la tabla de clientes**, localizar un cliente de prueba
2. **Click en botón "Eliminar" (rojo)**
3. **Verificar diálogo de confirmación:**
   - ✅ Mensaje: "¿Está seguro de eliminar este cliente?"
4. **Click en "Aceptar"**
5. **Verificar:**
   - ✅ Mensaje: "Cliente eliminado exitosamente"
   - ✅ Cliente desaparece de la tabla
   - ✅ Lista se actualiza automáticamente

### Paso 6: Validaciones

#### Prueba de Validación de NIT

1. **Crear nuevo cliente**
2. **Tipo:** NIT
3. **Número:** `123456` (formato incorrecto)
4. **Click fuera del campo**
5. **Verificar:** 
   - ✅ Mensaje de error: "Formato de NIT inválido. Use: 0000-000000-000-0"

#### Prueba de Validación de DUI

1. **Cambiar tipo a:** DUI
2. **Número:** `12345678` (sin guión)
3. **Click fuera del campo**
4. **Verificar:**
   - ✅ Mensaje de error: "Formato de DUI inválido. Use: 00000000-0"

#### Prueba de Campos Requeridos

1. **Crear nuevo cliente**
2. **Dejar campos vacíos:**
   - Nombre (dejar vacío)
   - Departamento (dejar vacío)
3. **Click en "Guardar Cliente"**
4. **Verificar:**
   - ✅ Campos marcados en rojo
   - ✅ No permite guardar

### Paso 7: Integración con Facturas

1. **Crear/Editar un cliente** con municipio específico
2. **Ir a "Nueva Factura"**
3. **Seleccionar el cliente** del dropdown
4. **Crear factura** (agregar productos, etc.)
5. **Verificar que en la factura guardada:**
   - ✅ Se guarden códigos de departamento y municipio
   - ✅ Los datos del cliente estén completos en JSON

### Paso 8: Verificar Base de Datos

```javascript
// Desde la consola de desarrollo (Ctrl+Shift+I):

// Ver todos los clientes
const clientes = await window.electronAPI.getClientes();
console.table(clientes);

// Verificar que tengan departamento y municipio
clientes.forEach(c => {
  console.log(`${c.nombre}: Depto ${c.departamento}, Muni ${c.municipio}`);
});
```

## ✅ Checklist de Pruebas

- [ ] Crear cliente nuevo con todos los campos
- [ ] Seleccionar departamento y verificar carga de municipios
- [ ] Cambiar departamento y verificar actualización de municipios
- [ ] Probar los 14 departamentos diferentes
- [ ] Editar cliente existente
- [ ] Modificar departamento en edición
- [ ] Verificar que municipio se mantenga al editar
- [ ] Eliminar cliente
- [ ] Confirmar eliminación
- [ ] Cancelar eliminación
- [ ] Validar formato de NIT
- [ ] Validar formato de DUI
- [ ] Validar campos requeridos
- [ ] Crear factura con cliente actualizado
- [ ] Verificar datos en base de datos

## 🐛 Problemas Comunes

### 1. Municipios no se cargan

**Solución:**
- Verificar que el departamento esté seleccionado
- Revisar consola de desarrollo para errores
- Verificar que `municipiosPorDepartamento` existe en app.js

### 2. Edición no guarda cambios

**Solución:**
- Verificar que todos los campos requeridos estén llenos
- Revisar consola para errores de red
- Verificar que el IPC handler `updateCliente` esté funcionando

### 3. Error al eliminar cliente usado en facturas

**Comportamiento esperado:**
- El cliente se puede eliminar
- Las facturas históricas mantienen los datos del cliente en JSON
- No afecta integridad de facturas ya emitidas

## 📊 Datos de Prueba

### Cliente 1: Empresa San Salvador
```
Tipo: NIT
Número: 0614-123456-101-5
Nombre: Comercial San Salvador S.A.
Departamento: San Salvador (06)
Municipio: San Salvador (15)
```

### Cliente 2: Negocio Santa Ana
```
Tipo: DUI
Número: 03456789-1
Nombre: Juan Pérez
Departamento: Santa Ana (02)
Municipio: Santa Ana (10)
```

### Cliente 3: Tienda La Libertad
```
Tipo: NIT
Número: 0614-654321-102-3
Nombre: Distribuidora El Progreso
Departamento: La Libertad (05)
Municipio: Santa Tecla (10)
```

## 🎯 Resultados Esperados

Al finalizar todas las pruebas:

✅ Los clientes se crean correctamente  
✅ Los municipios se cargan dinámicamente  
✅ La edición actualiza todos los campos  
✅ La eliminación funciona con confirmación  
✅ Las validaciones previenen errores  
✅ La integración con facturas funciona  
✅ Los datos se almacenan correctamente  

---

**¡Listo para probar!** 🚀

Si encuentras algún problema, revisa la consola de desarrollo (Ctrl+Shift+I en la aplicación) para ver mensajes de error detallados.
