const path = require('path');
const Ajv = require('ajv');

const schemas = {
  '01': require(path.join(__dirname, '../schemas/fe-fc-v1.json')),
  '03': require(path.join(__dirname, '../schemas/fe-ccf-v3.json')),
  '05': require(path.join(__dirname, '../schemas/fe-nc-v3.json'))
};

class DTEValidator {
  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      jsonPointers: true,
      multipleOfPrecision: 12,
      strict: false
    });

    this.validators = {};
    for (const [tipoDte, schema] of Object.entries(schemas)) {
      this.validators[tipoDte] = this.ajv.compile(schema);
    }
  }

  validar(dte) {
    const tipoDte = dte?.identificacion?.tipoDte;
    const validator = this.validators[tipoDte];

    if (!validator) {
      return {
        valido: true,
        advertencias: [`No hay schema local para validar DTE tipo ${tipoDte || 'desconocido'}.`],
        errores: []
      };
    }

    const valido = validator(dte);
    const errores = this.filtrarErroresNumericos(dte, validator.errors || []);
    return {
      valido: valido || errores.length === 0,
      advertencias: [],
      errores: valido ? [] : this.formatearErrores(errores)
    };
  }

  filtrarErroresNumericos(dte, errors) {
    return errors.filter((error) => {
      if (error.keyword !== 'multipleOf') return true;

      const valor = this.obtenerValorPorRuta(dte, error.dataPath);
      const multipleOf = error.params?.multipleOf;
      if (typeof valor !== 'number' || typeof multipleOf !== 'number') return true;

      const cociente = valor / multipleOf;
      return Math.abs(cociente - Math.round(cociente)) > 1e-6;
    });
  }

  obtenerValorPorRuta(objeto, dataPath) {
    if (!dataPath || dataPath === '/') return objeto;
    return dataPath
      .split('/')
      .filter(Boolean)
      .reduce((valor, segmento) => {
        if (valor === undefined || valor === null) return undefined;
        return valor[segmento];
      }, objeto);
  }

  formatearErrores(errors) {
    return errors.map((error) => {
      const campo = error.dataPath || error.schemaPath || '/';
      const valor = Object.prototype.hasOwnProperty.call(error, 'data')
        ? ` Valor: ${JSON.stringify(error.data)}.`
        : '';
      return `${campo} ${error.message}.${valor}`;
    });
  }
}

module.exports = DTEValidator;
