import { createPost, getAllPost, updatePost, updatePost2, updatePost3, deletePost, getTimeStamp, getSinglePost } from '../controllers/postController.js'
import { loginRequired } from '../controllers/auth.js'
// import { getAllPost, createPost } from '../controllers/postController.js'
const postRoutes = (app) => {
    app.route('/post')
        .get(getAllPost)
        .post(loginRequired, createPost);

    app.route('/time')
        .get(getTimeStamp)

    //Title
    app.route('/post/:id')
        .put(loginRequired, updatePost)
        .get(loginRequired, getSinglePost)
        .delete(loginRequired, deletePost)
    //Content
    app.route('/post2/:id')
        .put(loginRequired, updatePost2)
    //Category
    app.route('/post3/:id')
        .put(loginRequired, updatePost3)


}

export default postRoutes