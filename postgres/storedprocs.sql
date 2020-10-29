create or replace procedure create_users_table()
language plpgsql    
as $$
begin
    drop table if exists users;
    CREATE TABLE users (
        user_name varchar,
        email varchar,
        city varchar
    );
end;
$$
;

create or replace procedure insert_user(
  user_name varchar,
  email varchar,
  city varchar
)
language plpgsql    
as $$
begin
  insert into users (user_name, email, city) values (user_name, email, city);
end;$$
;

create or replace procedure add_sample_data()
language plpgsql    
as $$
begin
  call insert_user('Bill Gates', 'bill@microsoft.com', 'Seattle');
  call insert_user('Robert DeNiro', 'robert@deniro.com', 'New York');
  call insert_user('Joe Scarborough', 'joe@morningjoe.com', 'Washington D.C.');
end;$$
;

drop function if exists get_users();
create or replace function get_users()
returns table (user_name varchar, email varchar, city varchar)
language plpgsql    
as $$
begin
  return query
    select * from users;
end;$$
;