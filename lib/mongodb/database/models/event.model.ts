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
  externalSignUpUrl?: string;
  imageUrl: string;
  isFree: boolean;
  isHostedExternally?: boolean;
  location?: string;
  price: string;
  startDateTime: Date;
  title: string;
}

const EventSchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  createdAt: { type: Date, default: Date.now },
  description: { type: String, required: false },
  endDateTime: { type: Date, default: Date.now },
  externalSignUpUrl: { type: String, required: false },
  imageUrl: { type: String, required: true },
  isFree: { type: Boolean, default: false },
  isHostedExternally: { type: Boolean, required: false },
  location: { type: String, required: false },
  price: { type: String },
  startDateTime: { type: Date, default: Date.now },
  title: { type: String, required: true },
});

// Use existing model. Or create new instance of the model
const Event = models.Event || model("Event", EventSchema);

export default Event;
