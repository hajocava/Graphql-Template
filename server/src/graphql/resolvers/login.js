import bcrypt from 'bcrypt';
import { getToken } from '../../config/middleware/auth';

export default {
    Mutation: {
        async login(root, { email, password }, { models: { user } }) {
            try {
                let User = await user.findOne({ email }, 'name password role');

                if (User && bcrypt.compareSync(password, User.password)) {
                    return {
                        ok: true,
                        message: 'Authenticated',
                        token: getToken({ user: User.id, role: User.role })
                    };

                } else return {
                    ok: false,
                    message: 'Incorrect email or password'
                };

            } catch (err) {
                return {
                    ok: false,
                    message: err.message
                };
            }
        }
    }
};