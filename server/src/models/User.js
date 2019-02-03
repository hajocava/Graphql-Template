import moongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let roles = {
    values: ['ADMIN', 'USER'],
    message: '{VALUE} it is not a valid role'
}

let Schema = moongoose.Schema;

let userSchema =  new Schema({
    name: {
        type: String,
        required: [true, 'The name is necessary']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'The email is necessary']
    },
    password: {
        type: String,
        required: [true, 'The password is necessary']
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: roles
    },
    status: {
        type: Boolean,
        default: true
    }
});

// Remove the password when a query is made (for security).
userSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

userSchema.plugin(uniqueValidator, { message: '{PATH} it must be unique' });

export default moongoose.model('User', userSchema);
