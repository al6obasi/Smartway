# Smartway

A Smartway  task using AngularJs , 
------------------------------------


I used localstorage to store user credentials , cookies to store polls , bootstrap , font-awesome-4.1 and others tools.



Done  By : Mohammad Tawfiq Masa'id 

Table of Contents :

----> Registeration view :

1- Signup      ,

2- Login       , logout 

-----> Home view :           

1- news tab :
				
				view to show the latest 5 posts , expand specific post , see comments . Add posts , Add comments 
2- polls tab :
				
				view the previous polls with results, participate in poll once , add a new poll and manage it .
3- profile tab :
				
				view the user credentials and update it .

----------------------------------------------
Some usage instructions
From within the root directory open app directory then to  :

_________________________________________________

################ Important Notes : ################


Start : terminal #1: npm start after install all Dependencies it will work automatically or  once you had Installed Dependencies  you can run it using  : http-server -a localhost -p 8000 -c-1 

 From the root directory 'Smartway' open another terminal and Start JSON Server to communicate with db

terminal #2  :  json-server --watch db.json 


###################################################

_________________________________________________


################ Important Notes 2  : ################


please make sure json-server was installed successfully . 
if not ?! try : npm install -g json-server
go to   the root directory'  Smartway ' then open  another terminal : json-server --watch db.json 

###################################################

______________________________________________________

----------------------

Test :npm test

----------------------

Requirements

Angular >= 1.6.x,  http-server , webdriver, json-server

Installing Dependencies :

 

View the task roadmap here

Contributing
Link : https://github.com/al6obasi


Resources :
json-server : https://www.npmjs.com/package/json-server , https://github.com/typicode/json-server
Bootstrap polls result : https://bootsnipp.com/snippets/featured/poll-example,
Bootstrap polls Desgin: https://bootsnipp.com/snippets/featured/poll-design,
Login , Signup forms :https://bootsnipp.com