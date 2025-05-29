# APP SUMMARY

New app in /my-app, React app with Vite

A web app for unwriters for commercial and specialty insurance. 

This app allows the user to create seperate projects for each client they are interfacing with. When a project is created, it spawns a chatbot that inquires first about the source of information for the project. The source can be:
spawning the project. The source can be:

1. An email thread
2. Relevant documents (pdfs, etc) that can be uploaded
3. Textual description about the project

Depending on the source information, the chatbot will populate broad information about the project in a box above the chat, and inquire about the most relevant information, and about how to acquire it. For example, if it determines it needs a form for the project, it will ask for the form and provide info on retrieving it. If it believes the client needs to send more information, it will ask for access to the email thread and send an email to the client asking for photos, etc (the relevant information). 

It will keep a note about the status of the project in the information box near the top, including if it's waiting on email threads, documents that haven't been filled out, research not performed, etc. Each one of these status markers has a button that allows "agent mode" to take over and automate that section, a chat mode where the user can click and create a new chat window for just that and walk the app through it, or can upload data manually to fill that section, and the system determines if enough information is updated