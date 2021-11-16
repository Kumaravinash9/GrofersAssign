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

### Development

**Fontend Section**

    HTML
    CSS
    BootStrap-4.0
    JavaScript
   
   
#### Backend Section


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
* `npm start`
* run `localhost:3000` in the browser 

#### Code linting and formatting
GrofersAssign uses **Prettier + Eslint** for code listing and formatting. To check if your code follows the guidelines, run `npm run prettier`



# Udaan Machine Coding :
 
 
**Goals (completed) :**

* Desgined a  POST API which creates new user with unique username :
 As mentioned in the Question, we  donot have to create a User authentication. So for Indentification  I used username as a identification for the user.
 
 Route :   `http://localhost:3000/users/ `  

![UdaanUserIdentificationAPI](https://user-images.githubusercontent.com/64456168/141971060-7c04f680-121e-4085-bea4-ca378ad443f6.PNG)


* Designed a POST request API for creating *Event* :

Route: `http://localhost:3000/events/`
 Required Body:
```
{
	"event_type": "yoga",
	"capacity":60,
	"start_time":30,
	"duration": 30
}
```
![CreateEvent](https://user-images.githubusercontent.com/64456168/141974230-89206ac9-4463-4a06-ab2f-9d516b6309d1.PNG)

* Desgined a API for registering the Event :

Cases Handled:
* If user have already registered for the event , they willn't able to  register again.
* If event's capacity have exceeded then user push into waiting list
* If event's capacity haven't exceeded then user able to register the event.

Route: `http://localhost:3000/events/:eventid/regsiterevent`
Headers Required :
```
   username : (since i used username as identification. so it is required)
```

![Registered_event](https://user-images.githubusercontent.com/64456168/141973161-1795d6a5-0198-4b34-bf73-83013f7bd474.PNG)

* Desgined a API by which user can cancel their registeration 30minutes before the event start

Cases Handled:
 * User can able to cancel the event 30 min before the event start
 * If user can able to cancle then it automatically confirm the registration of  the first waiting user into main list if any waitlist user exits.
 
 Route : `http://localhost:3000/users/:username/cancelevent`

Headers Required:
```
eventid : (Id of the Event that user want to cancel) (required)
time: (time in minutes when user want to try  to cancel the registered  event)  (required)

```

![CancelEventAPI](https://user-images.githubusercontent.com/64456168/141975709-d63688b7-c8b2-46e4-8b07-80d0ca68da66.PNG)

### Prerequisites

* `node: v16.13.0`
* `npm: 8.1.0`
* `MongoDb`

### Development

   **Dependencies**
   
   
        express
        ejs
        BodyParser
        path
        dotenv
        mongoose
        eslint
        nodemon
        eslint-plugin-prettier
        cors
        mongoose
        
        
      
   **Database**
   
        (1). MongoDb (locally  setup)
        
        
        
## Installing on Local Machine

* `cd Udaan/`
* `npm install`
* `npm start/nodemon`
* `install mongoose local`

#### Build and load the app
* `npm install`
* `npm start`
* run `localhost:3000` in the browser 

### API testing :
* `PostMan`

#### Code linting and formatting
Udaan Class Booking System uses **Prettier + Eslint** for code listing and formatting. To check if your code follows the guidelines, run `npm run prettier`


