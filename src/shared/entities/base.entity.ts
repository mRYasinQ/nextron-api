import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { Opt } from '@mikro-orm/sqlite';

@Entity({ abstract: true })
abstract class BaseEntity {
  @PrimaryKey({ type: 'numeric', autoincrement: true })
  id: number;

  @Property()
  createdAt: Date & Opt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date();
}

export default BaseEntity;
