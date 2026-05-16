import { Migration } from '@mikro-orm/migrations';

export class Migration20260516184045 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table \`sessions\` (\`id\` numeric(10,0) not null primary key, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`browser\` text not null, \`os\` text not null, \`token\` text not null, \`user_id\` numeric(10,0) not null, \`expire_at\` datetime not null, constraint \`sessions_user_id_foreign\` foreign key (\`user_id\`) references \`users\` (\`id\`));`);
    this.addSql(`create index \`sessions_token_index\` on \`sessions\` (\`token\`);`);
    this.addSql(`create unique index \`sessions_token_unique\` on \`sessions\` (\`token\`);`);
    this.addSql(`create index \`sessions_user_id_index\` on \`sessions\` (\`user_id\`);`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists \`sessions\`;`);
  }

}
