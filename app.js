const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);
/////////////////API for all document//////////////
app.route('/articles')
    .get(function (req, res) {
        Article.find(function (err, articleResults) {
            if (!err) {
                res.send(articleResults);
            } else {
                res.send(err);
            }
        })
    })
    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added a new article to database");
            } else {
                res.send(err);
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Successfully delete all document");
            } else {
                res.send(err);
            }
        });
    });

//////////API for specific document///////////////
app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({
            title: req.params.articleTitle
        }, function (err, articleResult) {
            if (articleResult) {
                res.send(articleResult);
            } else {
                res.send("No articles matching that title was found.");
            }
        });
    })
    .put(function (req, res) {
        //dalam mengupdate data pada mongoose ada 3 cara yaitu update, updateOne, dan replaceOne
        //update deprecated
        //updateOne mengupdate document namun tidak mengoverwrite document tersebut sehingga apabila ada key dengan value
        //yang kosong maka updateOne akan memberi nilai null pada key dengan value kosong.
        //replaceOne overwrite semua document sehingga apabila ada key yang tidak memiliki value maka akan dihapus key tersebut.
        Article.replaceOne({
                title: req.params.articleTitle
            }, {
                title: req.body.title,
                content: req.body.content
            },
            function (err) {
                if (!err) {
                    res.send("Successfully updated selected article");
                } else {
                    res.send(err);
                }
            });
    })
    .patch(function (req, res) {
        //update just one document that have a new value in req body
        Article.updateOne({
                title: req.params.articleTitle
            }, {
                $set: req.body
            },
            function (err) {
                if (!err) {
                    res.send("Successfully updated article");
                } else {
                    res.send(err);
                }
            });
    })
    .delete(function (req, res) {
        Article.deleteOne({
                title: req.params.articleTitle
            },
            function (err) {
                if (!err) {
                    res.send("Successfully delete the document.");
                } else {
                    res.send(err);
                }
            }
        )
    });

app.listen(3000, function () {
    console.log("Successfully connected to port 3000");
})