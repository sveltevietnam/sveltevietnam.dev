INSERT INTO isc_clients (id, secret) VALUES ('www', 'secret') ON CONFLICT (id) DO NOTHING;
