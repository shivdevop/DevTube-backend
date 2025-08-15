import mongoose,{Schema} from "mongoose";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },

    writtenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetType: {
      type: String,
      enum: ["Video", "Post", "Comment"], // what is being commented on
      required: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // ID of the video/post/comment
    },

    // If it’s a reply, this stores the parent comment ID
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
