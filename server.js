const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { iniciarPool, getConexion } = require('./db');
const { getEmpleados9Box } = require('./queries');

const app = express();
app.use(cors());
app.use(express.json());

/* ================================
   ENDPOINT PRINCIPAL 9BOX
================================ */
app.get('/api/9box', async (req, res) => {
  try {
    const { area, cargo } = req.query;
    const data = await getEmpleados9Box({ area, cargo });

    res.json({
      ok: true,
      total: data.length,
      empleados: data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

/* ================================
   ENDPOINT AREAS
================================ */
app.get('/api/areas', async (req, res) => {
  res.json({ areas: [] }); // luego lo llenas con query real
});

/* ================================
   🔥 ENDPOINT DE PRUEBA DB
================================ */
app.get('/test-db', async (req, res) => {
  let conn;

  try {
    conn = await getConexion();

    const result = await conn.execute(`SELECT * FROM rh_t_person  WHERE id_person ='5825843'`);

    res.json({
      ok: true,
      data: result.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error: error.message
    });

  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (e) {
        console.error('Error cerrando conexión', e);
      }
    }
  }
});

/* ================================
   INICIAR SERVIDOR
================================ */
const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    await iniciarPool();

    console.log('✅ BD conectada correctamente');

    app.listen(PORT, () => {
      console.log(`🚀 API corriendo en http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Error al iniciar pool Oracle:', err);
    process.exit(1);
  }
}

iniciarServidor();