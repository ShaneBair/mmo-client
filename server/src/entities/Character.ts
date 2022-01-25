import { Entity, ObjectIdColumn, ObjectID, Column, Index } from 'typeorm';
import { IsNumber, IsString } from 'class-validator';
import { Location } from './Location';

@Entity()
export class Character {
  @ObjectIdColumn()
  id?: ObjectID;

  @Column()
  @IsString()
  userId?: string;

  @Column()
  @IsString()
  @Index({ unique: true })
  name?: string;

  @Column()
  @IsNumber()
  level?: number;

  @Column()
  @IsNumber()
  money?: number;

  @Column()
  @IsNumber()
  experience?: number;

  @Column()
  @IsNumber()
  maxHealth?: number;

  @Column()
  @IsNumber()
  health?: number;

  @Column()
  @IsNumber()
  maxMana?: number;

  @Column()
  @IsNumber()
  mana?: number;

  @Column()
  location?: Location;

  public constructor(data?: Character) {
    if (data) {
      this.name = data.name;
      this.userId = data.userId;
      this.level = data.level ?? 1;
      this.money = data.money ?? 0;
      this.experience = data.experience ?? 0;
      this.health = data.health ?? 100;
      this.maxHealth = data.maxHealth ?? 100;
      this.mana = data.mana ?? 100;
      this.maxMana = data.maxMana ?? 100;
      this.location = data.location ?? new Location({ mapName: 'DemoScene' });
    }
  }
}
