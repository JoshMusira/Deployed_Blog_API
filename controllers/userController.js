import sql from 'mssql';
import config from '../db/config.js';
import bcrypt from 'bcrypt';

//create User
export const createUser = async (req, res) => {
    const { username, email, password, created_at } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM Users WHERE username = @username OR email = @email');
        const user = result.recordset[0];
        if (user) {
            res.status(409).json({ error: 'User already exists' });
        } else {
            await pool.request()
                .input('username', sql.VarChar, username)
                .input('email', sql.VarChar, email)
                .input('hashedPassword', sql.VarChar, hashedPassword)
                .input('created_at', sql.VarChar, created_at)
                .query('INSERT INTO Users (username,email, password, created_at) VALUES (@username , @email , @hashedpassword,@created_at)');
            res.status(200).send({ message: 'User created successfully' });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred while creating the user' });
    } finally {
        sql.close();
    }

};


//Update the details of a user
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;
        const hashedpassword = bcrypt.hashSync(password, 10);
        let pool = await sql.connect(config.sql);
        await pool.request()
            .input("id", sql.Int, id)
            .input("username", sql.VarChar, username)
            .input("email", sql.VarChar, email)
            .input("hashedpassword", sql.VarChar, hashedpassword)
            .query("UPDATE Users SET username = @username, email = @email , password = @hashedpassword WHERE user_id = @id;");
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred while updating a User' });
    } finally {
        sql.close();
    }
};

// Get a single User
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        let pool = await sql.connect(config.sql);
        const result = await pool.request()
            .input("id", sql.Int, id)
            .query("SELECT * FROM Users WHERE user_id = @id");
        !result.recordset[0] ? res.status(404).json({ message: 'User not found' }) :
            res.status(200).json(result.recordset);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while retrieving todo' });
    } finally {
        sql.close();
    }
};

// Delete a User
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await sql.connect(config.sql);
        await sql.query`DELETE FROM Users WHERE user_id = ${id}`;
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred while deleting a User' });
    } finally {
        sql.close();
    }
};

// Get all Users
export const getAllUsers = async (req, res) => {
    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request().query("SELECT * FROM Users");
        !result.recordset[0] ? res.status(404).json({ message: 'User not found' }) :
            res.status(200).json(result.recordset);
    } catch (error) {
        console.log(error)
        res.status(201).json({ error: 'an error occurred while retrieving a User' });
    } finally {
        sql.close(); // Close the SQL connection
    }
};


