-- Database Schema for 805 LifeGuard Client Portal
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    emergency_contact TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    service_type TEXT NOT NULL CHECK (service_type IN ('swim-lesson', 'lifeguard', 'event')),
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    duration REAL NOT NULL,
    participants INTEGER NOT NULL,
    special_requests TEXT,
    cost DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_type TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    price_per_hour DECIMAL(10, 2),
    max_participants INTEGER DEFAULT 1,
    duration_options TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default services
INSERT OR REPLACE INTO services (service_type, name, description, base_price, price_per_hour, max_participants, duration_options) VALUES
('swim-lesson', 'Private Swim Lesson', 'One-on-one swimming instruction', 75.00, 75.00, 2, '["1", "1.5", "2"]'),
('lifeguard', 'Lifeguard Service', 'Professional lifeguard for events and parties', 45.00, 45.00, 50, '["2", "3", "4", "6", "8"]'),
('event', 'Special Event Coverage', 'Lifeguard coverage for special events', 65.00, 65.00, 25, '["3", "4", "6", "8"]');

-- Insert demo user (password is 'demo123' hashed)
INSERT OR REPLACE INTO users (id, name, email, password_hash, phone, address, emergency_contact, created_at) VALUES
(1, 'John Doe', 'demo@805lifeguard.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', '(805) 555-0123', '123 Pool St, Ventura, CA 93001', 'Jane Doe - (805) 555-0124', datetime('now', '-2 years'));

-- Insert demo bookings
INSERT OR REPLACE INTO bookings (user_id, service_type, booking_date, booking_time, duration, participants, special_requests, cost, status, created_at) VALUES
(1, 'swim-lesson', date('now', '+1 day'), '14:00', 1, 1, 'Focus on backstroke technique', 75.00, 'confirmed', datetime('now', '-1 day')),
(1, 'lifeguard', date('now', '+6 days'), '12:00', 6, 5, 'Birthday party for 8-year-old, 25 guests expected', 486.00, 'pending', datetime('now', '-2 days'));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);