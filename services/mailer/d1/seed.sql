INSERT INTO clients (id, secret) VALUES ('www', 'secret') ON CONFLICT (id) DO NOTHING;
