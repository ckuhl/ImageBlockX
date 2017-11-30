PROJECT_NAME=image-block-x
EXCLUDE := .git Makefile README.md .gitignore


make:
	zip -r ./${PROJECT_NAME}.zip * -x ${EXCLUDE}

.PHONY: clean
clean:
	rm ${PROJECT_NAME}.zip

