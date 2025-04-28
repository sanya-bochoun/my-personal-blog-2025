-- Create tables
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    introduction TEXT,
    content TEXT,
    thumbnail_url TEXT,
    category_id INTEGER REFERENCES categories(id),
    author_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test data
INSERT INTO users (username, name) VALUES
    ('testuser', 'Test User');

INSERT INTO categories (name) VALUES
    ('Technology'),
    ('Lifestyle');

-- Insert test articles
INSERT INTO articles (title, introduction, content, category_id, author_id, status) VALUES
    ('Test Article 1', 'Test Introduction 1', 'Test Content 1', 1, 1, 'draft'),
    ('Test Article 2', 'Test Introduction 2', 'Test Content 2', 2, 1, 'published'); 