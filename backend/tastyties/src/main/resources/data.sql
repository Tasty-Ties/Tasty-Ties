
-- activity point log --
create table activity_point_log (
                                    amount float(53) not null,
                                    id integer not null auto_increment,
                                    user_id integer,
                                    transaction_date datetime(6),
                                    description varchar(255),
                                    primary key (id)
) engine=InnoDB;

-- album --
create table album (
                       album_id integer not null auto_increment,
                       folder_count integer not null,
                       user_id integer not null,
                       album_name varchar(255),
                       primary key (album_id)
) engine=InnoDB;

-- cooking class --
create table cooking_class (
                               cooking_class_id integer not null auto_increment,
                               dish_cooking_time integer not null,
                               host_id integer,
                               is_delete bit not null,
                               is_limited_age bit not null,
                               level integer not null,
                               quota integer not null,
                               cooking_class_end_time datetime(6) not null,
                               cooking_class_start_time datetime(6) not null,
                               create_time datetime(6),
                               replay_end_time datetime(6),
                               update_time datetime(6),
                               chat_room_id varchar(255),
                               country_code varchar(255) not null,
                               country_name varchar(255) not null,
                               description varchar(255),
                               dish_name varchar(255) not null,
                               language_code varchar(255) not null,
                               language_name varchar(255) not null,
                               main_image varchar(255),
                               session_id varchar(255),
                               title varchar(255) not null,
                               uuid varchar(255) not null,
                               primary key (cooking_class_id)
) engine=InnoDB;

-- cooking class and cooking class tag --
create table cooking_class_and_cooking_class_tag (
                                                     cooking_class_and_cooking_class_tag_id integer not null auto_increment,
                                                     cooking_class_id integer,
                                                     cooking_class_tag_id integer,
                                                     primary key (cooking_class_and_cooking_class_tag_id)
) engine=InnoDB;

-- cooking class image --
create table cooking_class_image (
                                     cooking_class_id integer,
                                     id integer not null auto_increment,
                                     cooking_class_image_url varchar(255),
                                     primary key (id)
) engine=InnoDB;

-- cooking class tag --
create table cooking_class_tag (
                                   cooking_class_tag_id integer not null auto_increment,
                                   cooking_class_tag_name varchar(255),
                                   primary key (cooking_class_tag_id)
) engine=InnoDB;

-- cooking tool --
create table cooking_tool (
                              cooking_class_id integer,
                              cooking_tool_id integer not null auto_increment,
                              cooking_tool_name varchar(255),
                              primary key (cooking_tool_id)
) engine=InnoDB;

-- country --
create table country (
                         id integer not null auto_increment,
                         alpha2 varchar(255) not null unique,
                         country_image_url varchar(255),
                         english_name varchar(255) not null unique,
                         korean_name varchar(255) not null unique,
                         primary key (id)
) engine=InnoDB;

-- folder --
create table folder (
                        album_id integer,
                        folder_id integer not null auto_increment,
                        max_photo_count integer not null,
                        cooking_class_uuid varchar(255),
                        country_code varchar(255),
                        folder_name varchar(255),
                        main_img_url varchar(255),
                        primary key (folder_id)
) engine=InnoDB;

-- ingredient --
create table ingredient (
                            cooking_class_id integer,
                            ingredient_id integer not null auto_increment,
                            is_required bit not null,
                            quantity integer not null,
                            ingredient_name varchar(255),
                            quantity_unit varchar(255),
                            primary key (ingredient_id)
) engine=InnoDB;

-- language --
create table language (
                          id integer not null auto_increment,
                          alpha2 varchar(255) not null unique,
                          english varchar(255) not null unique,
                          korean varchar(255) not null unique,
                          primary key (id)
) engine=InnoDB;

-- notification --
create table notification (
                              id integer not null auto_increment,
                              user_id integer,
                              create_time datetime(6),
                              body varchar(255),
                              title varchar(255),
                              primary key (id)
) engine=InnoDB;

-- photo --
create table photo (
                       folder_id integer,
                       order_index integer not null,
                       photo_id integer not null auto_increment,
                       photo_image_url varchar(255),
                       primary key (photo_id)
) engine=InnoDB;

-- recipe --
create table recipe (
                        cooking_class_id integer,
                        recipe_id integer not null auto_increment,
                        description varchar(255),
                        step varchar(255),
                        primary key (recipe_id)
) engine=InnoDB;

-- seq --
create table short_form_and_short_form_tag_seq (
                                                   next_val bigint
) engine=InnoDB;

insert into short_form_and_short_form_tag_seq values ( 1 );

-- short form --
create table short_form (
                            category tinyint not null,
                            hit integer not null,
                            is_delete bit not null,
                            short_form_id integer not null auto_increment,
                            user_id integer,
                            create_time datetime(6),
                            short_form_video_url varchar(255) not null,
                            title varchar(255) not null,
                            uuid varchar(255) not null,
                            primary key (short_form_id)
) engine=InnoDB;

