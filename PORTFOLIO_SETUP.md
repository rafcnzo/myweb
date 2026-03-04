# Dynamic Portfolio Setup Guide

This portfolio template has been refactored to use **dynamic data from Supabase**. All content is now pulled from your database, making it easy to manage and update.

## Architecture Overview

The portfolio consists of:

1. **Hero Section** - Displays name, role, and description from `biodata`
2. **About Section** - Shows work experiences and education from `experiences`
3. **Works Section** - Lists your projects from `projects`
4. **Tech Marquee** - Displays skills grouped by category from `skills`
5. **Footer** - Shows contact email and social links from `biodata`

## Database Tables

Your Supabase database has 6 tables:

### 1. `biodata` (Portfolio Owner Info)
```sql
- id: bigint (PK)
- name: text
- role: text
- description: text
- telepon: varchar
- email: text
- github_url: text
- linkedin_url: text
- cv_path: text
- created_at: timestamp
- updated_at: timestamp
```

### 2. `experiences` (Work & Education)
```sql
- id: bigint (PK)
- title: text
- company: text
- start_date: text (format: "2024-01" or "2024")
- end_date: text (format: "2024-12" or "Present")
- description: text
- type: text ("Work", "Education", etc.)
- created_at: timestamp
- updated_at: timestamp
```

### 3. `projects` (Portfolio Projects)
```sql
- id: bigint (PK)
- title: text
- category: text
- status: text
- image_path: text (URL to project image)
- created_at: timestamp
```

### 4. `skills` (Technical Skills)
```sql
- id: bigint (PK)
- name: text
- category: text (e.g., "Frontend", "Backend", "Tools")
- percentage: bigint (0-100, optional)
- created_at: timestamp
- updated_at: timestamp
```

### 5. `messages` (Contact Form Submissions)
```sql
- id: bigint (PK)
- name: text
- email: text
- message: text
- is_read: boolean
- created_at: timestamp
- updated_by: timestamp
```

### 6. `site_settings` (Site Configuration)
```sql
- id: bigint (PK)
- title: text
- theme_color: text
- favicon_url: text
- created_at: timestamp
- updated_at: timestamp
```

## Environment Variables

The following environment variables are automatically set (found in the Vars section):

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Key Files

- **`lib/supabase.ts`** - Supabase client setup and data fetching functions
- **`components/hero.tsx`** - Hero section (pulls from `biodata`)
- **`components/about.tsx`** - Experience section (pulls from `experiences`)
- **`components/works.tsx`** - Projects section (pulls from `projects`)
- **`components/tech-marquee.tsx`** - Skills section (pulls from `skills`)
- **`components/footer.tsx`** - Footer (pulls from `biodata` for contact info)

## How to Update Your Portfolio

### 1. Update Your Bio
Add or edit your biodata in Supabase:

```sql
INSERT INTO biodata (name, role, description, email, github_url, linkedin_url) 
VALUES ('Your Name', 'Full Stack Developer', 'Your description...', 'your@email.com', 'https://github.com/...', 'https://linkedin.com/...')
```

### 2. Add Experiences
Insert work experience or education:

```sql
INSERT INTO experiences (title, company, start_date, end_date, description, type)
VALUES ('Senior Developer', 'Tech Corp', '2022-01', '2024-12', 'Led development of...', 'Work')
```

### 3. Add Projects
Add your portfolio projects:

```sql
INSERT INTO projects (title, category, status, image_path)
VALUES ('AI Chat App', 'Web', 'Completed', '/path/to/image.jpg')
```

### 4. Add Skills
Add your technical skills:

```sql
INSERT INTO skills (name, category, percentage)
VALUES ('React', 'Frontend', 90)
```

## Data Flow

```
Hero Component → getBiodata() → Supabase biodata table
About Component → getExperiences() → Supabase experiences table
Works Component → getProjects() → Supabase projects table
TechMarquee Component → getSkills() → Supabase skills table
Footer Component → getBiodata() → Supabase biodata table
```

## Component Props

All components are self-contained and fetch their own data:

- `<Hero />` - No props needed
- `<About />` - No props needed
- `<Works />` - No props needed
- `<TechMarquee />` - No props needed
- `<Footer />` - No props needed

## Error Handling

- If Supabase connection fails, components show "LOADING..." or fallback text
- Check browser console for any API errors
- Verify environment variables are correctly set

## Performance Tips

1. Data is fetched on component mount using `useEffect`
2. Consider adding loading states for better UX
3. Cache data if needed using SWR or React Query
4. Images in the `projects` table should be optimized

## Customization

### Changing Section Order
Edit `app/page.tsx` to rearrange or remove sections:

```tsx
<main>
  <Hero />
  <About />
  <Works />
  <TechMarquee />
  <Footer />
</main>
```

### Styling
All components use Tailwind CSS classes. Customize in the component files.

### Adding New Fields
To add new fields to biodata or other tables:
1. Modify the Supabase table schema
2. Update the TypeScript interfaces in `lib/supabase.ts`
3. Update the component to display the new field

## Next Steps

1. ✅ Supabase credentials are set
2. ⭕ Populate your `biodata` with your information
3. ⭕ Add your `experiences` (work, education, projects)
4. ⭕ Add your `projects` with images
5. ⭕ Add your `skills` with categories

That's it! Your portfolio will automatically display all the data from Supabase.
