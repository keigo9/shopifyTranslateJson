const deepl = require('deepl-node');
require('dotenv').config();

const authKey = process.env.DEEPL_API_KEY;
const translator = new deepl.Translator(authKey);

(async () => {
    const result = await translator.translateText('Hello, world!', null, 'ja');
    console.log(result.text); // こんにちは、世界よ！
})();