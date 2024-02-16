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
  imgLarge: string; // 940 x 470
  imgThumbnail: string; // 50 x 25
  isFree: boolean;
  isHostedExternally?: boolean;
  location: {
    description: string;
    placeId: string;
    structuredFormatting: {
      mainText: string;
      secondaryText: string;
    };
  };
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
  imgLarge: String,
  imgThumbnail: String,
  isFree: { type: Boolean, default: false },
  isHostedExternally: { type: Boolean, required: false },
  location: {
    description: String,
    placeId: String,
    structuredFormatting: {
      mainText: String,
      secondaryText: String,
    },
  },
  price: { type: String },
  startDateTime: { type: Date, default: Date.now },
  title: { type: String, required: true },
});

// Use existing model. Or create new instance of the model
const Event = models.Event || model("Event", EventSchema);

export default Event;
