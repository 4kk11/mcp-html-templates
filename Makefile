.PHONY: build run clean

build:
	docker build -t mcp-html-templates .

run:
	docker run -i --rm -v ./resources:/app/resources mcp-html-templates

clean:
	docker rmi mcp-html-templates

tag: 
	docker tag mcp-html-templates 4kk11/mcp-html-templates

push:
	docker push 4kk11/mcp-html-templates

help:
	@echo "Available commands:"
	@echo "  make build  - Build Docker image"
	@echo "  make run    - Run Docker container"
	@echo "  make clean  - Remove Docker image"