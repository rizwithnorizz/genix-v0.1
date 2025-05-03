
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .content {
            padding: 20px;
            background-color: #f4f4f4;
        }
        .link {
            color: #007BFF;
            text-decoration: none;s
        }
    </style>
</head>
<body>
    <div class="content">
        <h1>Hello, {{$name}}!</h1>
        <p>You have been assigned as a new Department Admin for {{$department}}.</p>

        <p>Your login credentials are as follows:</p>
        <p><strong>Email:</strong> {{$email}}</p>
        <p><strong>Password:</strong> {{$password}}</p>

        <p>Please login to the system via this link: </p>
        <a href="https://srv801185.hstgr.cloud/login" class="link">Login</a>
        <p>Thank you, have a great day!</p>
        <p>Regards,<br>Genix<br>A course scheduling system</p>

    </div>
</body>
</html>