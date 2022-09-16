import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

//define schema
const userSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true,
     unique: true
  },
  password:{
    type: String,
    required: true,

  },
  isAdmin:{
    type: Boolean,
    required: true,
    default: false
  }
},{
  timestamps: true
})

//method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  //check password
  return await bcrypt.compare(enteredPassword, this.password)
}

//method to encrypt password before saving a record in db
userSchema.pre('save',async function(next){

  //if password is not changed
  if(!this.isModified('password')){

    //go to next middleware
    next()
  }

  //if password is changed


  //generate salt
  const salt = await bcrypt.genSalt(10)
  //hash password
  this.password = await bcrypt.hash(this.password, salt)
})
//define model
const User = mongoose.model('User',userSchema)

export default User;
