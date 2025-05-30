const path = require('path');
const mongoose = require ('mongoose');
const jwt = require('jsonwebtoken');
const sendEmail = require("../utils/email");
const { generateSystemPrompt, generateUserPrompt, checkAgainstBlocklist } = require("../utils/guardrails");
const { sendPrompt } = require('../utils/openaiservice')
const ExpressError = require('../utils/ExpressError');
const user =  require('../models/users');
const Token = require("../models/token");
const crypto = require('crypto');
const fs = require('fs').promises;
require('dotenv').config();

const llmsettings = {};

llmsettings.systemprompt = generateSystemPrompt("Level 1", "None"); // initial level and settings
llmsettings.spotlight = "None";
llmsettings.model = "gpt-4o-mini"
llmsettings.inputfilter = [];
llmsettings.outputfilter = [];

mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
        console.log("Connection open");
    })
    .catch(err => {
        console.log("Error: ");
        console.log(err);
    });

// change the below into utils and add all validations
function validate(body) {
  if (!body.email || !body.password) return false;
  if (body.password=="") return false;   // test with an empty password to see if we need this line
  return true;
};

const authenticateJWT = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (authHeader) {
      jwt.verify(authHeader, process.env.JWT_SECRET, (err, id) => {
          if (err) {
              return res.sendStatus(403);
          }
          req.id = id;
          next();
      });
  } else {
      res.sendStatus(401);
  }
};

// To prevent brute-force attacks, consider adding logging or rate limiting for login attempts.
const login = async (req, res, next) => {
  try {

    if (!validate(req.body)) return next(new ExpressError('No credentials provided', 400) );

    let foundUser = await user.authenticate(req.body.email, req.body.password);
    if (!foundUser) {
      //return next (new ExpressError('Incorrect username or password', 404) );
      return res.status(401).send({
        message: "Incorrect username or password"
      });
    }
    if (!foundUser.verified) {
      //return next ( new ExpressError('Email not verified', 401) );   
      return res.status(401).send({
        message: "Email not verified"
      });
    }
    
    const token = jwt.sign({
      id: foundUser._id.toString()
    }, process.env.JWT_SECRET, { expiresIn: '2h' });

    // save user token
    foundUser.sessionToken = token;
    await foundUser.save();

    res.status(200).json({
      id: foundUser._id,
      name: foundUser.name,
      email: foundUser.email,
      sessionToken: foundUser.sessionToken
    });
    
  } catch (err) {
    next( err );
  }
};

const register = async (req, res, next) => {
  try {

    if (!validate(req.body))
      return next(new ExpressError('No credentials provided', 400));
      
    const { name, email, password } = req.body;
    const email_lower =  email.toLowerCase()

    const userExist = await user.findOne({ email: email_lower });
    if (userExist) {      
      return res.status(409).send({
        message: "Email already exists"
      });
    }
    const nuUser = new user({
      name,
      email: email_lower,
      password, // password is being hashed inside the schema model as a pre save.
    });

    let token = await new Token({
      userId: nuUser._id.toString(),
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    console.log(token)

    const baseURL = process.env.BASE_URL;

    const message = `${baseURL}/api/verify/${token.userId}/${token.token}`;
    console.log(message)
    //check for email format, consider adding a regex or using a library like validator.
    try {
      await sendEmail(nuUser.email, "Verify Email", message);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
      // Optionally delete the user or token if email fails
    }

    console.log ( await nuUser.save() );

    //res.status(200).send(nuUser._id);
    res.status(201).send({ userId: nuUser._id });


  } catch (err) {
    next(err);
  }
}

const verifyemail = async (req, res, next) => {
  //console.log("Verifying email...");
  //console.log(req.params.id);
  //console.log(req.params.token);
  
  try {
    const veruser = await user.findById(req.params.id);

    if (!veruser) return res.status(200).send("Invalid link user"); // remove the user fb

    if (veruser.verified) return res.status(200).send("Token has already been verified"); 

    console.log (req.params.token) 

    const token = await Token.findOne({
      userId: veruser._id.toString(),
      token: req.params.token,
    });
    
        if (!token) return res.status(200).send("Invalid link token");  // remove the token fb

    veruser.verified = true;
    console.log ( veruser.save() );
    console.log ( await Token.findByIdAndDelete(token._id) );

    //res.send("email verified successfully");
    res.sendFile(path.resolve('src/views/regconfirm.html'));
  } catch (err) {
    next( err );
  }
}

const submitprompt = async (req, res, next) => {
  try {
    const foundUser = await user.findById(req.id.id);
    if (!foundUser) return next(new ExpressError('Not Authenticated', 401));

    const { userprompt } = req.body;
    if (!userprompt) return next(new ExpressError('No prompt provided', 400));

    let message = "Prompt processed successfully";
    let response = null;

    if (checkAgainstBlocklist(userprompt, llmsettings.inputfilter)) {
      response = "Got you! It looks like you hit the input blocklist. Try to be more subtle plz!";
    } else {
      const prompt = generateUserPrompt(userprompt, llmsettings.spotlight);
      const aiResponse = await sendPrompt(llmsettings.systemprompt, prompt);

      if (checkAgainstBlocklist(aiResponse, llmsettings.outputfilter)) {
        response = "Wow! It looks like you hit the output blocklist. This means you prooobably got the password but it got blocked. You're on the right track, try to be more creative! ;)";
      } else {
        response = aiResponse;
      }
    }

    return res.status(200).json({ message, response });

  } catch (err) {
    console.error(err);
    next(err);
  }
};


const submitsettings = async (req, res, next) => {
  try {

    const foundUser = await user.findById(req.id.id);
    if (!foundUser) return next( new ExpressError('Not Authenticated', 401) ); 

    const { settings } = req.body;
    if (!settings) return next(new ExpressError('Missing settings', 400));

    const { systemPrompt, inputFilter, outputFilter, selectedGuardrail, sysmodel} = settings;

    llmsettings.inputfilter = inputFilter.split('\n').map(term => term.trim()).filter(Boolean);
    llmsettings.outputfilter = outputFilter.split('\n').map(term => term.trim()).filter(Boolean);
    llmsettings.spotlight = selectedGuardrail;
    llmsettings.systemprompt = systemPrompt;
    llmsettings.model = sysmodel;
    // no need to generate system prompt as it's being generated on front end
    //llmsettings.systemprompt = generateSystemPrompt(settings.level, settings.spotlight);

    return res.status(200).send({
      message: "Settings submitted successfully"
    });

  } catch (err) {     
    console.log(err)     
    next( err );
  }
};

module.exports = {
  register,
  login,
  authenticateJWT,
  verifyemail,
  submitprompt,
  submitsettings
};