________________________________________________________DAY-1_______________________________________________________
create a repo
initialize the repo
node modules,package.json,package-lock.json
install express
create server
listen to a port
write request handlers for /test , /hello
install nodemon and update scripts inside package.json
what are dependencies
what is the use of '-g' while npm install
differnce between '~(tilde)' and '^(caret)'

________________________________________________________DAY-2_______________________________________________________
initialize the git 
.gitignore
create a remote repoon github
push all code to remote origin
play with routes and route extensions ex-/hello , /hello/2 , /hello2
install the postman app and add new workspace>>>new collection>>>test API call
write logic to handle get,put,post,patch,delete methods and test them on postman
Explore routing and use of ?,+,(),* in the routes
use of regex in routes /a/,/*fly$/
Reading the query params in the routes 
Reading the dynamic routes
what is the difference between params and query

________________________________________________________DAY-3_______________________________________________________
multiple Route Handlers -play with the code
next()
next function and errors along with res.send()
app.use('/route',(req,res)=>{[r1,r2,r3,r4,r5]})
what is middleware
how express JS basically handles requests behind the scenes
difference between app.use() and app.all()

________________________________________________________DAY-4_______________________________________________________

create a db.js to check whether the node connected to db or not
connect application to DB
call the connectDB function and connect to database before starting application on 4000
create the tables user, connectionrequest
create POST/signup API to add data to database
Push some records using API calls from postman
error handling 

________________________________________________________DAY-5_______________________________________________________

difference between res.send() and res.json()
difference between javascript and json

________________________________________________________DAY-6_______________________________________________________

add express.json() to your code
make your signup API dynamic to receive data from the end user(may be postman too)
get API using email
verify user is valid or not based on email and password
how to use try catch properly in node
difference between createConnection and createPool
write the API to update the data of a user
update the user data based on email Id as refference

________________________________________________________DAY-6_______________________________________________________

Add age validation and gender validation
sql: updating 2 tables based on user object as input
adding new table to db (skills)
difference between left join and right join and how do they work

________________________________________________________DAY-7_______________________________________________________

add validations for each column
improve db schema 
creating timestamps of user account (creationt time and last account update time)
creating strong password (includes min of 1 uppercase,1 lower case,1 numerical and 1 special character)
adding a validation for email (email id should not be modified)

________________________________________________________DAY-8_______________________________________________________

update the user and skills tables based on json data provided by user
difference between "req.params" and "req.params?"
adding email validation (ex: email:"akhi@gmail.com","xyzsaseffdgy")=>both emails is accepted by our db now.
photo Url validator need to be added
strong password validation is added
NEVER TRUST req.body
updating login data with entered password and hashed stored password in DB

________________________________________________________DAY-9_______________________________________________________

validating Signup API
updating Login API