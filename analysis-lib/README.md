Issue #14 in project electron-the-orchard is about processing the TSV file within the Electron app. We want to be able to work on the data processing logic from the command line, because Electron is too cumbersome. Please create a CLI tool for that.

The ticket to create that CLI tool is #15:
https://gitlab.com/vivadata/electron-the-orchard/issues/15

The tool will support a Node.js module that can be used later on, in the hook created for #14.

We will use a completely separate repo for this purpose.

In this CLI, do not spend time making it pretty. It is only for our debugging convenience.

## Filters API

To run all filters:

```
npm run all_filters
```

To run a single filter:

```
npm run single_filter [-- <filter_idx>]
```

This command throws an error in case <filter_idx> is not specified,¬
or if it's out of bounds (filter does not exist).
