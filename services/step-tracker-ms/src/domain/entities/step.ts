export class StepEntity {
  constructor(
    public readonly userId: string,
    public readonly steps: number,
    public readonly date: string,
  ) {}
}
