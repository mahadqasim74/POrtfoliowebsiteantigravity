# Deployment Guide

Follow these steps to deploy your portfolio to the internet.

## Prerequisites
-   A [GitHub](https://github.com) account.
-   A [Vercel](https://vercel.com) account.

## Step 1: Push to GitHub

1.  Create a new repository on GitHub (e.g., `my-portfolio`).
2.  Run the following commands in your terminal (inside the project folder):

```bash
git remote add origin https://github.com/YOUR_USERNAME/my-portfolio.git
git branch -M main
git push -u origin main
```

*(Replace `YOUR_USERNAME` and `my-portfolio` with your actual details)*

## Step 2: Deploy to Vercel

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `my-portfolio` repository.
4.  **Configure Project**:
    -   **Framework Preset**: Next.js (should be auto-detected).
    -   **Root Directory**: `./` (default).
5.  **Environment Variables**:
    -   Expand the "Environment Variables" section.
    -   Add the following variables:
        -   `ADMIN_PASSWORD`: Set a secure password for the admin portal.
        -   `NEXTAUTH_SECRET`: Generate a random string (you can use `openssl rand -base64 32` in terminal or just mash your keyboard).
        -   `NEXTAUTH_URL`: Your Vercel domain (e.g., `https://my-portfolio.vercel.app`). *Note: You might need to deploy once, get the URL, and then update this variable.*
6.  **Database Setup (Vercel Postgres)**:
    -   Click **"Deploy"**. The build might fail initially if the database isn't connected, or it might succeed but show empty data.
    -   Once the project is created, go to the **Storage** tab in your Vercel project dashboard.
    -   Click **"Connect Store"** -> **"Postgres"** -> **"Create New"**.
    -   Follow the prompts to create a database.
    -   Once created, go to the `.env.local` tab in the database view and click **"Copy Snippet"**.
    -   Go to **Settings** -> **Environment Variables** and paste the snippet (this sets `POSTGRES_URL`, etc.).
    -   **Important**: You also need to set `DATABASE_URL` to the same value as `POSTGRES_PRISMA_URL` if using Prisma with Vercel Postgres.

## Step 3: Initialize the Database

Since Vercel Postgres is a new database, it will be empty. You need to push your schema and seed data.

1.  In your local terminal, run:
    ```bash
    npx prisma migrate deploy
    ```
    *(Note: You need to temporarily set your local `.env` `DATABASE_URL` to your Vercel Postgres URL to do this, or use the Vercel CLI if you install it later).*

    **Easier Alternative**:
    -   Go to your Vercel Project -> **Settings** -> **Build & Development Settings**.
    -   Change the **Build Command** to:
        ```bash
        npx prisma generate && npx prisma db push && next build
        ```
    -   Redeploy. This will ensure the database schema is always in sync.

## Step 4: Configure Deployment Trigger (Optional)

To use the "Deploy" button in your Admin Portal:
1.  Go to Vercel Project Settings -> **Git** -> **Deploy Hooks**.
2.  Create a new hook (e.g., "Admin Portal").
3.  Copy the URL.
4.  Add it as an Environment Variable named `DEPLOY_HOOK_URL`.

## Done!
Your website should now be live at your Vercel URL.
