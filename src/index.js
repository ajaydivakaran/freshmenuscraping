var scraperjs = require('scraperjs');
var _ = require('lodash');
var notifier = require('node-notifier');

var delayInMillSeconds = 1000;
var FRESHMENU = 'http://www.freshmenu.com';

scraperjs.DynamicScraper.create(FRESHMENU)
    .delay(delayInMillSeconds)
    .scrape(function($) {
        return $("div.info").map(function() {
            return {title: $(this).find("h4").text(), description: $(this).find("p").text()};
        }).get();
    })
    .then(findMyFavouriteDishAndNotifyIfPresent);

function findMyFavouriteDishAndNotifyIfPresent(items) {
    var mincedBurgers =  _.filter(items, function(item){
        var titleInLowerCase = _.toLower(item.title);
        var descriptionInLowerCase = _.toLower(item.description);
        return titleInLowerCase.indexOf("burger") >= 0 &&
            (descriptionInLowerCase.indexOf("mince") >= 0 || descriptionInLowerCase.indexOf("patty") >= 0 );
    });
    notify(mincedBurgers);
}

function notify(mincedBurgers) {
    var logMessage = mincedBurgers == null ? "No burger available" : mincedBurgers[0].title;
    console.log(new Date() + " " + logMessage);
    var message = mincedBurgers ? mincedBurgers[0].title : "Not available";
    notifier.notify({title: 'FreshMenu burger', message: message}, function() {});
}
