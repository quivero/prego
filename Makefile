.PHONY: help clean test test-watch lint coverage install
.DEFAULT_GOAL := help

define PRINT_HELP_PYSCRIPT
import re, sys

regex_pattern = r'^([a-zA-Z_-]+):.*?## (.*)$$'

for line in sys.stdin:
	match = re.match(regex_pattern, line)
	if match:
		target, help = match.groups()
		print("%-20s %s" % (target, help))
endef

export PRINT_HELP_PYSCRIPT

help:
	@python -c "$$PRINT_HELP_PYSCRIPT" < $(MAKEFILE_LIST)

clean: clean-test ## remove all unnecessary artifacts

clean-test: ## remove test and coverage artifacts
	rm -fr coverage/

test: ## run tests with jest
	npm run test

test-watch: ## run tests on watchdog mode
	npm run test:watch

coverage: ## run tests on watchdog mode
	npm run test:ci

lint: clean ## perform inplace lint fixes
	npm run format

install: clean ## install the packages
	npm install

publish: clean ## build source and publish package
	npm run release
