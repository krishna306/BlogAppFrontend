# Inkline

Inkline is an editorial blog for engineering notes: short, readable stories with a magazine-style layout. Readers browse by topic; writers publish, edit, and manage their own work.

This repository is the **web app**.

## What it does

- Shows a home feed of latest stories, with a featured piece at the top
- Lets anyone read a full article, including cover image, category, date, reading time, and author
- Helps readers continue with related and next stories
- Lets people create an account, sign in, and stay signed in across visits
- Lets signed-in writers compose a story with a title, category, cover image, and rich text
- Lets writers update or delete only their own stories
- Keeps the feed fast with cached lists and article pages on the server

## Features

### Reading

- Featured story on the first page of the feed
- Category chips: Technology, Travel, Web design, Programming, AI, and Other
- Paginated grid of story cards
- Sidebar of stories on the current page
- Article page with cover, byline, and readable body
- Estimated reading time
- “Keep reading” suggestions in the same category

### Writing

- Dedicated compose view for a new story
- Cover image upload (JPG or PNG, up to 10MB)
- Category selection
- Rich-text editor (headings, lists, links, formatting)
- Edit flow that loads the full story, not a truncated preview
- Confirmation before deleting a story
- “My articles” list of everything you have published

### Account

- Sign up and log in
- Account menu with avatar initial, name, and email
- Shortcuts to write and to your articles
- Log out that clears the session even if the network request fails

### Design

- Paper-and-ink editorial theme (serif titles, sans UI, teal accent)
- Inkline mark in the nav and as the browser icon
- Responsive layout for feed, article, and compose

## Stack

- React
- Redux Toolkit and RTK Query
- React Router
- Bootstrap / React Bootstrap
- Draft.js editor
- Session persistence in the browser

The app talks to the [Inkline server](https://github.com/krishna306/BlogApp).

## Run locally

```bash
npm install
npm start
```

Build for production:

```bash
npm run build
```

Point the app at your running server before starting it. Do not commit secrets or environment files.
