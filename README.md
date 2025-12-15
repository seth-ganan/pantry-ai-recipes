# pantry-ai-recipes
*The pantry app that generates recipes using AI based on your ingredients


The goal of this app is that you can enter the name of your ingredient and its amount in the boxes. I created this app for myself since I tend to fall back on the same recipes after I go to the store, however, I've been wanting to branch out and so an app like this is perfect for brainstorming meal ideas. This also helps solve the issue of buying ingredients which you dont have a use for since the ai will figure something out based on what you have.


---

## 🌐 Live Demo

| Type                         | Link                                                           |
| ---------------------------- | -------------------------------------------------------------- |
| **Frontend (Deployed Site)** | [https://pantry-ai-recipes-1.onrender.com](https://your-frontend-url.com) |
| **Backend (API Base URL)**   | [https://pantry-ai-recipes.onrender.com](https://your-backend-url.com)   |


##Features:
*data persisted in MongoDB
*Create, read, and delete **[pantry]
*error handling client + server
*Backend API with CRUD operations

### **Advanced Feature**

I ended up deciding to work with the OpenAI API gpt-5.2 which I used in a couple of different ways. I used it to standardize ingredients since I thought it would be cool if ingredients combined with each other if they shared the same name and it worked. I also tried to use to create recipes, however, you cant really see the ingredients and steps in the recipes.


---
---

## 📸 Screenshots

> Include 2–4 screenshots of your app.
> https://image2url.com/images/1765772764789-62c70e24-90f3-4f1b-b92c-583376d64351.png 
>https://image2url.com/images/1765772820004-75229a66-74f8-451b-83f6-b38d47c70df8.png
>https://image2url.com/images/1765772837578-0aa38278-af1e-4f42-b3c1-da8a79d07da3.png

---

## 🏗️ Project Architecture

Describe how the pieces fit together.

```
/frontend
index.html
packag-lock and package.json
vite.config.js
  /src
  App.jsx
  main.jsx
    /components
    PantryForm.jsx
    PantryList.jsx
    RecipeList.jsx

/backend
  /models
  Pantry.js
  Recipe.js
  /routes
  pantry.js
  recipes.js
  /utilities
  openai.js
server.js
package lock and package.json
```

Include a sentence explaining the flow:

> I am using Render for both the frontend and backend which store all of my sensitive info like API keys and mongodb connection strings. the user interacts with the frontend and as they access the page a request is made to the backend which itself receives information from the database on ingredients and recipes. when standardization occurs a call is made to the openAI api.

---

## 📦 Installation & Setup

### **1. Clone the project**

```bash
git clone https://github.com/seth-ganan/pantry-ai-recipes.git
```

---

### **2. Environment Variables**

everything is stored on react so no need to worry about a .env file

---

### **3. Install Dependencies**

#### Frontend:

```bash
cd frontend
npm install
npm run dev
```

#### Backend:

```bash
cd backend
npm install
npm run dev
```


*Reflections
  I am proud of how i was able to get the ai working with the database. In terms of what was the hardest, it had to be working with netlify. I was not expecting to be cut off of credits as i was working on the project and I ended up in a panic trying to figure out how to fix this issue. If I were to do something differently, I would use render for the front and backend from the get go. This way i wouldnt have to struggle with functionality. I attempted to use ChatGPT to fix some of the issues with recipe ingredients and steps but I couldnt figure it out. There are comments throughout my code where i ended up using AI. Overall, I learned a ton about using the openai API's and the differences between models, for instance, gpt-5-mini is horrible for json requests. I tried using it for standardization of ingredient names and it just would not work, however, I found out GPT 5.2 is great at it. I also got exprerienced with Render and Netlify whether I liked it or not due to some of the issues I was having with it. I got really good at console logging issues to figure out what was going on. While I still have issues upon submission I feel good about the work I put in and I will continue working on it in a way that is different from my other projects. As annoying as it can be working with OpenAI's API's it is pretty fun.

