# GrofersAssign
 
  Here Is the link of the Website : https://nameless-beyond-87561.herokuapp.com/
 
 
 
 
 
**Goals :**

* Design an API which allows users to get the raffle tickets. This API can be
consumed in a lot of ways like We can call this API after the user has placed
an Order.

Inside the App, I added RandomTicket button in the Home Screen. Whenever a user tap a RandomTicket button, I simply filtered all the occured luckydraw event and also filtered those event of which user have already a ticket and also filter those event in which user has already particiated. After filtering  the events, i simply chose random event from the remainig events  and provide it to the user. In this way, I provided a random ticket to the user. Logic code is available in `Routes/LuckyDraw/luckyDraw.js`.

* Design an API which shows the next Lucky Draw Event timing & the
corresponding reward. For example - Lucky Draw can run everyday at 8AM.
Reward on say 10th Feb is Phone, 11th Feb is Washing Machine etc

I simply filter  all the events which has been finished before the `Date.now()`. Logic code for filtering the events is available in `Routes/LuckyDraw/luckyDrawUtils.js` function `checkvalidity`.


* Design an API which allows users to participate in the game. Once a user
has participated with a raffle ticket, she shouldn’t be able to participate
again in the same event.

I created a User model which have a field name `tickets` which contains all the tickets id that he/she have and also created a Luckydraw model which contain a field `participated-users` which contains a list of participated user's id. using these  field, i  checked if user have already participated or have a not a valid ticket then they can't take a part in the event.  Logic code is defined in  `Routes/LuckyDraw/luckyDraw.js` route `:id/getrandomticket`.

* Design an API which lists all the winners of all the events in the last one
week.

I defined a function which checks that a event will occur or not in last one week (function  is  defined in `Routes/LuckyDraw/luckyDrawUtils.js` function name `getoneweek`.).
using this function, i filtered the event which  has occured in one week ago and also check the winners of the event decided or not . if not, i find the three random users for the list of participated user and insert the random users in the `winners field` and return the list of winners. Logic code is defined in  `Routes/LuckyDraw/luckyDraw.js` route `/getlastweekwinner`.

* Compute the winner for the event and announce the winner.
almost same as for the lastoneweekwinners API.  Logic code is defined in  `Routes/LuckyDraw/luckyDraw.js` route `/:id/winners`.






  

 
 
 
 
 
 
![home](https://user-images.githubusercontent.com/64456168/115984905-f6f08e80-a5c6-11eb-9f9c-8f2b5a9900c3.JPG)





![details](https://user-images.githubusercontent.com/64456168/115983982-3a94c980-a5c2-11eb-8d00-ebbea1158567.JPG)





![random ticket](https://user-images.githubusercontent.com/64456168/115983991-44b6c800-a5c2-11eb-99a3-1f58395734bb.JPG)




![eventregisteration](https://user-images.githubusercontent.com/64456168/115984897-efc98080-a5c6-11eb-9416-0df8a3dec0a3.JPG)



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

