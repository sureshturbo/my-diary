import { query } from '../db/index';
import validate from '../utils/validate';

class entryController {
  /**
   * Get all of a user's diary entries
   * Requires auth token to be passed in authorization header
   * @static
   * @param {*} req - Client request object
   * @param {*} res - Server response object
   * @returns {object} token
   * @memberof userController
   */
  static getAllEntries(req, res) {
    let { limit, page } = req.query;
    // validate queries
    limit = validate.isNumber(limit) ? limit : 20;
    page = validate.isNumber(page) ? page : 0;
    // get entries
    query(
      `SELECT entries.id, entries.title, entries.content, entries.created_on, entries.updated_on, 
        entries.is_favorite FROM entries INNER JOIN users ON entries.user_id=users.id WHERE users.email=$1 
        LIMIT $2 OFFSET $3`,
      [req.authorizedUser.email, limit, page * limit],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: { message: 'An error occurred on the server' } });
        }
        return res.status(200).json({ entries: result.rows, meta: { limit, page } });
      },
    );
  }
}

export default entryController;
