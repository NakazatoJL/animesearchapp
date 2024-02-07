import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

const page = {
    type: "none",
};

app.get("/", (req, res) =>{
    page.type = "home";
    res.render("index.ejs", {page});
});

app.get("/about", (req, res) =>{
    page.type = "about";
    res.render("about.ejs", {page});
});

app.get("/faq", (req, res) =>{
    page.type = "faq";
    res.render("faq.ejs", {page});
});

app.post("/search", async(req, res) =>{
    console.log("type:" + req.body.type + " search:" + req.body.search);

    var query = `
    query ($search: String) {
        Media (search: $search, type: ANIME, sort: FAVOURITES_DESC) {
            id
            title {
                romaji
                english
                native
                }
            type
        }
    }
    `;

    var variables = {
        search: req.body.search,
    };

    const data = {
        query: query,
        variables: variables
    };

    console.log(variables);

    var url = 'https://graphql.anilist.co';

    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

    // Make the HTTP Api request
    
    try {
        const result = await axios({
        url,
        method: 'post',
        headers,
        data: data
      });

        console.log(result.data.data.Media);

      } catch (error) {
        //res.render("index.ejs", { content: JSON.stringify(error.response.data) });
        console.log(error.message);
      }
      /*
      const result = await axios({
        url,
        method: 'post',
        headers,
        data: data
      }).catch((err) => console.log(err.message));

      console.log(result.data.data.Page.media);
      */
});

app.listen(port, ()=>{
    console.log(`App is listening to port ${port}`);
});