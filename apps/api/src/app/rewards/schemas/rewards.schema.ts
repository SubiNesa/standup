import * as mongoose from 'mongoose';

export const RewardSchema = new mongoose.Schema(
  {
    recipientId: {
      type: String,
      required: [true, 'RECIPIENT_ID_IS_BLANK'],
    },
    presenterId: {
      type: String,
      required: [true, 'PRESENTER_ID_IS_BLANK'],
    },
    drinks: {
      type: Number,
      default: 0,
    },
    food: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
