const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {                    //lowercase
        type: String,           
        required: true,
        unique: true
    },
    userCategory: {
        type: String,
        required: false,
        default: "user"     // maybe change to defender or attacker
    },
    password: { 
        type: String, 
        required: true 
    },
    creationDate: { 
        type: Date, 
        required: true, 
        default: Date.now 
    },
    verified: {
        type: Boolean,
        default: false,
    },
    sessionToken: String,
    scores: [{
        score: Number,
        submissionDate: { 
            type: Date, 
            default: Date.now
        }
    }],
    totalScore: { 
        type: Number, 
        default: 0 
    },
    submittedFlags: [{ type: String }]    
});

userSchema.statics.authenticate = async function (email, password) {

    const foundUser = await this.findOne ({ email: email.toLowerCase() });
    if (!foundUser) return false;
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid? foundUser : false;
}

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

module.exports  = mongoose.model('userModel', userSchema);
