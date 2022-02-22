var bcrypt = require('bcryptjs');
var salt = "$2a$10$w.w00NoEqD.uuWyrfdxPKO";

const encryptPassword = (password) => {
    return bcrypt.hashSync(password, salt);
}

module.exports = encryptPassword;
    