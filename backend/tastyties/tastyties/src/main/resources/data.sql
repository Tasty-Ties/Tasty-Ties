-- insert initial data into language table
insert into language (alpha2, english, korean) values ('en', 'english', '영어');
insert into language (alpha2, english, korean) values ('ko', 'korean', '한국어');
insert into language (alpha2, english, korean) values ('zh', 'chinese', '중국어');
insert into language (alpha2, english, korean) values ('ja', 'japanese', '일본어');
insert into language (alpha2, english, korean) values ('es', 'spanish', '스페인어');
insert into language (alpha2, english, korean) values ('fr', 'french', '프랑스어');
insert into language (alpha2, english, korean) values ('de', 'german', '독일어');
insert into language (alpha2, english, korean) values ('ru', 'russian', '러시아어');
insert into language (alpha2, english, korean) values ('it', 'italian', '이탈리아어');
insert into language (alpha2, english, korean) values ('pt', 'portuguese', '포르투갈어');
insert into language (alpha2, english, korean) values ('ar', 'arabic', '아랍어');
insert into language (alpha2, english, korean) values ('hi', 'hindi', '힌디어');
insert into language (alpha2, english, korean) values ('vi', 'vietnamese', '베트남어');
insert into language (alpha2, english, korean) values ('th', 'thai', '타이어');
insert into language (alpha2, english, korean) values ('tr', 'turkish', '터키어');

-- insert initial data into country table
insert into country (alpha2, english_name, korean_name) values ('us', 'united states', '미국');
insert into country (alpha2, english_name, korean_name) values ('kr', 'south korea', '대한민국');
insert into country (alpha2, english_name, korean_name) values ('cn', 'china', '중국');
insert into country (alpha2, english_name, korean_name) values ('jp', 'japan', '일본');
insert into country (alpha2, english_name, korean_name) values ('es', 'spain', '스페인');
insert into country (alpha2, english_name, korean_name) values ('fr', 'france', '프랑스');
insert into country (alpha2, english_name, korean_name) values ('de', 'germany', '독일');
insert into country (alpha2, english_name, korean_name) values ('ru', 'russia', '러시아');
insert into country (alpha2, english_name, korean_name) values ('it', 'italy', '이탈리아');
insert into country (alpha2, english_name, korean_name) values ('pt', 'portugal', '포르투갈');
insert into country (alpha2, english_name, korean_name) values ('sa', 'saudi arabia', '사우디아라비아');
insert into country (alpha2, english_name, korean_name) values ('in', 'india', '인도');
insert into country (alpha2, english_name, korean_name) values ('vn', 'vietnam', '베트남');
insert into country (alpha2, english_name, korean_name) values ('th', 'thailand', '태국');
insert into country (alpha2, english_name, korean_name) values ('tr', 'turkey', '터키');

-- insert sample data into user table
insert into user (username, activity_point, password, nickname, birth, email, is_deleted, is_adult, country_id, language_id)
values ('thai', 0, 'thai', '폼폼푸린', '2001-02-18', 'maithai071823@gmail.com', false, false, 14, 14);

insert into user (username, activity_point, password, nickname, birth, email, is_deleted, is_adult, country_id, language_id)
values ('john_doe', 0, 'password123', 'john', '1990-06-15', 'john_doe@example.com', false, false, 1, 1);

insert into user (username, activity_point, password, nickname, birth, email, is_deleted, is_adult, country_id, language_id)
values ('jane_smith', 0, 'securepass', 'jane', '1985-09-23', 'jane_smith@example.com', false, false, 2, 2);

insert into user (username, activity_point, password, nickname, birth, email, is_deleted, is_adult, country_id, language_id)
values ('maria_garcia', 0, 'mypass', 'maria', '1992-11-30', 'maria_garcia@example.com', false, false, 5, 5);

insert into user (username, activity_point, password, nickname, birth, email, is_deleted, is_adult, country_id, language_id)
values ('chen_wei', 0, 'pass123', 'chen', '1988-03-12', 'chen_wei@example.com', false, false, 3, 3);
