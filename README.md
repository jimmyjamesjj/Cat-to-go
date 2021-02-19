# Cat-to-go
the web app helps the user to book a hotel room for their cats for a specified period of time, the user creats an account and is able to either choose standard room or very
important cat(VIC) after booking the room the hotel management gets the request and its able to either confirm the client booking or delete the booking and the client is able
to get the feedback .

User Stories
404 - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
500 - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
homepage - As a user I want to be able to access the homepage so that I see what the app is about and login and signup
sign up - As a user I want to sign up on the webpage so that I can see all the events that I could attend
login - As a user I want to be able to log in on the webpage so that I can get back to my account
logout - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
events list - As a user I want to see all the events available so that I can choose which ones I want to attend
events create - As a user I want to create an event so that I can invite others to attend
events detail - As a user I want to see the event details and attendee list of one event so that I can decide if I want to attend
event attend - As a user I want to be able to attend to event so that the organizers can count me in
Backlog
List of other features outside of the MVPs scope

User profile:

see my profile
update my booking
list of events created by the user

Homepage

...
ROUTES:
GET /

renders the homepage
GET /verify/signup

redirects to / if user logged in
renders the signup form (with flash msg)
POST /auth/signup

redirects to / if user logged in
body:
username
email
password
GET /auth/login

redirects to / if user logged in
renders the login form (with flash msg)
POST /auth/login

redirects to / if user logged in
body:
username
password
POST /auth/logout

body: (empty)
GET /events

renders the event list + the create form
POST /events/create

redirects to / if user is anonymous
body:
name
date
location
description
GET /events/:id

renders the event detail page
includes the list of attendees
attend button if user not attending yet
POST /events/:id/attend

redirects to / if user is anonymous
body: (empty - the user is already stored in the session)
Models
User model
catroom model
admin model

username: String
password: String
Event model

owner: ObjectId<User>
name: String
description: String
date: Date

Repository Link

https://github.com/jimmyjamesjj/Cat-to-go

Deploy Link

https://cat-to-go.herokuapp.com/userRequests

Slides Link:  https://docs.google.com/presentation/d/1eLQPlgJMKZrTcmTXM_iycAXRIGYYtJ91FSZcLpm-vQk/edit#slide=id.gbdeea581e9_2_106

