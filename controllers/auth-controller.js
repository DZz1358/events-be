const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { google } = require('googleapis');
const nodemailer = require('nodemailer')

const myEmail = 'yourbestfriend1587@gmail.com'

const CLIENT_ID = '33473790718-hgqun8ant77obrm65k1ol1rtdt432s9r.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = "1//04mgUVrKv8fIFCgYIARAAGAQSNwF-L9IrZmgrBgJVNy_llUGD9SxxF5-0OcRZLNTCLr5Mi14e4oeZ3sLkH5jD707XQHawFUFCTIo";

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

exports.register = async (req, res) => {
    const { email, name } = req.body;


    if (!email || !name) {
        return res.status(400).send('Email и имя обязательны.');
    }

    // Генерация случайного пароля
    const password = Math.random().toString(36).slice(-8);

    try {
        // Создание нового пользователя и сохранение в базе данных
        const newUser = new User({ email, name, password });
        await newUser.save();

        const { token } = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: myEmail,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: token,
            },
        });

        const mailOptions = {
            from: myEmail,
            to: email,
            subject: 'Ваш пароль для регистрации',
            text: `Привет, ${name}! Ваш пароль: ${password}`,
        };

        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        res.status(200).send('Сообщение с паролем отправлено на ваш email.');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Ошибка при отправке email.');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
