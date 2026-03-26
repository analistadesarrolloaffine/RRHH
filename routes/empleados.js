//empleados
const express = require('express');
const router = express.Router();
const { getEmpleados9Box } = require('../queries');

router.get('/9box', async (req, res) => {
  try {
    const { area, cargo } = req.query;
    const data = await getEmpleados9Box({ area, cargo });

    res.json({
      ok: true,
      total: data.length,
      empleados: data
    });

  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

module.exports = router;