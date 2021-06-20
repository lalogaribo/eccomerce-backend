const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
      type: String,
      required: true
    },
    street: {
        type: String,
        default: ''
    },
    apartment: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    phone: {
        type: Number,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

userSchema.virtual('id').get(function() {
    return this._id.toHexString()
});

userSchema.set('toJSON', {
    virtuals: true
})

userSchema.methods.generateJwtToken = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id, isAdmin: user.isAdmin}, process.env.SECRET_KEY, {expiresIn: '1d'})
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error(`Unable to login`);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Unable to login");
    }

    return user;
};

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model("User", userSchema);

module.exports = User;

