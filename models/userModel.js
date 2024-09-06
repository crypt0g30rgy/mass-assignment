const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs"); // to encrypt password

const uuid = require("uuid").v4;

const UserSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      default: uuid,
    },
    username: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      unique: true
    },
    company: {
      type: String,
      required: false,
    },
    department: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      select: false
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "superuser"]
    }
  },
  { timestamps: true }
);

// Pre-save hook to hash the password
UserSchema.pre('save', async function (next) {
  // Check if the password is modified or is new
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  }

  next();
});

module.exports = mongoose.model("User", UserSchema);