-- short form and short form tag --
create table short_form_and_short_form_tag (
                                               id integer not null,
                                               `short-form_id` integer not null,
                                               `short-form_tag_id` integer,
                                               primary key (id)
) engine=InnoDB;

-- short form like --
create table short_form_like (
                                 is_like bit not null,
                                 `short-form_id` integer,
                                 short_form_like_id integer not null auto_increment,
                                 primary key (short_form_like_id)
) engine=InnoDB;

-- short form tag --
create table short_form_tag (
                                short_form_tag_id integer not null auto_increment,
                                short_form_tag_name varchar(255),
                                primary key (short_form_tag_id)
) engine=InnoDB;

-- user --
create table user (
                      activity_point float(53) not null,
                      birth date not null,
                      country_id integer not null,
                      is_adult bit not null,
                      is_deleted bit not null,
                      language_id integer not null,
                      user_id integer not null auto_increment,
                      description varchar(255),
                      email varchar(255) not null,
                      fcm_token varchar(255),
                      instagram_handle varchar(255),
                      instagram_url varchar(255),
                      nickname varchar(255) not null,
                      password varchar(255) not null,
                      profile_image_url varchar(255),
                      username varchar(255) not null,
                      youtube_handle varchar(255),
                      youtube_url varchar(255),
                      primary key (user_id)
) engine=InnoDB;

-- user and cooking class --
create table user_and_cooking_class (
                                        cooking_class_id integer,
                                        user_cooking_class_id integer not null auto_increment,
                                        user_id integer,
                                        cooking_class_review_create_time datetime(6),
                                        reservation_time datetime(6),
                                        cooking_class_review varchar(255),
                                        uuid varchar(255),
                                        primary key (user_cooking_class_id)
) engine=InnoDB;

-- user and country --
create table user_and_country (
                                  country_id integer,
                                  user_flag_id integer not null auto_increment,
                                  user_id integer,
                                  flag_create_time datetime(6),
                                  primary key (user_flag_id)
) engine=InnoDB;

-- user statistics --
create table user_statistics (
                                 classes_attended integer not null,
                                 classes_hosted integer not null,
                                 id integer not null auto_increment,
                                 user_id integer,
                                 primary key (id)
) engine=InnoDB;

-- index --
create index idx_user_id on album (user_id);

create index idx_uuid on cooking_class (uuid);

-- fk --
alter table user add constraint UKob8kqyqqgmefl0aco34akdtpe unique (email);
alter table user add constraint UKn4swgcf30j6bmtb4l4cjryuym unique (nickname);
alter table user add constraint UKsb8bbouer5wak8vyiiy4pf2bx unique (username);

alter table user_statistics add constraint UK14hay547dsmu33phkweirx73y unique (user_id);

alter table activity_point_log add constraint FKc1aa4hnqnnw496yg8fac6hs35 foreign key (user_id) references user (user_id);

alter table album add constraint FKmi5m81x9aswan1ci0wnw04dq1 foreign key (user_id) references user (user_id);

alter table cooking_class add constraint FKkg23i2n1aqd5r29i8u6qkk7ig foreign key (host_id) references user (user_id);

alter table cooking_class_and_cooking_class_tag add constraint FKohfosta2hp54vg428uvh7jlo2 foreign key (cooking_class_id) references cooking_class (cooking_class_id);
alter table cooking_class_and_cooking_class_tag add constraint FKinohi8fn83n2n8xh05nmjst5d foreign key (cooking_class_tag_id) references cooking_class_tag (cooking_class_tag_id);

alter table cooking_class_image add constraint FKe9sfq3lra5j8vkqshufoy4cxc foreign key (cooking_class_id) references cooking_class (cooking_class_id);

alter table cooking_tool add constraint FKivn6egobvs4kxp5c2em277wal foreign key (cooking_class_id) references cooking_class (cooking_class_id);

alter table folder add constraint FKl9m613c9bj3c81vmvgcypx5gq foreign key (album_id) references album (album_id);

alter table ingredient add constraint FKdhnmmr32ybciw0rcpeo3uodjl foreign key (cooking_class_id) references cooking_class (cooking_class_id);

alter table notification add constraint FKb0yvoep4h4k92ipon31wmdf7e foreign key (user_id) references user (user_id);

alter table photo add constraint FKmi0km9rabqsky3sf6dwntg3u4 foreign key (folder_id) references folder (folder_id);

alter table recipe add constraint FK9vu3esapbhasnocc4hotx04mp foreign key (cooking_class_id) references cooking_class (cooking_class_id);

