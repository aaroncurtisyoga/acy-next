141 lines (104 sloc)  6.31 KB
   
<h1 style="text-align: center;">AaronCurtisYoga.com</h1>
<p style="text-align: center;">Fullstack Next.js App for Aaron Curtis Yoga </p>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Intro](#introduction)
2. 🤸 [Quick Start](#quick-start)
3. ⚙️ [Tech Stack](#tech-stack)
4. 🔋 [Features](#features)
5. ✨ [Get in touch](#contact)


## <a name="introduction">🤖 Intro</a>

This app is set up to help current and future yoga students: 
Learn about me, Find my weekly schedule, sign up to my newsletter, and register for events (_work in progress_)


## <a name="quick-start">🤸 Quick Start</a>

Before getting started, create a .env in the root of your project and

**Set Up Environment Variables**

```env
MAILCHIMP_API_KEY=
MAILCHIMP_AUDIENCE_ID=
MAILCHIMP_API_SERVER=
```

My app is built with [Next.js](https://nextjs.org/). The common scripts are:
- `npm run dev`
- `npm run lint`
- `npm build` 


## <a name="tech-stack">⚙️ Tech Stack</a>

- Next.js (_TypeScript_)
- Tailwind
- React Hook Form
- Zod
- Mailchimp Marketing API ([docs -- specifically lists.addListMember /lists/{list_id}/members](https://mailchimp.com/developer/marketing/))

## <a name="features">🔋 Features</a>

👉 **Newsletter:** People can sign up to the Newsletter & stay up-to-date w/ upcoming events

👉 **IN PROGRESS - Authentication:** Secure and efficient auth

👉 **UPCOMING - Events (CRUD):** Admins can create, read, update, and delete events
- **Create Events:** Admins can  create new events, providing details like the title, date, location, etc.
- **Read Events:** Users can view events
- **Update Events:** Admins can modify event details to make sure  event info stays accurate & up-to-date
- **Delete Events:** Admins can remove events from the system

👉 **UPCOMING - Search & Filter:** Users can search and filter events

👉 **UPCOMING - Checkout and Pay:** Users can securely pay for events


## <a name="contact">✨ Get in touch</a>
* Instagram: [instagram.com/aaroncurtisyoga](https://www.instagram.com/aaroncurtisyoga/)
* Email: aaroncurtisyoga@gmail.com

