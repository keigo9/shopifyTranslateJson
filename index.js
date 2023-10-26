const deepl = require('deepl-node');
const json2csv = require('json2csv');
const fs = require('fs').promises;
require('dotenv').config();

const authKey = process.env.DEEPL_API_KEY;
const translator = new deepl.Translator(authKey);

const inputFilePath = './data/input/test.json'; // 入力CSVファイルのパス
const outputFilePath = './data/output/output.json'; // 出力CSVファイルのパス

// JSONファイルを読み込む
const jsonData = require(inputFilePath);

async function translateObject(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = await translateText(obj[key]);
    } else if (typeof obj[key] === 'object') {
      await translateObject(obj[key]);
    }
  }
}

// テキストを翻訳する関数
async function translateText(text) {
  try {
    const result = await translator.translateText(text, null, 'ja');
    return result.text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // エラーが発生した場合、元のテキストを返す
  }
}

// JSONオブジェクト内のテキストを再帰的に翻訳する関数
async function translateJson(json) {
  for (const prop in json) {
    if (json.hasOwnProperty(prop)) {
      if (typeof json[prop] === 'string') {
        //console.log(json[prop]);
        json[prop] = await translateText(json[prop]);
        //console.log(json[prop]);
      } else if (typeof json[prop] === 'object') {
        await translateJson(json[prop]);
      }
    }
  }
}

async function translateAndWriteJSON() {
  await translateJson(jsonData);
  console.log(jsonData);

  try {
    // JSONデータを文字列に変換
    const jsonString = JSON.stringify(jsonData, null, 2);
    // JSONファイルに書き込み
    await fs.writeFile(outputFilePath, jsonString);
    console.log('JSON file has been saved as output.json');
  } catch (error) {
    console.error('JSON writing failed:', error);
  }
}

// 翻訳とJSON書き込みを実行
translateAndWriteJSON().catch(error => {
  console.error('Translation and CSV writing failed:', error);
});
