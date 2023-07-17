const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const app = express();
const discordLoader = require('./discord/DiscordLoader')
const messages = require('./assets/messages.json');

app.use(session({
    secret: 'mongo_dcverify',
    resave: false,
    saveUninitialized: false
}))
app.set('case sensitive routing', true);
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./css'))
app.use(express.static('./data'))

app.get('/', (request, result) => {
    if (request.session.error) {
        request.session.error = undefined;
    }
    result.send('home');
})

app.get('/auth', async (request, result) => {
    if (request.session.auth) {
        request.session.auth = undefined;
        if (!request.user) {
            request.session.error = true;
            return result.redirect('/error?text=' + messages.com_4);
        }
        const discordId = request.user.id;
        await discordLoader.getDc(discordId, (err, isOnDiscord) => {
            if (isOnDiscord) {
                discordLoader.addRulesRole(discordId);
                result.render('auth');
            } else {
                result.redirect('/error?text=' + messages.not_on_discord);
            }
        })
    } else {
        result.redirect('/')
    }
})

app.get('/error', (request, result) => {
    if (request.session.error) {
        result.render('error', { text: request.query.text })
    } else {
        result.redirect('/')
    }
});

passport.use(
    new DiscordStrategy(
        {
            clientID: '1129711538287149147',
            clientSecret: 'DQvda9LIjrtpjH9fTlG6u4uITML7_ggi',
            callbackURL: 'http://localhost:1337/auth/discord/callback',
            scope: ['identify']
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

app.get('/auth/discord/callback',
    (req, res, next) => {
        passport.authenticate('discord', (err, user, info) => {
            if (err) {
                req.session.error = true;
                return result.redirect('/error?text=' + messages.com_1);
            }
            if (!user) {
                req.session.error = true;
                return result.redirect('/error?text=' + messages.com_2);
            }
            req.logIn(user, (err) => {
                if (err) {
                    req.session.error = true;
                    return result.redirect('/error?text=' + messages.com_3);
                }
                req.session.auth = true;
                return res.redirect('/auth');
            });
        })(req, res, next);
    }
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.listen(1337, '127.0.0.1', () => {
    discordLoader.startBot();
})
