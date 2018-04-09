<!DOCTYPE html>

<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link type="text/css" rel="stylesheet" href="css/materialize.min.css" media="screen,projection" />

    <link rel="stylesheet" href="./css/style.css">
    <title>CMPS183: Homework 3</title>
</head>

<body>
    <div class="navbar-fixed">
        <nav>
            <div class="nav-wrapper">
                <a href="#" class="brand-logo">&nbsp;&nbsp; CMPS183: Homework 3</a>
                <ul id="nav-mobile" class="right hide-on-med-and-down">
                    <li>
                        <a href="/index">Home</a>
                    </li>
                    <li>
                        <a href="/list">Todos</a>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
    <div class="row" style="width:100%; margin-top:20px;">
        <div class="col s3 l3">
            <ul class="collapsible popout" data-collapsible="accordion">
                % for i in sidebarItems:
                <li>
                    <div class="collapsible-header">
                        <i class="material-icons">{{i.icon}}</i>{{i.title}}</div>
                    <div class="collapsible-body">
                        <span>{{i.content}}</span>
                    </div>
                </li>
                % end
            </ul>
        </div>
        <script type="text/javascript" src="scripts/jquery.min.js"></script>
        <script type="text/javascript" src="scripts/materialize.min.js"></script>
        <div class="col s9 l9" style="padding-right:30px;">
            % setdefault('base', 'nothing') 
            {{!base}}
        </div>
    </div>
    <footer class="page-footer">
        <div class="container">
            <div class="row">
                <div class="col l6 s12">
                    <h5 class="white-text">Front End Framework</h5>
                    <p class="grey-text text-lighten-4">This project use Materialize to build the fancy UI.</p>
                </div>
                <div class="col l4 offset-l2 s12">
                    <h5 class="white-text">Links</h5>
                    <ul>
                        <li>
                            <a class="grey-text text-lighten-3" href="#!">About Us</a>
                        </li>
                        <li>
                            <a class="grey-text text-lighten-3" href="#!">Contact</a>
                        </li>
                        <li>
                            <a class="grey-text text-lighten-3" href="#!">Privacy</a>
                        </li>
                        <li>
                            <a class="grey-text text-lighten-3" href="#!">Credits</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer-copyright">
            <div class="container">
                © 2018 Copyright CI010
                <a class="grey-text text-lighten-4 right" href="https://www.github.com/ci010">Github</a>
            </div>
        </div>
    </footer>

    <!-- <div class="footer">
        <div class="footer-container">
            <a href="#" class="footer-button">About Us</a> &nbsp;|&nbsp;
            <a href="#" class="footer-button">Contact</a>&nbsp;|&nbsp;
            <a href="#" class="footer-button">Privacy</a>&nbsp;|&nbsp;
            <a href="#" class="footer-button">Credits</a>
        </div>
    </div> -->
    <script>
        $(document).ready(function () {
            $('.collapsible').collapsible();
        });
    </script>
</body>

</html>