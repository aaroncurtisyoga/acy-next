import { model, models, Schema } from "mongoose";

const UserSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // Todo: Might not need username. Consider removing at a later date.
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  photo: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

const User = models.User || model("User", UserSchema);

export default User;
