-- MySQL dump for Language table

-- Create the table
CREATE TABLE Language (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          alpha2 CHAR(2) NOT NULL,
                          english VARCHAR(50) NOT NULL,
                          korean VARCHAR(50) NOT NULL
);

-- Insert initial data
INSERT INTO Language (alpha2, english, korean) VALUES ('EN', 'English', '영어');
INSERT INTO Language (alpha2, english, korean) VALUES ('KO', 'Korean', '한국어');
INSERT INTO Language (alpha2, english, korean) VALUES ('ZH', 'Chinese', '중국어');
INSERT INTO Language (alpha2, english, korean) VALUES ('JA', 'Japanese', '일본어');
INSERT INTO Language (alpha2, english, korean) VALUES ('ES', 'Spanish', '스페인어');
INSERT INTO Language (alpha2, english, korean) VALUES ('FR', 'French', '프랑스어');
INSERT INTO Language (alpha2, english, korean) VALUES ('DE', 'German', '독일어');
INSERT INTO Language (alpha2, english, korean) VALUES ('RU', 'Russian', '러시아어');
INSERT INTO Language (alpha2, english, korean) VALUES ('IT', 'Italian', '이탈리아어');
INSERT INTO Language (alpha2, english, korean) VALUES ('PT', 'Portuguese', '포르투갈어');
INSERT INTO Language (alpha2, english, korean) VALUES ('AR', 'Arabic', '아랍어');
INSERT INTO Language (alpha2, english, korean) VALUES ('HI', 'Hindi', '힌디어');
INSERT INTO Language (alpha2, english, korean) VALUES ('VI', 'Vietnamese', '베트남어');
INSERT INTO Language (alpha2, english, korean) VALUES ('TH', 'Thai', '타이어');
INSERT INTO Language (alpha2, english, korean) VALUES ('TR', 'Turkish', '터키어');

-- Create the Country table
CREATE TABLE Country (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         alpha2 CHAR(2) NOT NULL,
                         english_name VARCHAR(100) NOT NULL,
                         korean_name VARCHAR(100) NOT NULL
);

-- Insert initial data into Country table
INSERT INTO Country (alpha2, english_name, korean_name) VALUES ('US', 'United States', '미국');
INSERT INTO Country (alpha2, english_name, korean_name) VALUES ('KR', 'South Korea', '대한민국');
INSERT INTO Country (alpha2, english_name, korean_name) VALUES ('CN', 'China', '중국');
INSERT INTO Country (alpha2, english_name, korean_name) VALUES ('JP', 'Japan', '일본');
INSERT INTO Country (alpha2, english_name, korean_name) VALUES ('ES', 'Spain', '스페인');
INSERT INTO Country (alpha2, english_name, korean_name) VALUES ('FR', 'France', '프랑스');
INSERT INTO Country (alpha2, english_name, korean_name) VALUES ('DE', 'Germany', '독일');
INSERT INTO Country (alpha2, english_name, korean_name) VALUES ('RU', 'Russia', '러시아');
INSERT INTO Country (alpha2, english_name, korean_name) VALUES ('IT', 'Italy', '이탈리아');
INSERT INTO Country (alpha2, english_name, korean_name) VALUES ('PT', 'Portugal', '포르투갈');
INSERT INTO Country (alpha2, english_name, korean_name) VALUES ('SA', 'Saudi Arabia', '사우디아라비아');
INSERT INTO Country (alpha2, english_name, korean_name) VALUES ('IN', 'India', '인도');
INSERT INTO Country (alpha2, english_name, korean_name) VALUES ('VN', 'Vietnam', '베트남');
INSERT INTO Country (alpha2, english_name, korean_name) VALUES ('TH', 'Thailand', '태국');
INSERT INTO Country (alpha2, english_name, korean_name) VALUES ('TR', 'Turkey', '터키');