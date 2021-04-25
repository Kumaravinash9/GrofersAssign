# GrofersAssign
 
  Here Is the link of the Website : https://nameless-beyond-87561.herokuapp.com/
 
 
 
 
 
**Goals :**

* Design an API which allows users to get the raffle tickets. This API can be
consumed in a lot of ways like We can call this API after the user has placed
an Order.

Inside the App, I added RandomTicket button in the Home Screen. Whenever a user tap a RandomTicket button, It simply filtered all the occured luckydraw event and also filtered those event of which user have already a ticket along with it also filter those event in which user has already particiated. After filtering  the events, i simply chose random event from the remaining events  and provide it to the user. In this way, It provides a random ticket to the user. Logic code is defined in `Routes/LuckyDraw/luckyDraw.js`.

* Design an API which shows the next Lucky Draw Event timing & the
corresponding reward. For example - Lucky Draw can run everyday at 8AM.
Reward on say 10th Feb is Phone, 11th Feb is Washing Machine etc

It simply filter  all the events which has been finished before the `Date.now()`. Logic code for filtering the events is available in `Routes/LuckyDraw/luckyDrawUtils.js` function Name `checkvalidity`.


* Design an API which allows users to participate in the game. Once a user
has participated with a raffle ticket, she shouldn’t be able to participate
again in the same event.

The app consists of a user model, with a field name `Ticket` that contains a list of  IDs  of tickets that the user already has. And the app also has a LuckyDraw model, which consists of a field `participant-user` that contains a list of IDs of the user who participated. using these  field, it  checked if user have already participated or have a not a valid ticket then they can't take a part in the event.  Logic code is defined in   route `:id/getrandomticket` which is avilable in `Routes/LuckyDraw/luckyDraw.js`.

* Design an API which lists all the winners of all the events in the last one
week.

I defined a function which checks that a event will occur or not in a last week(function  is  defined in `Routes/LuckyDraw/luckyDrawUtils.js` function name `getoneweek`.).
 By using `getobeweek`, i filtered the event which  has occured in one week ago and also check the winners of the event decided or not . if winner was not  decided, it chose  the three random users  from the list of participated user and map the random choosen winners in the `winners field` and return the list of winners. Logic code is defined in route `/getlastweekwinner` in  `Routes/LuckyDraw/luckyDraw.js` file. function for choosing  random  three numbers is defined in  `Routes/LuckyDraw/luckyDrawUtils.js` file by the name of `firstrandomNumber`, `secondrandomNumber` and `thirdrandomNumber`.

* Compute the winner for the event and announce the winner.

Almost same as for the lastoneweekwinners API.  Logic code is defined in  route `/:id/winners` which is available in`Routes/LuckyDraw/luckyDraw.js` file.






  

 
 
 
 
 
 
![home](https://user-images.githubusercontent.com/64456168/115984905-f6f08e80-a5c6-11eb-9f9c-8f2b5a9900c3.JPG)





![details](https://user-images.githubusercontent.com/64456168/115983982-3a94c980-a5c2-11eb-8d00-ebbea1158567.JPG)





![random ticket](https://user-images.githubusercontent.com/64456168/115983991-44b6c800-a5c2-11eb-99a3-1f58395734bb.JPG)





![login](https://user-images.githubusercontent.com/64456168/115984953-328b5880-a5c7-11eb-8026-aa5ef34f061f.JPG)



### Prerequisites

* `node: v8.10.0`
* `npm: v6.14.41`
* `MongoDb`

**Fontend Section**

    HTML
    CSS
    BootStrap-4.0
    JavaScript
   
   
**Backend Section**


   **Dependencies**
   
   
        express
        ejs
        BodyParser
        path
        dotenv
        passport
        Google-passport
        mongoose
        mongoose-connect
        express-session
        nodemon
        passport-local
        cors
        mongoose
        
        
      
   **Database**
   
        (1). MongoDb
        
        
        
   **Authentication**
   
        (a). Local-Authentication
        
        
        
**Deploy on Heroku**
      


## Installing on Local Machine

* Fork to get your own copy of the project 
* Clone the repo
* `cd Grofers/`
* `npm install`
* `npm start/nodemon`

#### Build and load the app
* `npm install`
* run `localhost:3000` in the browser 

#### Code linting and formatting
GrofersAssign uses **Prettier + Eslint** for code listing and formatting. To check if your code follows the guidelines, run `npm run prettier`

