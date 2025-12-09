create or replace function use_credit(amount int)
returns void as $$
begin
  update profiles
  set credits = credits - amount
  where id = auth.uid()
    and credits >= amount;
end;
$$ language plpgsql security definer;
