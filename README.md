Gitbook Plugin Index of Figures
=============

A gitbook plugin to do automatic table of figures and figure name resolution, it is inspired by and works in companion with [gitbook-plugin-image-captions](https://github.com/m0n0l0c0/gitbook-plugin-index-of-figures.git).

### Install

Add this to your `book.json`, then run `gitbook install`:

```json
{
    "plugins": ["index-of-figures"]
}
```

### Setup

In your `book.json` add

```json
{
	"pluginsConfig": {
		"index-of-figures": {
			"path": "./figures.json"
		}
	}
}
```

Where `./figures.json` is your figures config file, it is done this way to avoid filling the `book.json` with useless crap about your figures

### Usage

When you want to reference the figure `ANN` in the config file, use the following in the content of a page:

```
{{ "ANN" | fig }}
```

You can also add the index of figures table with:

```
{% figures %} {% endfigures %}
```

The table of figures should be included in a file called Figures.md

If you name the file anything other than Figures.md, it will break the links from the individual figures to this Figures page (each figure will link to Figures.html#fig- plus the index of that figure).

### Figures settings

Example of `./figures.json`

```json
{
	"prefix": "Fig. ",
	"figures": {
		"ANN": {
			"path": "/assets/ANN.png",
			"description": "An Artificial Neural Network"
		}
	}
} 
```

* `prefix`: The prefix to put on each figure before the number (eg: Fig, Figure, ...). Defaults to `Fig.`
* `figures`: An object with all the figures, the name of the figure is to be passed in the content page.
* `path`: The path to the asset, this serve as a key to find the figure after figcaptions has processed all the figures and assigned numbers automatically, this is the way we substitute the text with the correct figure number.
* `description`: This is the text used to display in the table of figures 