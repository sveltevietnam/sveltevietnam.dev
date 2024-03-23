-- should only used for production
INSERT INTO isc_clients (id, secret) VALUES ('www', 'secret_www') ON CONFLICT (id) DO NOTHING;
INSERT INTO isc_clients (id, secret) VALUES ('mailer', 'secret_mailer') ON CONFLICT (id) DO NOTHING;
INSERT INTO isc_clients (id, secret) VALUES ('qr', 'secret_qr') ON CONFLICT (id) DO NOTHING;
