<script lang="ts">
  import ChartSwitcher from "../../charts/ChartSwitcher.svelte";
  import { is_empty } from "../../lib/objects.ts";
  import TreeTable from "../../tree-table/TreeTable.svelte";
  import type { TreeReportProps } from "./index.ts";

  let { charts, trees, date_range }: TreeReportProps = $props();
  let end = $derived(date_range?.end ?? null);
  let non_empty_trees = $derived(
    trees.filter((tree) => !is_empty(tree.balance_children)),
  );
</script>

<ChartSwitcher {charts} />

<div class="row">
  <div class="column">
    {#each non_empty_trees.slice(0, 1) as tree (tree.account)}
      <TreeTable {tree} {end} />
    {/each}
  </div>
  <div class="column">
    {#each non_empty_trees.slice(1) as tree (tree.account)}
      <TreeTable {tree} {end} />
    {/each}
  </div>
</div>
