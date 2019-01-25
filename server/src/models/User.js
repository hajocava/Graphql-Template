import moongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let Schema = moongoose.Schema;

let userSchema =  new Schema({
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: String },
    status: { type: Boolean, default: true }
});

// Remove the password when a query is made (for security).
userSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

userSchema.plugin(uniqueValidator, { message: '{PATH} it must be unique' });

module.exports =  moongoose.model('Users', userSchema);
