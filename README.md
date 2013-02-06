# DDSC Webclient


## ANGULAR REWRITE

We started building DDSC with Backbone and Marionette. This choice was made based on some testing with Backbone, Ember, Ext.js and Knockout.js. Backbone seemed the leanest, least abstracted and has a lot of momentum in the webdev world.

However, even with the help of Marionette, we were quickly doing things wrong or in the wrong way/place. This is a known and even advertised benefit/hazard of Backbone, depending on your project/personal taste/experience/expectations.

An emerging alternative to Backbone and the others is [Angular.js](http://docs.angularjs.org/), a framework by Google engineers. [This Angular example](http://www.smartjava.org/examples/cpi/#/custom?year=2010&countries=6,1,4) by Jos Dirksen convinced me to experiment with it. Hence this branch!




## Installation

We use [Yeoman](http://yeoman.io/) and [Grunt.js](http://gruntjs.com/) to facilitate building (minification/concatenation) of the production assets.
Run the following commands to install yeoman. We prefer to install it in a [Vagrant](http://vagrantup.com/) environment:

    sudo apt-get install python-software-properties
    sudo add-apt-repository ppa:chris-lea/node.js
    sudo apt-get update
    sudo apt-get install nodejs npm
    sudo npm install -g yeoman
    sudo npm install phantomjs
    sudo gem install compass

Start the webserver after the installation:

    cd webclient
    yeoman server

And point a browser to localhost 3051.
The 'yeoman server' step is optional, you can also serve it with nginx, apache or just: 
    
    $ python -m SimpleHTTPServer



## Tests

### Front-end testing with Casper.js

[Casper.js](http://casperjs.org/) is a bit like Selenium, but faster, more flexible and scriptable.

First, install [Phantom.js](http://phantomjs.org/) for your platform. (OS X users can brew install phantomjs)
Then, install Casper from a recent tag:

    $ git clone git://github.com/n1k0/casperjs.git
    $ cd casperjs && git checkout tags/1.0.1
    
Make sure both phantomjs and casperjs are in your PATH (symlink into /usr/local/bin for example)
When all is right, the following should be possible on your system:

    $ which casperjs && which phantomjs
    /usr/local/bin/casperjs
    /usr/local/bin/phantomjs

Change directory to test/ and tell Casper to test using the frontend.js script:

    $ casperjs test frontend.js
    
This will test the front-end user interface.


### Unit testing with Mocha.js

If you've installed Yeoman, you should be able to run the Mocha test-suite from the commandline as such:

    $ yeoman test
    Testing index.html...........OK
    >> 11 assertions passed (0s)

    Done, without errors.    

This is perfect for automated testing or for CI systems like Jenkins or Travis.
Use this for testing Backbone models, collections, functions, in/out values, stuff like that.
Mocha can run in BDD or TDD mode. More info at http://visionmedia.github.com/mocha/
Assuming you're serving the project root using a webserver, you should be able to point your browser to test/index.html.
This will show the test suite in HTML format. Use this to spot errors.

** Note ** The test/index.html file includes the project's javascript files. It also contains all the template fragments, which is obviously not ideal. 
Perhaps we should start externalizing these templates so they can be included.
See http://lostechies.com/derickbailey/2012/02/09/asynchronously-load-html-templates-for-backbone-views/



## Mock API

Because of parallel front-end and back-end development, at some point we're in need of a fake/mock/stub API, so we can create a responsive interface.
This API was hacked together using node.js/PostGIS and lives here: https://github.com/ddsc/ddsc-node-mock-api

 * Clone that repo somewhere you like
 * Install node.js and npm (you probably have those already, see above)
 * Install PostGIS (ask around if you don't know where to start), load the file dumpddsc.sql
 * Run 'npm install -d' to install the packages required such as Express.js and the non-blocking node-postgres library
 * Run 'node app.js' to run the API on port 3000
 * Make sure to reference the proper IP and port in app/localsettings.js (this is just during development)
 * Enjoy


