All shapes must export the following API:

## `shape(gen, name)`

This is the constructor of the shape. `gen` is the current random generator and `name` is the name object of the shape.

Returns a shape object with the following properties:

### `shape.render(opts)`

Renders the shape to a given canvas. The passed `opts` object has the following properties:

 - `opts.canvas`: the targeted cavnas
 - `opts.context`: a 2d context to the canvas
 - `opts.origin`: a point in the format of `{x, y}`, the origin of the shape
 - `opts.scale`: the size of the shape, from the origin in all directions
 - `opts.palette`: the current palette

### `shape.name`

A name, identifying the shape type (used for debug)
