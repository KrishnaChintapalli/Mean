var express = require('express'),
    engine = require('consolidate'),
    model = require('model'),
    bodyParser = require('body-parser');

var app = express();

app.engine('html', engine.nunjucks);

app.set('view engine','html');

app.set('views', __dirname + '/views');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({'extended': false}));
app.use(bodyParser.json());



//app.use('/', )

//starting server

var server = app.listen(3307, function(){

    console.log(" server started at port 3307");
});

//routings

app.get('/', function(req, res){

    console.log('/');
    //    res.send('index',{});
    res.render('index',{});

});


app.post('/login', function(req, res){

    console.log('/login');
    //res.set('Content-Type', 'text/plain');
    model.findById({_id:req.body.userName}, function(err, response){
        if(err){
            res.send('error');
        }
        if(!response){
            console.log('User not found with'+req.user.userName);
            res.send('error1');
        }
        else{
            res.send({state:'success', user:req.body});
        }

    });

});

app.post('/register', function(req, res){

    //    res.send('index',{});
    var user ={
        _id: req.body.Username,
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        password:req.body.password,
        email:req.body.email
    }
    model.findById({_id:req.body.Username}, function(err, response){
        if(err){
            res.send(err);
        }
        if(response.length!=0){
            console.log('User already exit'+response);
            res.send('error 2');
        }else{
            //res.send('Hi');
            model.save(user, function(err, response){
                if(err){
                    res.send('error 3');
                }
                else{
                    console.log('got response from mongo');
                    res.send({state:'success', user:user._id});
                }
            });
        }
    });

});

app.get('/logout', function(req, res){
    req.logout();
    res.redirectTo('/');

});
app.get('/messages', function(req, res){

});

app.post('/message/:message', function(req, res){

});

app.get('getprofile', function(req, res){
   var username = req.body.current_user;
    console.log(username);
    model.findById({_id:username}, function(err, response){
        if(err){
            res.send(err);
        }
        if(response){
            console.log(response);
            res.send(response);
        }
    });
});