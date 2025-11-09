// Estado de la aplicación
let state = {
  currentView: 'dashboard',
  clientes: [],
  productos: [],
  facturas: [],
  configuracion: null,
  currentFactura: {
    items: [],
    cliente: null
  }
};

// Municipios oficiales de El Salvador (Actualizado Noviembre 2025)
// Estructura: Departamento → Municipio → Distritos
// Código de 4 dígitos (DDMM) donde DD=Departamento, MM=Municipio
const municipiosPorDepartamento = {
  '01': [ // Ahuachapán
    { codigo: '0101', nombre: 'Ahuachapán Centro' },
    { codigo: '0102', nombre: 'Ahuachapán Norte' },
    { codigo: '0103', nombre: 'Ahuachapán Sur' }
  ],
  '02': [ // Santa Ana
    { codigo: '0201', nombre: 'Santa Ana Centro' },
    { codigo: '0202', nombre: 'Santa Ana Este' },
    { codigo: '0203', nombre: 'Santa Ana Norte' },
    { codigo: '0204', nombre: 'Santa Ana Oeste' }
  ],
  '03': [ // Sonsonate
    { codigo: '0301', nombre: 'Sonsonate Centro' },
    { codigo: '0302', nombre: 'Sonsonate Este' },
    { codigo: '0303', nombre: 'Sonsonate Norte' },
    { codigo: '0304', nombre: 'Sonsonate Oeste' }
  ],
  '04': [ // Chalatenango
    { codigo: '0401', nombre: 'Chalatenango Centro' },
    { codigo: '0402', nombre: 'Chalatenango Norte' },
    { codigo: '0403', nombre: 'Chalatenango Sur' }
  ],
  '05': [ // La Libertad
    { codigo: '0501', nombre: 'La Libertad Centro' },
    { codigo: '0502', nombre: 'La Libertad Costa' },
    { codigo: '0503', nombre: 'La Libertad Este' },
    { codigo: '0504', nombre: 'La Libertad Norte' },
    { codigo: '0505', nombre: 'La Libertad Oeste' },
    { codigo: '0506', nombre: 'La Libertad Sur' }
  ],
  '06': [ // San Salvador
    { codigo: '0601', nombre: 'San Salvador Centro' },
    { codigo: '0602', nombre: 'San Salvador Este' },
    { codigo: '0603', nombre: 'San Salvador Norte' },
    { codigo: '0604', nombre: 'San Salvador Oeste' },
    { codigo: '0605', nombre: 'San Salvador Sur' }
  ],
  '07': [ // Cuscatlán
    { codigo: '0701', nombre: 'Cuscatlán Norte' },
    { codigo: '0702', nombre: 'Cuscatlán Sur' }
  ],
  '08': [ // La Paz
    { codigo: '0801', nombre: 'La Paz Centro' },
    { codigo: '0802', nombre: 'La Paz Este' },
    { codigo: '0803', nombre: 'La Paz Oeste' }
  ],
  '09': [ // Cabañas
    { codigo: '0901', nombre: 'Cabañas Este' },
    { codigo: '0902', nombre: 'Cabañas Oeste' }
  ],
  '10': [ // San Vicente
    { codigo: '1001', nombre: 'San Vicente Norte' },
    { codigo: '1002', nombre: 'San Vicente Sur' }
  ],
  '11': [ // Usulután
    { codigo: '1101', nombre: 'Usulután Este' },
    { codigo: '1102', nombre: 'Usulután Norte' },
    { codigo: '1103', nombre: 'Usulután Oeste' }
  ],
  '12': [ // San Miguel
    { codigo: '1201', nombre: 'San Miguel Centro' },
    { codigo: '1202', nombre: 'San Miguel Norte' },
    { codigo: '1203', nombre: 'San Miguel Oeste' }
  ],
  '13': [ // Morazán
    { codigo: '1301', nombre: 'Morazán Norte' },
    { codigo: '1302', nombre: 'Morazán Sur' }
  ],
  '14': [ // La Unión
    { codigo: '1401', nombre: 'La Unión Norte' },
    { codigo: '1402', nombre: 'La Unión Sur' }
  ]
};

