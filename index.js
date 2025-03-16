import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");

const blogs = [];
const users = [];
let currentDate; 


app.get("/", (req, res) => {
    if (!currentDate) {
        currentDate = new Date().toLocaleString();
    }
    res.render("home.ejs", { blogs: blogs, currentDate: currentDate});
});

app.get("/blogs", (req, res) => {
    res.render("index.ejs", {blogs});
});

app.get("/blogs", (req, res) => {
    res.render("blogs.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/sign-up", (req, res) => {
    res.render("signup.ejs");
});



app.post("/new", (req, res) => {
    const { blogName, blogContent } = req.body;

    const newBlog = {
        id: blogs.length + 1,
        title: blogName,
        content: blogContent,
        date: new Date().toLocaleString(),
    }

    blogs.push(newBlog);

    res.render("index.ejs", {blogs});
});

app.post("/sign-up", (req, res) => {
  const { userName, password } = req.body;

  const newUser = {
    id: users.length + 1,
    userName: userName,
    password: password,
    date: Date.now(),
  };

  users.push(newUser);

  res.render("home.ejs");
});

app.get("/blogs/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const findEditBlog = blogs.find((blog) => blog.id === id);

    if(findEditBlog) {
        res.render("blogs.ejs", {blog: findEditBlog});
    } else {
        res.status(404).send("Blog doesn't exist");
    }

});

app.get("/blogs/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const findEditBlog = blogs.find((blog) => blog.id === id);

  if (findEditBlog) {
    res.render("edit.ejs", { blog: findEditBlog });
  } else {
    res.status(404).send("Blog doesn't exist");
  }
});



app.put("/blogs/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const {blogName, blogContent} = req.body;
    const searchIndex = blogs.findIndex((blog) => blog.id === id); 


    if (searchIndex !== -1) {
        blogs[searchIndex] = {
            id: id,
            title: blogName,
            content: blogContent,
            date: new Date().toLocaleString(),
        };
        res.redirect(`/blogs/${id}`);
    } else {
        res.status(404).send("Blog not found")
    }
    
});

app.delete("/blogs/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const searchIndex = blogs.findIndex((blog) => blog.id === id);

    if (searchIndex >= 0) {
        blogs.splice(searchIndex, 1);
        res.redirect("/blogs/");
    } else {
        res.status(404).send("Blog not found");
    }
});



app.listen(port, () => {
    console.log(`Server liston on port: http://localhost:${port}`);
});