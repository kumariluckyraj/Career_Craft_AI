import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  profileUrl: { type: String, required: true },
  name: { type: String },
  description: { type: String },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Profile ||
  mongoose.model("Profile", ProfileSchema);
