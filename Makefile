.PHONY: docker-build docker-run docker-clean docker-tag docker-push npm-build npm-publish help

# Docker commands
docker-build:
	docker build -t mcp-html-templates . && docker image prune -f

docker-run:
	docker run -i --rm -v ./resources:/app/resources mcp-html-templates

docker-clean:
	docker rmi mcp-html-templates
	docker rmi 4kk11/mcp-html-templates

docker-tag: docker-build
	docker tag mcp-html-templates 4kk11/mcp-html-templates

docker-push: docker-tag
	docker push 4kk11/mcp-html-templates

# NPM commands
npm-build:
	npm run build

npm-publish: npm-build
	npm publish

help:
	@echo "Available commands:"
	@echo "Docker commands:"
	@echo "  make docker-build   - Build Docker image"
	@echo "  make docker-run     - Run Docker container"
	@echo "  make docker-clean   - Remove Docker image"
	@echo "  make docker-tag     - Tag Docker image"
	@echo "  make docker-push    - Push Docker image"
	@echo ""
	@echo "NPM commands:"
	@echo "  make npm-build      - Build NPM package"
	@echo "  make npm-publish    - Build and publish NPM package"