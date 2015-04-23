The ultimate mapping application
================================

##Purpose
This application was created purely to show how to use [Wardley Maps](wardleymaps.com) in practice. As a side effect of applying Wardley Maps, I will get a fully functional, and trully working c4p application I would like to use.

## Components
Wardley Maps recommend outsourcing everything what someone else can do better than you are. Fortunately, organizing conferences and gathering talk proposals is a repeatable task, with equally boring and repeatable subtasks, so the whole project requires only small bits of integration.

### Component 1 - Platform
I do not consider myself a developer anymore, and development techniques have changed significantly during cloud adoption. I do not want to reinvent the wheel, so I have used a ready technology stack configured and stubbed for my by OpenShift (Node + Mongo), which also offered free hosting for small apps.

### Component 2 - User Management
User registration, e-mail confirmation, password management - those are all boring tasks that are hard to get right for first timers. But, hey, Maps say that those tasks should be outsourced, and there is one provider that offers a free tier - [Stormpath](stormpath.com). If you want to run this application, you need to register there and obtain apiKey.properties file. 

## Open Source
Maps say that open source increases adoption. This software is expected to ease the paper submission process for all sides, so, take it, use it, share it, do whatever you want. It is all ASL 2.0.

## Running the application
1. Checkout the code.
2. Register at [Stormpath](stormpath.com), create there your own application and download apiKey.properties.
3. npm start

## Accessing the live application
The application is running under this address: [http://c4p-geecon.rhcloud.com/](http://c4p-geecon.rhcloud.com/). You may propose your talk to non-existing conference.

## Contributing
Open a request, suggestion, pull request, share this to any conference organizers. We can help each other.

