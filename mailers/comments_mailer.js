import { transporter, renderTemplate } from "../config/nodemailer.js";

// this is another way of exporting a method

const newComment = (comment) => {
  let htmlString = renderTemplate(
    { comment: comment },
    "/comments/new_comment.ejs"
  );
  transporter.sendMail(
    {
      from: "singalcn7@gmail.com",
      to: comment.user.email,
      subject: "New Comment Published!",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending mail", err);
        return;
      }

      console.log("Message sent", info);
      return;
    }
  );
};

export { newComment };
