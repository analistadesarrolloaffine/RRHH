// queries.js
const { getConexion } = require('./db');

async function getEmpleados9Box({ area, cargo } = {}) {
  const conn = await getConexion();
  try {
    // Ajusta los nombres de tabla y columnas a los tuyos
    let sql = `
      SELECT 
        e.ID_EMPLEADO,
        e.NOMBRE,
        e.CARGO,
        e.AREA,
        e.JEFE_DIRECTO,
        e.FOTO_URL,
        ROUND(MONTHS_BETWEEN(SYSDATE, e.FECHA_INGRESO) / 12, 1) AS ANOS_EMPRESA,
        c.CALIFICACION_DESEMPENO,
        c.CALIFICACION_POTENCIAL,
        CASE 
          WHEN c.CALIFICACION_DESEMPENO >= 4 AND c.CALIFICACION_POTENCIAL >= 4 THEN 'Estrella'
          WHEN c.CALIFICACION_DESEMPENO >= 4 AND c.CALIFICACION_POTENCIAL BETWEEN 2 AND 3 THEN 'Pilar'
          WHEN c.CALIFICACION_DESEMPENO >= 4 AND c.CALIFICACION_POTENCIAL < 2 THEN 'Experto'
          WHEN c.CALIFICACION_DESEMPENO BETWEEN 2 AND 3 AND c.CALIFICACION_POTENCIAL >= 4 THEN 'Potencial Alto'
          WHEN c.CALIFICACION_DESEMPENO BETWEEN 2 AND 3 AND c.CALIFICACION_POTENCIAL BETWEEN 2 AND 3 THEN 'Core'
          WHEN c.CALIFICACION_DESEMPENO BETWEEN 2 AND 3 AND c.CALIFICACION_POTENCIAL < 2 THEN 'Dilema'
          WHEN c.CALIFICACION_DESEMPENO < 2 AND c.CALIFICACION_POTENCIAL >= 4 THEN 'Enigma'
          WHEN c.CALIFICACION_DESEMPENO < 2 AND c.CALIFICACION_POTENCIAL BETWEEN 2 AND 3 THEN 'Bajo Riesgo'
          ELSE 'En Riesgo'
        END AS CUADRANTE
      FROM EMPLEADOS e
      JOIN CALIFICACIONES c ON e.ID_EMPLEADO = c.ID_EMPLEADO
      WHERE c.PERIODO = (SELECT MAX(PERIODO) FROM CALIFICACIONES)
    `;

    const params = {};
    if (area) { sql += ` AND e.AREA = :area`; params.area = area; }
    if (cargo) { sql += ` AND e.CARGO = :cargo`; params.cargo = cargo; }

    const result = await conn.execute(sql, params);
    return result.rows;
  } finally {
    await conn.close(); // siempre cerrar la conexión
  }
}

module.exports = { getEmpleados9Box };