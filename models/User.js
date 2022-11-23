import mongoose from "mongoose";

// creqate schama
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      // unicqe : true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      // required : true,
      trim: true,
    },
    phone: {
      type: String,
      // required : true,
      trim: true,
    },
    skill: {
      type: String,
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    location: {
      type: String,

      trim: true,
    },

    photo: {
      type: String,
      trim: true,
    },
    gallery: {
      type: Array,
      trim: true,
    },
    follower: {
      type: [mongoose.Schema.Types.ObjectId],
      trim: "User",
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      trim: "User",
    },

    accessToken: {
      type: Array,
      trim: true,
    },

    isActivate: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// create collection
export default mongoose.model("user", userSchema);
