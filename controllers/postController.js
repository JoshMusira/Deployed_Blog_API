import sql from 'mssql';
import config from '../db/config.js';
import bcrypt from 'bcrypt';
// Create a Post

export const createPost = async (req, res) => {
    const { title, Content, image_URL, user_id, category_name } = req.body;
    // console.log(title, Content, image_URL, user_id, category_name);
    const created_at = new Date().toLocaleString();
    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request()
            .input('title', sql.VarChar, title)
            .input('Content', sql.VarChar, Content)
            .input('category_name', sql.VarChar, category_name)
            .query('SELECT * FROM Posts WHERE title = @title AND Content = @Content   AND category_name = @category_name');
        const user = result.recordset[0];
        if (user) {
            res.status(409).json({ error: 'Post already exists' });
        } else {
            await pool.request()
                .input('title', sql.VarChar, title)
                .input('Content', sql.VarChar, Content)
                .input('image_URL', sql.VarChar, image_URL)
                .input('user_id', sql.Int, user_id)
                .input('category_name', sql.VarChar, category_name)
                .input('created_at', sql.VarChar, created_at)
                .query('INSERT INTO Posts (title,Content,image_URL, user_id,category_name, created_at) VALUES (@title , @Content,@image_URL,@user_id , @category_name,@created_at)');
            res.status(200).send({ message: 'Post created successfully' });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred while creating the Post' });
    } finally {
        sql.close();
    }

};

//Get all Post
export const getAllPost = async (req, res) => {
    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request().query("SELECT * FROM Posts");
        !result.recordset[0] ? res.status(404).json({ message: 'Post not found' }) :
            res.status(200).json(result.recordset);
    } catch (error) {
        console.log(error)
        res.status(201).json({ error: 'an error occurred while retrieving Posts' });
    } finally {
        sql.close(); // Close the SQL connection
    }
};
//Get single Post
export const getSinglePost = async (req, res) => {
    const { id } = req.params
    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request()
            .input("post_id", sql.Int, id)
            .query(`SELECT * FROM Posts WHERE post_id = ${id}`);
        const post = result.recordset[0]
        !result.recordset[0] ? res.status(404).json({ message: 'Post not found' }) :
            res.status(200).json(post);
    } catch (error) {
        console.log(error)
        res.status(201).json({ error: 'an error occurred while retrieving Posts' });
    } finally {
        sql.close(); // Close the SQL connection
    }
};

//Get timeStamp
export const getTimeStamp = async (req, res) => {
    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request().query("SELECT created_at FROM Posts");
        !result.recordset[0] ? res.status(404).json({ message: 'TimeStamp not found' }) :
            res.status(200).json(result.recordset);
    } catch (error) {
        console.log(error)
        res.status(201).json({ error: 'an error occurred while retrieving TimeStamp' });
    } finally {
        sql.close(); // Close the SQL connection
    }
};



//Update the details of a Post Title
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        let pool = await sql.connect(config.sql);
        await pool.request()
            .input("id", sql.Int, id)
            .input("title", sql.VarChar, title)
            .query("UPDATE Posts SET title = @title WHERE post_id = @id;");
        res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred while updating a Post' });
    } finally {
        sql.close();
    }
};


//Update the details of a Post Content
export const updatePost2 = async (req, res) => {
    try {
        const { id } = req.params;
        const { Content, category_name } = req.body;
        let pool = await sql.connect(config.sql);
        await pool.request()
            .input("id", sql.Int, id)
            .input("Content", sql.VarChar, Content)
            // .input("Content", sql.VarChar, Content)
            // .input("category_name", sql.VarChar, category_name)
            .query("UPDATE Posts SET Content = @Content WHERE post_id = @id;");
        res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred while updating a Post' });
    } finally {
        sql.close();
    }
};

//Update the details of a Post category_name
export const updatePost3 = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_name } = req.body;
        let pool = await sql.connect(config.sql);
        await pool.request()
            .input("id", sql.Int, id)
            .input("category_name", sql.VarChar, category_name)
            .query("UPDATE Posts SET category_name = @category_name WHERE post_id = @id;");
        res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred while updating a Post' });
    } finally {
        sql.close();
    }
};


//delete post
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        await sql.connect(config.sql);
        await sql.query`DELETE FROM Posts WHERE post_id = ${id}`;
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred while deleting a User' });
    } finally {
        sql.close();
    }
};


