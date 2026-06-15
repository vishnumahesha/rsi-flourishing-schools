-- =====================================================================
-- RSI Flourishing Schools — seed data (demonstration content)
-- Run AFTER 0001_init.sql. Safe to re-run (uses fixed UUIDs + upserts).
--
-- NOTE: Seeded auth users exist so the data model is fully populated and
-- facilitator/admin dashboards show real rows. They are demo accounts; the
-- first real platform admin should be created via signup, then promoted:
--   update profiles set role='platform_admin' where email='you@example.com';
-- All citations are placeholders and must be replaced before production.
-- =====================================================================

-- ---------- Organization ----------
insert into organizations (id, name, slug, type, cohort)
values ('11111111-1111-1111-1111-111111111111',
        'Riverbend Community School', 'riverbend',
        'Public · K–8', 'Spring Cohort 2026')
on conflict (id) do update set name = excluded.name;

-- ---------- Seed auth users (trigger creates matching profiles) ----------
do $$
declare
  u record;
begin
  for u in
    select * from (values
      ('a0000000-0000-0000-0000-000000000001'::uuid, 'admin@riverbend.demo',      'Maya Thompson'),
      ('a0000000-0000-0000-0000-000000000002'::uuid, 'devin@riverbend.demo',      'Devin Park'),
      ('a0000000-0000-0000-0000-000000000003'::uuid, 'aisha@riverbend.demo',      'Aisha Bello'),
      ('a0000000-0000-0000-0000-000000000004'::uuid, 'facilitator@rsi.demo',      'Jordan Rivera')
    ) as t(id, email, full_name)
  loop
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      is_super_admin, confirmation_token, recovery_token,
      email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000', u.id, 'authenticated', 'authenticated',
      u.email, crypt('FlourishDemo123!', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}',
      json_build_object('full_name', u.full_name),
      false, '', '', '', ''
    )
    on conflict (id) do nothing;
  end loop;
end $$;

-- ---------- Promote seeded profiles (trigger made them 'applicant') ----------
update profiles set role='school_admin', organization_id='11111111-1111-1111-1111-111111111111', title='Principal', full_name='Maya Thompson'
  where id='a0000000-0000-0000-0000-000000000001';
update profiles set role='teacher', organization_id='11111111-1111-1111-1111-111111111111', title='5th Grade Lead', full_name='Devin Park'
  where id='a0000000-0000-0000-0000-000000000002';
update profiles set role='teacher', organization_id='11111111-1111-1111-1111-111111111111', title='Humanities', full_name='Aisha Bello'
  where id='a0000000-0000-0000-0000-000000000003';
update profiles set role='rsi_facilitator', title='RSI Facilitator', full_name='Jordan Rivera'
  where id='a0000000-0000-0000-0000-000000000004';

-- ---------- Resources (curated library; placeholder citations) ----------
insert into resources (slug, title, summary, domains, grade_levels, evidence_strength, difficulty, is_public, source_citation, overview)
values
  ('morning-belonging-circles','Morning Belonging Circles','A short advisory routine that builds connection at the start of each day.',
    array['belonging','community_wellbeing','sel'], array['Elementary','Middle School'],'promising','low', true,'Placeholder citation',
    'Belonging circles give every student a brief, predictable moment to be seen and heard.'),
  ('gratitude-journaling-practice','Weekly Gratitude Journaling','A brief reflective writing practice supporting emotional well-being.',
    array['student_wellbeing','character_skills'], array['Middle School','High School'],'established','low', true,'Placeholder citation',
    'Students set aside a few minutes weekly to write about what they are grateful for.'),
  ('staff-reflection-protocol','Staff Reflection Protocol','A structured, voluntary routine for educator reflection and peer learning.',
    array['staff_capacity','school_culture'], array['Whole School'],'promising','moderate', true,'Placeholder citation',
    'A lightweight protocol that helps staff reflect together without adding heavy workload.'),
  ('purpose-mapping-advisory','Purpose Mapping in Advisory','An advisory sequence helping students connect learning to personal purpose.',
    array['purpose','character_skills'], array['High School'],'emerging','moderate', true,'Placeholder citation',
    'Students explore interests, strengths, and values to articulate a sense of purpose.'),
  ('calm-corner-routines','Calm Corner Routines','A self-regulation space and routine for the early grades.',
    array['student_wellbeing','sel'], array['Early Years','Elementary'],'promising','low', true,'Placeholder citation',
    'A predictable, visual routine that gives young students a way to self-regulate.'),
  ('peer-connection-mapping','Peer Connection Mapping','A periodic check that surfaces students who may need more connection.',
    array['belonging','school_culture'], array['Middle School','High School'],'emerging','moderate', true,'Placeholder citation',
    'A simple periodic mapping that helps staff notice and act on student connection.')
