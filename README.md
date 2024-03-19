# translate json file, EN to JA
1. ```npm install```  project root directory in the Terminal
2. make ".env" file in root.
3. set env. DEEPL_API_KEY = "your_api_key".
4. upload en.default.json file to data/input.
5. type ```node index.js``` with the CLI.

## Confirm your api-key is working
- ```node deepl-test.js```
- If your api is working, return "こんにちは、世界よ！"