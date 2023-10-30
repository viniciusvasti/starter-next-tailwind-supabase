CREATE TABLE employees (
  id uuid NOT NULL PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  salary numeric(10, 2) NOT NULL,
  address text,
  created_by uuid NOT NULL REFERENCES auth.users(id),
  updated_by uuid NULL REFERENCES auth.users(id),
  created_at timestamp WITH time zone NOT NULL DEFAULT timezone('utc' :: text, NOW()),
  updated_at timestamp WITH time zone NOT NULL DEFAULT timezone('utc' :: text, NOW())
)