import logger from '../../lib/logger.js'
import getDatabase from '../../lib/database.js'

export default async function handler(req) {
  logger.info('handling request: %s %s', req.method, req.url)
  if (req.method === 'GET') {
    const db = await getDatabase()
    return db.allUsers()
  }
}
