import bcrypt from 'bcrypt'
import { isAuth, ForbiddenError } from '../../config/errors/authentication'
import { pubsub } from '../../config/apollo'


// I export my querys and mutations to join with the other resolvers
export default {
    Subscription: {
        newUser: {
            subscribe: () => pubsub.asyncIterator('NEW_USER')
        }
    },

    Query: {
        /*
            "isAuth" verifies that the user is logged in and 
            that the token is valid, if it passes the validations 
            then it executes the resolver that it contains inside
        */
        getUsers: isAuth.createResolver(
            async (root, { since = 0, limit = 10 }, { models: { user } }) => {
                try {
                    return await user.find({ status: true }).skip(since).limit(limit);
                } catch (err) {
                    return { ok: false, message: err.message };
                }
            }
        ),

        getUser: isAuth.createResolver(
            async (root, { id }, { models: { user } }) => {
                try {
                    return await user.findOne({ status: true, _id: id });
        
                } catch (err) { return { ok: false, message: err.message }; }
            }
        )
    },

    Mutation: {
        createUser: async (root, { input }, { models: { user } }) => {

            let { name, email, password, role } = input;
        
            try {
                let newUser =  new user({
                    name,
                    email,
                    password: bcrypt.hashSync(password, 10),
                    role
                });
        
                await newUser.save()
        
                // Active eventTrigger
                pubsub.publish('NEW_USER', { newUser })
        
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
        },

        updateUser: isAuth.createResolver(
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
        ),
        
        deleteUser: isAuth.createResolver(
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
        )
    }
    
}