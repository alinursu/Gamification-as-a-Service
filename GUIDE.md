<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h1>GamS (Gamification as a Service)</h1>
    <h2>Utilization Guide</h2>
    <h3>I. Creating and logging into an account</h3>
    <ol>
        <li>From the main page of the application, click on the "ÎNREGISTRARE" button.</li>
        <li>This action will redirect you to the register page.</li>
        <li>Fill the form and press "ÎNREGISTREAZĂ-TE".</li>
        <ul>
            <li>If something went wrong, an error message will be displayed.</li>
            <li>If the account has been created, a success message will be displayed.</li>
        </ul>
        <li>After creating the account, click on the "AUTENTIFICARE" button.</li>
        <li>This will redirect you to the login page.</li>
        <li>Fill in the form and press "AUTENTIFICĂ-TE".</li>
    </ol>
    <h3>II. Creating a Gamification System</h3>
    <ol>
        <li>Once logged in, click on your name from the header to access your profile page.</li>
        <li>Click on the "Creează un sistem nou" button.</li>
        <li>This action will redirect you to the gamification system creation page.</li>
        <li>Fill the form and then click on the "CREEAZĂ" button.</li>
        <ul>
            <li>If something went wrong, an error message will be displayed.</li>
            <li>If the account has been created, a success message will be displayed.</li>
        </ul>
    </ol>
    <h3>II. Viewing a Gamification System</h3>
    <ol>
        <li>Once logged in, click on your name from the header to access your profile page.</li>
        <li>Click on a gamification system listed.</li>
        <li>This action will redirect you to the gamification system view page.</li>
    </ol>
    <h3>III. Modifying a Gamification System</h3>
    <ol>
        <li>Once logged in, click on your name from the header to access your profile page.</li>
        <li>Click on a gamification system listed.</li>
        <li>This action will redirect you to the gamification system view page.</li>
        <li>Click on the "MODIFICĂ" button.</li>
        <li>Fill the form and then click on the "MODIFICĂ" button.</li>
        <ul>
            <li>If something went wrong, an error message will be displayed.</li>
            <li>If the account has been created, a success message will be displayed.</li>
        </ul>
    </ol>
    <h3>IV. Integrating a Gamification System into a website</h3>
    <ol>
        <li>Once logged in, click on your name from the header to access your profile page.</li>
        <li>Click on a gamification system listed.</li>
        <li>This action will redirect you to the gamification system view page. Here you can view the API Key.</li>
        <li>Whenever you want to get data about a certain user, make a GET request on the following link: 
<a href="#">localhost:8081/external/gamification-system?apikey={{API_KEY}}&userId={{USER_ID}}</a></li>
        <li>Whenever you want to get data about the top of users, make a GET request on the following link: 
<a href="#">localhost:8081/external/gamification-system/top-users?apikey={{API_KEY}}</a></li>
        <li>Whenever a certain event happens for a user, make a POST/PUT request on the following link: 
<a href="#">localhost:8081/external/gamification-system?apikey={{API_KEY}}</a></li>
        <ul>
            <li>Request Body: userId={{USER_ID}}&eventName={{EVENT_NAME}}</li>
        </ul>
        <li>Whenever you want to remove a certain reward of a user, make a DELETE request on the following link: 
<a href="#">localhost:8081/external/gamification-system?apikey={{API_KEY}}</a></li>
        <ul>
            <li>Request Body: userId={{USER_ID}}&rewardName={{EVENT_NAME}}</li>
        </ul>
    </ol>
</body>