import {google} from 'googleapis'
import 'dotenv/config'

console.log(process.env)
console.log('hello')

async function main() {
  const sheet = google.sheets({
    version: 'v4',
    key: process.env.SHEETS_KEY
  })
  const res = await sheet.spreadsheets.values.get({
    spreadsheetId:
      '1eJk-J_UwVQ3qdCAqPKQ49sKff7dnKTfxfGf5E2GRvBE',
    range: 'Sheet1'
  })
  return res
}

main().then(console.log)
