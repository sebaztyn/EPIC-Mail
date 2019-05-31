import { Pool } from 'pg';
import 'dotenv/config';


let dbString = process.env.DATABASE_URL;
if (process.env.NODE_ENV === 'test') dbString = process.env.DATABASE_TEST;
if (process.env.NODE_ENV === 'development') dbString = process.env.DATABASE_DEV_URL;
const pool = new Pool({
  connectionString: dbString
});
pool.connect()
  .then(() => {
    console.log(`connected to the db - ${process.env.NODE_ENV} database`);
  })
  .catch(err => console.log(err));

const dbQuery = async (query) => {
  const result = await pool.query(query);
  return result;
}
;

export default dbQuery;
