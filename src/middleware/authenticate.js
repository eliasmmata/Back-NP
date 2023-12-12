// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const tokenFromBody = req.body.token; // Obtener el token del cuerpo de la solicitud

  if (tokenFromBody) {
    // Si hay un token en el cuerpo, configurarlo en el objeto de solicitud para su posterior manejo si es necesario
    req.token = tokenFromBody;
    next();
  } else {
    return res.status(401).json({ error: 'Unauthorized. Need token in body' });
  }
};

// Middleware to attach token in headers
const attachHeaders = (req, res, next) => {
  const tokenFromBody = req.body.token; // Obtener el token del cuerpo de la solicitud

  if (tokenFromBody) {
    // Configurar el token en el encabezado 'Authorization' como 'Bearer <token>'
    req.headers['Authorization'] = `Bearer ${tokenFromBody}`;
    next();
  } else {
    return res.status(401).json({ error: 'Unauthorized headers.' });
  }
};

export {
  authenticateToken,
  attachHeaders
}
