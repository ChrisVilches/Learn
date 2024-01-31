# Troubleshooting

## Use `ts-node`, not `tsx` for scripts

Using `tsx` for some reason doesn't inject dependencies correctly (they become `undefined` and crashes).

This may be related to decorator related configurations when compiling and executing TS code. Since dependency injection uses reflection, decorators and metadata are necessary, and `tsx` may be omitting that.
