create table if not exists public.youlearn_users
(
    id       serial
        constraint users_pk
            primary key,
    login    varchar(256)          not null
        constraint users_pk2
            unique,
    password varchar(256)          not null,
    is_admin boolean default false not null
);

create table if not exists public.youlearn_tokens
(
    id              serial
        primary key,
    user_id         integer
        references public.youlearn_users,
    token           uuid,
    expiration_date timestamp default CURRENT_TIMESTAMP
);

create table if not exists public.youlearn_cards
(
    id            serial
        constraint cards_pk
            primary key,
    title         varchar(256)                        not null,
    description   text                                not null,
    img_url       text                                not null,
    creator_id    integer                             not null
        constraint cards_users_id_fk
            references public.youlearn_users,
    creation_date timestamp default CURRENT_TIMESTAMP not null
);

create table if not exists public.youlearn_tags
(
    id   serial
        primary key,
    name varchar(256) not null
);

create table if not exists public.youlearn_card_tags
(
    card_id integer not null
        constraint card_tags_cards_id_fk
            references public.youlearn_cards
            on delete cascade,
    tag_id  integer not null
        constraint card_tags_tags_id_fk
            references public.youlearn_tags
            on delete cascade,
    constraint card_tags_pk
        primary key (card_id, tag_id)
);

create table if not exists public.youlearn_card_user
(
    card_id integer not null
        constraint card_user_cards_null_fk
            references public.youlearn_cards,
    user_id integer not null
        constraint card_user_users_null_fk
            references public.youlearn_users,
    constraint card_user_pk
        primary key (card_id, user_id)
);

create table if not exists public.youlearn_tests
(
    id       serial
        constraint tests_pk
            primary key,
    question text    default 'Вопрос?'::text not null,
    card_id  integer                         not null
        constraint tests_cards_id_fk
            references public.youlearn_cards
            on delete cascade,
    type     integer default 0               not null,
    image    text
);

create table if not exists public.youlearn_test_answers
(
    id         serial
        constraint test_answers_pk
            primary key,
    text       text    default 'Ответ'::text not null,
    is_correct boolean default false         not null,
    test_id    integer                       not null
        constraint test_answers_tests_id_fk
            references public.youlearn_tests
            on delete cascade
);

create table if not exists public.youlearn_attempts
(
    id           serial
        constraint attempts_pk
            primary key,
    user_id      integer                             not null
        constraint attempts_users_null_fk
            references public.youlearn_users
            on delete cascade,
    card_id      integer
        constraint attempts_cards_null_fk
            references public.youlearn_cards
            on delete cascade,
    start_time   timestamp default CURRENT_TIMESTAMP not null,
    current_test integer   default 0                 not null,
    is_finished  boolean   default false             not null,
    progress     integer   default 0                 not null
);


create table if not exists public.youlearn_attempt_answers
(
    attempt_id integer not null
        constraint attempt_answers_attempts_null_fk
            references public.youlearn_attempts
            on delete cascade,
    test_id    integer not null
        constraint attempt_answers_tests_null_fk
            references public.youlearn_tests
            on delete cascade,
    answer_id  integer not null
        constraint attempt_answers_test_answers_null_fk
            references public.youlearn_test_answers
            on delete cascade,
    constraint attempt_answers_pk
        primary key (attempt_id, test_id, answer_id)
);
