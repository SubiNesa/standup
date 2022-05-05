import * as mongoose from 'mongoose';

export const GoalSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'USER_ID_IS_BLANK'],
    },
    ticket: {
      type: String,
      required: [true, 'TICKET_IS_BLANK'],
    },
    details: {
      type: String,
    },
    title: {
      type: String,
      required: [true, 'TITLE_IS_BLANK'],
    },
    blocked: {
      type: Boolean,
      required: [true, 'BLOCKED_IS_BLANK'],
    },
    finish: {
      type: Number,
      required: [true, 'FINISH_IS_BLANK'],
    },
    days: {
      type: Number,
    },
    comments: {
      type: Array,
    },
    previous: {
      type: [],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
