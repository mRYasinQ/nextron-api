import { Migration } from '@mikro-orm/migrations';

export class Migration20260517104403 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`pragma foreign_keys = off;`);
    this.addSql(`create table \`users__temp_alter\` (\`id\` numeric(10,0) not null primary key, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`first_name\` text null, \`last_name\` text null, \`phone_number\` text not null, \`email\` text null, \`is_active\` integer not null default true, \`is_admin\` integer not null default false, \`is_phone_verified\` integer not null default false, \`is_email_verified\` integer not null default false, \`password\` text not null);`);
    this.addSql(`insert into \`users__temp_alter\` select \`id\`, \`created_at\`, \`updated_at\`, \`first_name\`, \`last_name\`, \`phone_number\`, \`email\`, \`is_active\`, \`is_admin\`, \`is_phone_verified\`, \`is_email_verified\`, \`password\` from \`users\`;`);
    this.addSql(`drop table \`users\`;`);
    this.addSql(`alter table \`users__temp_alter\` rename to \`users\`;`);
    this.addSql(`create unique index \`users_phone_number_unique\` on \`users\` (\`phone_number\`);`);
    this.addSql(`create unique index \`users_email_unique\` on \`users\` (\`email\`);`);
    this.addSql(`pragma foreign_keys = on;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`pragma foreign_keys = off;`);
    this.addSql(`create table \`users__temp_alter\` (\`created_at\` datetime not null, \`email\` text not null, \`first_name\` text null, \`id\` numeric not null primary key, \`is_active\` integer not null default true, \`is_admin\` integer not null default false, \`is_email_verified\` integer not null default false, \`is_phone_verified\` integer not null default false, \`last_name\` text null, \`password\` text not null, \`phone_number\` text not null, \`updated_at\` datetime not null);`);
    this.addSql(`insert into \`users__temp_alter\` select \`created_at\`, \`email\`, \`first_name\`, \`id\`, \`is_active\`, \`is_admin\`, \`is_email_verified\`, \`is_phone_verified\`, \`last_name\`, \`password\`, \`phone_number\`, \`updated_at\` from \`users\`;`);
    this.addSql(`drop table \`users\`;`);
    this.addSql(`alter table \`users__temp_alter\` rename to \`users\`;`);
    this.addSql(`create unique index \`users_email_unique\` on \`users\` (\`email\`);`);
    this.addSql(`create unique index \`users_phone_number_unique\` on \`users\` (\`phone_number\`);`);
    this.addSql(`pragma foreign_keys = on;`);
  }

}
