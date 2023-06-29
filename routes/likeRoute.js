import { createLike, getUsersWhoLikedPost } from '../controllers/likeController.js'
import { loginRequired } from '../controllers/auth.js'

const likeRoutes = (app) => {
    app.route('/like')
        .post(createLike);


    app.route('/like/:id')
        .get(getUsersWhoLikedPost)




}
export default likeRoutes