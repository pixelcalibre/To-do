//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://Admin-Rakshith:test123@cluster0.xorse.mongodb.net/todolistDB?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const itemsSchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name: "Welcome to your ToDo List"
}) ;
const item2 = new Item({
  name: "Hit + to add new items"
}) ;
const item3 = new Item({
  name: "<---- hit this to crosscheck your task"
}) ;
const defaultItems = [item1,item2,item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});
const List = new mongoose.model("List",listSchema);

const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){

  Item.find({},function(err,results){
    if(results.length === 0)
    {
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Successfully saved default data");
        }
      });
      res.redirect("/");
    }else{
res.render("list",{listtitle: retday, newitems: results});
}
});
let retday = "Today";





});
app.post("/",function(req,res){
const itemName = (req.body.todoitem);
const listname = req.body.button;
const newItem = new Item({
  name: itemName
});

if(listname=== "Today")
{
  newItem.save();
  res.redirect("/");
}else{
  List.findOne({name: listname},function(err,foundlist){
    foundlist.items.push(newItem);
    foundlist.save();
    res.redirect("/"+listname);
  });
}

  // if(req.body.button === "Work")
  // {
  //   workitems.push(req.body.todoitem);
  //   res.redirect("/work");
  // }else{
  //   items.push(req.body.todoitem);
  //   res.redirect("/");
  // }

});

app.post("/delete",function(req,res){
  const id = (req.body.checkbox);
  const listname = req.body.hidden;
  if(listname === "Today")
  {
    Item.findByIdAndRemove(id,function(err){
      if(!err)
      {
        console.log("Successfully deleted");
        res.redirect("/");
      }
    });
  }else{
    List.findOneAndUpdate({name: listname},{$pull: {items: {_id : id}}},function(err,foundlist){
      if(!err){
        res.redirect("/"+listname);
      }
    });
  }

});
app.get("/:topic",function(req,res){
  const topic = _.capitalize(req.params.topic);
List.findOne({name: topic},function(err,foundList){
  if(!err)
  {
    if(!foundList)
    {
      const list = new List({
        name: topic,
        items: defaultItems
      });
      list.save();
      res.redirect("/"+topic);
    }else{
      res.render("list",{listtitle: foundList.name, newitems: foundList.items});
    }
  }
});

});
// app.get("/work",function(req,res){
//   res.render("list",{listtitle:"Work List", newitem:workitems});
// });
// app.post("/work",function(req,res){
//   workitems.push(req.body.todoitem);
//   res.redirect("/work");
// });
app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
// switch(currentday){
//   case 1 : retday="Monday";
//   break;
//   case 2 : retday="Tueday";
//   break;
//   case 3 : retday="Wednesnday";
//   break;
//   case 4 : retday="Thursday";
//   break;
//   case 5 : retday="Friday";
//   break;
//   case 6 : retday="Saturday";
//   break;
//   case 0: retday = "Sunday";
//   break;
// }