// Distritos por Municipio (Antiguos Municipios ahora son Distritos)
// Estructura: codigoCarga (4 dígitos), codigoDistrito (6 dígitos), nombre
// El código de carga agentes es el código que se usa para identificar el distrito
const distritosPorMunicipio = {
  // Ahuachapán Centro (0101)
  '0101': [
    { codigoCarga: '0101', codigoDistrito: '010101', nombre: 'Ahuachapán' },
    { codigoCarga: '0102', codigoDistrito: '010102', nombre: 'Apaneca' },
    { codigoCarga: '0104', codigoDistrito: '010104', nombre: 'Concepción de Ataco' },
    { codigoCarga: '0111', codigoDistrito: '010111', nombre: 'Tacuba' }
  ],
  // Ahuachapán Norte (0102)
  '0102': [
    { codigoCarga: '0103', codigoDistrito: '010203', nombre: 'Atiquizaya' },
    { codigoCarga: '0105', codigoDistrito: '010205', nombre: 'El Refugio' },
    { codigoCarga: '0109', codigoDistrito: '010209', nombre: 'San Lorenzo' },
    { codigoCarga: '0112', codigoDistrito: '010212', nombre: 'Turín' }
  ],
  // Ahuachapán Sur (0103)
  '0103': [
    { codigoCarga: '0106', codigoDistrito: '010306', nombre: 'Guaymango' },
    { codigoCarga: '0107', codigoDistrito: '010307', nombre: 'Jujutla' },
    { codigoCarga: '0108', codigoDistrito: '010308', nombre: 'San Francisco Menéndez' },
    { codigoCarga: '0110', codigoDistrito: '010310', nombre: 'San Pedro Puxtla' }
  ],
  // Santa Ana Centro (0201)
  '0201': [
    { codigoCarga: '0210', codigoDistrito: '020110', nombre: 'Santa Ana' }
  ],
  // Santa Ana Este (0202)
  '0202': [
    { codigoCarga: '0202', codigoDistrito: '020202', nombre: 'Coatepeque' },
    { codigoCarga: '0204', codigoDistrito: '020204', nombre: 'El Congo' }
  ],
  // Santa Ana Norte (0203)
  '0203': [
    { codigoCarga: '0206', codigoDistrito: '020306', nombre: 'Masahuat' },
    { codigoCarga: '0207', codigoDistrito: '020307', nombre: 'Metapán' },
    { codigoCarga: '0211', codigoDistrito: '020311', nombre: 'Santa Rosa Guachipilín' },
    { codigoCarga: '0213', codigoDistrito: '020313', nombre: 'Texistepeque' }
  ],
  // Santa Ana Oeste (0204)
  '0204': [
    { codigoCarga: '0201', codigoDistrito: '020401', nombre: 'Candelaria de la Frontera' },
    { codigoCarga: '0203', codigoDistrito: '020403', nombre: 'Chalchuapa' },
    { codigoCarga: '0205', codigoDistrito: '020405', nombre: 'El Porvenir' },
    { codigoCarga: '0208', codigoDistrito: '020408', nombre: 'San Antonio Pajonal' },
    { codigoCarga: '0209', codigoDistrito: '020409', nombre: 'San Sebastián Salitrillo' },
    { codigoCarga: '0212', codigoDistrito: '020412', nombre: 'Santiago de la Frontera' }
  ],
  // Sonsonate Centro (0301)
  '0301': [
    { codigoCarga: '0309', codigoDistrito: '030109', nombre: 'Nahulingo' },
    { codigoCarga: '0311', codigoDistrito: '030111', nombre: 'San Antonio del Monte' },
    { codigoCarga: '0314', codigoDistrito: '030114', nombre: 'Santo Domingo de Guzmán' },
    { codigoCarga: '0315', codigoDistrito: '030115', nombre: 'Sonsonate' },
    { codigoCarga: '0316', codigoDistrito: '030116', nombre: 'Sonzacate' }
  ],
  // Sonsonate Este (0302)
  '0302': [
    { codigoCarga: '0302', codigoDistrito: '030202', nombre: 'Armenia' },
    { codigoCarga: '0303', codigoDistrito: '030203', nombre: 'Caluco' },
    { codigoCarga: '0304', codigoDistrito: '030204', nombre: 'Cuisnahuat' },
    { codigoCarga: '0305', codigoDistrito: '030205', nombre: 'Santa Isabel Ishuatán' },
    { codigoCarga: '0306', codigoDistrito: '030206', nombre: 'Izalco' },
    { codigoCarga: '0312', codigoDistrito: '030212', nombre: 'San Julián' }
  ],
  // Sonsonate Norte (0303)
  '0303': [
    { codigoCarga: '0307', codigoDistrito: '030307', nombre: 'Juayúa' },
    { codigoCarga: '0308', codigoDistrito: '030308', nombre: 'Nahuizalco' },
    { codigoCarga: '0310', codigoDistrito: '030310', nombre: 'Salcoatitán' },
    { codigoCarga: '0313', codigoDistrito: '030313', nombre: 'Santa Catarina Masahuat' }
  ],
  // Sonsonate Oeste (0304)
  '0304': [
    { codigoCarga: '0301', codigoDistrito: '030401', nombre: 'Acajutla' }
  ],
  // Chalatenango Centro (0401)
  '0401': [
    { codigoCarga: '0401', codigoDistrito: '040101', nombre: 'Agua Caliente' },
    { codigoCarga: '0408', codigoDistrito: '040108', nombre: 'Dulce Nombre de María' },
    { codigoCarga: '0410', codigoDistrito: '040110', nombre: 'El Paraíso' },
    { codigoCarga: '0413', codigoDistrito: '040113', nombre: 'La Reina' },
    { codigoCarga: '0416', codigoDistrito: '040116', nombre: 'Nueva Concepción' },
    { codigoCarga: '0422', codigoDistrito: '040122', nombre: 'San Fernando' },
    { codigoCarga: '0424', codigoDistrito: '040124', nombre: 'San Francisco Morazán' },
    { codigoCarga: '0431', codigoDistrito: '040131', nombre: 'San Rafael' },
    { codigoCarga: '0432', codigoDistrito: '040132', nombre: 'Santa Rita' },
    { codigoCarga: '0433', codigoDistrito: '040133', nombre: 'Tejutla' }
  ],
  // Chalatenango Norte (0402)
  '0402': [
    { codigoCarga: '0404', codigoDistrito: '040204', nombre: 'Citalá' },
    { codigoCarga: '0425', codigoDistrito: '040225', nombre: 'San Ignacio' },
    { codigoCarga: '0412', codigoDistrito: '040212', nombre: 'La Palma' }
  ],
  // Chalatenango Sur (0403)
  '0403': [
    { codigoCarga: '0402', codigoDistrito: '040302', nombre: 'Arcatao' },
    { codigoCarga: '0403', codigoDistrito: '040303', nombre: 'Azacualpa' },
    { codigoCarga: '0405', codigoDistrito: '040305', nombre: 'Comalapa' },
    { codigoCarga: '0406', codigoDistrito: '040306', nombre: 'Concepción Quezaltepeque' },
    { codigoCarga: '0407', codigoDistrito: '040307', nombre: 'Chalatenango' },
    { codigoCarga: '0409', codigoDistrito: '040309', nombre: 'El Carrizal' },
    { codigoCarga: '0411', codigoDistrito: '040311', nombre: 'La Laguna' },
    { codigoCarga: '0414', codigoDistrito: '040314', nombre: 'Las Vueltas' },
    { codigoCarga: '0415', codigoDistrito: '040315', nombre: 'Nombre de Jesús' },
    { codigoCarga: '0417', codigoDistrito: '040317', nombre: 'Nueva Trinidad' },
    { codigoCarga: '0418', codigoDistrito: '040318', nombre: 'Ojos de Agua' },
    { codigoCarga: '0419', codigoDistrito: '040319', nombre: 'Potonico' },
    { codigoCarga: '0420', codigoDistrito: '040320', nombre: 'San Antonio de la Cruz' },
    { codigoCarga: '0421', codigoDistrito: '040321', nombre: 'San Antonio Los Ranchos' },
    { codigoCarga: '0426', codigoDistrito: '040326', nombre: 'San Isidro Labrador' },
    { codigoCarga: '0423', codigoDistrito: '040323', nombre: 'San Francisco Lempa' },
    { codigoCarga: '0427', codigoDistrito: '040327', nombre: 'San José Cancasque' },
    { codigoCarga: '0428', codigoDistrito: '040328', nombre: 'San José Las Flores' },
    { codigoCarga: '0429', codigoDistrito: '040329', nombre: 'San Luis del Carmen' },
    { codigoCarga: '0430', codigoDistrito: '040330', nombre: 'San Miguel de Mercedes' }
  ],
  // La Libertad Centro (0501)
  '0501': [
    { codigoCarga: '0502', codigoDistrito: '050102', nombre: 'Ciudad Arce' },
    { codigoCarga: '0515', codigoDistrito: '050115', nombre: 'San Juan Opico' }
  ],
  // La Libertad Costa (0502)
  '0502': [
    { codigoCarga: '0505', codigoDistrito: '050205', nombre: 'Chiltiupán' },
    { codigoCarga: '0508', codigoDistrito: '050208', nombre: 'Jicalapa' },
    { codigoCarga: '0509', codigoDistrito: '050209', nombre: 'La Libertad' },
    { codigoCarga: '0518', codigoDistrito: '050218', nombre: 'Tamanique' },
    { codigoCarga: '0520', codigoDistrito: '050220', nombre: 'Teotepeque' }
  ],
  // La Libertad Este (0503)
  '0503': [
    { codigoCarga: '0501', codigoDistrito: '050301', nombre: 'Antiguo Cuscatlán' },
    { codigoCarga: '0506', codigoDistrito: '050306', nombre: 'Huizúcar' },
    { codigoCarga: '0510', codigoDistrito: '050310', nombre: 'Nuevo Cuscatlán' },
    { codigoCarga: '0514', codigoDistrito: '050314', nombre: 'San José Villanueva' },
    { codigoCarga: '0522', codigoDistrito: '050322', nombre: 'Zaragoza' }
  ],
  // La Libertad Norte (0504)
  '0504': [
    { codigoCarga: '0512', codigoDistrito: '050412', nombre: 'Quezaltepeque' },
    { codigoCarga: '0516', codigoDistrito: '050416', nombre: 'San Matías' },
    { codigoCarga: '0517', codigoDistrito: '050417', nombre: 'San Pablo Tacachico' }
  ],
  // La Libertad Oeste (0505)
  '0505': [
    { codigoCarga: '0503', codigoDistrito: '050503', nombre: 'Colón' },
    { codigoCarga: '0507', codigoDistrito: '050507', nombre: 'Jayaque' },
    { codigoCarga: '0513', codigoDistrito: '050513', nombre: 'Sacacoyo' },
    { codigoCarga: '0519', codigoDistrito: '050519', nombre: 'Talnique' },
    { codigoCarga: '0521', codigoDistrito: '050521', nombre: 'Tepecoyo' }
  ],
  // La Libertad Sur (0506)
  '0506': [
    { codigoCarga: '0504', codigoDistrito: '050604', nombre: 'Comasagua' },
    { codigoCarga: '0511', codigoDistrito: '050611', nombre: 'Santa Tecla' }
  ],
  // San Salvador Centro (0601)
  '0601': [
    { codigoCarga: '0603', codigoDistrito: '060103', nombre: 'Ayutuxtepeque' },
    { codigoCarga: '0604', codigoDistrito: '060104', nombre: 'Cuscatancingo' },
    { codigoCarga: '0608', codigoDistrito: '060108', nombre: 'Mejicanos' },
    { codigoCarga: '0614', codigoDistrito: '060114', nombre: 'San Salvador' },
    { codigoCarga: '0619', codigoDistrito: '060119', nombre: 'Ciudad Delgado' }
  ],
  // San Salvador Este (0602)
  '0602': [
    { codigoCarga: '0607', codigoDistrito: '060207', nombre: 'Ilopango' },
    { codigoCarga: '0613', codigoDistrito: '060213', nombre: 'San Martín' },
    { codigoCarga: '0617', codigoDistrito: '060217', nombre: 'Soyapango' },
    { codigoCarga: '0618', codigoDistrito: '060218', nombre: 'Tonacatepeque' }
  ],
  // San Salvador Norte (0603)
  '0603': [
    { codigoCarga: '0601', codigoDistrito: '060301', nombre: 'Aguilares' },
    { codigoCarga: '0605', codigoDistrito: '060305', nombre: 'El Paisnal' },
    { codigoCarga: '0606', codigoDistrito: '060306', nombre: 'Guazapa' }
  ],
  // San Salvador Oeste (0604)
  '0604': [
    { codigoCarga: '0602', codigoDistrito: '060402', nombre: 'Apopa' },
    { codigoCarga: '0609', codigoDistrito: '060409', nombre: 'Nejapa' }
  ],
  // San Salvador Sur (0605)
  '0605': [
    { codigoCarga: '0610', codigoDistrito: '060510', nombre: 'Panchimalco' },
    { codigoCarga: '0611', codigoDistrito: '060511', nombre: 'Rosario de Mora' },
    { codigoCarga: '0612', codigoDistrito: '060512', nombre: 'San Marcos' },
    { codigoCarga: '0615', codigoDistrito: '060515', nombre: 'Santiago Texacuangos' },
    { codigoCarga: '0616', codigoDistrito: '060516', nombre: 'Santo Tomás' }
  ],
  // Cuscatlán Norte (0701)
  '0701': [
    { codigoCarga: '0706', codigoDistrito: '070106', nombre: 'Oratorio de Concepción' },
    { codigoCarga: '0707', codigoDistrito: '070107', nombre: 'San Bartolomé Perulapía' },
    { codigoCarga: '0709', codigoDistrito: '070109', nombre: 'San José Guayabal' },
    { codigoCarga: '0710', codigoDistrito: '070110', nombre: 'San Pedro Perulapán' },
    { codigoCarga: '0715', codigoDistrito: '070115', nombre: 'Suchitoto' }
  ],
  // Cuscatlán Sur (0702)
  '0702': [
    { codigoCarga: '0701', codigoDistrito: '070201', nombre: 'Candelaria' },
    { codigoCarga: '0702', codigoDistrito: '070202', nombre: 'Cojutepeque' },
    { codigoCarga: '0703', codigoDistrito: '070203', nombre: 'El Carmen' },
    { codigoCarga: '0704', codigoDistrito: '070204', nombre: 'El Rosario' },
    { codigoCarga: '0705', codigoDistrito: '070205', nombre: 'Monte San Juan' },
    { codigoCarga: '0708', codigoDistrito: '070208', nombre: 'San Cristóbal' },
    { codigoCarga: '0711', codigoDistrito: '070211', nombre: 'San Rafael Cedros' },
    { codigoCarga: '0712', codigoDistrito: '070212', nombre: 'San Ramón' },
    { codigoCarga: '0713', codigoDistrito: '070213', nombre: 'Santa Cruz Analquito' },
    { codigoCarga: '0714', codigoDistrito: '070214', nombre: 'Santa Cruz Michapa' },
    { codigoCarga: '0716', codigoDistrito: '070216', nombre: 'Tenancingo' }
  ],
  // La Paz Centro (0801)
  '0801': [
    { codigoCarga: '0802', codigoDistrito: '080102', nombre: 'El Rosario' },
    { codigoCarga: '0803', codigoDistrito: '080103', nombre: 'Jerusalén' },
    { codigoCarga: '0804', codigoDistrito: '080104', nombre: 'Mercedes La Ceiba' },
    { codigoCarga: '0806', codigoDistrito: '080106', nombre: 'Paraíso de Osorio' },
    { codigoCarga: '0807', codigoDistrito: '080107', nombre: 'San Antonio Masahuat' },
    { codigoCarga: '0808', codigoDistrito: '080108', nombre: 'San Emigdio' },
    { codigoCarga: '0812', codigoDistrito: '080112', nombre: 'San Juan Tepezontes' },
    { codigoCarga: '0814', codigoDistrito: '080114', nombre: 'San Miguel Tepezontes' },
    { codigoCarga: '0816', codigoDistrito: '080116', nombre: 'San Pedro Nonualco' },
    { codigoCarga: '0818', codigoDistrito: '080118', nombre: 'Santa María Ostuma' },
    { codigoCarga: '0819', codigoDistrito: '080119', nombre: 'Santiago Nonualco' },
    { codigoCarga: '0822', codigoDistrito: '080122', nombre: 'San Luis La Herradura' }
  ],
  // La Paz Este (0802)
  '0802': [
    { codigoCarga: '0810', codigoDistrito: '080210', nombre: 'San Juan Nonualco' },
    { codigoCarga: '0817', codigoDistrito: '080217', nombre: 'San Rafael Obrajuelo' },
    { codigoCarga: '0821', codigoDistrito: '080221', nombre: 'Zacatecoluca' }
  ],
  // La Paz Oeste (0803)
  '0803': [
    { codigoCarga: '0801', codigoDistrito: '080301', nombre: 'Cuyultitán' },
    { codigoCarga: '0805', codigoDistrito: '080305', nombre: 'Olocuilta' },
    { codigoCarga: '0809', codigoDistrito: '080309', nombre: 'San Francisco Chinameca' },
    { codigoCarga: '0811', codigoDistrito: '080311', nombre: 'San Juan Talpa' },
    { codigoCarga: '0813', codigoDistrito: '080313', nombre: 'San Luis Talpa' },
    { codigoCarga: '0815', codigoDistrito: '080315', nombre: 'San Pedro Masahuat' },
    { codigoCarga: '0820', codigoDistrito: '080320', nombre: 'Tapalhuaca' }
  ],
  // Cabañas Este (0901)
  '0901': [
    { codigoCarga: '0909', codigoDistrito: '090109', nombre: 'Dolores' },
    { codigoCarga: '0902', codigoDistrito: '090102', nombre: 'Guacotecti' },
    { codigoCarga: '0905', codigoDistrito: '090105', nombre: 'San Isidro' },
    { codigoCarga: '0906', codigoDistrito: '090106', nombre: 'Sensuntepeque' },
    { codigoCarga: '0908', codigoDistrito: '090108', nombre: 'Victoria' }
  ],
  // Cabañas Oeste (0902)
  '0902': [
    { codigoCarga: '0901', codigoDistrito: '090201', nombre: 'Cinquera' },
    { codigoCarga: '0903', codigoDistrito: '090203', nombre: 'Ilobasco' },
    { codigoCarga: '0904', codigoDistrito: '090204', nombre: 'Jutiapa' },
    { codigoCarga: '0907', codigoDistrito: '090207', nombre: 'Tejutepeque' }
  ],
  // San Vicente Norte (1001)
  '1001': [
    { codigoCarga: '1001', codigoDistrito: '100101', nombre: 'Apastepeque' },
    { codigoCarga: '1006', codigoDistrito: '100106', nombre: 'San Esteban Catarina' },
    { codigoCarga: '1007', codigoDistrito: '100107', nombre: 'San Ildefonso' },
    { codigoCarga: '1008', codigoDistrito: '100108', nombre: 'San Lorenzo' },
    { codigoCarga: '1009', codigoDistrito: '100109', nombre: 'San Sebastián' },
    { codigoCarga: '1004', codigoDistrito: '100104', nombre: 'Santa Clara' },
    { codigoCarga: '1005', codigoDistrito: '100105', nombre: 'Santo Domingo' }
  ],
  // San Vicente Sur (1002)
  '1002': [
    { codigoCarga: '1002', codigoDistrito: '100202', nombre: 'Guadalupe' },
    { codigoCarga: '1003', codigoDistrito: '100203', nombre: 'San Cayetano Istepeque' },
    { codigoCarga: '1010', codigoDistrito: '100210', nombre: 'San Vicente' },
    { codigoCarga: '1011', codigoDistrito: '100211', nombre: 'Tecoluca' },
    { codigoCarga: '1012', codigoDistrito: '100212', nombre: 'Tepetitán' },
    { codigoCarga: '1013', codigoDistrito: '100213', nombre: 'Verapaz' }
  ],
  // Usulután Este (1101)
  '1101': [
    { codigoCarga: '1103', codigoDistrito: '110103', nombre: 'California' },
    { codigoCarga: '1104', codigoDistrito: '110104', nombre: 'Concepción Batres' },
    { codigoCarga: '1106', codigoDistrito: '110106', nombre: 'Ereguayquín' },
    { codigoCarga: '1110', codigoDistrito: '110110', nombre: 'Jucuarán' },
    { codigoCarga: '1113', codigoDistrito: '110113', nombre: 'Ozatlán' },
    { codigoCarga: '1123', codigoDistrito: '110123', nombre: 'Usulután' },
    { codigoCarga: '1117', codigoDistrito: '110117', nombre: 'San Dionisio' },
    { codigoCarga: '1118', codigoDistrito: '110118', nombre: 'Santa Elena' },
    { codigoCarga: '1120', codigoDistrito: '110120', nombre: 'Santa María' },
    { codigoCarga: '1122', codigoDistrito: '110122', nombre: 'Tecapán' }
  ],
  // Usulután Norte (1102)
  '1102': [
    { codigoCarga: '1101', codigoDistrito: '110201', nombre: 'Alegría' },
    { codigoCarga: '1102', codigoDistrito: '110202', nombre: 'Berlín' },
    { codigoCarga: '1105', codigoDistrito: '110205', nombre: 'El Triunfo' },
    { codigoCarga: '1107', codigoDistrito: '110207', nombre: 'Estanzuelas' },
    { codigoCarga: '1109', codigoDistrito: '110209', nombre: 'Jucuapa' },
    { codigoCarga: '1111', codigoDistrito: '110211', nombre: 'Mercedes Umaña' },
    { codigoCarga: '1112', codigoDistrito: '110212', nombre: 'Nueva Granada' },
    { codigoCarga: '1116', codigoDistrito: '110216', nombre: 'San Buenaventura' },
    { codigoCarga: '1121', codigoDistrito: '110221', nombre: 'Santiago de María' }
  ],
  // Usulután Oeste (1103)
  '1103': [
    { codigoCarga: '1108', codigoDistrito: '110308', nombre: 'Jiquilisco' },
    { codigoCarga: '1114', codigoDistrito: '110314', nombre: 'Puerto El Triunfo' },
    { codigoCarga: '1115', codigoDistrito: '110315', nombre: 'San Agustín' },
    { codigoCarga: '1119', codigoDistrito: '110319', nombre: 'San Francisco Javier' }
  ],
  // San Miguel Centro (1201)
  '1201': [
    { codigoCarga: '1203', codigoDistrito: '120103', nombre: 'Comacarán' },
    { codigoCarga: '1209', codigoDistrito: '120109', nombre: 'Moncagua' },
    { codigoCarga: '1206', codigoDistrito: '120106', nombre: 'Chirilagua' },
    { codigoCarga: '1212', codigoDistrito: '120112', nombre: 'Quelepa' },
    { codigoCarga: '1217', codigoDistrito: '120117', nombre: 'San Miguel' },
    { codigoCarga: '1220', codigoDistrito: '120120', nombre: 'Uluazapa' }
  ],
  // San Miguel Norte (1202)
  '1202': [
    { codigoCarga: '1201', codigoDistrito: '120201', nombre: 'Carolina' },
    { codigoCarga: '1202', codigoDistrito: '120202', nombre: 'Ciudad Barrios' },
    { codigoCarga: '1204', codigoDistrito: '120204', nombre: 'Chapeltique' },
    { codigoCarga: '1211', codigoDistrito: '120211', nombre: 'Nuevo Edén de San Juan' },
    { codigoCarga: '1213', codigoDistrito: '120213', nombre: 'San Antonio del Mosco' },
    { codigoCarga: '1214', codigoDistrito: '120214', nombre: 'San Gerardo' },
    { codigoCarga: '1216', codigoDistrito: '120216', nombre: 'San Luis de la Reina' },
    { codigoCarga: '1219', codigoDistrito: '120219', nombre: 'Sesori' }
  ],
  // San Miguel Oeste (1203)
  '1203': [
    { codigoCarga: '1205', codigoDistrito: '120305', nombre: 'Chinameca' },
    { codigoCarga: '1207', codigoDistrito: '120307', nombre: 'El Tránsito' },
    { codigoCarga: '1208', codigoDistrito: '120308', nombre: 'Lolotique' },
    { codigoCarga: '1210', codigoDistrito: '120310', nombre: 'Nueva Guadalupe' },
    { codigoCarga: '1215', codigoDistrito: '120315', nombre: 'San Jorge' },
    { codigoCarga: '1218', codigoDistrito: '120318', nombre: 'San Rafael Oriente' }
  ],
  // Morazán Norte (1301)
  '1301': [
    { codigoCarga: '1301', codigoDistrito: '130101', nombre: 'Arambala' },
    { codigoCarga: '1302', codigoDistrito: '130102', nombre: 'Cacaopera' },
    { codigoCarga: '1303', codigoDistrito: '130103', nombre: 'Corinto' },
    { codigoCarga: '1307', codigoDistrito: '130107', nombre: 'El Rosario' },
    { codigoCarga: '1310', codigoDistrito: '130110', nombre: 'Joateca' },
    { codigoCarga: '1311', codigoDistrito: '130111', nombre: 'Jocoaitique' },
    { codigoCarga: '1314', codigoDistrito: '130114', nombre: 'Meanguera' },
    { codigoCarga: '1316', codigoDistrito: '130116', nombre: 'Perquín' },
    { codigoCarga: '1318', codigoDistrito: '130118', nombre: 'San Fernando' },
    { codigoCarga: '1320', codigoDistrito: '130120', nombre: 'San Isidro' },
    { codigoCarga: '1324', codigoDistrito: '130124', nombre: 'Torola' }
  ],
  // Morazán Sur (1302)
  '1302': [
    { codigoCarga: '1304', codigoDistrito: '130204', nombre: 'Chilanga' },
    { codigoCarga: '1305', codigoDistrito: '130205', nombre: 'Delicias de Concepción' },
    { codigoCarga: '1306', codigoDistrito: '130206', nombre: 'El Divisadero' },
    { codigoCarga: '1308', codigoDistrito: '130208', nombre: 'Gualococti' },
    { codigoCarga: '1309', codigoDistrito: '130209', nombre: 'Guatajiagua' },
    { codigoCarga: '1312', codigoDistrito: '130212', nombre: 'Jocoro' },
    { codigoCarga: '1313', codigoDistrito: '130213', nombre: 'Lolotiquillo' },
    { codigoCarga: '1315', codigoDistrito: '130215', nombre: 'Osicala' },
    { codigoCarga: '1317', codigoDistrito: '130217', nombre: 'San Carlos' },
    { codigoCarga: '1319', codigoDistrito: '130219', nombre: 'San Francisco Gotera' },
    { codigoCarga: '1321', codigoDistrito: '130221', nombre: 'San Simón' },
    { codigoCarga: '1322', codigoDistrito: '130222', nombre: 'Sensembra' },
    { codigoCarga: '1323', codigoDistrito: '130223', nombre: 'Sociedad' },
    { codigoCarga: '1325', codigoDistrito: '130225', nombre: 'Yamabal' },
    { codigoCarga: '1326', codigoDistrito: '130226', nombre: 'Yoloaiquín' }
  ],
  // La Unión Norte (1401)
  '1401': [
    { codigoCarga: '1401', codigoDistrito: '140101', nombre: 'Anamorós' },
    { codigoCarga: '1402', codigoDistrito: '140102', nombre: 'Bolívar' },
    { codigoCarga: '1403', codigoDistrito: '140103', nombre: 'Concepción de Oriente' },
    { codigoCarga: '1406', codigoDistrito: '140106', nombre: 'El Sauce' },
    { codigoCarga: '1409', codigoDistrito: '140109', nombre: 'Lislique' },
    { codigoCarga: '1411', codigoDistrito: '140111', nombre: 'Nueva Esparta' },
    { codigoCarga: '1412', codigoDistrito: '140112', nombre: 'Pasaquina' },
    { codigoCarga: '1413', codigoDistrito: '140113', nombre: 'Polorós' },
    { codigoCarga: '1415', codigoDistrito: '140115', nombre: 'San José La Fuente' },
    { codigoCarga: '1416', codigoDistrito: '140116', nombre: 'Santa Rosa de Lima' }
  ],
  // La Unión Sur (1402)
  '1402': [
    { codigoCarga: '1404', codigoDistrito: '140204', nombre: 'Conchagua' },
    { codigoCarga: '1405', codigoDistrito: '140205', nombre: 'El Carmen' },
    { codigoCarga: '1407', codigoDistrito: '140207', nombre: 'Intipucá' },
    { codigoCarga: '1408', codigoDistrito: '140208', nombre: 'La Unión' },
    { codigoCarga: '1410', codigoDistrito: '140210', nombre: 'Meanguera del Golfo' },
    { codigoCarga: '1414', codigoDistrito: '140214', nombre: 'San Alejo' },
    { codigoCarga: '1417', codigoDistrito: '140217', nombre: 'Yayantique' },
    { codigoCarga: '1418', codigoDistrito: '140218', nombre: 'Yucuaiquín' }
  ]
};

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Aplicación iniciada');
  
  // Configurar navegación
  setupNavigation();
  
  // Cargar datos iniciales
  await loadInitialData();
  
  // Configurar event listeners
  setupEventListeners();
  
  // Actualizar dashboard
  updateDashboard();
  
  // Configurar cambio de departamento para cargar municipios
  setupDepartamentoMunicipioHandler();
  setupDepartamentoMunicipioConfigHandler();
});

