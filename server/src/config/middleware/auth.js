import jwt from 'jsonwebtoken';

export const getToken = payload => {
    let token = jwt.sign(payload, process.env.SEED, { expiresIn: process.env.EXPTOKEN });
    return token;
}

export const checkToken = (req, res, next) => {
    const token = req.headers["x-token"];
    
    if (token) {
        try {
            // Verificamos que el token sea valido
            const { user, role } = jwt.verify(token, process.env.SEED);

            // Si se verifico bien, entonces creamos un nuevo token con el mismo idUser
            const newToken = getToken({ user });

            // Agregamos a nuestros headers (backend) el id del usuario logeado
            req.user = user;
            req.role = role;

            // Enviamos a los headers del cliente el nuevo token para que lo actualice
            res.set("Access-Control-Expose-Headers", "x-token");
            res.set("x-token", newToken);

        } catch (error) {
            // Invalid Token
        }
    }

    next();
}