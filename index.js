const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

// ファイルパスとDeepl APIの認証キーを設定
const inputFileName = "en.default.json"; // this is your file name you want to translate.
const filePath = `./data/input/${inputFileName}`;
const apiKey = process.env.DEEPL_API_KEY;
const outputPath = `./data/output/ja.json`;

// ファイルの読み込み
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Failed to read the file:', err);
    return;
  }

  try {
    const fileContent = JSON.parse(data);

    // 翻訳を行う関数
    const translate = async (text) => {
      try {
        const response = await axios.post(
          'https://api-free.deepl.com/v2/translate',
          {
            text,
            source_lang: 'EN',
            target_lang: 'JA',
            auth_key: apiKey
          }
        );

        return response.data.translations[0].text;
      } catch (error) {
        console.error('Translation failed:', error.response.data);
        return '';
      }
    };

    // 再帰的な翻訳処理
    const translateObject = async (obj) => {
      if (typeof obj !== 'object') {
        // 文字列の場合は翻訳を行う
        return translate(obj);
      }

      if (Array.isArray(obj)) {
        // 配列の場合は各要素に対して翻訳を行う
        const translatedArray = await Promise.all(obj.map((item) => translateObject(item)));
        return translatedArray;
      }

      // オブジェクトの場合は各プロパティに対して翻訳を行う
      const translatedObject = {};
      await Promise.all(Object.entries(obj).map(async ([key, value]) => {
        translatedObject[key] = await translateObject(value);
      }));
      return translatedObject;
    };

    // 翻訳を実行
    translateObject(fileContent)
      .then((translatedContent) => {
        // 翻訳結果を出力するか、元のファイルに上書きするか選択
        fs.writeFile(outputPath, JSON.stringify(translatedContent, null, 2), 'utf8', (err) => {
          if (err) {
            console.error('Failed to write the translated file:', err);
          } else {
            console.log('Translation completed. Translated file saved at:', outputPath);
          }
        });
      })
      .catch((error) => {
        console.error('Translation failed:', error);
      });
  } catch (error) {
    console.error('Failed to parse the file content:', error);
  }
});