// Configurar navegación
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      switchView(view);
      
      // Actualizar estado activo
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

// Cambiar vista
function switchView(viewName) {
  // Ocultar todas las vistas
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  
  // Mostrar vista seleccionada
  const targetView = document.getElementById(`${viewName}-view`);
  if (targetView) {
    targetView.classList.add('active');
    state.currentView = viewName;
    
    // Actualizar título
    const titles = {
      'dashboard': 'Dashboard',
      'nueva-factura': 'Nueva Factura',
      'facturas': 'Facturas',
      'clientes': 'Clientes',
      'productos': 'Productos',
      'configuracion': 'Configuración'
    };
    document.getElementById('view-title').textContent = titles[viewName] || viewName;
    
    // Cargar datos según la vista
    loadViewData(viewName);
  }
}

// Cargar datos de la vista
async function loadViewData(viewName) {
  switch(viewName) {
    case 'facturas':
      await loadFacturas();
      break;
    case 'clientes':
      await loadClientes();
      break;
    case 'productos':
      await loadProductos();
      break;
    case 'configuracion':
      await loadConfiguracion();
      break;
    case 'nueva-factura':
      await loadClientesSelect();
      await loadProductosSelect();
      break;
  }
}

// Cargar datos iniciales
async function loadInitialData() {
  try {
    state.clientes = await window.electronAPI.getClientes();
    state.productos = await window.electronAPI.getProductos();
    state.facturas = await window.electronAPI.getFacturas({});
    state.configuracion = await window.electronAPI.getConfiguracion();
    
    console.log('Datos iniciales cargados', state);
  } catch (error) {
    console.error('Error cargando datos iniciales:', error);
    showNotification('Error al cargar datos', 'error');
  }
}

