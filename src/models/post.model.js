import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const postSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    image: {
      type: String // optional — store Cloudinary URL if uploaded
    },

    //likes will be array of user ids(object)
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

postSchema.plugin(aggregatePaginate)
export const Post = mongoose.model("Post", postSchema);
