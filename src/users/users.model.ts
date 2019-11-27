import * as mongoose from "mongoose";
import { validateCPF } from "../common/validators";
import * as bcrypt from "bcrypt";
import { environment } from "../common/environment";
import * as restify from "restify";

export interface UserInterface extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  matches(password: string): boolean
}

export interface UserModel extends mongoose.Model <UserInterface> {
  findByEmail(email: string, projection?: string): Promise<UserInterface>
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 80,
    minlength: 3
  },
  email: {
    type: String,
    unique: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    required: true
  },
  password: {
    type: String,
    select: false,
    required: true
  },
  gender: {
    type: String,
    required: false,
    enum: ["Male", "Female"]
  },
  cpf: {
    type: String,
    required: false,
    validate: {
      validator: validateCPF,
      msg: "{PATH}: invalid CPF ({VALUE})"
    }
  }
});

userSchema.statics.findByEmail = function(email: string, projection: string){
  return this.findOne({email}, projection)
}

userSchema.methods.matches = function(password: string): boolean {
  return bcrypt.compareSync(password, this.password)
}

const hashPassword = (obj: any, next: restify.Next) => {
  bcrypt
    .hash(obj.password, environment.security.saltRounds)
    .then(hash => {
      obj.password = hash;
      next();
    })
    .catch(next);
};

const saveMiddleware = function(this: any, next: restify.Next) {
  const user = this;
  if (!user.isModified("password")) {
    next();
  } else {
    hashPassword(user, next);
  }
};

const updateMiddleware = function(this: any, next: restify.Next) {
  if (!this.getUpdate().password) {
    next();
  } else {
    hashPassword(this.getUpdate(), next);
  }
};

userSchema.pre("save", saveMiddleware);
userSchema.pre("findOneAndUpdate", updateMiddleware);
userSchema.pre("update", updateMiddleware);

export const User = mongoose.model<UserInterface, UserModel>("User", userSchema);
