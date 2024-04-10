// charge.model.ts

/**
 * Represents a financial transaction charge.
 */
export class Charge {
  /**
   * Unique identifier for the charge.
   */
  public id: string;

  /**
   * The amount of the charge.
   */
  public amount: number;

  /**
   * The currency in which the charge was made.
   */
  public currency: string;

  /**
   * The current status of the charge.
   */
  public status: string;

  /**
   * The latency of the charge request in milliseconds. Optional.
   */
  public latency?: number;

  /**
   * Constructs a new `Charge` instance.
   *
   * @param id - The unique identifier for the charge.
   * @param amount - The amount of the charge.
   * @param currency - The currency in which the charge was made.
   * @param status - The current status of the charge.
   * @param latency - The latency of the charge request in milliseconds. Optional.
   */
  constructor(
    id: string,
    amount: number,
    currency: string,
    status: string,
    latency?: number,
  ) {
    this.id = id;
    this.amount = amount;
    this.currency = currency;
    this.status = status;
    this.latency = latency;
  }
}
