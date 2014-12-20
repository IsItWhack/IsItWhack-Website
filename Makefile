test:
	node bin/migrator.js
	@./node_modules/.bin/mocha --reporter spec --recursive test

.PHONY:	test