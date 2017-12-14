# [Image Block X](https://addons.mozilla.org/en-US/firefox/addon/image-block-x/)

## What does it do?
It's a switch to toggle whether or not the browser will load images.


## Why?
I like to tether my laptop to my phone, and this way I can ensure my
data will last as long as possible.

I previously used
[Image Block](https://addons.mozilla.org/en-US/firefox/addon/image-block/)
but since it has not been converted to a web extension,
I figured I'd learn how to write a web extension and do it myself.


## Is it done?
Hardly.

There's still lots of improvements that could be done in the future, such
as:
- whitelisting certain pages
- loading only images below a certain size
- alernately blacklisting certain pages
- allow toggling on a per-tab basis


Meta-improvements to be done:
- improving the release process
- 


## Build dependencies

ImageMagick (http://www.imagemagick.org) is used to generate png icons from svg.
Also needs zip commandline archiver.

## Contribution
Have an idea for a feature that I haven't added or mentioned? Feel free to
raise an issue on GitHub or if you're feeling daring, make a pull request!


## Release Process
1. Make changes
2. Increment version number in `manifest.json`
3. Update `CHANGELOG.md`
4. `make`
5. Upload to [AMO](https://addons.mozilla.org/en-US/developers/addon/image-block-x/versions/submit/)
