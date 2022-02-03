import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

export const UserSchema = new mongoose.Schema ({
    name: {
        type: String,
        minlength: 6,
        maxlength: 255,
        required: [true, 'NAME_IS_BLANK']
    },
    email: {
        type: String,
        lowercase: true,
        maxlength: 255,
        minlength: 6,
        required: [true, 'EMAIL_IS_BLANK']
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024,
        required: [true, 'PASSWORD_IS_BLANK']
    },
    roles: {
        type: [String],
        default: ['']
    },
    teams: {
        type: [String],
        default: ['']
    },
    projects: {
        type: [String],
        default: ['']
    },
    deletedAt: {
        type: Date
    },
    settings: {
        goal: {
            last: {
                type: Boolean
            },
            search: {
                type: Boolean
            }
        }
    },
    rewards: {
        drinks: {
            type: Number
        },
        food: {
            type: Number
        }
    }
}, {
    versionKey: false,
    timestamps: true
});

UserSchema.pre('save', async function(next) {
    try {
      if (!this.isModified('password')) {
        return next();
      }
      // tslint:disable-next-line:no-string-literal
      const hashed = await bcrypt.hash(this['password'], 10);
      // tslint:disable-next-line:no-string-literal
      this['password'] = hashed;
      return next();
    } catch (err) {
      return next(err);
    }
  });