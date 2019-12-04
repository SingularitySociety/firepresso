## Overview

This is an attempt to create a modern content management system, which makes it extremely easy to deploy a blog or homepage using the Firebase.

## Instruction (how to deploy your own Firepresso)

1. Git clone this repository
2. Run "npm install firebase-tools -g" to install firebase tools. 
3. Run "npm install" once to get necessary node modules.
4. Run "npm install" once in the functions directory as well.
5. Open the firebase console (from https://firebase.google.com) and create a project.
6. From the dashboard of this project, add an app and choose "web" (</>).
7. From the setting of this app, choose "Config" (in Firebase SDK snippet)
8. Copy the config file, and paste into src/config.js file.  
9. Replace the word "firepresso" in .firebaserc file with your Firebase project name.
10. Open the firebase console, and create a Cloud Firestore (make it "secure"). 
11. Run "npm run build"
12. Run "firebase deploy"