alter table short_form add constraint FK5e3d5a4y76a52hkboy2ebe1o4 foreign key (user_id) references user (user_id);

alter table short_form_and_short_form_tag add constraint FKkoait1kihnfwdc0lep3cjmnja foreign key (`short-form_id`) references short_form (short_form_id);
alter table short_form_and_short_form_tag add constraint FK18aqd3y8uhtis14kkkmvko7k5 foreign key (`short-form_tag_id`) references short_form_tag (short_form_tag_id);

alter table short_form_like add constraint FKetin1oc5t30ihwgc1ct5809pm foreign key (`short-form_id`) references short_form (short_form_id);

alter table user add constraint FKge8lxibk9q3wf206s600otk61 foreign key (country_id) references country (id);
alter table user add constraint FKj9k2portqypgs993xn20pywtr foreign key (language_id) references language (id);

alter table user_and_cooking_class add constraint FKd784983u0ts9ydfn5a0j6y9k foreign key (cooking_class_id) references cooking_class (cooking_class_id);
alter table user_and_cooking_class add constraint FKjm608uyehcjcro3kn27af4rne foreign key (user_id) references user (user_id);

alter table user_and_country add constraint FKnuca79wxpcpey60ts4jnqjncb foreign key (country_id) references country (id);
alter table user_and_country add constraint FKd1nb423v6v6b2mjv9uden8gue foreign key (user_id) references user (user_id);

alter table user_statistics add constraint FKpt8rurq22vf5732sa75jhm0kb foreign key (user_id) references user (user_id);


-- Insert initial data
INSERT INTO language (alpha2, english, korean) VALUES ('EN', 'English', '영어');
INSERT INTO language (alpha2, english, korean) VALUES ('KO', 'Korean', '한국어');
INSERT INTO language (alpha2, english, korean) VALUES ('ZH', 'Chinese', '중국어');
INSERT INTO language (alpha2, english, korean) VALUES ('JA', 'Japanese', '일본어');
INSERT INTO language (alpha2, english, korean) VALUES ('ES', 'Spanish', '스페인어');
INSERT INTO language (alpha2, english, korean) VALUES ('FR', 'French', '프랑스어');
INSERT INTO language (alpha2, english, korean) VALUES ('DE', 'German', '독일어');
INSERT INTO language (alpha2, english, korean) VALUES ('RU', 'Russian', '러시아어');
INSERT INTO language (alpha2, english, korean) VALUES ('IT', 'Italian', '이탈리아어');
INSERT INTO language (alpha2, english, korean) VALUES ('PT', 'Portuguese', '포르투갈어');
INSERT INTO language (alpha2, english, korean) VALUES ('AR', 'Arabic', '아랍어');
INSERT INTO language (alpha2, english, korean) VALUES ('HI', 'Hindi', '힌디어');
INSERT INTO language (alpha2, english, korean) VALUES ('VI', 'Vietnamese', '베트남어');
INSERT INTO language (alpha2, english, korean) VALUES ('TH', 'Thai', '타이어');
INSERT INTO language (alpha2, english, korean) VALUES ('TR', 'Turkish', '터키어');

-- Insert initial data into Country table
INSERT INTO country (alpha2, english_name, korean_name) VALUES ('US', 'United States', '미국');
INSERT INTO country (alpha2, english_name, korean_name) VALUES ('KR', 'South Korea', '대한민국');
INSERT INTO country (alpha2, english_name, korean_name) VALUES ('CN', 'China', '중국');
INSERT INTO country (alpha2, english_name, korean_name) VALUES ('JP', 'Japan', '일본');
INSERT INTO country (alpha2, english_name, korean_name) VALUES ('ES', 'Spain', '스페인');
INSERT INTO country (alpha2, english_name, korean_name) VALUES ('FR', 'France', '프랑스');
INSERT INTO country (alpha2, english_name, korean_name) VALUES ('DE', 'Germany', '독일');
INSERT INTO country (alpha2, english_name, korean_name) VALUES ('RU', 'Russia', '러시아');
INSERT INTO country (alpha2, english_name, korean_name) VALUES ('IT', 'Italy', '이탈리아');
INSERT INTO country (alpha2, english_name, korean_name) VALUES ('PT', 'Portugal', '포르투갈');
INSERT INTO country (alpha2, english_name, korean_name) VALUES ('SA', 'Saudi Arabia', '사우디아라비아');
INSERT INTO country (alpha2, english_name, korean_name) VALUES ('IN', 'India', '인도');
INSERT INTO country (alpha2, english_name, korean_name) VALUES ('VN', 'Vietnam', '베트남');
INSERT INTO country (alpha2, english_name, korean_name) VALUES ('TH', 'Thailand', '태국');
INSERT INTO country (alpha2, english_name, korean_name) VALUES ('TR', 'Turkey', '터키');
