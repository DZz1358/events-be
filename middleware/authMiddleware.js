const bcrypt = require('bcryptjs');

const users = [];

exports.findUserByEmail = (email) => {
    return users.find(user => user.email === email);
};

exports.createUser = async (email, password) => {
    // const hashedPassword = await bcrypt.hash(password, 10);
    const user = { email, password };
    // const user = { email, password: hashedPassword };
    users.push(user);
    console.log('users', users);
    return user;
};