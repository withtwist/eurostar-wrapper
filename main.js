
var cheerio = require('cheerio');
var regex = require('regex');
var request = require('request');









module.exports = {
    //Fetches a list of {id,name} pairs for avaliable cities.
    getCities: function(callback) {
        request = request.defaults({jar:true});
        var url = 'http://www.eurostar.se';
        request.get(url).end(function (error, res) {
          if (error) {
            console.log(error);
          } else {
            $ = cheerio.load(res.text);
            cities_string = $('ul.dropdown-menu').text().split('\n').map(function(s){return s.trim()});
            cities = [];
            id_counter = 1;
            for (i=0;i<cities_string.length; i++) {
                c = cities_string[i];
                if (c.length>2) {
                    cities.push({id : id_counter, name : c});
                    id_counter++;
                }
                
            }
            callback(cities)
          }
        })
    },

    getMovies: function(id, callback) {
        request = request.defaults({jar:true});
        var url = 'http://www.eurostar.se/';
        var movies = [];
        request.get(url, function(err , res) {
            if (err) {
                console.log(err);
            } else { 
                request.get(url+'?stad='+id.toString(), function(err, res2) { 
                    if (err) {
                        console.log(err);
                    } else {
                        $ = cheerio.load(res2.body);
                        var movies_url = 'http://www.eurostar.se/Filmer/'
                        request.get(movies_url, function(err, res3) {
                            if (err) {
                                console.log(err);
                            } else {
                                $ = cheerio.load(res3.body);
                                movie_data = $('div.container div.table-striped').each(function(i,elem) {
                                    title = elem.children[3].children[1].children[0].data;
                                    description = elem.children[3].children[3].data.trim();
                                    movies.push({'title':title, 'description':description});
                                });
                                callback(movies);
                            }
                        });
                    }
                });  
            }
        });

    },

    getTimetable : function(id, callback) {
        //TODO
    }
}
