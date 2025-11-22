/**
 * Utilidades para trabajar con la división geográfica de El Salvador
 * Funciones auxiliares que cargan y procesan los datos desde division-geografica.json
 */

const fs = require('fs');
const path = require('path');

// Variable para almacenar los datos cargados
let datosGeograficos = null;

/**
 * Carga los datos geográficos desde el archivo JSON
 * @returns {Object} Datos de departamentos, municipios y distritos
 */
function cargarDatosGeograficos() {
  if (!datosGeograficos) {
    const rutaJSON = path.join(__dirname, 'division-geografica.json');
    const contenido = fs.readFileSync(rutaJSON, 'utf-8');
    datosGeograficos = JSON.parse(contenido);
  }
  return datosGeograficos;
}

/**
 * Obtiene la lista de todos los departamentos
 * @returns {Array} Array de objetos {codigo, nombre}
 */
function getDepartamentos() {
  const datos = cargarDatosGeograficos();
  return datos.departamentos;
}

/**
 * Obtiene los municipios de un departamento
 * @param {string} codigoDepartamento - Código del departamento (ej: "06")
 * @returns {Array} Array de objetos {codigo, nombre}
 */
function getMunicipios(codigoDepartamento) {
  const datos = cargarDatosGeograficos();
  return datos.municipios[codigoDepartamento] || [];
}

/**
 * Obtiene los distritos de un municipio
 * @param {string} codigoMunicipio - Código del municipio (ej: "0601")
 * @returns {Array} Array de objetos {codigo, nombre}
 */
function getDistritos(codigoMunicipio) {
  const datos = cargarDatosGeograficos();
  return datos.distritos[codigoMunicipio] || [];
}

/**
 * Busca un departamento por su código
 * @param {string} codigo - Código del departamento
 * @returns {Object|null} Objeto {codigo, nombre} o null si no se encuentra
 */
function getDepartamentoByCodigo(codigo) {
  const departamentos = getDepartamentos();
  return departamentos.find(d => d.codigo === codigo) || null;
}

/**
 * Busca un municipio por su código
 * @param {string} codigo - Código del municipio (ej: "0601")
 * @returns {Object|null} Objeto {codigo, nombre} o null si no se encuentra
 */
function getMunicipioByCodigo(codigo) {
  const datos = cargarDatosGeograficos();
  const codigoDepartamento = codigo.substring(0, 2);
  const municipios = datos.municipios[codigoDepartamento] || [];
  return municipios.find(m => m.codigo === codigo) || null;
}

/**
 * Busca un distrito por su código
 * @param {string} codigo - Código del distrito (ej: "060114")
 * @returns {Object|null} Objeto {codigo, nombre} o null si no se encuentra
 */
function getDistritoByCodigo(codigo) {
  const datos = cargarDatosGeograficos();
  const codigoMunicipio = codigo.substring(0, 4);
  const distritos = datos.distritos[codigoMunicipio] || [];
  return distritos.find(d => d.codigo === codigo) || null;
}

/**
 * Puebla un elemento select con los departamentos
 * @param {HTMLSelectElement} selectElement - Elemento select del DOM
 * @param {string} valorSeleccionado - Valor a preseleccionar (opcional)
 */
function poblarSelectDepartamentos(selectElement, valorSeleccionado = '') {
  selectElement.innerHTML = '<option value="">Seleccionar departamento</option>';
  const departamentos = getDepartamentos();
  
  departamentos.forEach(dept => {
    const option = document.createElement('option');
    option.value = dept.codigo;
    option.textContent = dept.nombre;
    if (dept.codigo === valorSeleccionado) {
      option.selected = true;
    }
    selectElement.appendChild(option);
  });
}

/**
 * Puebla un elemento select con los municipios de un departamento
 * @param {HTMLSelectElement} selectElement - Elemento select del DOM
 * @param {string} codigoDepartamento - Código del departamento
 * @param {string} valorSeleccionado - Valor a preseleccionar (opcional)
 */
function poblarSelectMunicipios(selectElement, codigoDepartamento, valorSeleccionado = '') {
  selectElement.innerHTML = '<option value="">Seleccionar municipio</option>';
  
  if (!codigoDepartamento) return;
  
  const municipios = getMunicipios(codigoDepartamento);
  
  municipios.forEach(mun => {
    const option = document.createElement('option');
    option.value = mun.codigo;
    option.textContent = mun.nombre;
    if (mun.codigo === valorSeleccionado) {
      option.selected = true;
    }
    selectElement.appendChild(option);
  });
}

/**
 * Puebla un elemento select con los distritos de un municipio
 * @param {HTMLSelectElement} selectElement - Elemento select del DOM
 * @param {string} codigoMunicipio - Código del municipio
 * @param {string} valorSeleccionado - Valor a preseleccionar (opcional)
 */
function poblarSelectDistritos(selectElement, codigoMunicipio, valorSeleccionado = '') {
  selectElement.innerHTML = '<option value="">Seleccionar distrito</option>';
  
  if (!codigoMunicipio) return;
  
  const distritos = getDistritos(codigoMunicipio);
  
  distritos.forEach(dist => {
    const option = document.createElement('option');
    option.value = dist.codigo;
    option.textContent = dist.nombre;
    if (dist.codigo === valorSeleccionado) {
      option.selected = true;
    }
    selectElement.appendChild(option);
  });
}

module.exports = {
  getDepartamentos,
  getMunicipios,
  getDistritos,
  getDepartamentoByCodigo,
  getMunicipioByCodigo,
  getDistritoByCodigo,
  poblarSelectDepartamentos,
  poblarSelectMunicipios,
  poblarSelectDistritos
};
