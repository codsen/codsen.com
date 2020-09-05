What are _ranges_? Composable string amendment instructions. They are arrays containing "from" and "to" string indexes.

For example, _a range_ `[1, 5]` means an instruction to delete characters which would otherwise fall into `String.slice(1, 5)`.

For example, _a range_ `[2, 6, "foo"]` means an instruction to replace characters which would otherwise fall into `String.slice(2, 6)` with string `"foo"`.

**That's all there is** — we note pieces of string to be deleted or replaced using character indexes and arrays.