// Actualizar dashboard
function updateDashboard() {
  const hoy = new Date().toISOString().split('T')[0];
  const facturasHoy = state.facturas.filter(f => f.fecha_emision?.startsWith(hoy));
  
  const totalHoy = facturasHoy.reduce((sum, f) => sum + (f.total || 0), 0);
  const enviadas = state.facturas.filter(f => f.estado === 'ENVIADO' || f.estado === 'ACEPTADO').length;
  const pendientes = state.facturas.filter(f => f.estado === 'PENDIENTE').length;
  
  document.getElementById('facturas-hoy').textContent = facturasHoy.length;
  document.getElementById('total-hoy').textContent = formatCurrency(totalHoy);
  document.getElementById('enviadas-hacienda').textContent = enviadas;
  document.getElementById('pendientes').textContent = pendientes;
  
  // Tabla de recientes
  const tbody = document.querySelector('#tabla-recientes tbody');
  if (state.facturas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay facturas recientes</td></tr>';
  } else {
    const recientes = state.facturas.slice(0, 10);
    tbody.innerHTML = recientes.map(f => {
      const clienteData = JSON.parse(f.cliente_datos || '{}');
      return `
        <tr>
          <td>${formatDate(f.fecha_emision)}</td>
          <td>${f.numero_control || 'N/A'}</td>
          <td>${clienteData.nombre || 'N/A'}</td>
          <td>${formatCurrency(f.total)}</td>
          <td><span class="badge badge-${getEstadoBadgeClass(f.estado)}">${f.estado}</span></td>
        </tr>
      `;
    }).join('');
  }
}

// Cargar facturas
async function loadFacturas() {
  try {
    state.facturas = await window.electronAPI.getFacturas({});
    const tbody = document.querySelector('#tabla-facturas tbody');
    
    if (state.facturas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay facturas</td></tr>';
    } else {
      tbody.innerHTML = state.facturas.map(f => {
        const clienteData = JSON.parse(f.cliente_datos || '{}');
        return `
          <tr>
            <td>${formatDate(f.fecha_emision)}</td>
            <td>${f.numero_control || 'N/A'}</td>
            <td>${clienteData.nombre || 'N/A'}</td>
            <td>${formatCurrency(f.total)}</td>
            <td><span class="badge badge-${getEstadoBadgeClass(f.estado)}">${f.estado}</span></td>
            <td>
              <button class="btn btn-small btn-primary" onclick="verFactura(${f.id})">Ver</button>
              ${f.estado === 'PENDIENTE' ? `<button class="btn btn-small btn-success" onclick="enviarFactura(${f.id})">Enviar</button>` : ''}
            </td>
          </tr>
        `;
      }).join('');
    }
  } catch (error) {
    console.error('Error cargando facturas:', error);
    showNotification('Error al cargar facturas', 'error');
  }
}

// Cargar clientes
async function loadClientes() {
  try {
    state.clientes = await window.electronAPI.getClientes();
    const tbody = document.querySelector('#tabla-clientes tbody');
    
    if (state.clientes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay clientes</td></tr>';
    } else {
      tbody.innerHTML = state.clientes.map(c => {
        // Construir información de ubicación
        let ubicacion = '';
        if (c.distrito) {
          const nombreDistrito = obtenerNombreDistrito(c.distrito);
          ubicacion = nombreDistrito;
        } else if (c.municipio && c.departamento) {
          const nombreMunicipio = obtenerNombreMunicipio(c.departamento, c.municipio);
          ubicacion = nombreMunicipio;
        } else if (c.departamento) {
          const deptos = {
            '01': 'Ahuachapán', '02': 'Santa Ana', '03': 'Sonsonate',
            '04': 'Chalatenango', '05': 'La Libertad', '06': 'San Salvador',
            '07': 'Cuscatlán', '08': 'La Paz', '09': 'Cabañas',
            '10': 'San Vicente', '11': 'Usulután', '12': 'San Miguel',
            '13': 'Morazán', '14': 'La Unión'
          };
          ubicacion = deptos[c.departamento] || c.departamento;
        } else {
          ubicacion = 'N/A';
        }
        
        return `
          <tr>
            <td>${c.numero_documento}</td>
            <td>${c.nrc || 'N/A'}</td>
            <td>${c.nombre}</td>
            <td>${c.tipo_persona || 'N/A'}</td>
            <td>${ubicacion}</td>
            <td>${c.telefono || 'N/A'}</td>
            <td>${c.email || 'N/A'}</td>
            <td>
              <button class="btn btn-small btn-primary" onclick="editarCliente(${c.id})">Editar</button>
              <button class="btn btn-small btn-danger" onclick="eliminarCliente(${c.id})">Eliminar</button>
            </td>
          </tr>
        `;
      }).join('');
    }
  } catch (error) {
    console.error('Error cargando clientes:', error);
    showNotification('Error al cargar clientes', 'error');
  }
}

// Cargar productos
async function loadProductos() {
  try {
    state.productos = await window.electronAPI.getProductos();
    const tbody = document.querySelector('#tabla-productos tbody');
    
    if (state.productos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay productos</td></tr>';
    } else {
      tbody.innerHTML = state.productos.map(p => {
        const tipoNombre = getTipoProductoNombre(p.tipo);
        const tieneIVA = !p.exento;
        const precioFinal = tieneIVA ? p.precio * 1.13 : p.precio;
        const ivaTexto = tieneIVA ? '13%' : 'Exento';
        
        return `
          <tr>
            <td><strong>${p.codigo}</strong></td>
            <td>${p.descripcion}</td>
            <td><span class="badge badge-info">${tipoNombre}</span></td>
            <td>${formatCurrency(p.precio)}</td>
            <td><span class="badge ${tieneIVA ? 'badge-success' : 'badge-warning'}">${ivaTexto}</span></td>
            <td><strong>${formatCurrency(precioFinal)}</strong></td>
            <td>
              <button class="btn btn-small btn-primary" onclick="editarProducto(${p.id})">Editar</button>
              <button class="btn btn-small btn-danger" onclick="eliminarProducto(${p.id})">Eliminar</button>
            </td>
          </tr>
        `;
      }).join('');
    }
  } catch (error) {
    console.error('Error cargando productos:', error);
    showNotification('Error al cargar productos', 'error');
  }
}

