import { isAuth } from '../../middleware/permissions';
import User from '../../classes/User';
const user = new User();

export default {
    Query: {
        getUsers: isAuth.createResolver((root, { since, limit }) => user.getUsers(since, limit)),
        getUser: isAuth.createResolver((root, { id }) => user.getUser(id))
        
    },
    Mutation: {
        createUser: isAuth.createResolver((root, { input }) => user.createUser(input)),
        updateUser: isAuth.createResolver((root, { id, input }) => user.updateUser(id, input)),
        deleteUser: isAuth.createResolver((root, { id }) => user.deleteUser(id))
    }
};
