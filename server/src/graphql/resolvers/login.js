import { login } from '../../middleware/auth';

export default {
    Mutation: {
        login: (root, { email, password }) => login(email, password)
    }
};
