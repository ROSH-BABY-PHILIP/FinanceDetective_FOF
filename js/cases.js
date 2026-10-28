/* THE FINANCE DETECTIVE — centralized, fictional case data.
   All companies, people, invoices and amounts are invented for this exercise.
   NOTE: answer logic ships to the browser and is inspectable. Not for secure assessment. */
(function (root) {
  const T = (cols, rows, opt) => Object.assign({ cols, rows }, opt || {});

  const CASES = [
  /* ───────────────────────── CASE 01 ───────────────────────── */
  {
    id: 1, ref: 'CASE-001', title: 'The $85,000 Cash Mystery', cat: 'Cash Flow & Working Capital',
    diff: 'Intermediate', mins: 15, summary: 'Revenue is growing. The cash balance tells a different story.',
    company: 'Northstar Components (fictional US manufacturer)',
    brief: 'Northstar Components expected to close September with $240,000 in cash. The bank shows $155,000. The CFO wants to understand the $85,000 shortfall before the next leadership meeting.',
    kpis: [['Forecast closing cash', '$240,000'], ['Actual closing cash', '$155,000'], ['Shortfall', '($85,000)']],
    timeline: [['22 Sep', 'Weekly supplier payment run releases invoices due within 14 days'], ['26–29 Sep', 'Two large customer receipts expected'], ['30 Sep', 'Books close: cash $155,000'], ['2–3 Oct', 'Customer payment released / first receipt lands'], ['6 Oct', 'Second receipt lands']],
    evidence: [
      { id: 'E-01', title: 'September cash bridge: forecast vs actual', type: 'Cash-flow schedule',
        t: T(['Line', 'Forecast', 'Actual', 'Variance'], [
          ['Opening cash (1 Sep)', '310,000', '310,000', '0'],
          ['Customer receipts', '520,000', '460,000', '(60,000)'],
          ['Supplier & other payments', '(590,000)', '(615,000)', '(25,000)'],
          ['Closing cash (30 Sep)', '240,000', '155,000', '(85,000)']], { total: 3 }) },
      { id: 'E-02', title: 'Expected receipts not received by 30 Sep', type: 'AR receipts schedule',
        t: T(['Invoice', 'Customer', 'Amount', 'Due', 'Expected', 'Received', 'Dispute?'], [
          ['INV-N-3187', 'Delmar Fabrication', '35,000', '26 Sep', '26 Sep', '3 Oct', 'No'],
          ['INV-N-3194', 'Crestline Auto', '25,000', '29 Sep', '29 Sep', '6 Oct', 'No'],
          ['Total', '', '60,000', '', '', '', '']], { total: 2 }) },
      { id: 'E-03', title: 'Supplier payment log', type: 'AP payment records',
        t: T(['Supplier', 'Invoice', 'Amount', 'Due', 'Forecast pay date', 'Actual pay date'], [
          ['Ironbridge Metals', 'INV-8841', '25,000', '5 Oct', '5 Oct', '22 Sep'],
          ['Summit Packaging', 'INV-7710', '48,000', '25 Sep', '25 Sep', '25 Sep']]),
        note: 'Payment run of 22 Sep covers every invoice due within the next 14 days. Forecast assumed payment on due date.' },
      { id: 'E-04', title: 'Bank statement, 1–10 Oct (after period end)', type: 'Bank activity',
        t: T(['Date', 'Description', 'Credit'], [
          ['3 Oct', 'Remittance Delmar Fabrication ref INV-N-3187', '35,000'],
          ['6 Oct', 'Remittance Crestline Auto ref INV-N-3194', '25,000']]) },
      { id: 'E-05', title: 'AR notes & payment history', type: 'Internal notes',
        t: T(['Source', 'Note', 'Status'], [
          ['AR log, 2 Oct', 'Delmar: payment released after month-end approval batch. No dispute raised.', 'Confirmed'],
          ['AR log, 3 Oct', 'Crestline AP: payment scheduled in 5 Oct run. Average days-to-pay last 6 invoices: 31.', 'Confirmed'],
          ['Allowance schedule', 'Allowance for doubtful accounts unchanged in September.', 'Confirmed']]) },
      { id: 'E-06', title: 'September P&L summary', type: 'Income statement',
        t: T(['Line', 'Forecast', 'Actual'], [['Revenue', '495,000', '498,000'], ['Payroll', '142,000', '142,000']]),
        note: 'Revenue and payroll both landed on plan.' }
    ],
    relevant: ['E-01', 'E-02', 'E-03', 'E-04', 'E-05'],
    d1: { q: 'Which records should you check first?', ctx: 'The gap is $85,000. Start with how you will isolate it.', refs: 'E-01',
      opts: [
        ['Perform a comprehensive review of the September revenue recognition schedule and P&L line items to determine whether unearned revenue or billing reversals reduced cash generation.', .3, 'Weak. Revenue is recognized on an accrual basis and landed on plan ($498k vs $495k); the P&L does not explain cash receipt timing.'],
        ['Construct a cash bridge from forecast to actual to isolate specific line variances before tracing to underlying records.', 1, 'Strong. A variance bridge immediately isolates receipts (-$60k) and disbursements (-$25k) before chasing individual invoices.'],
        ['Convene an urgent review with Sales and Account Executives to survey which enterprise customers encountered delivery disputes or requested extended terms.', .5, 'Incomplete. Anecdotal sales feedback provides useful context, but cannot substitute for reconciling transactional bank and ledger records.'],
        ['Immediately adjust the bad debt reserve upward in the general ledger to reflect the $85,000 discrepancy and protect the balance sheet.', 0, 'Risky. A bad debt allowance is a non-cash accounting entry that does not affect bank balances and presumes default without evidence.']] },
    d2: { q: 'How do you separate delayed receipts from bad debt?', ctx: 'Two customer invoices were expected before month end.', refs: 'E-02, E-04, E-05',
      opts: [
        ['Request updated credit agency reports, pull audited financial statements for both accounts, and calculate refreshed Altman Z-scores to gauge insolvency risk.', .4, 'Incomplete. Credit bureau reports indicate long-term solvency, but do not show whether September remittances cleared in October.'],
        ['Assume any receivable unpaid at month-end carries impaired recoverability and immediately establish a specific credit loss reserve against both balances.', .1, 'Risky. Conflates a brief operational timing delay with permanent credit loss, distorting earnings.'],
        ['Examine post-close bank remittances, check for open billing disputes, and review historic payment patterns.', 1, 'Strong. Clearing early in the following period with clean remittance advice and zero customer dispute confirms timing rather than default.'],
        ['Hold all collections outreach and defer assessment until the subsequent monthly close to observe if normal billing cycles clear the items.', .3, 'Slow. Bank activity for early October is already available in hand to inspect immediately.']] },
    dx: { q: 'Which explanation best fits the evidence?', opts: [
      ['Two timing differences: $60,000 of customer receipts landed after 30 Sep and a $25,000 supplier payment was released before its forecast date.', 1, 'Your diagnosis matched the evidence: the full $85,000 is explained by $60,000 in early October customer receipts and a $25,000 early vendor run.'],
      ['Customer receipt delays totaling $60,000 across Delmar and Crestline account for the variance, while remaining cash outflows conformed fully to the forecast plan.', .5, 'Partly right: delayed customer receipts explain $60,000, but this leaves the $25,000 supplier disbursement variance completely unaccounted for.'],
      ['Systemic commercial revenue underperformance compounded by customer insolvencies, resulting in uncollectible balances on Delmar Fabrication and Crestline Auto accounts.', 0, 'Incorrect. Revenue exceeded forecast by $3,000, both invoices cleared fully in early October, and neither counterparty defaulted.'],
      ['An unexpected surge in operational payroll and material overhead expenditures during late September that depleted operating liquidity prior to month-end close.', .1, 'Incorrect. Payroll was exactly on budget at $142,000 and supplier variance was due to an early payment run, not elevated total expense.']] },
    d3: { q: 'What should the CFO be told, and what should change?', ctx: 'Choose the recommendation you would take to the leadership meeting.', refs: 'E-01, E-03',
      opts: [
        ['Transition treasury entirely to an automated 13-week direct cash forecasting platform and shorten contractual customer payment terms from Net 30 to Net 15 across the board.', .4, 'Incomplete. Implementing new forecasting software does not resolve the root cause of disconnected AP payment schedules or unverified customer remittance dates.'],
        ['Brief the leadership team that the shortfall is purely transient timing, maintain all current operational workflows, and take no corrective process interventions.', .5, 'Incomplete. While the variance is indeed timing, failing to fix payment run rules and receipt forecasting guarantees recurring forecast misses.'],
        ['Institute immediate credit freezes and mandate upfront deposits for Delmar Fabrication and Crestline Auto before fulfilling subsequent component purchase orders.', .1, 'Risky. Penalizing reliable customers who pay within standard 30-day operating windows damages commercial relationships without justification.'],
        ['Report a timing variance with a bridge; forecast receipts by customer payment run dates and schedule AP runs strictly to invoice due dates.', 1, 'Strong. Reassures leadership with an exact reconciliation and institutes operational controls preventing early cash outflows.']] },
    rubric: [['Timing', ['timing', 'delay', 'late', 'after 30', 'october', 'oct']], ['Receipts $60,000', ['receipt', '60,000', '60k', 'customer', 'invoice']], ['Supplier $25,000', ['supplier', 'early', '25,000', '25k', 'payment run']], ['Reconciliation', ['reconcil', 'bridge', '85,000', '85k', 'variance']]],
    reveal: {
      cause: 'Two timing differences explain the full $85,000: $60,000 of customer receipts arrived in early October, and a $25,000 supplier payment was released about two weeks early.',
      support: ['E-01 isolates the gap to receipts (\u2212$60,000) and payments (\u2212$25,000) with a flat opening balance.', 'E-02 and E-04 show INV-N-3187 and INV-N-3194 were paid on 3 and 6 Oct with no dispute.', 'E-03 shows the Ironbridge invoice due 5 Oct was paid on 22 Sep in the standard run.'],
      calc: [['Forecast closing cash', '$240,000'], ['Less delayed receipts ($35,000 + $25,000)', '($60,000)'], ['Less supplier payment made early', '($25,000)'], ['Reconstructed closing cash', '$155,000'], ['Unexplained residual', '$0']],
      alts: [['Bad debt', 'Both customers paid within 7 days of the expected date with no dispute, and the allowance did not change (E-04, E-05).'], ['Revenue shortfall', 'September revenue was $3,000 above forecast (E-06).'], ['Bank error', 'The bridge reconciles to $0 with identified invoices and bank credits.']],
      action: 'Brief the CFO that cash is expected to recover in October ($60,000 received) and that $25,000 simply moved earlier.',
      controls: ['Forecast receipts by invoice using remittance or payment-promise data, not due dates.', 'Set the payment run to pay on due date unless an early-pay discount is approved.', 'Add a weekly forecast-to-actual bridge for any variance above 2% of cash.'],
      kpis: ['Forecast accuracy (closing cash vs forecast)', 'Receipts forecast variance', 'Share of payments made before due date'],
      exec: 'September\u2019s $85,000 cash shortfall is timing only: $60,000 of receipts landed 4\u20137 days late and $25,000 of supplier payments went out two weeks early. No credit loss is indicated.' }
  },

  /* ───────────────────────── CASE 02 ───────────────────────── */
  {
    id: 2, ref: 'CASE-002', title: 'The Customer Who Stopped Paying', cat: 'Accounts Receivable & Collections',
    diff: 'Intermediate', mins: 15, summary: 'Sales says the relationship is healthy. The aging report says otherwise.',
    company: 'Brightline Industrial Supply (fictional) \u2192 customer Harlow Logistics',
    brief: 'Harlow Logistics, a long-standing customer on Net 30 terms, has three overdue invoices. Sales says the relationship is healthy. AR is concerned. Today is 15 October.',
    kpis: [['Total open', '$83,350'], ['Overdue', '$63,250'], ['Oldest overdue', '69 days']],
    timeline: [['3 Jun \u2013 22 Jul', 'Two invoices issued and paid within terms'], ['30 Jun', 'Purchase order HL-77120 closed'], ['1 Jul', 'Replacement PO HL-88041 issued by customer'], ['8 Jul', 'First invoice without a PO reference'], ['14 Aug \u2013 9 Oct', 'Three customer-portal rejection notices'], ['15 Oct', 'AR review']],
    evidence: [
      { id: 'E-01', title: 'Invoice ledger: Harlow Logistics (as of 15 Oct)', type: 'AR ledger',
        t: T(['Invoice', 'Issued', 'Due', 'Amount', 'Status', 'Days overdue', 'PO on invoice'], [
          ['INV-2101', '3 Jun', '3 Jul', '18,400', 'Paid 2 Jul', '\u2013', 'HL-77120'],
          ['INV-2109', '24 Jun', '24 Jul', '17,900', 'Paid 22 Jul', '\u2013', 'HL-77120'],
          ['INV-2118', '8 Jul', '7 Aug', '21,750', 'Open', '69', '(blank)'],
          ['INV-2133', '5 Aug', '4 Sep', '19,200', 'Open', '41', '(blank)'],
          ['INV-2147', '2 Sep', '2 Oct', '22,300', 'Open', '13', '(blank)'],
          ['INV-2159', '6 Oct', '5 Nov', '20,100', 'Open', 'Not due', '(blank)']]),
        note: 'All invoices on Net 30 per contract.' },
      { id: 'E-02', title: 'Aging summary', type: 'Aging report',
        t: T(['Bucket', 'Amount', 'Invoices'], [['Current', '20,100', '1'], ['1\u201330 days', '22,300', '1'], ['31\u201360 days', '19,200', '1'], ['61\u201390 days', '21,750', '1'], ['Total open', '83,350', '4']], { total: 4 }) },
      { id: 'E-03', title: 'Customer portal rejection notices', type: 'Dispute notes',
        t: T(['Date', 'Invoice', 'Customer reason code', 'AR action logged'], [
          ['14 Aug', 'INV-2118', 'No valid PO \u2013 match failed', 'Reminder sent to billing mailbox'],
          ['11 Sep', 'INV-2133', 'No valid PO \u2013 match failed', 'Reminder sent to billing mailbox'],
          ['9 Oct', 'INV-2147', 'No valid PO \u2013 match failed', 'Reminder sent to billing mailbox']]),
        note: 'No notice exists for INV-2101 or INV-2109.' },
      { id: 'E-04', title: 'Purchase-order and billing-profile record', type: 'PO / billing details',
        t: T(['Item', 'Detail'], [
          ['PO HL-77120', 'Fully drawn; closed 30 Jun'],
          ['PO HL-88041', 'Issued 1 Jul, covers Jul\u2013Dec; emailed to Sales contact'],
          ['Billing profile PO field', 'Still set to HL-77120; invoices after 1 Jul print a blank PO']]) },
      { id: 'E-05', title: 'Remittance records', type: 'Remittance advice',
        t: T(['Date', 'Amount', 'Reference'], [['2 Jul', '18,400', 'INV-2101 / PO HL-77120'], ['22 Jul', '17,900', 'INV-2109 / PO HL-77120']]),
        note: 'No remittance received since 22 Jul.' },
      { id: 'E-06', title: 'Communications', type: 'Emails and notes',
        t: T(['From', 'Statement', 'Status'], [
          ['Sales (internal)', 'Harlow\u2019s COO says the relationship is strong and volume will grow next quarter.', 'Claim'],
          ['Harlow AP clerk', 'We cannot release payment on invoices without a valid PO reference. Resubmit with a PO and we pay within terms.', 'Claim, consistent with E-03'],
          ['AR analyst', 'Customer may be having cash problems.', 'Hypothesis, no evidence']]) },
      { id: 'E-07', title: 'Sales pipeline: Harlow Logistics', type: 'CRM extract',
        t: T(['Opportunity', 'Stage', 'Value'], [['Warehouse racking', 'Proposal', '64,000'], ['Dock equipment', 'Qualified', '38,000']]) }
    ],
    relevant: ['E-01', 'E-03', 'E-04', 'E-05', 'E-06'],
    d1: { q: 'Which overdue items deserve immediate attention?', ctx: 'Three invoices are overdue.', refs: 'E-01, E-02',
      opts: [
        ['Assign separate collections specialists to pursue each unpaid invoice independently, prioritizing outreach strictly by outstanding dollar amount.', .5, 'Incomplete. Chasing invoices in isolation misses the shared operational flaw connecting all unpaid balances.'],
        ['Defer escalation until aging reaches the standard 90-day delinquency threshold per company collections policy to avoid straining client goodwill.', .2, 'Risky. Waiting until 90 days compounds cash lockup and ignores automated customer portal rejection signals.'],
        ['Analyze the oldest overdue invoice (INV-2118) and determine whether all unpaid invoices share a systematic underlying characteristic.', 1, 'Strong. Checking whether the three overdue invoices share a common attribute quickly reveals the missing PO on post-June billings.'],
        ['Immediately issue formal default notices and place Harlow Logistics on strict credit hold to prevent exposure on pending warehouse racking proposals.', .1, 'Risky. Harlow has stated willingness to pay and continues expanding business; a premature credit freeze jeopardizes active commercial proposals.']] },
    d2: { q: 'What should AR verify before escalating?', ctx: 'Sales and AR disagree about Harlow\u2019s health.', refs: 'E-03, E-06',
      opts: [
        ['Confirm with Harlow\u2019s AP team why payment has not been released and compare the invoice fields to what their matching process requires.', 1, 'Strong. Directly checking Harlow\'s AP matching criteria pinpoints the missing purchase order number on the invoice face.'],
        ['Have the Vice President of Sales escalate directly to Harlow\u2019s Chief Operating Officer to leverage executive relationships for payment release.', .5, 'Incomplete. Executive escalation cannot override an AP automated matching hold if the underlying billing documents lack a valid PO.'],
        ['Re-transmit complete invoice statements and standard payment reminder letters to Harlow\u2019s general accounting email inbox on a weekly automated schedule.', .3, 'Weak. Re-sending identical, flawed invoices without valid POs will repeatedly trigger the same automated portal rejection.'],
        ['Commission an in-depth third-party credit solvency audit and request Harlow\u2019s latest quarterly balance sheet through executive sales channels.', .3, 'Incomplete. Solvency scores do not explain why Harlow paid invoices with PO references on time while rejecting those without them.']] },
    dx: { q: 'Which explanation best fits the evidence?', opts: [
      ['Harlow Logistics is suffering severe liquidity shortfalls and is deliberately deferring operational disbursements while negotiating supplier payment concessions.', 0, 'Incorrect. Harlow paid earlier invoices promptly within terms and explicitly committed in writing to pay immediately once invoices include a valid PO.'],
      ['Harlow\u2019s procurement department is disputing unit pricing and fulfillment quality on recent shipments, withholding approval until credits are granted.', .2, 'Incorrect. Portal dispute logs show rejection reason code "No valid PO - match failed", not pricing or merchandise disputes.'],
      ['Informal side agreements made between Sales and Harlow management extended commercial credit terms from Net 30 to unapproved Net 90 payment windows.', .1, 'Incorrect. Both the contract terms and AR aging records confirm that all invoices are strictly Net 30.'],
      ['A recurring billing-data issue: invoices issued after the PO changed carry no valid PO, so Harlow\u2019s AP cannot match and pay them.', 1, 'Your diagnosis matched the evidence: the customer\'s AP system rejected invoices due to a blank PO resulting from an outdated billing profile.']] },
    d3: { q: 'Which teams are needed and what prevents recurrence?', ctx: 'Choose the fix.', refs: 'E-04',
      opts: [
        ['Demand that Harlow Logistics revise its automated accounts payable matching protocols to accept billing statements without mandatory customer PO numbers.', .3, 'Risky. Customer corporate procurement controls require a PO match; attempting to dictate the customer\'s internal AP policies will fail.'],
        ['Involve billing operations and Sales ops: update the PO on the billing profile, resubmit open invoices, capture PO at renewal, and hold invoice release if a required PO is missing.', 1, 'Strong. Fixes the active invoices, aligns billing master data, and creates an automated hard stop preventing future blank-PO invoices.'],
        ['Direct collections to transmit dunning notifications earlier in the payment cycle, penalize overdue accounts with contractual late-payment interest fees, and escalate uncollected balances to external legal recovery.', .4, 'Incomplete. Dunning earlier and threatening legal recovery cannot resolve invoices that Harlow\'s AP system cannot legally or procedurally match and disburse.'],
        ['Unilaterally shorten Harlow\u2019s credit terms from Net 30 to cash-on-delivery and require corporate credit card pre-authorization on all future product orders.', .1, 'Risky. Punishing an established client for internal billing configuration mistakes will likely cause them to cancel pending proposals.']] },
    rubric: [['PO / purchase order', ['po ', 'purchase order', 'hl-88041', 'hl-77120']], ['Billing / invoice process', ['billing', 'invoice', 'profile', 'master data']], ['Not a credit problem', ['not credit', 'not a credit', 'credit risk', 'ability to pay', 'dispute']], ['Resubmit / control', ['resubmit', 'control', 'block', 'hold', 'update', 'prevent']]],
    reveal: {
      cause: 'The billing profile still points to a closed PO. Every invoice issued after 1 Jul prints a blank PO, so Harlow\u2019s three-way match fails and the invoices are rejected. This is an operational issue, not a credit problem.',
      support: ['E-01: both invoices carrying a PO were paid within terms; all four invoices without one are unpaid.', 'E-03: all three rejection notices cite the PO match, and AR only sent reminders to a billing mailbox.', 'E-04: PO HL-88041 was never loaded; the profile still holds HL-77120.', 'E-05: the last remittance (22 Jul) references the old PO.'],
      calc: [['Overdue invoices without PO ($21,750 + $19,200 + $22,300)', '$63,250'], ['Share of overdue balance with no PO', '100%'], ['Invoices with PO paid within terms ($18,400 + $17,900)', '$36,300'], ['Total open incl. current invoice', '$83,350']],
      alts: [['Credit problem', 'Harlow paid on time through July and says it will pay once a PO is supplied (E-05, E-06). The cash-problem claim has no evidence.'], ['Pricing or quality dispute', 'Every rejection code is the PO match, not content.'], ['Extended terms', 'The ledger shows Net 30 on every invoice.']],
      action: 'Update the PO on the billing profile, reissue INV-2118, INV-2133, INV-2147 and INV-2159 with HL-88041, and confirm the payment date with Harlow AP.',
      controls: ['Capture the PO number and expiry date at contract and renewal intake.', 'Block invoice release when the customer requires a PO and the field is blank.', 'Route portal rejection notices to a monitored AR queue.'],
      kpis: ['Invoices rejected for missing PO', 'Dispute resolution time', '% overdue balance with a dispute code'],
      exec: '$63,250 overdue at Harlow stems from a PO missing on our invoices since July. Fixing billing data and resubmitting should release payment within terms; no credit action is warranted.' }
  },

  /* ───────────────────────── CASE 03 ───────────────────────── */
  {
    id: 3, ref: 'CASE-003', title: 'The Subscription That Never Died', cat: 'Spend Management',
    diff: 'Beginner to Intermediate', mins: 12, summary: 'Software spend is up. Headcount and approved projects are not.',
    company: 'Calder & Finch Studio (fictional, 52 employees)',
    brief: 'Software spending has risen with limited headcount growth and no approved technology expansion. Review the records and decide what is solid enough to act on.',
    kpis: [['Annual software cost in scope', '$30,600'], ['Subscriptions reviewed', '5'], ['Headcount change', '+2']],
    timeline: [['12 Mar', 'Marketing starts a 30-day trial of DataVault'], ['11 Apr', 'Trial converts to a paid monthly plan'], ['30 Apr', 'Last DataVault login'], ['Jan\u2013Sep', 'Six employees leave; Plano access not reclaimed'], ['1 Dec', 'Plano renewal']],
    evidence: [
      { id: 'E-01', title: 'Subscription register', type: 'Vendor records',
        t: T(['Tool', 'Dept', 'Owner', 'Annual cost', 'Renewal', 'Auto-renew'], [
          ['Plano Design', 'Design', 'P. Nair', '9,600', '1 Dec', 'Yes'],
          ['DataVault Analytics', 'Marketing', '(requester left)', '5,400', 'Monthly', 'Yes'],
          ['TaskGrid', 'Operations', 'M. Alvarez', '3,600', '15 Jan', 'Yes'],
          ['BoardFlow', 'Product', 'J. Kim', '4,200', '20 Jan', 'Yes'],
          ['SecuriScan', 'IT', 'D. Osei', '7,800', '1 Mar', 'Yes'],
          ['Total', '', '', '30,600', '', '']], { total: 5 }) },
      { id: 'E-02', title: 'Plano Design license assignment', type: 'License report',
        t: T(['Status', 'Licenses', 'Cost at $240 each'], [['Active (login in last 30 days)', '28', '6,720'], ['Assigned to offboarded employees', '6', '1,440'], ['Unassigned', '6', '1,440'], ['Total purchased', '40', '9,600']], { total: 3 }) },
      { id: 'E-03', title: 'DataVault billing and usage', type: 'Invoices and logins',
        t: T(['Item', 'Detail'], [
          ['Trial started', '12 Mar by Marketing (30 days free)'], ['Converted to paid', '11 Apr at $450/month, card on file'],
          ['Last login', '30 Apr'], ['Logins since 1 May', '0'], ['Billed to date (Apr\u2013Oct)', '7 \u00d7 $450 = $3,150']]) },
      { id: 'E-04', title: 'Offboarding log, Jan\u2013Sep', type: 'HR records',
        t: T(['Employee ID', 'Left', 'Plano seat still assigned?', 'Checklist includes software reclaim?'], [
          ['EMP-1042', '14 Feb', 'Yes', 'No'], ['EMP-1057', '3 Apr', 'Yes', 'No'], ['EMP-1063', '28 May', 'Yes', 'No'],
          ['EMP-1071', '19 Jun', 'Yes', 'No'], ['EMP-1080', '8 Aug', 'Yes', 'No'], ['EMP-1088', '12 Sep', 'Yes', 'No']]) },
      { id: 'E-05', title: 'TaskGrid and BoardFlow usage', type: 'Usage comparison',
        t: T(['Metric', 'TaskGrid', 'BoardFlow'], [
          ['Licensed users', '15', '14'], ['Weekly active users', '12', '11'], ['Users with accounts in both', '9', '9'],
          ['Feature used only here', 'Resource scheduling', 'Roadmap views']]),
        note: 'Both tools are used weekly. Overlap in function is plausible but not yet validated.' },
      { id: 'E-06', title: 'SecuriScan usage and control mapping', type: 'IT record',
        t: T(['Item', 'Detail'], [['Interactive logins last 90 days', '4'], ['Automated scans', 'Daily, 100% success'], ['Mapped control', 'SOC 2 vulnerability-management control CTRL-14']]) }
    ],
    relevant: ['E-01', 'E-02', 'E-03', 'E-04', 'E-05'],
    d1: { q: 'Which expenses have enough evidence to act on?', ctx: 'Five subscriptions, different quality of evidence.', refs: 'E-01 to E-06',
      opts: [
        ['The Plano idle licenses and the DataVault conversion, because both have assignment or usage data behind them.', 1, 'Strong. Hard usage data confirms 12 unassigned/offboarded Plano seats and zero logins on DataVault since April.'],
        ['Terminate SecuriScan immediately due to near-zero interactive user logins, which clearly reveals that the software is largely abandoned across IT and operations.', 0, 'Risky. SecuriScan is an automated background daemon maintaining 100% successful daily scans supporting SOC 2 compliance control CTRL-14.'],
        ['Eliminate TaskGrid and BoardFlow immediately, as retaining two workflow tools with 9 shared users represents prima facie functional duplication and wasteful spend.', .4, 'Incomplete. Both tools have active weekly users and distinct functional use cases (scheduling vs roadmaps); consolidation requires a feature-fit review first.'],
        ['Impose an immediate across-the-board 15% procurement budget reduction target across all department SaaS software subscriptions regardless of usage history.', .1, 'Weak. Arbitrary budget cuts ignore empirical seat utilization and jeopardize critical infrastructure and compliance obligations.']] },
    d2: { q: 'What should be checked before cancelling anything?', ctx: 'You have candidate savings.', refs: 'E-01, E-03, E-06',
      opts: [
        ['Issue an organization-wide employee survey to collect user satisfaction rankings and request written justifications from each department for every active tool.', .4, 'Slow and noisy. Employee surveys yield subjective opinions rather than objective login and API telemetry.'],
        ['Contract terms (notice, minimum commitment, refund), data export needs, and with the owner whether any compliance or workflow depends on it.', 1, 'Strong. Verifies renewal cut-offs, prevents data loss, and ensures no hidden regulatory or workflow dependencies exist.'],
        ['Review vendor agreements strictly to verify whether credit card chargebacks or retroactive cash refunds can be demanded for historically inactive subscription months.', .3, 'Incomplete. Contractual refund rights matter, but preserving business continuity, compliance controls, and proprietary data take precedence.'],
        ['Instruct accounting to place an immediate payment freeze on all vendor credit cards to halt disbursements while contracts undergo administrative review.', 0, 'Risky. Arbitrarily freezing payment cards can trigger immediate service suspension of critical operating tools and breach vendor contract terms.']] },
    dx: { q: 'Which explanation best fits the evidence?', opts: [
      ['Unchecked vendor SaaS pricing escalations combined with rapid departmental headcount expansion that forced automated tier upgrades across core enterprise tools.', 0, 'Incorrect. Vendor unit pricing did not increase and headcount only grew by 2; the cost arose from idle seats and an abandoned trial.'],
      ['The unauthorized conversion of the DataVault promotional trial accounts entirely for the budget variance, while remaining software commitments reflect normal operating needs.', .4, 'Partly right: DataVault accounts for $5,400, but fails to account for $2,880 in 12 idle Plano licenses.'],
      ['Governance gaps: seats not reclaimed at offboarding, a trial that converted with no owner, and a possible overlapping tool pair that needs validation.', 1, 'Your diagnosis matched the evidence: unmanaged employee offboarding, unmonitored trial rollovers, and unreviewed tooling overlap drove the spend expansion.'],
      ['Broad-based seat utilization creep across project management applications driven by cross-functional teams independently subscribing to overlapping enterprise licenses.', .1, 'Incorrect. Project management tools TaskGrid and BoardFlow only total $7,800 combined and are actively utilized weekly.']] },
    d3: { q: 'Who should own renewals, and how do you prevent a repeat?', ctx: 'Choose the governance fix.', refs: 'E-01, E-04',
      opts: [
        ['Assign exclusive unilateral ownership of all software vendor relationships and renewal authorizations to the corporate finance and accounting department.', .5, 'Incomplete. Finance needs to enforce commercial approval gates, but lacks domain context to evaluate departmental technical needs and day-to-day user engagement.'],
        ['Consolidate all software licensing decisions under central corporate finance, enforce quarterly retrospective invoice audits across every department, and establish an organizational ban on third-party productivity tools.', .4, 'Detective, not preventive. Bans stifle productivity and retrospective audits catch wasted spend months after contracts auto-renew.'],
        ['Establish centralized IT and Procurement sign-off that mandates a company-wide moratorium prohibiting all cloud software purchases and trial sign-ups indefinitely.', .1, 'Risky. A blanket purchasing freeze impedes company growth without addressing the core breakdown in employee exit checklists.'],
        ['Name a budget owner per subscription, calendar renewals 60 days ahead, add license reclaim to offboarding, and require approval before a trial converts to paid.', 1, 'Strong. Creates clear accountability, establishes proactive renewal decision milestones, and fixes the offboarding leak.']] },
    rubric: [['Idle licenses', ['idle', 'unused', 'license', 'seat', 'offboard']], ['Trial conversion', ['trial', 'datavault', 'convert']], ['Overlap needs validation', ['overlap', 'validate', 'taskgrid', 'boardflow', 'duplicate']], ['Ownership & renewal control', ['owner', 'renewal', 'governance', 'approval', 'calendar']]],
    reveal: {
      cause: 'Spend grew through lifecycle gaps, not growth: 12 idle Plano seats and a DataVault trial that silently converted, plus a possible TaskGrid/BoardFlow overlap that still needs validation.',
      support: ['E-02: 6 seats on offboarded employees and 6 unassigned seats are idle.', 'E-04: none of the six offboardings included a software reclaim step.', 'E-03: DataVault converted 11 Apr and has had zero logins since 30 Apr.', 'E-05: the TaskGrid/BoardFlow overlap is plausible but both tools are used weekly.'],
      calc: [['Plano idle seats: 12 \u00d7 $240', '$2,880 verified'], ['DataVault: $450 \u00d7 12', '$5,400 verified'], ['Verified avoidable annual cost', '$8,280'], ['TaskGrid (lower-cost tool) if consolidated', 'up to $3,600 needs validation'], ['Maximum potential if validated', '$11,880'], ['SecuriScan', '$0 (required control)']],
      alts: [['Price increases', 'No evidence of unit-price changes; seat counts and usage explain the cost.'], ['Headcount growth', 'Headcount rose by 2, yet 12 Plano seats sit idle.'], ['Cut low-login SecuriScan', 'It runs automatically and supports a SOC 2 control (E-06).']],
      action: 'Reclaim 12 Plano seats before the 1 Dec renewal, cancel DataVault after confirming no data is needed, and run a feature-fit review of TaskGrid versus BoardFlow.',
      controls: ['Add license reclaim to the offboarding checklist.', 'Assign a named budget owner and renewal date to every subscription.', 'Require finance approval before a trial converts to a paid plan.'],
      kpis: ['License utilization %', 'Renewals with a named owner', 'Spend on subscriptions with no login in 90 days'],
      exec: '$8,280 per year of software spend is verified as avoidable, with up to $3,600 more pending validation. Fixing offboarding and trial controls stops it returning.' }
  },

  /* ───────────────────────── CASE 04 ───────────────────────── */
  {
    id: 4, ref: 'CASE-004', title: 'Revenue Is Up. Profit Is Down.', cat: 'FP&A and Profitability',
    diff: 'Intermediate to Advanced', mins: 18, summary: 'Sales beat budget by 18%. Operating profit missed plan.',
    company: 'Meridian Home Products (fictional manufacturer)',
    brief: 'Sales rose 18% above budget, but gross margin fell and operating profit finished below plan. The CEO asks what happened.',
    kpis: [['Revenue vs budget', '+18.0%'], ['Gross margin', '36.0% \u2192 30.0%'], ['Operating profit vs plan', '($56,000)']],
    timeline: [['1 Jan', 'Budget approved at list prices'], ['1 Apr', '"Volume Growth Program" starts on Bravo'], ['May\u2013Jun', 'Supplier delay forces expedited freight on Bravo inputs'], ['Q3', 'Commission accruals rise with volume'], ['Year end', 'Actuals vs budget reviewed']],
    evidence: [
      { id: 'E-01', title: 'Budget vs actual summary', type: 'Management P&L',
        t: T(['Line', 'Budget', 'Actual', 'Variance'], [
          ['Revenue', '2,500,000', '2,950,000', '450,000'], ['Cost of goods sold', '1,600,000', '2,066,000', '(466,000)'],
          ['Gross profit', '900,000', '884,000', '(16,000)'], ['Gross margin %', '36.0%', '30.0%', '(6.0 pts)'],
          ['Operating expenses', '600,000', '640,000', '(40,000)'], ['Operating profit', '300,000', '244,000', '(56,000)']]) },
      { id: 'E-02', title: 'Product-level budget vs actual', type: 'Product P&L',
        t: T(['Product', 'Units bud', 'Units act', 'Price bud', 'Price act', 'Unit cost bud', 'Unit cost act', 'Rev bud', 'Rev act', 'GP bud', 'GP act'], [
          ['Alpha', '10,000', '10,500', '100', '100', '60', '60', '1,000,000', '1,050,000', '400,000', '420,000'],
          ['Bravo', '5,000', '8,000', '200', '180', '140', '145', '1,000,000', '1,440,000', '300,000', '280,000'],
          ['Cora', '20,000', '18,400', '25', '25', '15', '15', '500,000', '460,000', '200,000', '184,000'],
          ['Total', '35,000', '36,900', '', '', '', '', '2,500,000', '2,950,000', '900,000', '884,000']], { total: 3 }) },
      { id: 'E-03', title: 'Pricing approvals, Bravo', type: 'Approval log',
        t: T(['Date', 'Event', 'Approved by'], [
          ['1 Apr', 'Volume Growth Program: Bravo net price $200 \u2192 $180 for all accounts', 'VP Sales'],
          ['1 Apr', 'Margin floor check', 'Not performed']]) },
      { id: 'E-04', title: 'Bravo unit cost build-up', type: 'Standard cost',
        t: T(['Component', 'Budget', 'Actual'], [['Materials', '118', '118'], ['Freight-in', '14', '19'], ['Labor & overhead', '8', '8'], ['Unit cost', '140', '145']], { total: 3 }),
        note: 'Freight rose after a supplier delay required expedited shipping.' },
      { id: 'E-05', title: 'Operating expense lines', type: 'Opex detail',
        t: T(['Line', 'Budget', 'Actual'], [['Sales commissions', '120,000', '160,000'], ['All other opex', '480,000', '480,000'], ['Total', '600,000', '640,000']], { total: 2 }) },
      { id: 'E-06', title: 'Returns rate', type: 'Quality record', t: T(['Measure', 'Budget', 'Actual'], [['Returns % of units', '1.0%', '1.1%']]) }
    ],
    relevant: ['E-01', 'E-02', 'E-03', 'E-04', 'E-05'],
    d1: { q: 'What should you decompose first?', ctx: 'Gross profit missed by $16,000 on 18% more revenue.', refs: 'E-01, E-02',
      opts: [
        ['Conduct an aggregate historical variance analysis comparing current company-wide gross margin percentages against the prior five fiscal years to establish long-term margin trends.', .4, 'Incomplete. Aggregate corporate margin percentages show the symptom of dilution, but conceal which specific product line eroded margin.'],
        ['Audit operating expense ledgers and commission accrual schedules to understand why SG&A spending expanded disproportionately relative to budgeted revenue targets.', .3, 'Incomplete. Commission growth explains $40,000 of the operating profit decline, but explains none of the 6.0 percentage point gross margin collapse.'],
        ['Analyze macro wholesale customer pricing indices and benchmark overall market freight inflation against industry peer benchmarks.', .2, 'Weak. General market benchmarking does not quantify Meridian\'s internal variance against approved board budgets.'],
        ['Product-level price, cost and volume/mix effects on gross profit versus budget.', 1, 'Strong. Decomposing gross profit into price, cost, and volume/mix per product isolates exactly where margins were given away.']] },
    d2: { q: 'How do you test competing explanations?', ctx: 'Price, cost, volume and mix could each be responsible.', refs: 'E-02',
      opts: [
        ['Attribute the profitability contraction primarily to unfavorable portfolio mix drift toward lower-percentage product lines, since expanded Bravo shipments diluted corporate gross margin despite strong top-line sales.', .4, 'Plausible but false: Bravo\'s extra volume actually added $180,000 of gross profit dollars at standard margins; the variance was driven by price and freight.'],
        ['Quantify each effect per product: price = (actual \u2212 budget price) \u00d7 actual units; cost = (budget \u2212 actual unit cost) \u00d7 actual units; volume/mix = (actual \u2212 budget units) \u00d7 budget unit margin.', 1, 'Strong. Places price realization, cost inflation, and volume/mix on a mathematically reconciled basis summing precisely to the total gross profit variance.'],
        ['Conclude that unexpected supply-chain freight surcharges represent the dominant financial leakage, as expedited transit logistics eroded budgeted gross earnings.', .3, 'Incomplete. Expedited freight accounted for $40,000 of cost variance, but price discounting on Bravo was four times larger at $160,000.'],
        ['Prepare an updated multi-scenario rolling budget forecast to determine whether projected fourth-quarter unit volume will naturally absorb the cost overruns.', .1, 'Weak. Re-forecasting future periods describes expectations but does not diagnose why current year-to-date margins missed budget.']] },
    dx: { q: 'Which explanation best fits the evidence?', opts: [
      ['Price concessions on Bravo are the primary driver, with higher Bravo freight cost secondary; added volume did not offset them in margin.', 1, 'Your diagnosis matched the evidence: the $160k price discount and $40k expedite freight wiped out the $184k volume/mix contribution.'],
      ['Adverse product mix shift toward higher unit-volume products with structurally lower margin percentages, combined with uncontrollable corporate SG&A overhead inflation.', .4, 'Partly right: opex was up $40k, but volume/mix actually generated $184k in gross profit dollars; the drop was driven by net price realization.'],
      ['Unbudgeted selling commission growth resulting from exceeding gross sales targets, which depleted operating profit margins across all three core product families.', .3, 'Partly right: commissions explain $40,000 of operating profit variance, but do not impact cost of goods sold or gross margin.'],
      ['Severe cost inflation across raw materials and factory fabrication labor on the high-volume Alpha line that offset commercial revenue gains.', 0, 'Incorrect. Alpha manufacturing unit costs and selling prices matched budget numbers exactly at $60 and $100.']] },
    d3: { q: 'What should management do, and what do you tell the CEO?', ctx: 'Choose the recommendation.', refs: 'E-03, E-04, E-05',
      opts: [
        ['Implement an immediate corporate restructuring of the sales incentive compensation structure to cap commission payouts whenever gross margin falls below 35%.', .3, 'Incomplete. Capping commissions addresses a symptom of revenue-linked incentives, but leaves unauthorized customer price discounts untouched.'],
        ['Execute an immediate across-the-board 5% list price increase across Alpha, Bravo, and Cora to restore blended corporate gross margin back to the 36% target.', .3, 'Risky. Blanket price hikes ignore that Alpha and Cora pricing performed to budget and risk dampening demand in healthy lines.'],
        ['Fix the source: require approval and a margin floor for price changes, review freight sourcing, and report price/volume/mix monthly.', 1, 'Strong. Directly establishes discounting guardrails, fixes shipping lead-times, and equips the executive committee with monthly price-volume-mix visibility.'],
        ['Discontinue the Bravo product line immediately to eliminate expedited freight penalties and refocus operational capacity exclusively on high-margin lines.', .1, 'Risky. Bravo generated $280,000 of gross profit and $1,440,000 in revenue; it requires pricing discipline, not elimination.']] },
    rubric: [['Price / discount', ['discount', 'price', 'pricing', '$180', '180']], ['Bravo', ['bravo']], ['Freight / cost', ['freight', 'cost', 'expedit']], ['Volume vs margin', ['volume', 'mix', 'margin floor', 'offset']]],
    reveal: {
      cause: 'The Volume Growth Program cut Bravo\u2019s net price 10% ($200 \u2192 $180). The $160,000 price give-up consumed most of the $180,000 profit gained from selling 3,000 more units, and $40,000 of expedited freight finished the job.',
      support: ['E-03: the price cut was approved without a margin-floor check.', 'E-02: Bravo units +60% but gross profit down $20,000; Alpha and Cora costs and prices were unchanged.', 'E-04: Bravo unit cost +$5, all of it freight.', 'E-05: commissions +$40,000 explain the operating profit gap beyond gross profit.'],
      calc: [['Price effect, Bravo: ($180 \u2212 $200) \u00d7 8,000', '($160,000)'], ['Cost effect, Bravo: ($140 \u2212 $145) \u00d7 8,000', '($40,000)'], ['Volume/mix: Alpha +$20,000, Bravo +$180,000, Cora ($16,000)', '+$184,000'], ['Gross profit variance', '($16,000)'], ['Opex variance (commissions)', '($40,000)'], ['Operating profit variance', '($56,000)']],
      alts: [['Mix alone', 'Volume/mix was positive (+$184,000) in dollars; the percentage fell because of price and cost.'], ['Alpha cost inflation', 'Alpha unit cost and price match budget.'], ['Opex alone', 'Opex explains $40,000 of the operating gap but none of the $6.0-point margin drop.']],
      action: 'Reinstate list pricing for non-strategic Bravo accounts, renegotiate expedite terms with the supplier, and report the price/volume/mix bridge to the CEO.',
      controls: ['Margin-floor check on any price change.', 'Discount approval matrix by size.', 'Monthly price/volume/mix bridge.'],
      kpis: ['Net price realization vs list', 'Gross margin % by product', 'Freight cost per unit'],
      exec: 'Revenue grew $450,000 but gross profit fell $16,000: a $160,000 Bravo price give-up and $40,000 of freight outweighed $184,000 of volume gains. Operating profit is $56,000 below plan after $40,000 higher commissions.' }
  },

  /* ───────────────────────── CASE 05 ───────────────────────── */
  {
    id: 5, ref: 'CASE-005', title: 'The Month-End Close That Never Ends', cat: 'Accounting, Controls & Finance Operations',
    diff: 'Intermediate', mins: 15, summary: 'Same team, same headcount, and the close keeps running late.',
    company: 'Ridgeway Distribution (fictional)',
    brief: 'The target is to close in 5 working days (WD5). The last three closes finished on WD8 with unchanged staffing. The Controller asks where the delay really starts.',
    kpis: [['Target close', 'WD5'], ['Actual close', 'WD8'], ['Late by', '3 working days']],
    timeline: [['WD1 09:05', 'AP requests receipt list from Procurement mailbox'], ['WD2', 'AP follows up'], ['WD3 17:40', 'Procurement asks who owns the request'], ['WD4 11:20', 'Receipt list delivered'], ['WD5\u2013WD8', 'AP rec, flux review, final statements']],
    evidence: [
      { id: 'E-01', title: 'Close calendar: planned vs actual', type: 'Close tracker',
        t: T(['Task', 'Owner', 'Depends on', 'Planned', 'Actual', 'Delay'], [
          ['T1 AR & revenue cut-off', 'AR Lead', '\u2013', 'WD1', 'WD1', '0'],
          ['T2 Receipt (GRNI) list to AP', 'Procurement mailbox, no named owner', '\u2013', 'WD1', 'WD4', '+3'],
          ['T3 Accrual journal', 'AP Accountant', 'T2', 'WD2', 'WD4', '+2'],
          ['T4 AP subledger reconciliation', 'AP Accountant', 'T3', 'WD2', 'WD5', '+3'],
          ['T5 Bank reconciliation', 'Treasury Analyst', '\u2013', 'WD2', 'WD2', '0'],
          ['T6 Payroll accrual', 'Payroll', '\u2013', 'WD2', 'WD2', '0'],
          ['T7 Fixed assets & intercompany', 'GL Accountant', '\u2013', 'WD3', 'WD3', '0'],
          ['T8 Flux review & sign-off', 'Controller', 'T4, T5, T6, T7', 'WD4', 'WD7', '+3'],
          ['T9 Final financial statements', 'FP&A', 'T8', 'WD5', 'WD8', '+3']]) },
      { id: 'E-02', title: 'Journal log with approval timestamps', type: 'JE approvals',
        t: T(['JE', 'Description', 'Submitted', 'Approved', 'Approval time (h)'], [
          ['JE-1038', 'Payroll accrual', 'WD2 09:30', 'WD2 11:00', '1.5'], ['JE-1041', 'Depreciation', 'WD3 10:00', 'WD3 12:30', '2.5'],
          ['JE-1044', 'Intercompany', 'WD3 14:00', 'WD3 16:15', '2.25'], ['JE-1051', 'GRNI accrual', 'WD4 13:10', 'WD4 15:30', '2.33']]) },
      { id: 'E-03', title: 'AP accountant activity log', type: 'Time record',
        t: T(['Day', 'Productive hours', 'Waiting hours', 'Note'], [
          ['WD1', '7.5', '0', 'Posting invoices'], ['WD2', '3.0', '4.5', 'Waiting on receipt list'], ['WD3', '2.0', '5.5', 'Waiting on receipt list'],
          ['WD4', '8.0', '0', 'List arrives 11:20'], ['WD5', '8.5', '0', 'Reconciliation']]) },
      { id: 'E-04', title: 'Email and chat excerpts', type: 'Communications',
        t: T(['When', 'From \u2192 To', 'Excerpt'], [
          ['WD1 09:05', 'AP \u2192 Procurement mailbox', 'Need the receipt list for accruals.'],
          ['WD2 14:20', 'AP \u2192 Procurement mailbox', 'Following up. Is it coming today?'],
          ['WD3 17:40', 'Procurement \u2192 AP', 'Who owns this? The prior analyst left after the Q2 reorg.'],
          ['WD4 11:20', 'Procurement \u2192 AP', 'List attached.']]) },
      { id: 'E-05', title: 'Last three closes', type: 'KPI history',
        t: T(['Month', 'Close achieved', 'Receipt list arrived'], [['Jul', 'WD8', 'WD4'], ['Aug', 'WD8', 'WD4'], ['Sep', 'WD8', 'WD4']]) },
      { id: 'E-06', title: 'Bank reconciliation detail', type: 'Reconciliation', t: T(['Item', 'Value'], [['Reconciling items', '2'], ['Cleared by', 'WD2']]) }
    ],
    relevant: ['E-01', 'E-02', 'E-03', 'E-04', 'E-05'],
    d1: { q: 'Where does the delay begin?', ctx: 'The close finished three days late.', refs: 'E-01',
      opts: [
        ['Focus scrutiny on the Controller review and financial statement sign-off phase, since leadership review represents the final milestone that breached the close deadline.', .3, 'Incomplete. Late sign-off on WD7 is merely a downstream consequence of earlier tasks being delivered days behind schedule.'],
        ['Conduct an audit of general ledger account reconciliations to detect whether complex reconciling items and posting corrections delayed accounting staff.', .2, 'Weak. All independent balance sheet reconciliations (bank, payroll, fixed assets) completed on their target dates without delay.'],
        ['Trace the close critical path upstream to identify the earliest task in the dependency chain that slipped past its scheduled delivery deadline.', 1, 'Strong. Mapping task dependencies back to the earliest slip isolates Task T2 (Procurement receipt list), which missed by 3 days.'],
        ['Perform a departmental workload and overtime assessment across general accounting to identify which accounting teams face severe staffing capacity deficits.', .3, 'Incomplete. Time tracking shows the AP accountant was waiting idle for 10 hours rather than working overtime.']] },
    d2: { q: 'Is it capacity, unclear ownership, or approval timing?', ctx: 'Staffing has not changed.', refs: 'E-02, E-03, E-04',
      opts: [
        ['Conclude that executive approval bottlenecks are the primary culprit, since management reviews inevitably cluster at the end of the monthly financial cycle.', .4, 'Incomplete. Journal approval turnaround averaged only 2.1 hours and all were approved under 3 hours.'],
        ['Distribute a close-process survey across all finance personnel to gauge qualitative perceptions of overtime strain and workplace fatigue during close week.', .3, 'Incomplete. Subjective feedback cannot replace empirical timestamps showing when deliverables were handed off.'],
        ['Conclude that staffing shortages in the AP department prevent timely throughput and request immediate headcount authorization for additional accountants.', .1, 'Risky. AP had 10 idle waiting hours during WD2-WD3 waiting for Procurement data; hiring more accountants will not speed up Procurement handoffs.'],
        ['Compare approval turnaround, preparer waiting time versus working time, and whether each upstream deliverable has a named owner.', 1, 'Strong. Testing each hypothesis against timestamp data proves approval turnaround is fast, AP capacity is ample, and upstream ownership is missing.']] },
    dx: { q: 'Which explanation best fits the evidence?', opts: [
      ['Management approval bottlenecks: executive sign-offs on complex accruals and variance reviews take excessive time, delaying final financial statement publication.', .1, 'Incorrect. The approval log shows average turnaround was 2.1 hours, with every entry approved on the same day it was submitted.'],
      ['An upstream deliverable (the receipt list) has no accountable owner and arrives three days late, delaying accruals, AP reconciliation, review and close.', 1, 'Your diagnosis matched the evidence: unassigned ownership of the GRNI receipt list caused a 3-day upstream delay that propagated directly to close completion.'],
      ['Accounting capacity constraints: the AP accounting team is structurally understaffed and cannot process standard subledger reconciliations within scheduled target windows.', .1, 'Incorrect. The AP accountant logged 10.0 hours of idle waiting time on WD2 and WD3 while waiting for the receipt list to be provided.'],
      ['An excessive volume of manual balance sheet reconciliations and year-to-date schedule verifications that overwhelm the general ledger accounting staff.', .2, 'Incorrect. All general ledger balance sheet reconciliations without upstream procurement dependencies closed exactly on time.']] },
    d3: { q: 'Which change and which KPI would show the fix worked?', ctx: 'Choose your recommendation.', refs: 'E-01, E-05',
      opts: [
        ['Name an owner with a WD1 delivery deadline, then track on-time delivery of upstream inputs and days-to-close.', 1, 'Strong. Establishes clear accountability, formalizes an input SLA, and tracks both the root constraint and the final outcome.'],
        ['Engage temporary accounting contractors during peak close periods to assist AP with invoice reconciliations and reduce month-end pressure on full-time personnel.', .2, 'Weak. Adding AP contractors adds payroll cost without solving the fact that AP is blocked waiting for unowned procurement reports.'],
        ['Re-baseline the corporate close timeline formally from WD5 to WD8 to eliminate artificial schedule stress and align reporting targets with actual completion cycles.', .1, 'Risky. Institutionalizes inefficiency and delays executive and investor reporting rather than fixing a straightforward 3-day data handoff gap.'],
        ['Mandate that the Controller and finance managers provide pre-approvals on standard recurring accrual journals prior to the formal start of the monthly close.', .3, 'Incomplete. Journal approvals already take barely 2 hours; pre-approving journals does not accelerate delivery of the unowned receipt list.']] },
    rubric: [['Upstream dependency', ['upstream', 'depend', 'critical path', 'bottleneck', 'handoff', 'hand-off']], ['Receipt / GRNI list', ['receipt', 'grni', 'procurement', 'accrual']], ['Ownership', ['owner', 'accountab', 'unassigned']], ['KPI / deadline', ['kpi', 'sla', 'deadline', 'on-time', 'days-to-close', 'days to close']]],
    reveal: {
      cause: 'The delay starts upstream: the Procurement receipt list has no named owner and arrives on WD4 instead of WD1. Accruals, AP reconciliation, review and final statements all wait on it, so the close lands three days late.',
      support: ['E-01: T2 is the first late task (+3) and T3, T4, T8, T9 depend on it.', 'E-02: approvals took 1.5\u20132.5 hours, so approval timing is not the constraint.', 'E-03: AP waited 10.0 hours on WD2\u2013WD3 with capacity available.', 'E-04: Procurement asked who owns the request; E-05 shows the same WD4 arrival for three months.'],
      calc: [['T2 planned vs actual', 'WD1 \u2192 WD4 (+3)'], ['Final statements planned vs actual', 'WD5 \u2192 WD8 (+3)'], ['AP waiting hours (4.5 + 5.5)', '10.0'], ['Average approval time (1.5 + 2.5 + 2.25 + 2.33) / 4', '2.1 hours']],
      alts: [['Capacity', 'AP spent 10.0 hours waiting, not overloaded (E-03).'], ['Approval timing', 'Average approval time of 2.1 hours, all under 3 hours (E-02).'], ['Too many tasks', 'Tasks without an upstream dependency finished on plan (E-01).']],
      action: 'Assign a named owner for the receipt list, with a WD1 delivery deadline and a backup, and publish the dependency chain.',
      controls: ['Every close deliverable has a named owner and backup.', 'Daily dependency check during close.', 'Upstream SLAs between Procurement and AP.'],
      kpis: ['On-time delivery of upstream close inputs', 'Days to close', 'AP waiting hours during close'],
      exec: 'Close runs three days late because one unowned input, the Procurement receipt list, arrives on WD4 instead of WD1. Naming an owner with a WD1 deadline should restore WD5.' }
  }
  ];

  root.FD_CASES = CASES;
  if (typeof module !== 'undefined') module.exports = CASES;
})(typeof window !== 'undefined' ? window : globalThis);
