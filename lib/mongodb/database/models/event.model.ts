import { Document, model, models, Schema } from "mongoose";

export interface IEvent extends Document {
  _id: string;
  category?: {
    _id: string;
    name: string;
  };
  createdAt: Date;
  description?: string;
  endDateTime: Date;
  imageUrl: string;
  isFree: boolean;
  isSignUpManagedExternally?: boolean;
  location?: string;
  price?: string;
  startDateTime: Date;
  title: string;
  url?: string;
}

const EventSchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  createdAt: { type: Date, default: Date.now },
  description: { type: String, required: false },
  endDateTime: { type: Date, default: Date.now },
  imageUrl: { type: String, required: true },
  isFree: { type: Boolean, default: false },
  isSignUpManagedExternally: { type: Boolean, required: false },
  location: { type: String, required: false },
  price: { type: String },
  startDateTime: { type: Date, default: Date.now },
  title: { type: String, required: true },
  url: { type: String },
});

// Use existing model. Or create new instance of the model
const Event = models.Event || model("Event", EventSchema);

export default Event;
