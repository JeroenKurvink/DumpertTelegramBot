/**
 * Created by Jeroen on 19-12-2017.
 */

const TelegramBot = require('node-telegram-bot-api');
const token = '';

const robot = new TelegramBot(token, {polling: true});

const TeleBot = require('telebot');
const bot = new TeleBot(token);

const cheerio = require('cheerio');
const fs = require('fs');
const progress = require('request-progress');
const request = require('request');


robot.on('message', (msg) => {
    console.log("hey");

    if(msg.text.indexOf("dumpert.nl/mediabase") > -1){
        let dumpertUrl = msg.text;
        console.log(msg);

        let dumpertUrlName = dumpertUrl.substr(dumpertUrl.lastIndexOf('/') + 1).replace(".html", "");

        request(dumpertUrl, function (error, response, body) {
            let document = cheerio.load(body);
            let video = document("#video1").first();
            let videoBase64 = video.attr("data-files");

            if(videoBase64 != undefined){
                let videoObject = JSON.parse(Buffer.from(videoBase64, 'base64').toString("ascii"));
                let image = videoObject.still;
                let videoUrl = videoObject['720p'] || videoObject.tablet || videoObject.mobile;
                //const file_location =

                //let fileStreamVid = fs.createWriteStream('./js/' + dumpertUrlName + '.mp4');

                //let isreply = false;
                //let message_id = msg.message_id;
                let chat_id = msg.chat['id'];
                //let currentPercentage = 0;

                /*
                progress(request(videoUrl))
                    .on('progress', state => {
                    let progressPercentage = String(state['percent'] * 100).substr(0, String(state['percent'] * 100).indexOf('.'));

                let reply = progressPercentage + "% of your video " + dumpertUrlName + " has been downloaded.";

                if(!isreply){
                    robot.sendMessage(chat_id, reply).then((result) => {
                        console.log(result);
                    chat_id = result.chat['id'];
                    message_id = result.message_id;
                    isreply = true;
                });
                }else{
                    if(currentPercentage != progressPercentage){
                        robot.editMessageText(reply, {chat_id: chat_id, message_id: message_id});
                        currentPercentage = progressPercentage;
                    }
                }
            })
            .on('error', err => console.log(err))
            .on('end', () => {
                    robot.editMessageText("Your video " + dumpertUrlName + " has completed!", {chat_id: chat_id, message_id: message_id});
                robot.sendVideo(chat_id, './js/' + dumpertUrlName + '.mp4');
            })
            .pipe(fileStreamVid)*/

                robot.sendVideo(chat_id, videoUrl);
                console.log(image);
                console.log(videoUrl);
            }
        });
    }
});