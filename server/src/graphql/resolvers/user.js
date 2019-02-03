import bcrypt from 'bcrypt';
import { isAuth, ForbiddenError } from '../../config/errors/authentication'

/*
    "isAuth" verifies that the user is logged in and 
    that the token is valid, if it passes the validations 
    then it executes the resolver that it contains inside
*/

const getUsers = isAuth.createResolver(
    async (root, { since = 0, limit = 10 }, { models: { user } }) => {
        try {
            return await user.find({ status: true }).skip(since).limit(limit);
        } catch (err) {
            return { ok: false, message: err.message };
        }
    }
);

const getUser = isAuth.createResolver(
    async (root, { id }, { models: { user } }) => {
        try {
            return await user.findOne({ status: true, _id: id });

        } catch (err) { return { ok: false, message: err.message }; }
    }
);



/*
    I allow this resolver to be executed without being inside "isAuth", 
    because I need it to be able to create at least one user the first 
    time I start the application, once created I can wrap it inside 
    "isAuth.createResolver(allMyFunction)"
*/
const createUser = async (root, { input }, { models: { user } }) => {
    let { name, email, password, role } = input;

    try {
        let newUser =  new user({
            name,
            email,
            password: bcrypt.hashSync(password, 10),
            role
        });

        await newUser.save();

        return {
            ok: true,
            message: 'Created correctly'
        };

    } catch (err) {
        return {
            ok: false,
            message: err.message
        };
    }
}


const updateUser = isAuth.createResolver(
    async (root, { id, input }, { models: { user } }) => {

        const { name, email, role } = input;

        let query = { _id: id, status: true };
        let update = { $set: { name, email, role } };

        let props = {
            new: true,
            runValidators: true,
            context: 'query'
        }

        try {
            await user.findOneAndUpdate(query, update, props);
            return { ok: true, message: 'Updated successfully' }

        } catch (err) {
            return { ok: false, message: err.message };
        }
    }
);


/*
    This example, besides verifying that it is logged 
    with a valid token, also checks that it is an administrator 
    who can execute this resolver
*/
const deleteUser = isAuth.createResolver(
    async (root, { id }, { user: { role }, models: { user } }) => {
        // If the user does not have the permissions to create more users, we return an error
        if (role !== 'ADMIN') throw new ForbiddenError();

        try {
            let query = { _id: id, status: true };
            let update = { $set: { status: false } };

            let User = await user.findOneAndUpdate(query, update);

            if (!User) return { ok: false, message: 'It was previously removed' };
            return { ok: true, message: 'Removed correctly' };

        } catch (err) {
            return { ok: false, message: "The id does not exist" };
        }
    }
);

// I export my querys and mutations to join with the other resolvers
export default {
    Query: {
        getUsers,
        getUser
    },
    Mutation: {
        createUser,
        updateUser,
        deleteUser
    }
};