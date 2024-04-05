import { Document, model, models, Schema } from "mongoose";

export interface IEvent extends Document {
  _id: string;
  category: {
    _id: string;
    name: string;
  };
  createdAt: Date;
  description?: string;
  endDateTime: Date;
  externalRegistrationUrl?: string;
  imageUrl?: string; // 940 x 470
  isFree?: boolean;
  isHostedExternally: boolean;
  location: {
    formattedAddress: string;
    geometry: {
      lat: number;
      lng: number;
    };
    name: string;
    placeId: string;
  };
  maxAttendees?: number;
  price?: string;
  startDateTime: Date;
  title: string;
}

const EventSchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  createdAt: { type: Date, default: Date.now },
  description: { type: String, required: false },
  endDateTime: { type: Date, default: Date.now },
  externalRegistrationUrl: { type: String, required: false },
  imageUrl: { type: String, required: false },
  isFree: { type: Boolean, default: false, required: false },
  isHostedExternally: { type: Boolean, required: true },
  location: {
    formattedAddress: String,
    geometry: {
      lat: Number,
      lng: Number,
    },
    name: String,
    placeId: String,
  },
  maxAttendees: { type: Number, required: false },
  price: { type: String, required: false },
  startDateTime: { type: Date, default: Date.now },
  title: { type: String, required: true },
});

// Use existing model. Or create new instance of the model
const Event = models.Event || model("Event", EventSchema);

export default Event;
