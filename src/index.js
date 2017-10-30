/**
 * @prettier
 */
'use strict'

var quotesArray = require('./get-top-quotes')

function varLogger(v) {
    console.log('logger: ', JSON.stringify(v))
}

exports.handler = function(event, context) {
    try {

        varLogger(event)
        
        varLogger(context)

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

        if (
            event.session.application.applicationId !== process.env.APP_ID
        ) {
            context.fail('Invalid Application ID');
        }

        if (event.session.new) {
            onSessionStarted(
                { requestId: event.request.requestId },
                event.session
            );
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request, event.session, function callback(
                sessionAttributes,
                speechletResponse
            ) {
                context.succeed(
                    buildResponse(sessionAttributes, speechletResponse)
                );
            });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request, event.session, function callback(
                sessionAttributes,
                speechletResponse
            ) {
                context.succeed(
                    buildResponse(sessionAttributes, speechletResponse)
                );
            });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            context.succeed();
        } else {
            varLogger(event)
        }
    } catch (e) {
        context.fail('Exception: ' + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(
        'onSessionStarted requestId=' +
            sessionStartedRequest.requestId +
            ', sessionId=' +
            session.sessionId
    );

    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(
        'onLaunch requestId=' +
            launchRequest.requestId +
            ', sessionId=' +
            session.sessionId
    );

    var cardTitle = 'Movie Quoter';
    var speechOutput =
        'Welcome to Movie Quoter.  The purpose of this skill is see what the quotes are from popular movies.  To start using the skill, say Alexa, ask movie quoter to quote movies';
    callback(
        session.attributes,
        buildSpeechletResponse(cardTitle, speechOutput, '', false)
    );
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(
        'onIntent requestId=' +
            intentRequest.requestId +
            ', sessionId=' +
            session.sessionId
    );

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if (intentName == 'AskQuote') {
        handleAskQuoteRequest(intent, session, callback);
    } else {
        throw 'Invalid intent';
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session, callback) {
    console.log(
        'onSessionEnded requestId=' +
            sessionEndedRequest.requestId +
            ', sessionId=' +
            session.sessionId
    );

    var speechOutput =
        'Thank you for using movie quoter. Goodbye!';
    callback(
        session.attributes,
        buildSpeechletResponseWithoutCard(speechOutput, '', true)
    );
}

function handleAskQuoteRequest(intent, session, callback) {
    callback(
        session.attributes,
        buildSpeechletResponseWithoutCard(getQuote().quote, '', true)
    );
}

// ------- Helper functions to build responses -------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: title,
            content: output,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession: shouldEndSession,
    };
}

function buildSpeechletResponseWithoutCard(
    output,
    repromptText,
    shouldEndSession
) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession: shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes: sessionAttributes,
        response: speechletResponse,
    };
}

function getQuote() {
    return quotesArray[Date.now()%100]
}
