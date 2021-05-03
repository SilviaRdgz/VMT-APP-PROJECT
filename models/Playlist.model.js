const { Schema, model } = require("mongoose");

const playlistSchema = new Schema({
  name: { type: String },
  theme: { type: String },
  description: { type: String },
  imageUrl: { type: String },
  url: [{ type: String }],
  owner: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("Playlist", playlistSchema);
