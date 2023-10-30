# Starter for NextJS + Tailwind + Supabase

Also including Shadcn UI and React Hook Form with Zod validations

## Requirements

- Node
- Docker
- Supabase CLI

## Starting from this Starter

1. Delete supabase folder to init it from scratch
2. Run `supabase init` to setup a new supabase project for the app
3. Search for occurrences of "MyApp" and replace it with the name of you app
4. Search for occurrences of "TODO" and fix it according to your needs

## Running Locally

- Start supabase  
  `supabase start`
- Start the app  
  `npm run dev`

## Supabase basics

- `supabase start -x seviceA,serviceB,...`: starts supabase without the services after `-x`
- `supabase migration new create-table-x`: creates a new migration
- `supabase migration up`: run all migrations pending to run
- `supabase db reset`: resets the database an run each migration
- `supabase db push`: pushes the migrations to remote supabase project
