# Actualización de Actividades Económicas

## Fecha
2025-01-XX

## Descripción
Se actualizaron las actividades económicas en el formulario de clientes con la clasificación oficial del Banco Central de Reserva de El Salvador (BCR) - Revisión 4.0.

## Fuente Oficial
- **URL**: https://onec.bcr.gob.sv/clasificadoresv2/Clasificadores/Index/1?tipo=1
- **Nombre**: Clasificación de Actividades Económicas de El Salvador Rev. 4.0
- **Autoridad**: Banco Central de Reserva de El Salvador (BCR) / Ministerio de Hacienda

## Estructura de la Clasificación
La clasificación CIIU-4 utiliza una estructura jerárquica:
- **Secciones**: Letras A-U (21 secciones)
- **Divisiones**: Códigos de 2 dígitos (01-99) → **Nivel implementado en el formulario**
- **Grupos**: Códigos de 3 dígitos
- **Clases**: Códigos de 4 dígitos  
- **Subclases**: Códigos de 7 dígitos (nivel más detallado)

## Decisión de Implementación
Se utilizó el nivel de **Divisiones (2 dígitos)** porque:
- Proporciona suficiente detalle para clasificar clientes
- Mantiene el selector manejable (88 opciones)
- Es el estándar utilizado en formularios DTE
- Coincide con requerimientos de Ministerio de Hacienda

## Cambios Realizados

### Archivo Modificado
- `src/renderer/index.html` (líneas 585-720 aproximadamente)

### Actualizaciones de Descripciones
Las siguientes divisiones fueron actualizadas para coincidir exactamente con la nomenclatura oficial del BCR:

#### Sección A
- **01**: "Agricultura, ganadería, caza y servicios conexos" → "Producción agrícola, pecuaria, caza y actividades de servicios conexas"

#### Sección C
- **15**: "Curtido y adobo de cueros; fabricación de calzado" → "Fabricación de cueros y productos conexos"
- **16**: "Producción de madera y fabricación de productos de madera" → "Fabricación de productos de madera y corcho, excepto muebles"
- **17**: "Fabricación de papel y productos de papel" → "Fabricación de papel y de productos de papel"
- **19**: "Fabricación de coque y productos de refinación del petróleo" → "Fabricación de coque y de productos de la refinación del petróleo"
- **25**: "Fabricación de productos elaborados de metal" → "Fabricación de productos elaborados de metal, excepto maquinaria y equipo"
- **26**: "Fabricación de productos de informática, electrónica y óptica" → "Fabricación de productos de informática, de electrónica y de óptica"
- **29**: "Fabricación de vehículos automotores y sus partes" → "Fabricación de vehículos automotores, remolques y semirremolques"

#### Sección D
- Label: "Suministro de electricidad, gas, vapor" → "Suministro de electricidad, gas, vapor y aire acondicionado"

#### Sección E
- Label: "Suministro de agua, gestión de desechos" → "Suministro de agua; evacuación de aguas residuales, gestión de desechos"
- **37**: "Evacuación de aguas residuales" → "Evacuación de aguas residuales (alcantarillado)"
- **38**: "Recolección, tratamiento y eliminación de desechos" → "Recolección, tratamiento y eliminación de desechos; reciclaje"
- **39**: "Actividades de descontaminación y gestión de desechos" → "Actividades de saneamiento y otros servicios de gestión de desechos"

#### Sección G
- Label: "Comercio al por mayor y al por menor" → "Comercio al por mayor y al por menor; reparación de vehículos automotores"
- **45**: "Comercio y reparación de vehículos automotores y motocicletas" → "Comercio al por mayor y al por menor y reparación de vehículos automotores y motocicletas"
- **46**: "Comercio al por mayor, excepto vehículos automotores" → "Comercio al por mayor, excepto de vehículos automotores y motocicletas"
- **47**: "Comercio al por menor, excepto vehículos automotores" → "Comercio al por menor, excepto de vehículos automotores y motocicletas"

#### Sección H
- **49**: "Transporte terrestre y por tuberías" → "Transporte por vía terrestre y transporte por tuberías"
- **50**: "Transporte acuático" → "Transporte por vía acuática"
- **51**: "Transporte aéreo" → "Transporte por vía aérea"
- **52**: "Almacenamiento y actividades de apoyo al transporte" → "Almacenamiento y actividades de apoyo al transporte"

#### Sección I
- Label: "Alojamiento y servicios de comida" → "Actividades de alojamiento y de servicio de comidas"

