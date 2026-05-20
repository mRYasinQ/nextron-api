import { Migration } from '@mikro-orm/migrations';

export class Migration20260520205404 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table \`tickets\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`title\` text not null, \`status\` text check (\`status\` in ('OPEN', 'CLOSED', 'PENDING')) not null default 'OPEN', \`priority\` text check (\`priority\` in ('LOW', 'MEDIUM', 'HIGH')) not null default 'MEDIUM', \`creator_id\` numeric(10,0) not null, constraint \`tickets_creator_id_foreign\` foreign key (\`creator_id\`) references \`users\` (\`id\`));`);
    this.addSql(`create index \`tickets_creator_id_index\` on \`tickets\` (\`creator_id\`);`);

    this.addSql(`create table \`ticket_messages\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`message\` text not null, \`resource\` text null, \`sender_id\` numeric(10,0) not null, \`ticket_id\` numeric(10,0) not null, constraint \`ticket_messages_sender_id_foreign\` foreign key (\`sender_id\`) references \`users\` (\`id\`), constraint \`ticket_messages_ticket_id_foreign\` foreign key (\`ticket_id\`) references \`tickets\` (\`id\`));`);
    this.addSql(`create index \`ticket_messages_sender_id_index\` on \`ticket_messages\` (\`sender_id\`);`);
    this.addSql(`create index \`ticket_messages_ticket_id_index\` on \`ticket_messages\` (\`ticket_id\`);`);

    this.addSql(`pragma foreign_keys = off;`);
    this.addSql(`create table \`users__temp_alter\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`first_name\` text null, \`last_name\` text null, \`phone_number\` text not null, \`email\` text null, \`is_active\` integer not null default true, \`is_admin\` integer not null default false, \`is_phone_verified\` integer not null default false, \`is_email_verified\` integer not null default false, \`password\` text not null);`);
    this.addSql(`insert into \`users__temp_alter\` select \`id\`, \`created_at\`, \`updated_at\`, \`first_name\`, \`last_name\`, \`phone_number\`, \`email\`, \`is_active\`, \`is_admin\`, \`is_phone_verified\`, \`is_email_verified\`, \`password\` from \`users\`;`);
    this.addSql(`drop table \`users\`;`);
    this.addSql(`alter table \`users__temp_alter\` rename to \`users\`;`);
    this.addSql(`create unique index \`users_phone_number_unique\` on \`users\` (\`phone_number\`);`);
    this.addSql(`create unique index \`users_email_unique\` on \`users\` (\`email\`);`);
    this.addSql(`pragma foreign_keys = on;`);

    this.addSql(`pragma foreign_keys = off;`);
    this.addSql(`create table \`sessions__temp_alter\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`browser\` text not null, \`os\` text not null, \`token\` text not null, \`user_id\` numeric(10,0) not null, \`expire_at\` datetime not null, constraint \`sessions_user_id_foreign\` foreign key (\`user_id\`) references \`users\` (\`id\`));`);
    this.addSql(`insert into \`sessions__temp_alter\` select \`id\`, \`created_at\`, \`updated_at\`, \`browser\`, \`os\`, \`token\`, \`user_id\`, \`expire_at\` from \`sessions\`;`);
    this.addSql(`drop table \`sessions\`;`);
    this.addSql(`alter table \`sessions__temp_alter\` rename to \`sessions\`;`);
    this.addSql(`create index \`sessions_token_index\` on \`sessions\` (\`token\`);`);
    this.addSql(`create unique index \`sessions_token_unique\` on \`sessions\` (\`token\`);`);
    this.addSql(`create index \`sessions_user_id_index\` on \`sessions\` (\`user_id\`);`);
    this.addSql(`pragma foreign_keys = on;`);
  }

  override down(): void | Promise<void> {

    this.addSql(`drop table if exists \`tickets\`;`);
    this.addSql(`drop table if exists \`ticket_messages\`;`);

    this.addSql(`pragma foreign_keys = off;`);
    this.addSql(`create table \`sessions__temp_alter\` (\`browser\` text not null, \`created_at\` datetime not null, \`expire_at\` datetime not null, \`id\` integer not null primary key autoincrement, \`os\` text not null, \`token\` text not null, \`updated_at\` datetime not null, \`user_id\` numeric not null, constraint \`sessions_user_id_foreign\` foreign key (\`user_id\`) references \`users\` (\`id\`));`);
    this.addSql(`insert into \`sessions__temp_alter\` select \`browser\`, \`created_at\`, \`expire_at\`, \`id\`, \`os\`, \`token\`, \`updated_at\`, \`user_id\` from \`sessions\`;`);
    this.addSql(`drop table \`sessions\`;`);
    this.addSql(`alter table \`sessions__temp_alter\` rename to \`sessions\`;`);
    this.addSql(`create index \`sessions_token_index\` on \`sessions\` (\`token\`);`);
    this.addSql(`create unique index \`sessions_token_unique\` on \`sessions\` (\`token\`);`);
    this.addSql(`create index \`sessions_user_id_index\` on \`sessions\` (\`user_id\`);`);
    this.addSql(`pragma foreign_keys = on;`);

    this.addSql(`pragma foreign_keys = off;`);
    this.addSql(`create table \`users__temp_alter\` (\`created_at\` datetime not null, \`email\` text null, \`first_name\` text null, \`id\` integer not null primary key autoincrement, \`is_active\` integer not null default true, \`is_admin\` integer not null default false, \`is_email_verified\` integer not null default false, \`is_phone_verified\` integer not null default false, \`last_name\` text null, \`password\` text not null, \`phone_number\` text not null, \`updated_at\` datetime not null);`);
    this.addSql(`insert into \`users__temp_alter\` select \`created_at\`, \`email\`, \`first_name\`, \`id\`, \`is_active\`, \`is_admin\`, \`is_email_verified\`, \`is_phone_verified\`, \`last_name\`, \`password\`, \`phone_number\`, \`updated_at\` from \`users\`;`);
    this.addSql(`drop table \`users\`;`);
    this.addSql(`alter table \`users__temp_alter\` rename to \`users\`;`);
    this.addSql(`create unique index \`users_email_unique\` on \`users\` (\`email\`);`);
    this.addSql(`create unique index \`users_phone_number_unique\` on \`users\` (\`phone_number\`);`);
    this.addSql(`pragma foreign_keys = on;`);
  }

}
