import { createUser, updateUser, getUser, getAllUsers, deleteUser } from '../controllers/userController.js';
import { login, Register, loginRequired } from '../controllers/auth.js'
//Users
const userRoutes = (app) => {
    app.route('/user')
        .get(loginRequired, getAllUsers)
        .post(loginRequired, createUser);

    app.route('/user/:id')
        .put(loginRequired, updateUser)
        .get(loginRequired, getUser)
        .delete(loginRequired, deleteUser);

    // auth routes
    app.route('/auth/register')
        .post(Register);

    app.route('/auth/login')
        .post(login);


}


export default userRoutes;