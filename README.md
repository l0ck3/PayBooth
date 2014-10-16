# PAYBOOTH

PayBooth is a simple NodeJS application demonstration showing a basic integration of the PAYMILL API.

It’s a photo booth accepting credit-card payments instead of cash. Once the payment has been accepted it posts your picture on Twitter.

You can download the source code and get your own PatBooth running in a few minutes.

## Get it running online

### Get the source code

`$ git clone git@github.com:l0ck3/PayBooth.git
`$ cd PayBooth

### Create an Heroku account

We will be hosting our application on Heroku. For that you will first need to create a free account on Heroku: [https://id.heroku.com/signup].

### Install the Heroku Toolbelt

Then download the Heroku Toolbelt [here] and install it.

### Install the Heroku Config plugin

We will add a plugin for making your life easier. It will read the .env file of your application and create the environment variables on Heroku automatically.

Otherwise you would have to create them one by one from the command line.

`$ heroku plugins:install git://github.com/ddollar/heroku-config.git


### Create the application

You can now create a new application on the Heroku cloud:

`heroku apps:create my-pay-booth --region eu

It will ask you for credentials. Enter the ones of the account you just created.

The `--region` parameter is optional. Here I ask Heroku to create my application in the Europe region. It will be US by default.

### Add the Cloudinary add-on

All the images will be hosted on a service called Cloudinary: [http://cloudinary.com ].

Add it to your Heroku account:

`$ heroku addons:add cloudinary

Open your Cloudinary dashboard:

`$ heroku addons:open cloudinary

You will need the information present in the *Account Details* section later.

You also need to create an upload preset. The preset will be used to enable direct image upload from the browser.

Go to the *Settings* section then *Upload* tab.

Click *Enable unsigned uploading*.

Notice it automatically created a preset name. Remember its name, you will need it later.

### Create a free PAYMILL account

You will obviously need a PAYMILL account for making things work. It’s free and very easy.

Go to [https://app.paymill.com/user/register] and register a new account.

Once you’re logged-in in your dashboard, go into the *Development* section then *API Keys*.

You’ll find there your two API Keys. The **public** one is meant to be used client-side to create the tokens from the payment information. The **private** one is used server-side.

You will need them later as well.

### Create a Twitter application

For PayBooth to be able to post photos on your Twitter feed, you will need to create a Twitter application.

Go to [https://dev.twitter.com/] and follow the instructions.

Note the API Keys and token.

### Configuring the application

#### The .env file

You will find a `.env.sample` file at the root of the project. Copy it to a `.env` file.

This file contains all the secret information such as your API keys etc … It should never be put into the code repository.

the `.env` file look like this:

```
PAYMILL_PUBLIC_KEY=''
PAYMILL_SECRET_KEY=''

TWITTER_CONSUMER_KEY=''
TWITTER_CONSUMER_SECRET=''
TWITTER_TOKEN=''
TWITTER_TOKEN_SECRET=''

CLOUDINARY_CLOUD_NAME=''
CLOUDINARY_PRESET=''
CLOUDINARY_API_KEY=''
CLOUDINARY_API_SECRET=''
```

Just enter the various keys from the Cloudinary, Paymill and Twitter dashboards.

#### The config/default.yml file

This is the file containing the various settings for the application. You only need to set the `price` and `currency` values if needed. The price has to be set in *cents*.

Other settings are overridden by the environment variables defined in the `.env` file.

#### The config/custom-environment-variables.yml

You don’t need to change anything here. It’s the mapping between the config file and the environment variables names.

### Push your environment variables to Heroku

To set up the Heroku environment, you will need to push the values in your `.env` file to it.

`$ heroku config:push

### Push your code to the Heroku repository

Heroku gives you access to a git repository. Every time you will push changes to it, your application will be redeployed.

`$ git push heroku master

Once it’s done, ensure there is at least one web process running :

`$ heroku ps:scale web=1

### Open your application

To view your application in the browser just type:

`$ heroku open

And you’re done. Start playing with it.

## Using the PayBooth in PAYMILL test environment

Coming soon
