-- SQL script to update service prices in the database
-- Run this in your database management tool (e.g., Drizzle Studio, pgAdmin, or psql)

UPDATE services 
SET price = '125.00', "updatedAt" = NOW()
WHERE name = 'Entry Level Resume';

UPDATE services 
SET price = '55.00', "updatedAt" = NOW()
WHERE name = 'Entry Level Cover Letter';

UPDATE services 
SET price = '185.00', "updatedAt" = NOW()
WHERE name = 'Professional Resume';

UPDATE services 
SET price = '85.00', "updatedAt" = NOW()
WHERE name = 'Professional Cover Letter';

UPDATE services 
SET price = '355.00', "updatedAt" = NOW()
WHERE name = 'Executive Resume';

UPDATE services 
SET price = '125.00', "updatedAt" = NOW()
WHERE name = 'Executive Cover Letter';

-- Verify the updates
SELECT name, price, "updatedAt" 
FROM services 
WHERE name IN (
  'Entry Level Resume',
  'Entry Level Cover Letter',
  'Professional Resume',
  'Professional Cover Letter',
  'Executive Resume',
  'Executive Cover Letter'
)
ORDER BY name;
