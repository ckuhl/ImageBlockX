PROJECT=image-block-x
EXCLUDE := .git Makefile README.md .gitignore

make:
	zip -r ./${PROJECT}.zip * -x ${EXCLUDE}

