import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

const page = {
    type: "none",
    content: null,
    searchType: null,
    error: null,
};

var faqExpand = [false, false];

app.get("/", (req, res) =>{
    page.type = "home";
    page.content = null;
    page.error = null;
    res.render("index.ejs", {page});
});

app.get("/about", (req, res) =>{
    page.type = "about";
    res.render("about.ejs", {page});
});

app.get("/faq", (req, res) =>{
    page.type = "faq";
    res.render("faq.ejs", {page, faqExpand});
});

app.post("/search", async(req, res) =>{
    console.log("type:" + req.body.type + " search:" + req.body.search);
    page.type= "search"

    if(req.body.type === 'anime'){
        page.content = await animeSearch(req.body.search);
        page.searchType= "anime";
        if(page.content === "Error")
        {
            page.type = "home";
            page.content = null;
            page.error = "No Results";
            res.render("index.ejs", {page});
        }else{
            page.error = null;
            res.render("index.ejs", {page});
        }

    } else {
        page.content = await characterSearch(req.body.search);
        page.searchType= "character";
        if(page.content === "Error")
        {
            page.type = "home";
            page.content = null;
            page.error = "No Results";
            res.render("index.ejs", {page});
        }else{
            page.error = null;
            res.render("index.ejs", {page});
        }
    }

});

app.post("/expand", (req, res) =>{
    faqExpand[req.body.post_id] = req.body.expand;
    res.render("faq.ejs", {page, faqExpand});
});

app.listen(port, ()=>{
    console.log(`App is listening to port ${port}`);
});

async function animeSearch(search){

    var query = `
    query ($search: String) {
        Media (search: $search, type: ANIME, sort: FAVOURITES_DESC) {
            title {
                romaji
                english
                native
            }
            description(asHtml: true)
            coverImage{
                extraLarge
            }
            source
            status
            episodes
            genres
        }
    }
    `;

    var variables = {
        search: search,
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
        return result.data.data.Media;

      } catch (error) {
        console.log(error.message);
        return "Error";
      }
}

async function characterSearch(search){
    
    var query = `
    query ($search: String) {
        Character (search: $search, sort: FAVOURITES_DESC) {
            name{
                first
                middle
                last
                alternative
            }
            description (asHtml: true)
            image{
                large
            }
            gender
            dateOfBirth{
                month
                day
            }
            age
            bloodType

        }
    }
    `;

    var variables = {
        search: search,
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

        console.log(result.data.data.Character);
        return result.data.data.Character;

      } catch (error) {
        console.log(error.message);
        return "Error";
      }

}