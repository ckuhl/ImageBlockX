# [Image Block X](https://addons.mozilla.org/en-US/firefox/addon/image-block-x/)

A button to toggle loading images in Firefox.


## Why?

I like to tether my laptop to my phone, and this way I can ensure my
data will last as long as possible.

I previously used
[Image Block](https://addons.mozilla.org/en-US/firefox/addon/image-block/)
but since it has not been converted to a web extension, I figured I'd learn
how to write a web extension and do it myself.


## Possible improvements

While it works now, there are a lot of possible improvements that can be made:


### Features

- [ ] Page whitelisting (and / or blacklisting)
- [ ] Conditional image loading (if a certain size)
- [ ] Toggle loading per-tab (instead of a global state)
- [ ] Light / dark mode icons


### Project improvements

- [ ] Simplifying the release process
- [ ] Cleaning up the code / logic
- [ ] Adding JSDoc and type hints to code
- [ ] Adding tests


## Build dependencies

[ImageMagick](https://www.imagemagick.org/script/index.php) is required to
generate PNG icons from the source vector graphics.

[optipng](http://optipng.sourceforge.net/) is optionally used to compress
icons before zipping them up. If people are using this to save bandwidth, it
only makes sense to save bandwidth here too.


## Contribution

Have an idea for a feature that I haven't added or mentioned? Feel free to
raise an issue on GitHub, or if you're feeling daring, make a pull request!


## Current deployment process

1. Make changes
2. Increment version number in `manifest.json`
3. Update `CHANGELOG.md`
4. `make`
5. Upload to [AMO](https://addons.mozilla.org/en-US/developers/addon/image-block-x/versions/submit/)
