const { getConexion } = require('./db');

async function getEmpleados9Box() {
  const conn = await getConexion();

  const result = await conn.execute(`
    SELECT 
      CC,
      NOMBRE,
      FOTO,
      CARGO,
      PUNTAJE_DESEMPENO,
      PUNTAJE_POTENCIAL
    FROM rh_v_pruebajfv
  `);

  const empleados = [];

  for (let row of result.rows) {
    let fotoBase64 = null;

    if (row.FOTO) {
      const chunks = [];

      await new Promise((resolve, reject) => {
        row.FOTO.on('data', chunk => chunks.push(chunk));
        row.FOTO.on('end', resolve);
        row.FOTO.on('error', reject);
      });

      const buffer = Buffer.concat(chunks);
      fotoBase64 = buffer.toString('base64');
    }

    empleados.push({
      CC: row.CC,
      NOMBRE: row.NOMBRE,
      CARGO: row.CARGO,
      FOTO: fotoBase64
        ? `data:image/jpeg;base64,${fotoBase64}`
        : null,
        PUNTAJE_DESEMPENO:row.PUNTAJE_DESEMPENO,
      PUNTAJE_POTENCIAL:row.PUNTAJE_POTENCIAL

    });
  }

  await conn.close();
  return empleados;
}

module.exports = { getEmpleados9Box };