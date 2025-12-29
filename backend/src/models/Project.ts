import { Schema, model, Types } from "mongoose";

const mediaSchema = new Schema({
  fileId: String,
  url: String,
  type: {
    type: String,
    enum: ["IMAGE", "VIDEO"]
  }
});

const projectSchema = new Schema(
  {
    generator: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },

    projectName: {
      type: String,
      required: true
    },

    hectaresRestored: {
      type: Number,
      required: true
    },

    location: {
      latitude: Number,
      longitude: Number,
      address: String
    },

    media: [mediaSchema],

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

export default model("Project", projectSchema);