#### Sección J
- **59**: "Actividades de cinematografía, grabación de sonido y música" → "Actividades de producción de películas cinematográficas, videos y programas de televisión, grabación de sonido y edición de música"
- **62**: "Programación informática, consultoría y actividades conexas" → "Programación informática, consultoría informática y actividades conexas"

#### Sección K
- **64**: "Actividades de servicios financieros, excepto seguros" → "Actividades de servicios financieros, excepto las de seguros y fondos de pensiones"
- **65**: "Seguros, reaseguros y fondos de pensiones" → "Seguros, reaseguros y fondos de pensiones, excepto planes de seguridad social de afiliación obligatoria"
- **66**: "Actividades auxiliares de servicios financieros y seguros" → "Actividades auxiliares de las actividades de servicios financieros"

#### Sección M
- **69**: "Actividades jurídicas y de contabilidad" → "Actividades jurídicas y contables"
- **70**: "Actividades de oficinas principales; consultoría de gestión" → "Actividades de oficinas centrales; actividades de consultoría en gestión empresarial"
- **71**: "Actividades de arquitectura e ingeniería" → "Actividades de arquitectura e ingeniería; ensayos y análisis técnicos"

#### Sección N
- Label: "Actividades administrativas y servicios de apoyo" → "Actividades de servicios administrativos y de apoyo"
- **79**: "Actividades de agencias de viajes y operadores turísticos" → "Actividades de agencias de viajes, operadores turísticos y otros servicios de reserva"
- **80**: "Actividades de seguridad e investigación" → "Actividades de investigación y seguridad"
- **82**: "Actividades administrativas de oficina y apoyo" → "Actividades administrativas y de apoyo de oficinas y otras actividades de apoyo a empresas"

#### Sección O
- Label: "Administración pública y defensa" → "Administración pública y defensa; planes de seguridad social obligatoria"
- **84**: "Administración pública y defensa; seguridad social obligatoria" → "Administración pública y defensa; planes de seguridad social de afiliación obligatoria"

#### Sección Q
- Label: "Salud humana y asistencia social" → "Actividades de atención de la salud humana y de asistencia social"
- **87**: "Actividades de atención en instituciones residenciales" → "Actividades de atención en instituciones"

#### Sección R
- Label: "Artes, entretenimiento y recreación" → "Actividades artísticas, de entretenimiento y recreativas"
- **90**: "Actividades creativas, artísticas y de entretenimiento" → "Actividades creativas, artísticas y de esparcimiento"
- **91**: "Actividades de bibliotecas, archivos, museos" → "Actividades de bibliotecas, archivos, museos y otras actividades culturales"

#### Sección T
- Label: "Hogares como empleadores" → "Actividades de los hogares como empleadores"
- **97**: "Actividades de hogares como empleadores" → "Actividad de los hogares en calidad de empleadores de personal doméstico"
- **98**: "Actividades de hogares como productores" → "Actividades indiferenciadas de producción de bienes y servicios de los hogares para uso propio"

#### Sección U
- Label: "Actividades de organizaciones extraterritoriales" → "Actividades de organizaciones y órganos extraterritoriales"

## Total de Divisiones
- **88 divisiones** implementadas (códigos 01-03, 05-99, excluyendo 04)
- **21 secciones** (A-U)

## Impacto
✅ Cumplimiento con estándar oficial del BCR Rev. 4.0  
✅ Compatibilidad con requerimientos del Ministerio de Hacienda  
✅ Nomenclatura actualizada y precisa  
✅ Preparado para generación de DTEs  
✅ No requiere cambios en base de datos (campo `giro` ya existe)  
✅ No requiere cambios en lógica de aplicación  

## Notas Técnicas
- El campo en la base de datos (`giro`) almacena el código de 2 dígitos
- Los códigos 04 (Recolección de productos forestales no madereros) y 67 (Actividades auxiliares de las actividades de servicios financieros y de seguros) no están en uso en El Salvador según el catálogo oficial vigente
- La clasificación oficial del BCR incluye niveles más detallados (grupos, clases, subclases) que pueden implementarse en el futuro si se requiere mayor granularidad

## Testing
Para verificar los cambios:
1. Abrir la aplicación
2. Ir a la sección de Clientes
3. Hacer clic en "Agregar Cliente"
4. Desplegar el selector de "Actividad Económica"
5. Verificar que todas las opciones están correctamente etiquetadas y organizadas por sección

## Referencias
- Sitio oficial BCR: https://onec.bcr.gob.sv
- Clasificador de Actividades Económicas: https://onec.bcr.gob.sv/clasificadoresv2/Clasificadores/Index/1?tipo=1
- CIIU Revisión 4.0 (Clasificación Industrial Internacional Uniforme)
