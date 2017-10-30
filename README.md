![Movie Quoter](icons/MQ108.png) Movie Quoter: Alexa Skill
===========================

A simple Alexa Skill that quotes movies.

# Steps to run

- Zip `index.js` and `get-top-quotes.js`; And upload to AWS lambda
- Paste `intents.json` in your Alexa Dashboard and link your AWS Lambda ARN

# Requirements

The app uses an API to fetch recent updated movie quotes from a online source, but in order to use it a API key is needed.  

Create your key at: 

`https://andruxnet-random-famous-quotes.p.mashape.com/?cat=movies&count=1`

Fill the variable `QUOTE_API_SECRET` in `index.js` with your recently created secret key.

The app has a offline fallback that always return a movie quote in case of the API goes offline or no secret key is provided.