const mongoose =require("mongoose")

const todoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User",required:true},
  username:{type:String,required:true},
  status: { type: Boolean, default: false },
  description: { type: String, required: true },
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports=Todo;
