const bcrypt = require('bcryptjs');

const users = [];

exports.findUserByEmail = (email) => {
    return users.find(user => user.email === email);
};

exports.createUser = async (email, password, name) => {
    // const hashedPassword = await bcrypt.hash(password, 10);
    const user = { email, password, name };
    // const user = { email, password: hashedPassword };
    users.push(user);
    return user;
};