const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const sendPrompt = async ( systemprompt, userprompt, sysmodel) => {

    console.log(systemprompt)
    console.log(userprompt)

    switch (sysmodel) {
        case "gpt-3.5-turbo":
            break;
        case "gpt-4o-mini":
            break;
        default:
            sysmodel = "gpt-4o-mini"
    }
    console.log (sysmodel)
    if (!systemprompt || !userprompt) {
        throw new Error("Both systemprompt and userprompt must be non-null strings.");
    }

    const completion = await openai.chat.completions.create({
        model: sysmodel,
        messages: [{ role: 'system', content: systemprompt }, { role: "user", content: userprompt }],
        temperature: 0.7,
        });

    console.log (completion.choices[0].message.content)
    return completion.choices[0].message.content;
};

module.exports = {
    sendPrompt
};