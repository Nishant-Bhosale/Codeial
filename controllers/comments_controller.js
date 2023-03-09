import Comment from "../models/comment.js";
import Post from "../models/post.js";
import { newComment } from "../mailers/comments_mailer.js";
import queue from "../config/kue.js";
import commentEmailWorker from "../workers/comment_email_worker.js";
import Like from "../models/like.js";

// module.exports.create = async function(req, res){

// try{
//     let post = await Post.findById(req.body.post);

//     if (post){
//         let comment = await Comment.create({
//             content: req.body.content,
//             post: req.body.post,
//             user: req.user._id
//         });

//         post.comments.push(comment);
//         post.save();

//         comment = await comment.populate('user', 'name email').execPopulate();
//         // commentsMailer.newComment(comment);

//         let job = queue.create('emails', comment).save(function(err){
//             if (err){
//                 console.log('Error in sending to the queue', err);
//                 return;
//             }
//             console.log('job enqueued', job.id);

//         })

//         if (req.xhr){

//             return res.status(200).json({
//                 data: {
//                     comment: comment
//                 },
//                 message: "Post created!"
//             });
//         }

//         req.flash('success', 'Comment published!');

//         res.redirect('/');
//     }
// }catch(err){
//     req.flash('error', err);
//     return;
// }

//}

async function create(req, res) {
  try {
    let post = await Post.findById(req.body.post);

    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });

      post.comments.push(comment);
      post.save();

      // comment = await comment.populate('user', 'name email').execPopulate();
      const nC = await Comment.findById(comment._id).populate("user");
      newComment(nC);

      let job = queue.create("email", nC).save(function (err) {
        if (err) {
          console.log("Error in sending to the queue", err);
          return;
        }
        // commentEmailWorker
        console.log("job enqueued", job.id);
      });

      if (req.xhr) {
        //  comment = await comment.populate('user', 'name').execPopulate();
        console.log("first");
        return res.status(200).json({
          data: {
            comment: nC,
          },
          message: "Post created!",
        });
      }

      req.flash("success", "Comment published!");

      res.redirect("/");
    }
  } catch (err) {
    req.flash("error", err);
    return;
  }
}

async function destroy(req, res) {
  try {
    let comment = await Comment.findById(req.params.id);

    if (comment.user == req.user.id) {
      let postId = comment.post;

      comment.remove();

      let post = Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });

      // CHANGE :: destroy the associated likes for this comment
      await Like.deleteMany({ likeable: comment._id, onModel: "Comment" });

      // send the comment id which was deleted back to the views
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment_id: req.params.id,
          },
          message: "Post deleted",
        });
      }

      req.flash("success", "Comment deleted!");

      return res.redirect("back");
    } else {
      req.flash("error", "Unauthorized");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", err);
    return;
  }
}

export { create, destroy };
