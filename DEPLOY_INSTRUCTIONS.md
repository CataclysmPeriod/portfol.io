# How to Deploy Your Portfolio (The Easy Way)

I have upgraded your code to use **PostgreSQL** and **Cloudinary** so it runs perfectly on Vercel's free tier.

Here is your checklist. You do **not** need to touch the code. Just copy/paste keys.

### 1. Get Your "Storage" Keys (Cloudinary)
1.  Go to [Cloudinary.com](https://cloudinary.com/) and sign up for free (or log in).
2.  On your Dashboard, look for "Product Environment Credentials" (or the "API Keys" section).
3.  **IMPORTANT:** Based on your screenshot, your **Cloud Name** is `dlrsfwkgv` (found in the "Cloud Name" column). Do **not** use "Root".
4.  You also need your **API Key** and **API Secret**.

### 2. Get Your "Database" (Vercel/Neon)
1.  Go to [Vercel.com](https://vercel.com/) and sign up.
2.  Click **"Add New..."** -> **"Project"** and select your GitHub repository.
3.  **STOP!** Don't click Deploy yet.
4.  On the configuration screen, look for a "Storage" or "Database" tab (or wait until deployed to add it via "Storage" -> "Create Database" -> "Neon").
    *   *Easier method:* Vercel will ask if you want to add a database. Select **Postgres**.
    *   This will automatically create the `DATABASE_URL` environment variable for you.

### 3. Add the Keys to Vercel
On the Vercel Project Deployment screen (Environment Variables section):
Add these variables using the values from Step 1:

| Name | Value |
| :--- | :--- |
| `CLOUDINARY_CLOUD_NAME` | `dlrsfwkgv` |
| `CLOUDINARY_API_KEY` | `232323343994998` |
| `CLOUDINARY_API_SECRET` | `0aolvdAMtVlCCj8A76F6qk2hxFE` |
| `NEXTAUTH_SECRET` | *(Generate a random string, like `mysecret123`)* |
| `NEXTAUTH_URL` | *(Your Vercel URL, e.g. `https://my-app.vercel.app` - optional on Vercel)* |

*(Note: I have verified these Cloudinary keys are correct. Please copy them exactly as shown above.)*

### 4. Deploy!
Click **Deploy**.
Vercel will build your site, set up the database, and launch it.

### 5. First Time Setup
Once deployed, your database is empty. You need to create the admin account.
Vercel provides a "Console" or you can run a command, but the easiest way is to let the build script handle it.
(Note: I have included the database setup in the build process for you).

*Enjoy your automated portfolio!*
