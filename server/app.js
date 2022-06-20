const express = require("express");
const mongoose = require("mongoose");
const { TwitterApi } = require('twitter-api-v2');

const Team = require('../models/team');
const Club = require('../models/club');
const club = require("../models/club");

const PORT = process.env.PORT || 3010;


const userClient = new TwitterApi({
    appKey: 'b1LggxvB3R3memc9rBbqB44Zw',
    appSecret: 'N6dBofq1noSyxY1UciX07E6NRFjeQynY7SZq5y11jWz2GWr9go',
    accessSecret: '8YZzYHtZQidmT4UXO2dV4QeH43Y24Brq1VrRIBzNenNHq',
    accessToken: '532659983-iwfMYFgQdOnfsjQRLrCzLswV0pQpUv7UByEHO1aA'
})



const jsTweets = async function (tweetNameClub, hours, minutes) {
    //console.log(await userClient.currentUser());
    const dateMatch = new Date();
    console.log(dateMatch);
    dateMatch.setHours(hours, minutes);
    const setTwitterTime = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() - 1}T${date.getUTCHours()}:${date.getUTCMinutes()}:00Z`;
    const startTime = setTwitterTime(dateMatch);
    dateMatch.setHours(dateMatch.getHours() + 1);
    const endTime = setTwitterTime(dateMatch);
    console.log(startTime, endTime);
    const res = await userClient.v2.search(`("line up" OR "team news" OR "XI") from:${tweetNameClub}`, {
        'media.fields': 'url',
        expansions: ['attachments.media_keys'],
        start_time: startTime,
        //end_time: endTime
    });
    console.log(res.data);
}

const getLineupsTweet = async (club) => {
    const res = await userClient.v2.search(`("${club?.searchTerms[0]}") from:${club?.twitterAccount}`, {
        'user.fields': 'url',
    })
    //console.log(res.data.data[0].entities);
    return res.data.data[0];
}

const app = express();

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/dataFoot", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('MongoDB successfully connected');

    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
}

connectDB();

app.use(express.json());

app.post("/api", (req, res) => {
    console.log(req.body);
    res.json({ message: "Hello from server!" });
});

app.post("/api/getTeam", (req, res) => {
    console.log(req.body);
    Club.findOne(req.body)
        .then(async team => {
            const lineup = await getLineupsTweet(team);
            console.log(lineup);
            res.status(200).json(lineup);
        })
        .catch(error => res.status(404).json({ error }));
});

app.post('/api/addTeam', (req, res, next) => {
    //delete req.body._id;
    const team = new Club({
        ...req.body
    });
    team.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
});

app.put('/api/updateTeam/:trigram', (req, res, next) => {
    Club.findOne({ trigram: req.params.trigram })
        .then(async club => {
            console.log('club', club?._id)
            Club.updateOne({ _id: club?._id }, req.body)
                .then(() => res.status(201).json({ message: club?.name + ' mis à jour !' }))
                .catch(error => res.status(400).json({ error }));
        })
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
