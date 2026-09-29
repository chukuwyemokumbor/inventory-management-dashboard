// Creates server/db.json from the tracked seed file so json-server's writes
// never dirty the repo. Pass --reset to restore the sample data.
import { copyFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const seed = fileURLToPath(new URL('./db.seed.json', import.meta.url))
const db = fileURLToPath(new URL('./db.json', import.meta.url))

if (process.argv.includes('--reset') || !existsSync(db)) {
  copyFileSync(seed, db)
  console.log('server/db.json created from db.seed.json')
}