// Cargar configuración
async function loadConfiguracion() {
  try {
    const config = await window.electronAPI.getConfiguracion();
    if (config) {
      document.getElementById('config-nit').value = config.nit || '';
      document.getElementById('config-nrc').value = config.nrc || '';
      document.getElementById('config-nombre').value = config.nombre_empresa || '';
      document.getElementById('config-nombre-comercial').value = config.nombre_comercial || '';
      document.getElementById('config-tipo-persona').value = config.tipo_persona || '';
      document.getElementById('config-actividad').value = config.actividad_economica || '';
      document.getElementById('config-telefono').value = config.telefono || '';
      document.getElementById('config-email').value = config.email || '';
      document.getElementById('config-departamento').value = config.departamento || '';
      
      // Cargar municipios y distrito si hay departamento
      if (config.departamento) {
        cargarMunicipiosConfig(config.departamento);
        setTimeout(() => {
          document.getElementById('config-municipio').value = config.municipio || '';
          
          if (config.municipio) {
            cargarDistritosConfig(config.municipio);
            setTimeout(() => {
              document.getElementById('config-distrito').value = config.distrito || '';
            }, 50);
          }
        }, 50);
      }
      
      document.getElementById('config-direccion').value = config.direccion || '';
      document.getElementById('config-hacienda-usuario').value = config.hacienda_usuario || '';
      document.getElementById('config-hacienda-ambiente').value = config.hacienda_ambiente || 'pruebas';
      document.getElementById('config-establecimiento').value = config.codigo_establecimiento || '';
      document.getElementById('config-punto-venta').value = config.punto_venta || '';
    }
  } catch (error) {
    console.error('Error cargando configuración:', error);
  }
}

// Cargar clientes en select
async function loadClientesSelect() {
  const select = document.getElementById('cliente-select');
  select.innerHTML = '<option value="">Seleccionar cliente...</option>';
  state.clientes.forEach(c => {
    const option = document.createElement('option');
    option.value = c.id;
    option.textContent = `${c.nombre} - ${c.numero_documento}`;
    select.appendChild(option);
  });
}

// Configurar event listeners
function setupEventListeners() {
  // Configuración
  document.getElementById('form-configuracion')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await guardarConfiguracion();
  });
  
  // Nueva factura
  document.getElementById('form-factura')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await generarFactura();
  });
  
  document.getElementById('btn-agregar-item')?.addEventListener('click', agregarItem);
  document.getElementById('btn-cancelar')?.addEventListener('click', () => {
    switchView('dashboard');
    limpiarFormularioFactura();
  });
  
  // Nuevo cliente
  document.getElementById('btn-nuevo-cliente')?.addEventListener('click', () => {
    abrirModalCliente();
  });
  
  // Form cliente
  document.getElementById('form-cliente')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await guardarCliente();
  });
  
  // Nuevo producto
  document.getElementById('btn-nuevo-producto')?.addEventListener('click', () => {
    abrirModalProducto();
  });
  
  // Form producto
  document.getElementById('form-producto')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await guardarProducto();
  });
}

// Configurar manejador de departamento-municipio-distrito
function setupDepartamentoMunicipioHandler() {
  const departamentoSelect = document.getElementById('cliente-departamento');
  const municipioSelect = document.getElementById('cliente-municipio');
  
  if (departamentoSelect && municipioSelect) {
    departamentoSelect.addEventListener('change', (e) => {
      const departamento = e.target.value;
      cargarMunicipios(departamento);
    });
    
    municipioSelect.addEventListener('change', (e) => {
      const municipio = e.target.value;
      cargarDistritos(municipio);
    });
  }
}

// Cargar municipios según departamento
function cargarMunicipios(codigoDepartamento) {
  const municipioSelect = document.getElementById('cliente-municipio');
  const distritoSelect = document.getElementById('cliente-distrito');
  
  // Limpiar opciones actuales
  municipioSelect.innerHTML = '<option value="">Seleccionar municipio...</option>';
  if (distritoSelect) {
    distritoSelect.innerHTML = '<option value="">Seleccione primero un municipio...</option>';
    distritoSelect.disabled = true;
  }
  
  if (!codigoDepartamento || !municipiosPorDepartamento[codigoDepartamento]) {
    municipioSelect.disabled = true;
    return;
  }
  
  municipioSelect.disabled = false;
  
  // Cargar municipios del departamento seleccionado
  const municipios = municipiosPorDepartamento[codigoDepartamento];
  municipios.forEach(municipio => {
    const option = document.createElement('option');
    option.value = municipio.codigo;
    option.textContent = municipio.nombre;
    municipioSelect.appendChild(option);
  });
}

// Cargar distritos según municipio
function cargarDistritos(codigoMunicipio) {
  const distritoSelect = document.getElementById('cliente-distrito');
  
  // Limpiar opciones actuales
  distritoSelect.innerHTML = '<option value="">Seleccionar distrito...</option>';
  
  if (!codigoMunicipio || !distritosPorMunicipio[codigoMunicipio]) {
    distritoSelect.disabled = true;
    return;
  }
  
  distritoSelect.disabled = false;
  
  // Cargar distritos del municipio seleccionado
  const distritos = distritosPorMunicipio[codigoMunicipio];
  distritos.forEach(distrito => {
    const option = document.createElement('option');
    option.value = distrito.codigoDistrito; // Usar el código de 6 dígitos
    option.textContent = distrito.nombre;
    // Agregar el código de carga como atributo data para referencia
    option.setAttribute('data-codigo-carga', distrito.codigoCarga);
    distritoSelect.appendChild(option);
  });
}

// Obtener nombre del municipio por código
function obtenerNombreMunicipio(codigoDepartamento, codigoMunicipio) {
  if (!municipiosPorDepartamento[codigoDepartamento]) {
    return codigoMunicipio;
  }
  
  const municipio = municipiosPorDepartamento[codigoDepartamento].find(
    m => m.codigo === codigoMunicipio
  );
  
  return municipio ? municipio.nombre : codigoMunicipio;
}

// Obtener lista de distritos por código de municipio
function obtenerDistritosPorMunicipio(codigoMunicipio) {
  return distritosPorMunicipio[codigoMunicipio] || [];
}

// Obtener nombre del distrito por código completo (6 dígitos)
function obtenerNombreDistrito(codigoDistrito) {
  // Buscar en todos los municipios
  for (const municipio in distritosPorMunicipio) {
    const distrito = distritosPorMunicipio[municipio].find(d => d.codigoDistrito === codigoDistrito);
    if (distrito) {
      return distrito.nombre;
    }
  }
  return codigoDistrito;
}

// Obtener código de municipio desde código de distrito (primeros 4 dígitos)
function obtenerMunicipioDesdeDistrito(codigoDistrito) {
  return codigoDistrito.substring(0, 4);
}

// Funciones para departamento-municipio-distrito en configuración
function setupDepartamentoMunicipioConfigHandler() {
  const departamentoSelect = document.getElementById('config-departamento');
  const municipioSelect = document.getElementById('config-municipio');
  
  if (departamentoSelect && municipioSelect) {
    departamentoSelect.addEventListener('change', (e) => {
      const departamento = e.target.value;
      cargarMunicipiosConfig(departamento);
    });
    
    municipioSelect.addEventListener('change', (e) => {
      const municipio = e.target.value;
      cargarDistritosConfig(municipio);
    });
  }
}

// Cargar municipios en configuración
function cargarMunicipiosConfig(codigoDepartamento) {
  const municipioSelect = document.getElementById('config-municipio');
  const distritoSelect = document.getElementById('config-distrito');
  
  // Limpiar opciones actuales
  municipioSelect.innerHTML = '<option value="">Seleccionar municipio...</option>';
  if (distritoSelect) {
    distritoSelect.innerHTML = '<option value="">Seleccione primero un municipio...</option>';
    distritoSelect.disabled = true;
  }
  
  if (!codigoDepartamento || !municipiosPorDepartamento[codigoDepartamento]) {
    municipioSelect.disabled = true;
    return;
  }
  
  municipioSelect.disabled = false;
  
  // Cargar municipios del departamento seleccionado
  const municipios = municipiosPorDepartamento[codigoDepartamento];
  municipios.forEach(municipio => {
    const option = document.createElement('option');
    option.value = municipio.codigo;
    option.textContent = municipio.nombre;
    municipioSelect.appendChild(option);
  });
}

// Cargar distritos en configuración
function cargarDistritosConfig(codigoMunicipio) {
  const distritoSelect = document.getElementById('config-distrito');
  
  // Limpiar opciones actuales
  distritoSelect.innerHTML = '<option value="">Seleccionar distrito...</option>';
  
  if (!codigoMunicipio || !distritosPorMunicipio[codigoMunicipio]) {
    distritoSelect.disabled = true;
    return;
  }
  
  distritoSelect.disabled = false;
  
  // Cargar distritos del municipio seleccionado
  const distritos = distritosPorMunicipio[codigoMunicipio];
  distritos.forEach(distrito => {
    const option = document.createElement('option');
    option.value = distrito.codigoDistrito;
    option.textContent = distrito.nombre;
    option.setAttribute('data-codigo-carga', distrito.codigoCarga);
    distritoSelect.appendChild(option);
  });
}

// Guardar configuración
async function guardarConfiguracion() {
  try {
    const config = {
      nit: document.getElementById('config-nit').value,
      nrc: document.getElementById('config-nrc').value,
      nombre_empresa: document.getElementById('config-nombre').value,
      nombre_comercial: document.getElementById('config-nombre-comercial').value,
      tipo_persona: document.getElementById('config-tipo-persona').value,
      actividad_economica: document.getElementById('config-actividad').value,
      telefono: document.getElementById('config-telefono').value,
      email: document.getElementById('config-email').value,
      departamento: document.getElementById('config-departamento').value,
      municipio: document.getElementById('config-municipio').value,
      distrito: document.getElementById('config-distrito').value,
      direccion: document.getElementById('config-direccion').value,
      hacienda_usuario: document.getElementById('config-hacienda-usuario').value,
      hacienda_password: document.getElementById('config-hacienda-password').value,
      hacienda_ambiente: document.getElementById('config-hacienda-ambiente').value,
      codigo_establecimiento: document.getElementById('config-establecimiento').value,
      punto_venta: document.getElementById('config-punto-venta').value
    };
    
    await window.electronAPI.updateConfiguracion(config);
    state.configuracion = config;
    showNotification('Configuración guardada exitosamente', 'success');
  } catch (error) {
    console.error('Error guardando configuración:', error);
    showNotification('Error al guardar configuración', 'error');
  }
}

// Agregar item a factura
function agregarItem() {
  abrirModalItem();
}

