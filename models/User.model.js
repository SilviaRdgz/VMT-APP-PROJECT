const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: { 
      type: String, 
      unique: true, 
      lowercase: true, 
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      trim: true
    },
    passwordHash: { type: String },
    fullName: { type: String, trim: true, lowercase: true },
    googleID: { type: String },
    playlists: [{ type: Schema.Types.ObjectId, ref: "Playlist" }]
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = model("User", userSchema);

