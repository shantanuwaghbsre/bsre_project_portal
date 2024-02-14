monthly_deposit = [3000]*36
number_of_terms = 12
fragments_per_term = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]
yearly_interest = 0.0725


for term in range(number_of_terms):
    interest_accrued = 0
    for fragment in range(fragments_per_term[term]-3, fragments_per_term[term]):
        interest_accrued += monthly_deposit[fragment]*(yearly_interest/12)*(fragments_per_term[term]-fragment)
    print("interest for quarter", term+1, "is", interest_accrued)
    if term < number_of_terms-1:
        monthly_deposit[fragments_per_term[term]] += interest_accrued

print("total payout", sum(monthly_deposit)+interest_accrued)