// Generar factura
async function generarFactura() {
  try {
    // Validar que haya cliente seleccionado
    const clienteId = document.getElementById('cliente-select').value;
    if (!clienteId) {
      showNotification('Por favor seleccione un cliente', 'error');
      return;
    }

    // Validar que haya items
    if (state.currentFactura.items.length === 0) {
      showNotification('Por favor agregue al menos un producto', 'error');
      return;
    }

    // Obtener datos del cliente
    const cliente = state.clientes.find(c => c.id === parseInt(clienteId));
    if (!cliente) {
      showNotification('Cliente no encontrado', 'error');
      return;
    }

    // Calcular totales
    const resumen = calcularResumenFactura();
    
    // Crear objeto de factura
    const factura = {
      numero_control: generarNumeroControl(),
      codigo_generacion: generarCodigoGeneracion(),
      tipo_dte: document.getElementById('tipo-dte').value,
      fecha_emision: new Date().toISOString(),
      cliente_id: cliente.id,
      cliente_datos: {
        tipo_documento: cliente.tipo_documento,
        numero_documento: cliente.numero_documento,
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        email: cliente.email,
        direccion: cliente.direccion,
        municipio: cliente.municipio,
        departamento: cliente.departamento
      },
      items: state.currentFactura.items,
      subtotal: resumen.subtotalTotal,
      iva: resumen.totalIva,
      total: resumen.total,
      descuento: resumen.totalDescuento,
      condicion_operacion: document.getElementById('condicion-operacion').value,
      estado: 'PENDIENTE',
      json_dte: null // Se generará al firmar
    };

    // Guardar en base de datos
    const result = await window.electronAPI.addFactura(factura);
    
    if (result) {
      showNotification('Factura generada exitosamente', 'success');
      limpiarFormularioFactura();
      
      // Actualizar estadísticas
      await loadInitialData();
      updateDashboard();
      
      // Cambiar a vista de facturas
      switchView('facturas');
    }
  } catch (error) {
    console.error('Error generando factura:', error);
    showNotification('Error al generar factura: ' + error.message, 'error');
  }
}

// Limpiar formulario de factura
function limpiarFormularioFactura() {
  document.getElementById('form-factura').reset();
  state.currentFactura = { items: [], cliente: null };
  document.getElementById('items-body').innerHTML = '<tr><td colspan="6" class="text-center">No hay items agregados</td></tr>';
  actualizarResumenFactura();
}

// Actualizar resumen de factura
function actualizarResumenFactura() {
  const resumen = calcularResumenFactura();
  
  document.getElementById('resumen-subtotal-gravado').textContent = formatCurrency(resumen.subtotalGravado);
  document.getElementById('resumen-subtotal-exento').textContent = formatCurrency(resumen.subtotalExento);
  document.getElementById('resumen-subtotal').textContent = formatCurrency(resumen.subtotalTotal);
  document.getElementById('resumen-iva').textContent = formatCurrency(resumen.totalIva);
  document.getElementById('resumen-total').textContent = formatCurrency(resumen.total);
  document.getElementById('resumen-letras').textContent = numeroALetras(resumen.total);
}

// Calcular resumen de factura
function calcularResumenFactura() {
  let subtotalGravado = 0;
  let subtotalExento = 0;
  let totalIva = 0;
  let totalDescuento = 0;

  state.currentFactura.items.forEach(item => {
    const subtotal = (item.cantidad * item.precioUnitario) - item.descuento;
    
    if (item.exento) {
      subtotalExento += subtotal;
    } else {
      subtotalGravado += subtotal;
      totalIva += subtotal * 0.13;
    }
    
    totalDescuento += item.descuento;
  });

  const subtotalTotal = subtotalGravado + subtotalExento;
  const total = subtotalTotal + totalIva;

  return {
    subtotalGravado,
    subtotalExento,
    subtotalTotal,
    totalIva,
    total,
    totalDescuento
  };
}

// Generar número de control
function generarNumeroControl() {
  const config = state.configuracion || {};
  const tipoDoc = document.getElementById('tipo-dte').value;
  const establecimiento = config.codigo_establecimiento || '0001';
  const puntoVenta = config.punto_venta || '001';
  const numero = String(state.facturas.length + 1).padStart(15, '0');
  
  return `DTE-${tipoDoc}-${establecimiento}-${puntoVenta}-${numero}`;
}

// Generar código de generación (UUID)
function generarCodigoGeneracion() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16).toUpperCase();
  });
}

// Convertir número a letras (implementación del helper)
function numeroALetras(numero) {
  const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
  const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

  function convertirGrupo(n) {
    let texto = '';
    const c = Math.floor(n / 100);
    const d = Math.floor((n % 100) / 10);
    const u = n % 10;

    if (c > 0) {
      texto += (c === 1 && d === 0 && u === 0) ? 'CIEN' : centenas[c];
    }

    if (d === 1 && u > 0) {
      if (texto) texto += ' ';
      texto += especiales[u];
    } else {
      if (d > 0) {
        if (texto) texto += ' ';
        texto += decenas[d];
      }
      if (u > 0) {
        if (texto) texto += ' Y ';
        texto += unidades[u];
      }
    }

    return texto;
  }

  const entero = Math.floor(numero);
  const decimales = Math.round((numero - entero) * 100);

  let resultado = '';

  if (entero === 0) {
    resultado = 'CERO';
  } else if (entero < 1000) {
    resultado = convertirGrupo(entero);
  } else if (entero < 1000000) {
    const miles = Math.floor(entero / 1000);
    const resto = entero % 1000;
    resultado = (miles === 1 ? 'MIL' : convertirGrupo(miles) + ' MIL');
    if (resto > 0) resultado += ' ' + convertirGrupo(resto);
  }

  return `${resultado} DÓLARES CON ${decimales}/100`;
}

// Utilidades
function formatCurrency(value) {
  return new Intl.NumberFormat('es-SV', {
    style: 'currency',
    currency: 'USD'
  }).format(value || 0);
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-SV');
}

function getEstadoBadgeClass(estado) {
  const classes = {
    'PENDIENTE': 'warning',
    'FIRMADO': 'info',
    'ENVIADO': 'info',
    'ACEPTADO': 'success',
    'RECHAZADO': 'danger'
  };
  return classes[estado] || 'secondary';
}

function showNotification(message, type = 'info') {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // Aquí se puede implementar un sistema de notificaciones toast
  alert(message);
}

// Obtener nombre del tipo de producto
function getTipoProductoNombre(tipo) {
  const tipos = {
    '1': 'Bien',
    '2': 'Servicio',
    '3': 'Ambos',
    '4': 'Otros'
  };
  return tipos[tipo] || 'Desconocido';
}

// Funciones globales para botones
window.verFactura = async function(id) {
  const factura = state.facturas.find(f => f.id === id);
  if (!factura) {
    showNotification('Factura no encontrada', 'error');
    return;
  }
  
  abrirModalVerFactura(factura);
};

window.enviarFactura = async function(id) {
  const factura = state.facturas.find(f => f.id === id);
  if (!factura) {
    showNotification('Factura no encontrada', 'error');
    return;
  }
  
  if (factura.estado !== 'FIRMADO') {
    showNotification('La factura debe estar firmada antes de enviarla', 'warning');
    return;
  }
  
  await enviarFacturaHacienda(factura);
};

window.editarCliente = function(id) {
  console.log('Editar cliente:', id);
  const cliente = state.clientes.find(c => c.id === id);
  if (cliente) {
    abrirModalCliente(cliente);
  }
};

window.editarProducto = function(id) {
  console.log('Editar producto:', id);
  showNotification('Funcionalidad en desarrollo', 'info');
};

// ========== CONTROLADOR DE CLIENTES ==========

// Abrir modal para nuevo cliente o editar existente
function abrirModalCliente(cliente = null) {
  const modal = document.getElementById('modal-cliente');
  const titulo = document.getElementById('modal-cliente-titulo');
  const form = document.getElementById('form-cliente');
  
  // Limpiar formulario
  form.reset();
  
  if (cliente) {
    // Modo edición
    titulo.textContent = 'Editar Cliente';
    document.getElementById('cliente-id').value = cliente.id;
    document.getElementById('cliente-tipo-documento').value = cliente.tipo_documento;
    document.getElementById('cliente-numero-documento').value = cliente.numero_documento;
    document.getElementById('cliente-nrc').value = cliente.nrc || '';
    document.getElementById('cliente-nombre').value = cliente.nombre;
    document.getElementById('cliente-nombre-comercial').value = cliente.nombre_comercial || '';
    document.getElementById('cliente-tipo-persona').value = cliente.tipo_persona || '';
    document.getElementById('cliente-telefono').value = cliente.telefono || '';
    document.getElementById('cliente-email').value = cliente.email || '';
    document.getElementById('cliente-departamento').value = cliente.departamento || '';
    
    // Cargar municipios del departamento seleccionado
    if (cliente.departamento) {
      cargarMunicipios(cliente.departamento);
      // Esperar un momento para que se carguen los municipios antes de seleccionar
      setTimeout(() => {
        document.getElementById('cliente-municipio').value = cliente.municipio || '';
        
        // Cargar distritos del municipio seleccionado
        if (cliente.municipio) {
          cargarDistritos(cliente.municipio);
          // Esperar para cargar el distrito
          setTimeout(() => {
            document.getElementById('cliente-distrito').value = cliente.distrito || '';
          }, 50);
        }
      }, 50);
    }
    
    document.getElementById('cliente-direccion').value = cliente.direccion || '';
    document.getElementById('cliente-giro').value = cliente.giro || '';
  } else {
    // Modo nuevo
    titulo.textContent = 'Nuevo Cliente';
    document.getElementById('cliente-id').value = '';
  }
  
  modal.classList.add('active');
}

// Cerrar modal de cliente
function cerrarModalCliente() {
  const modal = document.getElementById('modal-cliente');
  modal.classList.remove('active');
  document.getElementById('form-cliente').reset();
}

// Guardar cliente (nuevo o editar)
async function guardarCliente() {
  try {
    const clienteId = document.getElementById('cliente-id').value;
    
    const clienteData = {
      tipo_documento: document.getElementById('cliente-tipo-documento').value,
      numero_documento: document.getElementById('cliente-numero-documento').value,
      nrc: document.getElementById('cliente-nrc').value,
      nombre: document.getElementById('cliente-nombre').value,
      nombre_comercial: document.getElementById('cliente-nombre-comercial').value,
      tipo_persona: document.getElementById('cliente-tipo-persona').value,
      telefono: document.getElementById('cliente-telefono').value,
      email: document.getElementById('cliente-email').value,
      departamento: document.getElementById('cliente-departamento').value,
      municipio: document.getElementById('cliente-municipio').value,
      distrito: document.getElementById('cliente-distrito').value,
      direccion: document.getElementById('cliente-direccion').value,
      giro: document.getElementById('cliente-giro').value
    };
    
    if (clienteId) {
      // Actualizar cliente existente
      const result = await window.electronAPI.updateCliente(parseInt(clienteId), clienteData);
      
      if (result) {
        showNotification('Cliente actualizado exitosamente', 'success');
        cerrarModalCliente();
        
        // Recargar lista de clientes
        await loadClientes();
        
        // Si estamos en vista de nueva factura, actualizar select
        if (state.currentView === 'nueva-factura') {
          await loadClientesSelect();
        }
      }
    } else {
      // Crear nuevo cliente
      const result = await window.electronAPI.addCliente(clienteData);
      
      if (result) {
        showNotification('Cliente guardado exitosamente', 'success');
        cerrarModalCliente();
        
        // Recargar lista de clientes
        await loadClientes();
        
        // Si estamos en vista de nueva factura, actualizar select
        if (state.currentView === 'nueva-factura') {
          await loadClientesSelect();
        }
      }
    }
  } catch (error) {
    console.error('Error guardando cliente:', error);
    showNotification('Error al guardar cliente: ' + error.message, 'error');
  }
}

