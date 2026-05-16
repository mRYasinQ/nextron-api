import { Migration } from '@mikro-orm/migrations';

export class Migration20260516124447 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table \`users\` (\`id\` numeric(10,0) not null primary key, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`first_name\` text null, \`last_name\` text null, \`phone_number\` text not null, \`email\` text not null, \`is_active\` integer not null default true, \`is_admin\` integer not null default false, \`is_phone_verified\` integer not null default false, \`is_email_verified\` integer not null default false, \`password\` text not null);`);
    this.addSql(`create unique index \`users_phone_number_unique\` on \`users\` (\`phone_number\`);`);
    this.addSql(`create unique index \`users_email_unique\` on \`users\` (\`email\`);`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists \`users\`;`);
  }

}
