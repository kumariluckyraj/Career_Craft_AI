import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    username: { type: String, required: true },
    profilepic: { type: String },
    coverpic: { type: String },

    razorpayId: { type: String },
    razorpaySecret: { type: String },

    // ✅ Pitch fields
    lastPitchGeneratedAt: {
      type: Date,
      default: null,
    },
    showPitchReminder: {
      type: Boolean,
      default: true,
    },

    // ✅ Strategy fields
    lastStrategyGeneratedAt: {
      type: Date,
      default: null,
    },

    // ✅ Post Ideas fields (NEW)
    lastPostIdeaGeneratedAt: {
      type: Date,
      default: null,
    },
    showPostIdeaReminder: {
      type: Boolean,
      default: true,
    },

    // ✅ Tech Stack (PERMANENT STORAGE)
    techStack: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true } // creates createdAt & updatedAt
);

export default mongoose.models.User || model("User", UserSchema);