// Editar cliente
async function editarCliente(clienteId) {
  try {
    const cliente = state.clientes.find(c => c.id === clienteId);
    if (cliente) {
      abrirModalCliente(cliente);
    } else {
      showNotification('Cliente no encontrado', 'error');
    }
  } catch (error) {
    console.error('Error al editar cliente:', error);
    showNotification('Error al cargar cliente', 'error');
  }
}

// Eliminar cliente
async function eliminarCliente(clienteId) {
  try {
    const confirmacion = confirm('¿Está seguro de eliminar este cliente? Esta acción no se puede deshacer.');
    if (!confirmacion) return;
    
    const result = await window.electronAPI.deleteCliente(clienteId);
    
    if (result) {
      showNotification('Cliente eliminado exitosamente', 'success');
      await loadClientes();
      
      if (state.currentView === 'nueva-factura') {
        await loadClientesSelect();
      }
    }
  } catch (error) {
    console.error('Error eliminando cliente:', error);
    showNotification('Error al eliminar cliente: ' + error.message, 'error');
  }
}

// Validar documento según tipo
function validarDocumento() {
  const tipo = document.getElementById('cliente-tipo-documento').value;
  const numero = document.getElementById('cliente-numero-documento').value;
  
  if (tipo === '13') { // NIT
    const nitRegex = /^\d{4}-\d{6}-\d{3}-\d$/;
    if (!nitRegex.test(numero)) {
      showNotification('Formato de NIT inválido. Use: 0000-000000-000-0', 'error');
      return false;
    }
  } else if (tipo === '36') { // DUI
    const duiRegex = /^\d{8}-\d$/;
    if (!duiRegex.test(numero)) {
      showNotification('Formato de DUI inválido. Use: 00000000-0', 'error');
      return false;
    }
  }
  
  return true;
}

// Formatear número de documento mientras se escribe
document.addEventListener('DOMContentLoaded', () => {
  const numeroDocInput = document.getElementById('cliente-numero-documento');
  const tipoDocSelect = document.getElementById('cliente-tipo-documento');
  
  if (numeroDocInput && tipoDocSelect) {
    numeroDocInput.addEventListener('blur', () => {
      validarDocumento();
    });
    
    tipoDocSelect.addEventListener('change', () => {
      numeroDocInput.value = '';
      const tipo = tipoDocSelect.value;
      
      if (tipo === '13') {
        numeroDocInput.placeholder = '0000-000000-000-0';
      } else if (tipo === '36') {
        numeroDocInput.placeholder = '00000000-0';
      } else {
        numeroDocInput.placeholder = 'Número de documento';
      }
    });
  }
});

// Hacer funciones globales para el modal
window.cerrarModalCliente = cerrarModalCliente;
window.abrirModalCliente = abrirModalCliente;

window.editarProducto = function(id) {
  console.log('Editar producto:', id);
  const producto = state.productos.find(p => p.id === id);
  if (producto) {
    abrirModalProducto(producto);
  }
};

// ========== CONTROLADOR DE PRODUCTOS ==========

// Abrir modal para nuevo producto o editar existente
function abrirModalProducto(producto = null) {
  const modal = document.getElementById('modal-producto');
  const titulo = document.getElementById('modal-producto-titulo');
  const form = document.getElementById('form-producto');
  
  // Limpiar formulario
  form.reset();
  
  if (producto) {
    // Modo edición
    titulo.textContent = 'Editar Producto/Servicio';
    document.getElementById('producto-id').value = producto.id;
    document.getElementById('producto-tipo').value = producto.tipo;
    document.getElementById('producto-codigo').value = producto.codigo;
    document.getElementById('producto-descripcion').value = producto.descripcion;
    document.getElementById('producto-precio').value = producto.precio;
    document.getElementById('producto-unidad').value = producto.unidad_medida || '99';
    document.getElementById('producto-iva').value = producto.exento ? '0' : '1';
    
    // Cargar tributos si existen
    const tributos = producto.tributos ? JSON.parse(producto.tributos) : [];
    document.getElementById('producto-notas').value = producto.notas || '';
  } else {
    // Modo nuevo
    titulo.textContent = 'Nuevo Producto/Servicio';
    document.getElementById('producto-id').value = '';
    document.getElementById('producto-iva').value = '1'; // Por defecto con IVA
  }
  
  modal.classList.add('active');
}

// Cerrar modal de producto
function cerrarModalProducto() {
  const modal = document.getElementById('modal-producto');
  modal.classList.remove('active');
  document.getElementById('form-producto').reset();
}

// Guardar producto (nuevo o editar)
async function guardarProducto() {
  try {
    const productoId = document.getElementById('producto-id').value;
    const tipoProducto = document.getElementById('producto-tipo').value;
    const exento = document.getElementById('producto-iva').value === '0';
    
    // Preparar tributos
    const tributos = [];
    if (!exento) {
      tributos.push({
        codigo: '20',
        descripcion: 'Impuesto al Valor Agregado 13%',
        valor: 0.13
      });
    }
    
    const productoData = {
      tipo: tipoProducto,
      codigo: document.getElementById('producto-codigo').value,
      descripcion: document.getElementById('producto-descripcion').value,
      precio: parseFloat(document.getElementById('producto-precio').value),
      unidad_medida: document.getElementById('producto-unidad').value,
      tributos: tributos,
      exento: exento ? 1 : 0,
      notas: document.getElementById('producto-notas').value
    };
    
    if (productoId) {
      // Actualizar producto existente
      const result = await window.electronAPI.updateProducto(productoId, productoData);
      
      if (result) {
        showNotification('Producto actualizado exitosamente', 'success');
        cerrarModalProducto();
        
        // Recargar lista de productos
        await loadProductos();
      }
    } else {
      // Crear nuevo producto
      const result = await window.electronAPI.addProducto(productoData);
      
      if (result) {
        showNotification('Producto guardado exitosamente', 'success');
        cerrarModalProducto();
        
        // Recargar lista de productos
        await loadProductos();
      }
    }
  } catch (error) {
    console.error('Error guardando producto:', error);
    showNotification('Error al guardar producto: ' + error.message, 'error');
  }
}

// Validar código de producto único
async function validarCodigoProducto(codigo, productoId = null) {
  const productos = await window.electronAPI.getProductos();
  const existe = productos.some(p => 
    p.codigo.toLowerCase() === codigo.toLowerCase() && 
    (!productoId || p.id !== parseInt(productoId))
  );
  
  if (existe) {
    showNotification('El código de producto ya existe', 'error');
    return false;
  }
  
  return true;
}

// Calcular precio con IVA
function calcularPrecioConIVA(precio, tieneIVA) {
  if (tieneIVA) {
    return precio * 1.13;
  }
  return precio;
}

// Listener para mostrar precio con IVA
document.addEventListener('DOMContentLoaded', () => {
  const precioInput = document.getElementById('producto-precio');
  const ivaSelect = document.getElementById('producto-iva');
  
  if (precioInput && ivaSelect) {
    const actualizarPreview = () => {
      const precio = parseFloat(precioInput.value) || 0;
      const tieneIVA = ivaSelect.value === '1';
      const precioConIVA = calcularPrecioConIVA(precio, tieneIVA);
      
      // Puedes mostrar esto en algún lugar del formulario si lo deseas
      console.log(`Precio base: $${precio.toFixed(2)}, Con IVA: $${precioConIVA.toFixed(2)}`);
    };
    
    precioInput.addEventListener('input', actualizarPreview);
    ivaSelect.addEventListener('change', actualizarPreview);
  }
});

// Hacer funciones globales para el modal
window.cerrarModalProducto = cerrarModalProducto;
window.abrirModalProducto = abrirModalProducto;

window.editarProducto = function(id) {
  console.log('Editar producto:', id);
  const producto = state.productos.find(p => p.id === id);
  if (producto) {
    abrirModalProducto(producto);
  }
};

// Eliminar producto
window.eliminarProducto = async function(id) {
  const producto = state.productos.find(p => p.id === id);
  if (!producto) return;
  
  const confirmacion = confirm(`¿Estás seguro de eliminar el producto "${producto.descripcion}"?`);
  if (!confirmacion) return;
  
  try {
    await window.electronAPI.deleteProducto(id);
    showNotification('Producto eliminado exitosamente', 'success');
    await loadProductos();
  } catch (error) {
    console.error('Error eliminando producto:', error);
    showNotification('Error al eliminar producto: ' + error.message, 'error');
  }
};

// ========== CONTROLADOR DE ITEMS DE FACTURA ==========

// Abrir modal para agregar item
function abrirModalItem() {
  const modal = document.getElementById('modal-item');
  const select = document.getElementById('item-producto');
  
  // Limpiar y cargar productos
  select.innerHTML = '<option value="">Seleccionar producto...</option>';
  state.productos.forEach(p => {
    const option = document.createElement('option');
    option.value = p.id;
    option.textContent = `${p.codigo} - ${p.descripcion} - ${formatCurrency(p.precio)}`;
    option.dataset.precio = p.precio;
    option.dataset.exento = p.exento;
    option.dataset.descripcion = p.descripcion;
    option.dataset.codigo = p.codigo;
    option.dataset.unidadMedida = p.unidad_medida;
    select.appendChild(option);
  });
  
  // Limpiar formulario
  document.getElementById('form-item').reset();
  document.getElementById('item-precio').value = '';
  document.getElementById('item-cantidad').value = '1';
  document.getElementById('item-descuento').value = '0';
  
  modal.classList.add('active');
}

// Cerrar modal de item
function cerrarModalItem() {
  const modal = document.getElementById('modal-item');
  modal.classList.remove('active');
}

