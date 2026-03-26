const express = require('express');
const { iniciarPool, getConexion } = require('./db');

const app = express();

async function iniciarServidor() {
  try {
    await iniciarPool();

    const conn = await getConexion();
    await conn.execute(`SELECT 1 FROM dual`);
    await conn.close();

    console.log('✅ BD conectada correctamente');

    app.listen(3000, () => {
      console.log('🚀 Servidor corriendo en puerto 3000');
    });

  } catch (error) {
    console.error('❌ No se pudo conectar a la BD:', error);
  }
}

iniciarServidor();