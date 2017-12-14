PROJECT_NAME=image-block-x
EXCLUDE := .git Makefile README.md .gitignore icons/*.svg

ICONS := \
	icons/image-16.png  \
	icons/image-24.png  \
	icons/image-32.png  \
	icons/image-64.png  \
	icons/image-128.png \
	icons/image-256.png \
	icons/image-512.png

ICONS_BLOCKED := \
	icons/image_blocked-16.png  \
	icons/image_blocked-24.png  \
	icons/image_blocked-32.png  \
	icons/image_blocked-64.png  \
	icons/image_blocked-128.png \
	icons/image_blocked-256.png \
	icons/image_blocked-512.png


all: make

make: gen_ico
	zip -r ./${PROJECT_NAME}.zip * -x ${EXCLUDE}

gen_ico: $(ICONS) $(ICONS_BLOCKED)

icons/image-%.png:
	$(call conv,$*)

icons/image_blocked-%.png:
	$(call conv,$*,"_blocked")

define conv
	convert  -transparent white  -geometry $1x$1    \
		icons/image$2.svg  icons/image$2-$1.png
endef

.PHONY: clean
clean:
	rm ${PROJECT_NAME}.zip icons/*.png