// Cuando se selecciona un producto, mostrar su precio
document.addEventListener('DOMContentLoaded', () => {
  const productoSelect = document.getElementById('item-producto');
  const precioInput = document.getElementById('item-precio');
  
  if (productoSelect && precioInput) {
    productoSelect.addEventListener('change', (e) => {
      const selectedOption = e.target.options[e.target.selectedIndex];
      if (selectedOption.value) {
        precioInput.value = selectedOption.dataset.precio;
      } else {
        precioInput.value = '';
      }
    });
  }
  
  // Manejar envío del formulario de item
  const formItem = document.getElementById('form-item');
  if (formItem) {
    formItem.addEventListener('submit', (e) => {
      e.preventDefault();
      agregarItemAFactura();
    });
  }
});

// Agregar item a la factura
function agregarItemAFactura() {
  const productoSelect = document.getElementById('item-producto');
  const selectedOption = productoSelect.options[productoSelect.selectedIndex];
  
  if (!selectedOption.value) {
    showNotification('Por favor seleccione un producto', 'error');
    return;
  }
  
  const cantidad = parseFloat(document.getElementById('item-cantidad').value);
  const precio = parseFloat(document.getElementById('item-precio').value);
  const descuento = parseFloat(document.getElementById('item-descuento').value) || 0;
  
  const item = {
    id: Date.now(), // ID temporal para el item
    productoId: parseInt(selectedOption.value),
    codigo: selectedOption.dataset.codigo,
    descripcion: selectedOption.dataset.descripcion,
    cantidad: cantidad,
    precioUnitario: precio,
    descuento: descuento,
    exento: selectedOption.dataset.exento === '1',
    unidadMedida: selectedOption.dataset.unidadMedida
  };
  
  // Agregar a la lista de items
  state.currentFactura.items.push(item);
  
  // Actualizar tabla
  actualizarTablaItems();
  
  // Actualizar resumen
  actualizarResumenFactura();
  
  // Cerrar modal
  cerrarModalItem();
  
  showNotification('Producto agregado a la factura', 'success');
}

// Actualizar tabla de items
function actualizarTablaItems() {
  const tbody = document.getElementById('items-body');
  
  if (state.currentFactura.items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay items agregados</td></tr>';
    return;
  }
  
  tbody.innerHTML = state.currentFactura.items.map(item => {
    const subtotal = (item.cantidad * item.precioUnitario) - item.descuento;
    const iva = item.exento ? 0 : subtotal * 0.13;
    
    return `
      <tr>
        <td>
          <strong>${item.codigo}</strong><br>
          <small>${item.descripcion}</small>
        </td>
        <td>${item.cantidad}</td>
        <td>${formatCurrency(item.precioUnitario)}</td>
        <td>${item.exento ? '<span class="badge badge-warning">Exento</span>' : formatCurrency(iva)}</td>
        <td><strong>${formatCurrency(subtotal)}</strong></td>
        <td>
          <button class="btn btn-small btn-danger" onclick="eliminarItemFactura(${item.id})">×</button>
        </td>
      </tr>
    `;
  }).join('');
}

// Eliminar item de la factura
window.eliminarItemFactura = function(itemId) {
  state.currentFactura.items = state.currentFactura.items.filter(item => item.id !== itemId);
  actualizarTablaItems();
  actualizarResumenFactura();
  showNotification('Producto eliminado de la factura', 'info');
};

// Hacer funciones globales
window.cerrarModalItem = cerrarModalItem;
window.abrirModalItem = abrirModalItem;

// ========== VISUALIZACIÓN Y ENVÍO DE FACTURAS ==========

// Abrir modal para ver detalle de factura
function abrirModalVerFactura(factura) {
  const modal = document.getElementById('modal-ver-factura');
  
  // Información de la factura
  document.getElementById('factura-numero-control').textContent = factura.numero_control || 'N/A';
  document.getElementById('factura-codigo-generacion').textContent = factura.codigo_generacion || 'N/A';
  document.getElementById('factura-fecha').textContent = formatDate(factura.fecha_emision);
  
  // Badge de estado
  const estadoBadge = `<span class="badge badge-${getEstadoBadgeClass(factura.estado)}">${factura.estado}</span>`;
  document.getElementById('factura-estado-badge').innerHTML = estadoBadge;
  
  // Información del cliente
  const clienteData = typeof factura.cliente_datos === 'string' 
    ? JSON.parse(factura.cliente_datos) 
    : factura.cliente_datos;
  
  document.getElementById('factura-cliente-nombre').textContent = clienteData.nombre || 'N/A';
  document.getElementById('factura-cliente-documento').textContent = clienteData.numero_documento || 'N/A';
  document.getElementById('factura-cliente-direccion').textContent = clienteData.direccion || 'N/A';
  
  // Items de la factura
  const items = typeof factura.items === 'string' ? JSON.parse(factura.items) : factura.items;
  const tbody = document.getElementById('factura-items-body');
  
  tbody.innerHTML = items.map(item => {
    const subtotal = (item.cantidad * item.precioUnitario) - (item.descuento || 0);
    const iva = item.exento ? 0 : subtotal * 0.13;
    
    return `
      <tr>
        <td>
          <strong>${item.codigo}</strong><br>
          <small>${item.descripcion}</small>
        </td>
        <td>${item.cantidad}</td>
        <td>${formatCurrency(item.precioUnitario)}</td>
        <td>${item.exento ? '<span class="badge badge-warning">Exento</span>' : formatCurrency(iva)}</td>
        <td><strong>${formatCurrency(subtotal)}</strong></td>
      </tr>
    `;
  }).join('');
  
  // Resumen
  document.getElementById('factura-subtotal').textContent = formatCurrency(factura.subtotal);
  document.getElementById('factura-iva').textContent = formatCurrency(factura.iva);
  document.getElementById('factura-total').textContent = formatCurrency(factura.total);
  
  // Mostrar botones según el estado
  const btnFirmar = document.getElementById('btn-firmar-factura');
  const btnEnviar = document.getElementById('btn-enviar-factura');
  
  btnFirmar.style.display = 'none';
  btnEnviar.style.display = 'none';
  
  if (factura.estado === 'PENDIENTE') {
    btnFirmar.style.display = 'inline-flex';
    btnFirmar.onclick = () => firmarFactura(factura.id);
  }
  
  if (factura.estado === 'FIRMADO') {
    btnEnviar.style.display = 'inline-flex';
    btnEnviar.onclick = () => enviarFacturaHacienda(factura.id);
  }
  
  modal.classList.add('active');
}

// Cerrar modal de ver factura
function cerrarModalVerFactura() {
  const modal = document.getElementById('modal-ver-factura');
  modal.classList.remove('active');
}

// Firmar factura con Puppeteer
async function firmarFactura(facturaId) {
  try {
    const factura = state.facturas.find(f => f.id === facturaId);
    if (!factura) {
      showNotification('Factura no encontrada', 'error');
      return;
    }
    
    // Verificar configuración
    if (!state.configuracion) {
      showNotification('Por favor configure los datos de la empresa primero', 'error');
      return;
    }
    
    const pinCertificado = prompt('Ingrese el PIN del certificado digital:');
    if (!pinCertificado) return;
    
    const usuarioFirmador = prompt('Ingrese el usuario del Firmador de Hacienda:');
    if (!usuarioFirmador) return;
    
    const passwordFirmador = prompt('Ingrese la contraseña del Firmador de Hacienda:');
    if (!passwordFirmador) return;
    
    showNotification('Firmando documento...', 'info');
    
    // Construir documento para firmar
    const documento = {
      identificacion: {
        version: 1,
        ambiente: state.configuracion.hacienda_ambiente === 'produccion' ? '00' : '01',
        tipoDte: factura.tipo_dte,
        numeroControl: factura.numero_control,
        codigoGeneracion: factura.codigo_generacion,
        tipoModelo: '1',
        tipoOperacion: '1',
        fecEmi: new Date(factura.fecha_emision).toISOString().split('T')[0],
        horEmi: new Date(factura.fecha_emision).toTimeString().split(' ')[0],
        tipoMoneda: 'USD'
      }
    };
    
    // Llamar al firmador
    const result = await window.electronAPI.firmarDocumento({
      documento: documento,
      pin: pinCertificado,
      usuario: usuarioFirmador,
      password: passwordFirmador
    });
    
    if (result.success) {
      showNotification('Documento firmado exitosamente', 'success');
      
      // Actualizar estado en base de datos
      await window.electronAPI.updateFacturaEstado(facturaId, 'FIRMADO', null);
      
      cerrarModalVerFactura();
      await loadFacturas();
    } else {
      showNotification('Error al firmar: ' + result.error, 'error');
    }
  } catch (error) {
    console.error('Error firmando factura:', error);
    showNotification('Error al firmar factura: ' + error.message, 'error');
  }
}

// Enviar factura a Hacienda
async function enviarFacturaHacienda(facturaId) {
  try {
    const factura = state.facturas.find(f => f.id === facturaId);
    if (!factura) {
      showNotification('Factura no encontrada', 'error');
      return;
    }
    
    if (!state.configuracion || !state.configuracion.hacienda_usuario) {
      showNotification('Por favor configure las credenciales de Hacienda primero', 'error');
      return;
    }
    
    const confirmacion = confirm('¿Está seguro de enviar esta factura al Ministerio de Hacienda?');
    if (!confirmacion) return;
    
    showNotification('Autenticando con Hacienda...', 'info');
    
    // Autenticar con Hacienda
    const authResult = await window.electronAPI.autenticar({
      usuario: state.configuracion.hacienda_usuario,
      password: state.configuracion.hacienda_password,
      ambiente: state.configuracion.hacienda_ambiente
    });
    
    if (!authResult.success) {
      showNotification('Error de autenticación: ' + authResult.error, 'error');
      return;
    }
    
    showNotification('Enviando DTE a Hacienda...', 'info');
    
    // Enviar DTE
    const dteResult = await window.electronAPI.enviarDTE({
      dte: {
        emisor: {
          nit: state.configuracion.nit
        },
        documento: JSON.parse(factura.json_dte || '{}')
      },
      token: authResult.token
    });
    
    if (dteResult.success) {
      showNotification('Factura enviada exitosamente a Hacienda', 'success');
      
      // Actualizar estado
      await window.electronAPI.updateFacturaEstado(
        facturaId, 
        'ENVIADO', 
        dteResult.resultado?.selloRecepcion || null
      );
      
      cerrarModalVerFactura();
      await loadFacturas();
    } else {
      showNotification('Error al enviar: ' + dteResult.error, 'error');
    }
  } catch (error) {
    console.error('Error enviando factura:', error);
    showNotification('Error al enviar factura: ' + error.message, 'error');
  }
}

// Hacer funciones globales
window.cerrarModalVerFactura = cerrarModalVerFactura;
window.editarCliente = editarCliente;
window.eliminarCliente = eliminarCliente;
window.cerrarModalCliente = cerrarModalCliente;