on conflict (slug) do nothing;

-- ---------- Growth areas ----------
insert into growth_areas (organization_id, domain, title, rationale, status, progress)
values
  ('11111111-1111-1111-1111-111111111111','belonging','Strengthen belonging in middle grades','Named as a priority; addressable with daily routines.','in_progress',62),
  ('11111111-1111-1111-1111-111111111111','staff_capacity','Build staff capacity for reflection','Supports sustainable change across the school.','in_progress',40),
  ('11111111-1111-1111-1111-111111111111','student_wellbeing','Embed well-being routines schoolwide','Early-stage planning for consistent routines.','planning',18)
on conflict do nothing;

-- ---------- PD sessions ----------
insert into pd_sessions (organization_id, title, scheduled_for, facilitator_id, status)
values
  ('11111111-1111-1111-1111-111111111111','Kickoff: Mapping your flourishing baseline','2026-02-10 16:00+00','a0000000-0000-0000-0000-000000000004','completed'),
  ('11111111-1111-1111-1111-111111111111','Workshop: Belonging routines that scale','2026-03-12 16:00+00','a0000000-0000-0000-0000-000000000004','completed'),
  ('11111111-1111-1111-1111-111111111111','Coaching: Reflection practices for staff','2026-06-22 16:00+00','a0000000-0000-0000-0000-000000000004','scheduled')
on conflict do nothing;

-- ---------- Intervention plans ----------
insert into intervention_plans (organization_id, title, description, status, owner_id)
values
  ('11111111-1111-1111-1111-111111111111','Pilot morning belonging circles in 5th grade','Run a two-week pilot and gather reflections.','in_progress','a0000000-0000-0000-0000-000000000002'),
  ('11111111-1111-1111-1111-111111111111','Draft staff reflection protocol','Adapt the protocol to a 15-minute staff meeting block.','in_progress','a0000000-0000-0000-0000-000000000003')
on conflict do nothing;

-- ---------- Reflections ----------
insert into reflections (author_id, organization_id, prompt, body)
values
  ('a0000000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','What did you notice after this week''s belonging circle?','Students who usually stay quiet volunteered to share. The talking-piece routine lowers the stakes.'),
  ('a0000000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','Where did you see a small win in student well-being?','Two students used the calm corner without prompting. The visual routine is starting to stick.')
on conflict do nothing;

-- ---------- Forum threads + posts ----------
insert into forum_threads (id, organization_id, author_id, title, excerpt)
values
  ('33333333-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','a0000000-0000-0000-0000-000000000002','How are you keeping belonging circles short?','Mine keep running long. Curious how others time the check-out.'),
  ('33333333-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','a0000000-0000-0000-0000-000000000003','Staff reflection — voluntary or expected?','Trying to find the balance so it feels supportive, not like a task.'),
  ('33333333-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','a0000000-0000-0000-0000-000000000002','Sharing our calm-corner visuals','Posted the printables we used. Feedback welcome before we roll out wider.')
on conflict (id) do nothing;

insert into forum_posts (thread_id, author_id, body)
values
  ('33333333-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000003','We use a one-word check-out and a visible timer. Keeps it tight.'),
  ('33333333-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000001','We kept it voluntary for the first cycle and participation grew on its own.')
on conflict do nothing;

-- ---------- Facilitator notes ----------
insert into facilitator_notes (organization_id, author_id, body)
values
  ('11111111-1111-1111-1111-111111111111','a0000000-0000-0000-0000-000000000004','Strong teacher buy-in on belonging circles. Ready to add a second domain next cycle.')
on conflict do nothing;
