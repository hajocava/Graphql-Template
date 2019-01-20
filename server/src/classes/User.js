import model from '../models/User';
import bcrypt from 'bcrypt';

export default class Users {
    
    async getUsers(since = 0, limit = 10){
        try {
            let filtro = 'name email role status verify'; // Campos permitidos para retornar.
            return await model.find({ status: true }, filtro).skip(since).limit(limit);

        } catch (err) {
            return {
                ok: false,
                message: err.message
            };
        }
    }

    async getUser(id) {
        try {
            let filtro = 'name email role status verify';
            return await model.findOne({ status: true, _id: id }, filtro);

        } catch (err) {
            return {
                ok: false,
                message: err.message
            };
        }
    }

    async createUser(input) {
        let { name, email, password, role } = input;
    
        // Si no se recibe contraseña, entonces se genera una con 6 cifras numericas aleatorias
        if(!password) {
            password = '';
            do {
                password = Math.floor((Math.random() * 1000000) + 1);
                password = password.toString();
            } while (password.length < 6);
        }
        
        try {
            let user =  new model({
                name,
                email,
                password: bcrypt.hashSync(password, 10),
                role
            });
    
            await user.save();

            return {
                ok: true,
                message: 'Creado correctamente'
            };
    
        } catch (err) {
            return {
                ok: false,
                message: err.message
            };
        }
    }
    
    async updateUser(id, data) {
        let { name } = data;
    
        let query = { _id: id, status: true };
        let update = { 
            $set: { 
                name
            }
        };
    
        let props = {
            new: true, //activa que retorne el nuevo registro actualizado
            runValidators: true, //activa la validaciones de nuestro Schema en este query.
            context: 'query' // Si no se activa esta opcion, las validaciones no funcionan bien
        }
    
        try {
            await model.findOneAndUpdate(query, update, props);

            return {
                ok: true,
                message: 'Actualizado correctamente'
            }

        } catch (err) {
            return {
                ok: false,
                message: err.message
            };
        }
    }
    
    async deleteUser(id) {
        try {
            let query = { _id: id, status: true };
            let update = { $set: { status: false }};
    
            let user = await model.findOneAndUpdate(query, update);
    
            if(!user) return {
                ok: false,
                message: 'El usuario no existe o fue eliminado anteriormente'
            };
    
            return {
                ok: true,
                message: 'Eliminado correctamente'
            };
    
        } catch (err) {
            return {
                ok: false,
                message: err.message
            };
        }
    }
    
}
