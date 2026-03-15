import { get as store_get } from "svelte/store";

import {
  get_balance_sheet,
  get_income_statement,
  get_trial_balance,
} from "../../api/index.ts";
import {
  type AccountTreeNode,
  ParsedHierarchyChart,
} from "../../charts/hierarchy.ts";
import type { ParsedFavaChart } from "../../charts/index.ts";
import { _ } from "../../i18n.ts";
import { getURLFilters } from "../../stores/filters.ts";
import { name_expenses } from "../../stores/options.ts";
import { Route } from "../route.ts";
import BalanceSheet from "./BalanceSheet.svelte";
import IncomeStatement from "./IncomeStatement.svelte";
import TrialBalance from "./TrialBalance.svelte";

export interface TreeReportProps {
  charts: ParsedFavaChart[];
  trees: AccountTreeNode[];
  date_range: { begin: Date; end: Date } | null;
}

export const income_statement = new Route(
  "income_statement",
  IncomeStatement,
  async (url) => {
    const report = await get_income_statement(getURLFilters(url));
    const [income, _profit, expenses] = report.trees;
    if (income && expenses) {
      report.charts.push(
        ParsedHierarchyChart.from_node(income),
        ParsedHierarchyChart.from_node(expenses),
      );
    }
    return report;
  },
  () => _("Income Statement"),
);

export const balance_sheet = new Route(
  "balance_sheet",
  BalanceSheet,
  async (url) => {
    const report = await get_balance_sheet(getURLFilters(url));
    report.charts.push(...report.trees.map(ParsedHierarchyChart.from_node));
    return report;
  },
  () => _("Balance Sheet"),
);

export const trial_balance = new Route(
  "trial_balance",
  TrialBalance,
  async (url) => {
    const report = await get_trial_balance(getURLFilters(url));
    const root = report.trees[0];
    if (root) {
      const expenses_name = store_get(name_expenses);
      const expenses_first = [...root.children].sort((a, b) =>
        a.account === expenses_name ? -1 : b.account === expenses_name ? 1 : 0,
      );
      report.charts.push(...expenses_first.map(ParsedHierarchyChart.from_node));
    }
    return report;
  },
  () => _("Trial Balance"),
);
