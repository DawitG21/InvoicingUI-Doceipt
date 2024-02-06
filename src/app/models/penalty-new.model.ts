import { PenaltyRange } from "./penalty-range";

export class PenaltyNew {
    name!: string;
    description!: string;
    isPercentRate!: boolean;
    rate!: number;
    rateType!: string;
    companyId!: string;
    financialPeriodId!: string;
    penaltyRates!: PenaltyRange[];

    /**
     *
     */
    constructor(companyId: string) {
        this.companyId = companyId;
    }
}
