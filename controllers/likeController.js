
import sql from 'mssql';
import config from '../db/config.js';

//Get Users who liked a post
export const createLike = async (req, res) => {
    const { post_id, user_id } = req.body;
    // const created_at = new Date().toISOString();

    try {
        const pool = await sql.connect(config.sql);

        const query = `
        SELECT post_id, user_id
        FROM Likes
        WHERE post_id = @post_id AND user_id = @user_id
      `;

        const result = await pool
            .request()
            .input('post_id', sql.Int, post_id)
            .input('user_id', sql.Int, user_id)
            .query(query);

        const like = result.recordset[0];

        if (like) {
            res.status(409).json({ error: 'Like already exists' });
        } else {
            const insertQuery = 'INSERT INTO Likes (post_id, user_id) VALUES (@post_id, @user_id)';

            await pool
                .request()
                .input('post_id', sql.Int, post_id)
                .input('user_id', sql.Int, user_id)
                .query(insertQuery);
        }

        res.status(200).send({ message: 'Like created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while creating a Like' });
    } finally {
        sql.close();
    }
};

//   export { getUsersWhoLikedPost };
export const getUsersWhoLikedPost = async (req, res) => {
    const { post_id } = req.params;

    try {
        const pool = await sql.connect(config.sql);

        const query = `
        SELECT *
        FROM Likes 
        WHERE post_id = @post_id;
        
        `;

        const result = await pool.request()
            .input('post_id', sql.Int, post_id)
            .query(query);

        const usernames = result.recordset.map(record => record.username);

        res.status(200).json({ usernames });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while retrieving usernames' });
    } finally {
        sql.close();
    }
};

