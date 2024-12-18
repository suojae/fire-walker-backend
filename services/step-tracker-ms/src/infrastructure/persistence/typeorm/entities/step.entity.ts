import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('steps')
@Index(['userId', 'date'], { unique: true })
export class Step {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'int' })
  steps: number;
}
