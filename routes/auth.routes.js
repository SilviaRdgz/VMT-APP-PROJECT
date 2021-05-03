const { Router } = require("express");
const bcrypt = require("bcrypt");
const router = Router();

const User = require("../models/User.model");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("auth/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/profile",
    failureRedirect: "/login" 
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: "929991102791-qbj75isgp28ntgfn9e9vbbiq6hfei9k4.apps.googleusercontent.com",
      clientSecret: "Fwl-cE0n8vtlh-UhfXMbS3YU",
      callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Google account details:", profile);
 
      User.findOne({ googleID: profile.id })
        .then(user => {
          if (user) {
            done(null, user);
            return;
          }
 
          User.create({ googleID: profile.id })
            .then(newUser => {
              done(null, newUser);
            })
            .catch(err => done(err)); 
        })
        .catch(err => done(err)); 
    }
  )
);


router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    res
      .status(400)
      .render("auth/signup", { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

  User.findOne({ email })
    .then((userResult) => {
      if (userResult) {
        res.status(400).render("auth/signup", {
          errorMessage: "Email already exists",
        });
        return;
      }

      bcrypt
        .hash(password, 10)
        .then((passwordHash) => {
          return User.create({ email, passwordHash, fullName });
        })
        .then((newUser) => {
          req.login(newUser, (err) => {
            if (err) {
              res.status(500).render("auth/signup", {
                errorMessage: "Login failed after signup",
              });
              return;
            }
            res.redirect("/profile");
          });
        })
        .catch((hashErr) => next(hashErr));
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('auth/signup', {
           errorMessage: 'Username and email need to be unique. Either username or email is already used.'
        });
      } else {
        next(error);
      }
    });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
