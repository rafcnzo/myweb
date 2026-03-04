# Quick Start Guide - 5 Minutes to Your Dynamic Portfolio

## Step 1: Verify Supabase Connection (✅ Already Done)
Your Supabase credentials are already set in the environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 2: Add Your Basic Info (5 minutes)

Go to your Supabase Dashboard → SQL Editor and run:

```sql
INSERT INTO biodata (name, role, description, email, github_url, linkedin_url) 
VALUES (
  'Your Name',
  'Your Job Title',
  'A brief description about yourself',
  'your.email@example.com',
  'https://github.com/yourname',
  'https://linkedin.com/in/yourname'
);
```

**Replace:**
- `Your Name` - Your full name
- `Your Job Title` - Your professional role
- `A brief description...` - 1-2 sentence bio
- Emails and URLs with your actual information

## Step 3: Add One Experience (2 minutes)

```sql
INSERT INTO experiences (title, company, start_date, end_date, description, type)
VALUES (
  'Your Position',
  'Your Company',
  '2024-01',
  'Present',
  'What you did here in 1-2 sentences',
  'Work'
);
```

## Step 4: Add One Project (2 minutes)

```sql
INSERT INTO projects (title, category, status, image_path)
VALUES (
  'Project Name',
  'Web',
  'Completed',
  'https://via.placeholder.com/800x600?text=Project+Screenshot'
);
```

## Step 5: Add Your Skills (1 minute)

```sql
INSERT INTO skills (name, category, percentage) VALUES ('React', 'Frontend', 90);
INSERT INTO skills (name, category, percentage) VALUES ('Node.js', 'Backend', 85);
INSERT INTO skills (name, category, percentage) VALUES ('Python', 'Backend', 80);
```

## Done! 🎉

Refresh your portfolio preview and see your real data live!

---

## Expand Later

Once the basics are set up, add more:
- More experiences (jobs, education)
- More projects with real images
- More skills in different categories
- Update social links and email

See `PORTFOLIO_SETUP.md` for detailed documentation.

---

## Need Help?

| Problem | Solution |
|---------|----------|
| "LOADING..." text shows | Wait a few seconds, Supabase might be initializing |
| Data not appearing | Check you ran the SQL INSERT commands |
| Email/links don't work | Make sure URLs start with `https://` |
| Want to edit data? | Go to Supabase dashboard → SQL Editor → UPDATE the row |

## Database Tables at a Glance

| Table | Purpose | Must Fill? |
|-------|---------|-----------|
| `biodata` | Your name, bio, contact info | ✅ YES |
| `experiences` | Jobs, education, roles | ✅ YES |
| `projects` | Portfolio projects | ⭕ Recommended |
| `skills` | Technical skills | ⭕ Recommended |
| `messages` | Contact form (not used yet) | ❌ NO |
| `site_settings` | Site configuration | ❌ NO |

---

**That's it! Your dynamic portfolio is ready to go.** 

Check the preview to see your portfolio come to life with real data! 🚀
