var express  = require("express");
var app = express();
var parser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
mongoose.set("useFindAndModify",false);
mongoose.set("useCreateIndex",true);
mongoose.set("useUnifiedTopology",true);
mongoose.set("useNewUrlParser",true);
mongoose.connect("mongodb://localhost/BlogApp");

app.use(parser.urlencoded({extend:true}));
app.use(expressSanitizer());
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
  title:String,
  image:String,
  body:String,
  date: {type:Date,default:Date.now}
})

var Blog = mongoose.model("Blog",blogSchema);
// Blog.create({
//     title:"First Blog",
//     image:"https://images.unsplash.com/photo-1589380820045-119cfb372aba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     body:"Apple is Everywhere"
// },function(err,log){
//   if(err) console.log(err);
//   else console.log("Saved");
// });

app.get("/",function(req,res){
  res.redirect("/blog");
})

app.get("/blog",function(req,res){
     Blog.find({},function(err,blogs){
       if(err) console.log("Fuck error ");
       else {
         console.log("DISPLAYED");
         res.render("index",{blogs:blogs});
       }
     });
});

app.get("/blog/new",function(req,res){
  res.render("new");
})

app.post("/blog",function(req,res){
      req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog,function(err,sol){
    if(err) console.log(err);
    else console.log(sol);

  });
  res.redirect("/blog");
})


app.get("/blog/:id",function(req,res){
  id=req.params.id;
  console.log(id);
   Blog.findById(id,function(err,sol){
     if(err) console.log("error");
     else {
       console.log("show");
       res.render("show",{blogs:sol});
     }
   });
});

app.get("/blog/:id/edit",function(req,res){
  Blog.findById(req.params.id,function(err,body){
    if(err) console.log("eroor");
    else {
      res.render("edit",{blog:body});
    }
  });

});
app.put("/blog/:id",function(req,res){
     req.body.blog.body = req.sanitize(req.body.blog.body);
      Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,sol){
        if(err) console.log("errr");
        else {
          console.log("successfully updated");
          res.redirect("/blog/"+req.params.id);
        }
      });
    });

app.delete("/blog/:id",function(req,res){
  Blog.findByIdAndRemove(req.params.id,function(err,delte){
    if(err) console.log("ererere");
    else {
      console.log("delted");
      res.redirect("/blog");
    }
  })
})




app.listen(3000,function(){
  console.log("server started");
})
